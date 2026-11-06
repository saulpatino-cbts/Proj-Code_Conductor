import { describe, expect, it } from 'vitest';
import { confirmInterview, INTERVIEW_DEFAULTS } from '../../packages/runtime/src/interview.js';
import type { PackInventory } from '../../packages/apm-adapter/src/pack-state.js';
import { orchestratorStatusText } from '../../apps/vscode/src/orchestrator-status.js';

const root = '/repo';
const inventory: PackInventory = {
  manifestSha256: 'a'.repeat(64),
  lockSha256: 'b'.repeat(64),
  apmVersion: '0.33.0',
  targets: ['codex'],
  packs: [{ reference: 'reviewed pin', name: 'example-pack', state: 'locked', version: '1.2.3', commit: 'c'.repeat(40), projections: [] }],
  diagnostics: [],
};

describe('read-only orchestrator status', () => {
  it('links local pack evidence and labels every unimplemented review/application state honestly', () => {
    const report = orchestratorStatusText(root, inventory);
    expect(report).toContain('apm.yml SHA-256 ' + 'a'.repeat(64));
    expect(report).toContain('Pack: example-pack · locked · version 1.2.3');
    expect(report).toContain('Catalog/version discovery: unknown');
    expect(report).toContain('Approved AI review: pending / not run.');
    expect(report).toContain('Blueprint update/conflict plan: not run');
    expect(report).toContain('Accepted baseline/receipt: unknown');
    expect(report).toContain('Runtime blueprint consumption: unknown');
    expect(report).toContain('Interview-only context proposal: unavailable');
    expect(report).toContain('packages/runtime/src/blueprint-update.ts');
    expect(report).toContain('No network/catalog request, provider, APM process');
  });

  it('lists only hashes for a valid saved interview and never discloses answer text', () => {
    const interview = confirmInterview(root, { ...INTERVIEW_DEFAULTS, mission: 'Private project mission text' });
    const report = orchestratorStatusText(root, inventory, interview);
    expect(report).toContain('Saved interview: valid for this repository.');
    expect(report).toContain('unreviewed and unapplied');
    expect(report).toContain('.agent/GOALS.md');
    expect(report).toMatch(/Draft template: \.agent\/GOALS\.md · SHA-256 [a-f0-9]{64}/);
    expect(report).not.toContain('Private project mission text');
  });

  it.each([
    ['wrong repository', confirmInterview('/other', { ...INTERVIEW_DEFAULTS })],
    ['invalid shape', { version: 99 }],
    ['malformed storage', null],
  ])('does not trust %s as a valid interview', (_label, saved) => {
    const report = orchestratorStatusText(root, inventory, saved);
    expect(report).toContain('Saved interview: present but invalid or for another repository.');
    expect(report).toContain('Interview-only context proposal: unavailable');
  });

  it('bounds displayed inventory and strips terminal/editor control characters', () => {
    const many = { ...inventory, packs: Array.from({ length: 101 }, (_, index) => ({ ...inventory.packs[0]!, name: `pack\u202e${index}` })) };
    const report = orchestratorStatusText('/repo\u001b[31m', many);
    expect(report).toContain('Repository: /repo [31m');
    expect(report).toContain('Additional pack records omitted: 1.');
    expect(report).not.toContain('\u202e');
  });
});
