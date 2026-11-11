import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('architect-first product positioning', () => {
  it('keeps the README aligned with the workflow decision and capability limits', () => {
    const readme = read('README.md');
    const workflow = read('docs/ARCHITECT-WORKFLOW.md');
    const decisions = read('docs/DECISIONS.md');

    expect(readme).toContain('# Architect Code Coductor');
    expect(readme).toContain('docs/ARCHITECT-WORKFLOW.md');
    expect(readme).toContain('docs/ARCHITECT-ISSUE-PRIORITIES.md');
    expect(readme).toContain('extension/package identifier remains `code-conductor-vscode`');
    expect(readme).toContain('development builds use the display name **Architect Code Coductor**');
    expect(readme).toMatch(/released\s+v0\.1\.3 remains branded \*\*Code Conductor\*\*/);
    expect(readme).toContain('**Code Conductor: Doctor**');
    expect(workflow).toContain('Current capability versus direction');
    expect(workflow).toContain('No automatic IaC generation');
    for (const tradeoff of ['security', 'resilience', 'cost', 'operations', 'performance', 'sustainability']) {
      expect(workflow.toLowerCase()).toContain(tradeoff);
    }
    expect(decisions).toContain('D-081');
    expect(decisions).toContain('ADR 0020');
  });

  it('keeps tracked agent context linked to the authoritative workflow', () => {
    for (const path of ['AGENTS.md', 'STARTER.md', 'CLAUDE.md', '.github/copilot-instructions.md']) {
      const context = read(path);
      expect(context).toContain('Architect Code Coductor');
      expect(context).toContain('docs/ARCHITECT-WORKFLOW.md');
    }
  });

  it('updates extension display text without changing its compatibility identity', () => {
    const manifest = JSON.parse(read('apps/vscode/package.json')) as {
      name: string;
      displayName: string;
      description: string;
      activationEvents: string[];
      contributes: {
        commands: Array<{ command: string; title: string }>;
        viewsContainers: { activitybar: Array<{ id: string; title: string }> };
      };
    };

    expect(manifest.name).toBe('code-conductor-vscode');
    expect(manifest.displayName).toBe('Architect Code Coductor');
    expect(manifest.description).toContain('cloud-architect-first');
    expect(manifest.activationEvents).toContain('onCommand:codeConductor.doctor');
    expect(manifest.contributes.viewsContainers.activitybar[0]).toMatchObject({
      id: 'codeConductor',
      title: 'Architect Code Coductor',
    });
    expect(manifest.contributes.commands).toContainEqual(expect.objectContaining({
      command: 'codeConductor.doctor',
      title: 'Architect Code Coductor: Doctor',
    }));
    expect(manifest.contributes.commands.every(({ title }) => title.startsWith('Architect Code Coductor:'))).toBe(true);
  });

  it('updates CLI help branding without renaming the command or stored commit identity', () => {
    const cli = read('packages/cli/src/index.ts');
    expect(cli).toContain('Usage: ccon <');
    expect(cli).toContain('Architect Code Coductor doctor');
    expect(cli).toContain('user.name=Code Conductor');
  });

  it('keeps installed-bundle smoke output assertions aligned on every platform', () => {
    // This contract runs even where Linux packaging integration tests are skipped.
    const smoke = read('scripts/smoke-vscode-bundle.mjs');
    const cli = read('packages/cli/src/index.ts');
    const output = 'No Architect Code Coductor agent worktrees recorded in stored runs.';
    expect(cli).toContain(output);
    const assertion = smoke.match(/assert\.match\(ccon\('worktrees'\), \/(.*?)\/\);/);
    expect(assertion, 'installed smoke must retain its worktrees output assertion').not.toBeNull();
    if (!assertion?.[1]) throw new Error('Missing installed smoke worktrees pattern');
    const pattern = new RegExp(assertion[1]);
    expect(pattern.test(`${output}\n`)).toBe(true);
    expect(pattern.test('No Code Conductor agent worktrees recorded in stored runs.\n')).toBe(false);
    expect(pattern.test('')).toBe(false);
    expect(pattern.test('Unexpected worktree command failure')).toBe(false);
  });

  it('distinguishes the released Doctor title and preserves exact CI workflow identity', () => {
    const install = read('docs/INSTALL.md');
    const workstation = read('docs/WORKSTATION-VALIDATION.md');
    const governance = read('docs/REPOSITORY-GOVERNANCE.md');
    const ci = read('.github/workflows/ci.yml');
    const manifestText = read('apps/vscode/package.json');
    const fixture = read('docs/DOGFOOD-FIXTURE.md');

    expect(install).toContain('released v0.1.3 extension');
    expect(install).toContain('**Code Conductor: Doctor**');
    expect(workstation).toContain('Use the title matching the installed build.');
    expect(workstation).toContain('**Code Conductor: Doctor**');
    expect(governance).toContain('`Code Conductor CI` workflow');
    expect(ci).toMatch(/^name: Code Conductor CI$/m);
    // The current source's identity and command IDs remain compatibility contracts.
    expect(manifestText).toContain('"name": "code-conductor-vscode"');
    expect(manifestText).toContain('"command": "codeConductor.doctor"');
    // Keep the copied 2026-10-21 fixture transcript historically exact.
    expect(fixture).toContain('"description": "A three-file Node project for Code Conductor dogfood runs:');
    expect(fixture).toContain('A tiny Node project used only to exercise Code Conductor runs');
    expect(fixture).not.toContain('A tiny Node project used only to exercise Architect Code Coductor runs');
  });
});
