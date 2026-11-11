import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const host = vi.hoisted(() => ({
  trusted: true,
  folders: [] as { uri: { fsPath: string }; name: string }[],
  commands: new Map<string, (...args: any[]) => any>(),
  trees: new Map<string, any>(),
  tasks: [] as any[],
  inputs: [] as any[],
  inputOptions: [] as any[],
}));

vi.mock('vscode', async () => {
  const { URI } = await import('vscode-uri');
  const disposable = () => ({ dispose() {} });
  const listen = () => () => disposable();
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
    Task: class {
      presentationOptions = {};
      constructor(public definition: any, public scope: any, public name: any, public source: any, public execution: any) {}
    },
    ProcessExecution: class { constructor(public executable: string, public args: string[], public options: any) {} },
    RelativePattern: class {},
    extensions: { getExtension: () => undefined },
    workspace: {
      get isTrusted() { return host.trusted; },
      get workspaceFolders() { return host.folders; },
      textDocuments: [],
      registerTextDocumentContentProvider: () => disposable(),
      onDidChangeWorkspaceFolders: listen(),
      onDidGrantWorkspaceTrust: listen(),
      createFileSystemWatcher: () => ({ dispose() {}, onDidCreate: listen(), onDidChange: listen(), onDidDelete: listen() }),
    },
    window: {
      createStatusBarItem: () => ({ show() {}, dispose() {} }),
      registerTreeDataProvider: (id: string, tree: any) => { host.trees.set(id, tree); return disposable(); },
      showQuickPick: async () => undefined,
      showInputBox: async (options: any) => { host.inputOptions.push(options); return host.inputs.shift(); },
      showWarningMessage: vi.fn(),
      showInformationMessage: vi.fn(),
      showErrorMessage: vi.fn(),
    },
    commands: {
      registerCommand: (name: string, fn: (...args: any[]) => any) => { host.commands.set(name, fn); return disposable(); },
      executeCommand: async (name: string, ...args: any[]) => host.commands.get(name)?.(...args),
    },
    tasks: {
      onDidStartTask: listen(),
      onDidEndTaskProcess: listen(),
      onDidEndTask: listen(),
      executeTask: async (task: any) => { host.tasks.push(task); return task; },
    },
  };
});

vi.mock('node:child_process', async (importOriginal) => ({
  ...await importOriginal<typeof import('node:child_process')>(),
  spawnSync: vi.fn(() => ({ status: 1, error: undefined, signal: null })),
}));

import { activate } from '../../apps/vscode/src/extension.js';

let temp = '';
let subscriptions: { dispose(): void }[] = [];
let state: Map<string, unknown>;

beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'cc-apm-catalog-'));
  host.trusted = true;
  host.folders = [];
  host.commands.clear();
  host.trees.clear();
  host.tasks = [];
  host.inputs = [];
  host.inputOptions = [];
  subscriptions = [];
  state = new Map<string, unknown>();
});

afterEach(() => {
  for (const subscription of subscriptions) subscription.dispose();
  subscriptions = [];
  if (temp) rmSync(temp, { recursive: true, force: true });
  host.folders = [];
  host.commands.clear();
  host.trees.clear();
  host.tasks = [];
  host.inputs = [];
  host.inputOptions = [];
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

async function setup(): Promise<{ repository: string; extension: string }> {
  const repository = join(temp, 'repository');
  mkdirSync(repository, { recursive: true });
  const extension = join(temp, 'extension');
  mkdirSync(join(extension, 'dist'), { recursive: true });
  writeFileSync(join(extension, 'dist', 'ccon.js'), '');
  const home = join(temp, 'home');
  mkdirSync(join(home, 'runs'), { recursive: true });
  vi.stubEnv('CODE_CONDUCTOR_HOME', home);
  host.folders = [{ uri: { fsPath: repository }, name: 'repository' }];
  const context = {
    subscriptions,
    extensionPath: extension,
    workspaceState: {
      get: (key: string) => state.get(key),
      update: async (key: string, value: unknown) => { if (value === undefined) state.delete(key); else state.set(key, value); },
    },
    secrets: { get: async () => undefined, store: async () => {}, delete: async () => {} },
  };
  await activate(context as never);
  return { repository, extension };
}

function commandPayload(task: any): unknown {
  const encoded = task.execution.args.at(-1);
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as unknown;
}

describe('APM catalog commands', () => {
  it('does not fetch on activation and exposes explicit discovery and validation actions', async () => {
    const { repository, extension } = await setup();
    expect(host.tasks).toHaveLength(0);

    const groups = host.trees.get('codeConductor.workstation').getChildren().map((item: any) => item.node);
    const packs = groups.find((node: any) => node.label === 'Packs').children;
    expect(packs.map((node: any) => node.label)).toContain('Discover public pack catalog');
    expect(packs.map((node: any) => node.label)).toContain('Validate catalog selection');

    await host.commands.get('codeConductor.discoverPacks')!();
    expect(commandPayload(host.tasks[0])).toEqual({
      cwd: repository,
      args: [join(extension, 'dist/ccon.js'), 'apm-catalog', '--repo', repository],
    });

    const selection = `hybridcloudworks/proj-agentpacks/typescript-distinguished-engineer-pack@1.2.3#${'a'.repeat(40)}`;
    host.inputs.push(selection);
    await host.commands.get('codeConductor.validatePackSelection')!();
    expect(host.inputOptions[0].validateInput(selection)).toBeUndefined();
    expect(commandPayload(host.tasks[1])).toEqual({
      cwd: repository,
      args: [join(extension, 'dist/ccon.js'), 'apm-catalog', '--repo', repository, '--select', selection],
    });
  });

  it('requires a selected repository before making a catalog request', async () => {
    await setup();
    host.folders = [];
    await host.commands.get('codeConductor.discoverPacks')!();
    const vscode = await import('vscode');
    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('Select an open repository'));
    expect(host.tasks).toHaveLength(0);
  });

  it('does not make a catalog request in Restricted Mode', async () => {
    await setup();
    host.trusted = false;
    await host.commands.get('codeConductor.discoverPacks')!();
    const vscode = await import('vscode');
    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('requires a trusted workspace'));
    expect(host.tasks).toHaveLength(0);
  });

  it('rejects invalid pasted selection IDs without making a request', async () => {
    await setup();
    host.inputs.push('--repo .');
    await host.commands.get('codeConductor.validatePackSelection')!();
    const vscode = await import('vscode');
    expect(host.inputOptions[0].validateInput('--repo .')).toContain('compound ID');
    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(expect.stringContaining('not a valid compound version ID'));
    expect(host.tasks).toHaveLength(0);
  });

  it.each(['1', '1..2', '1.2.3-01'])('rejects malformed SemVer %s without making a request', async (version) => {
    await setup();
    const selection = `hybridcloudworks/proj-agentpacks/example-pack@${version}#${'a'.repeat(40)}`;
    host.inputs.push(selection);
    await host.commands.get('codeConductor.validatePackSelection')!();
    expect(host.inputOptions[0]?.validateInput(selection)).toContain('compound ID');
    expect(host.tasks).toHaveLength(0);
  });

  it('reports the missing bundled CLI runtime without falling back', async () => {
    const { extension } = await setup();
    rmSync(join(extension, 'dist', 'ccon.js'));
    await host.commands.get('codeConductor.discoverPacks')!();
    const vscode = await import('vscode');
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('runtime bundle is missing'));
    expect(host.tasks).toHaveLength(0);
  });
});
