import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const host = vi.hoisted(() => ({
  folders: [] as { uri: { fsPath: string }; name: string }[],
  commands: new Map<string, (...args: any[]) => any>(),
  listeners: new Map<string, (event: any) => any>(),
  documents: [] as any[],
  shownDocuments: [] as any[],
  secrets: new Map<string, string>(),
  secretReadHook: undefined as ((key: string) => Promise<string | undefined>) | undefined,
  openDocumentHook: undefined as (() => Promise<void>) | undefined,
  workspaceWrites: [] as string[],
  secretWrites: [] as string[],
  taskExecutions: 0,
}));

vi.mock('vscode', async () => {
  const { URI } = await import('vscode-uri');
  const disposable = () => ({ dispose() {} });
  const listen = (key: string) => (fn: (event: any) => any) => { host.listeners.set(key, fn); return disposable(); };
  return {
    Uri: URI,
    env: { remoteName: undefined },
    TreeItem: class { constructor(public label: string) {} },
    ThemeIcon: class {},
    ThemeColor: class {},
    MarkdownString: class { appendText() {} },
    EventEmitter: class { event = () => disposable(); fire() {} },
    TreeItemCollapsibleState: { Expanded: 2, Collapsed: 1, None: 0 },
    StatusBarAlignment: { Left: 1 },
    TaskScope: { Workspace: 1 },
    TaskRevealKind: { Always: 1 },
    TaskPanelKind: { Dedicated: 1 },
    Task: class { presentationOptions = {}; constructor(public definition: any) {} },
    ProcessExecution: class {},
    RelativePattern: class {},
    extensions: { getExtension: () => undefined },
    workspace: {
      isTrusted: true,
      get workspaceFolders() { return host.folders; },
      get textDocuments() { return host.documents; },
      registerTextDocumentContentProvider: () => disposable(),
      openTextDocument: async (input: any) => {
        const document = {
          uri: URI.parse(`untitled:orchestrator-status-${host.documents.length}`),
          text: typeof input?.content === 'string' ? input.content : '',
          getText() { return this.text; },
        };
        host.documents.push(document);
        await host.openDocumentHook?.();
        return document;
      },
      onDidChangeWorkspaceFolders: listen('folders'),
      onDidGrantWorkspaceTrust: listen('trust'),
      createFileSystemWatcher: () => ({ dispose() {}, onDidCreate: listen('fileCreate'), onDidChange: listen('fileChange'), onDidDelete: listen('fileDelete') }),
    },
    window: {
      createStatusBarItem: () => ({ show() {}, dispose() {} }),
      registerTreeDataProvider: () => disposable(),
      showTextDocument: async (document: any) => { host.shownDocuments.push(document); },
      showWarningMessage: vi.fn(),
      showInformationMessage: vi.fn(),
      showErrorMessage: vi.fn(),
    },
    commands: {
      registerCommand: (name: string, fn: (...args: any[]) => any) => { host.commands.set(name, fn); return disposable(); },
      executeCommand: async (name: string, ...args: any[]) => host.commands.get(name)?.(...args),
    },
    tasks: {
      onDidStartTask: listen('start'),
      onDidEndTaskProcess: listen('processEnd'),
      onDidEndTask: listen('end'),
      executeTask: async () => { host.taskExecutions++; },
    },
  };
});

vi.mock('node:child_process', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:child_process')>(),
  spawnSync: vi.fn(() => ({ status: 1, error: undefined, signal: null })),
}));

import { activate } from '../../apps/vscode/src/extension.js';
import { interviewStorageKey } from '../../apps/vscode/src/interview.js';
import { orchestratorStatusText } from '../../apps/vscode/src/orchestrator-status.js';
import { confirmInterview, INTERVIEW_DEFAULTS, previewInterview } from '../../packages/runtime/src/interview.js';

let temp = '';
let subscriptions: { dispose(): void }[] = [];
let state: Map<string, unknown>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-05T12:00:00.000Z'));
  temp = mkdtempSync(join(tmpdir(), 'cc-orchestrator-status-'));
  host.folders = [];
  host.commands.clear();
  host.listeners.clear();
  host.documents = [];
  host.shownDocuments = [];
  host.secrets.clear();
  host.secretReadHook = undefined;
  host.openDocumentHook = undefined;
  host.workspaceWrites = [];
  host.secretWrites = [];
  host.taskExecutions = 0;
  subscriptions = [];
  state = new Map<string, unknown>();
});

afterEach(() => {
  for (const subscription of subscriptions) subscription.dispose();
  subscriptions = [];
  if (temp) rmSync(temp, { recursive: true, force: true });
  host.folders = [];
  host.commands.clear();
  host.listeners.clear();
  host.documents = [];
  host.shownDocuments = [];
  host.secretReadHook = undefined;
  host.openDocumentHook = undefined;
  vi.unstubAllEnvs();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function setup(repositoryName = 'repository'): Promise<{ root: string }> {
  const root = join(temp, repositoryName);
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, 'apm.yml'), 'targets:\n  - codex\ndependencies:\n  apm: []\n');
  const extension = join(temp, 'extension');
  mkdirSync(join(extension, 'dist'), { recursive: true });
  writeFileSync(join(extension, 'dist', 'ccon.js'), '');
  const home = join(temp, 'home');
  mkdirSync(join(home, 'runs'), { recursive: true });
  vi.stubEnv('CODE_CONDUCTOR_HOME', home);
  host.folders = [{ uri: { fsPath: root }, name: repositoryName }];
  const context = {
    subscriptions,
    extensionPath: extension,
    workspaceState: {
      get: (key: string) => state.get(key),
      update: async (key: string, value: unknown) => {
        host.workspaceWrites.push(key);
        if (value === undefined) state.delete(key);
        else state.set(key, value);
      },
    },
    secrets: {
      get: async (key: string) => {
        if (host.secretReadHook) return host.secretReadHook(key);
        return host.secrets.get(key);
      },
      store: async (key: string, value: string) => {
        host.secretWrites.push(key);
        host.secrets.set(key, value);
      },
      delete: async (key: string) => { host.secrets.delete(key); },
    },
  };
  await activate(context as any);
  return { root };
}

function deferred(): { promise: Promise<void>; resolve(): void } {
  let resolve!: () => void;
  const promise = new Promise<void>((complete) => { resolve = complete; });
  return { promise, resolve };
}

describe('Orchestrator status command snapshots', () => {
  it('renders an explicit observation timestamp, static-snapshot warning, and unknown runtime/review state', () => {
    const report = orchestratorStatusText('/repo', { targets: [], packs: [], diagnostics: [] });
    expect(report).toContain('Observed at: 2026-11-05T12:00:00.000Z');
    expect(report).toContain('does not auto-refresh');
    expect(report).toContain('rerun "Code Conductor: Inspect Orchestrator Status"');
    expect(report).toContain('Approved AI review: pending / not run.');
    expect(report).toContain('Runtime blueprint consumption: unknown');
  });

  it('keeps the original document unchanged after local inputs change and rerun shows the new snapshot', async () => {
    const { root } = await setup();
    const originalInterview = confirmInterview(root, { ...INTERVIEW_DEFAULTS, mission: 'Private original answer' });
    const key = interviewStorageKey(root);
    host.secrets.set(key, JSON.stringify(originalInterview));
    const command = host.commands.get('codeConductor.inspectOrchestrator');
    expect(command).toBeDefined();

    await command!();
    const first = host.shownDocuments[0]!;
    const firstText = first.getText();
    const firstDigest = previewInterview(originalInterview).interviewDigest;
    expect(firstText).toContain('Observed at: 2026-11-05T12:00:00.000Z');
    expect(firstText).toContain(`Interview digest: ${firstDigest}.`);
    expect(firstText).toContain('Local pack records: 0');
    expect(firstText).not.toContain('Private original answer');

    const workspaceWriteCount = host.workspaceWrites.length;
    vi.setSystemTime(new Date('2026-11-05T12:30:00.000Z'));
    writeFileSync(join(root, 'apm.yml'), [
      'targets:',
      '  - codex',
      'dependencies:',
      '  apm:',
      `    - hybridcloudworks/Proj-AgentPacks/example-pack#${'a'.repeat(40)}`,
      '',
    ].join('\n'));
    const updatedInterview = confirmInterview(root, { ...INTERVIEW_DEFAULTS, mission: 'Private updated answer' });
    host.secrets.set(key, JSON.stringify(updatedInterview));

    expect(first.getText()).toBe(firstText);
    expect(firstText).toContain('Observed at: 2026-11-05T12:00:00.000Z');
    expect(firstText).toContain('Local pack records: 0');

    await command!();
    const secondText = host.shownDocuments[1]!.getText();
    expect(secondText).toContain('Observed at: 2026-11-05T12:30:00.000Z');
    expect(secondText).toContain('Local pack records: 1');
    expect(secondText).toContain('Pack: example-pack · declared');
    expect(secondText).toContain(`Interview digest: ${previewInterview(updatedInterview).interviewDigest}.`);
    expect(secondText).not.toContain('Private updated answer');
    expect(host.workspaceWrites).toHaveLength(workspaceWriteCount);
    expect(host.secretWrites).toEqual([]);
    expect(host.taskExecutions).toBe(0);
  });

  it('does not display a report if the selected root changes while SecretStorage is pending', async () => {
    const { root } = await setup('first');
    const otherRoot = join(temp, 'second');
    mkdirSync(otherRoot);
    const gate = deferred();
    const entered = deferred();
    host.secretReadHook = async () => { entered.resolve(); await gate.promise; return undefined; };

    const command = host.commands.get('codeConductor.inspectOrchestrator')!;
    const result = command();
    await entered.promise;
    host.folders = [{ uri: { fsPath: otherRoot }, name: 'second' }];
    gate.resolve();
    await result;

    expect(host.shownDocuments).toEqual([]);
    expect(host.documents).toEqual([]);
    expect(host.secrets.get(interviewStorageKey(root))).toBeUndefined();
  });

  it('does not display a report if the selected root changes while opening its untitled document', async () => {
    await setup('first');
    const otherRoot = join(temp, 'second');
    mkdirSync(otherRoot);
    const gate = deferred();
    const entered = deferred();
    host.openDocumentHook = async () => { entered.resolve(); await gate.promise; };

    const command = host.commands.get('codeConductor.inspectOrchestrator')!;
    const result = command();
    await entered.promise;
    host.folders = [{ uri: { fsPath: otherRoot }, name: 'second' }];
    gate.resolve();
    await result;

    expect(host.documents).toHaveLength(1);
    expect(host.shownDocuments).toEqual([]);
  });
});
