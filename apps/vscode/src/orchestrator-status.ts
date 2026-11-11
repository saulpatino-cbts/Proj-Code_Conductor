import { interviewDraft, previewInterview, type InterviewState } from '@code-conductor/runtime/interview';
import type { PackInventory } from '@code-conductor/apm-adapter/pack-state';

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g;
const clean = (value: string, max = 240): string => value.replace(CONTROL_CHARACTERS, ' ').slice(0, max);
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

function savedInterviewFor(root: string, value: unknown): InterviewState | undefined {
  if (!record(value) || value.version !== 1 || typeof value.repository !== 'string' ||
      typeof value.digest !== 'string' || !record(value.answers) || !record(value.origins)) return undefined;
  const { answers, origins } = value;
  if (typeof answers.mission !== 'string' || typeof answers.priorities !== 'string' || typeof answers.style !== 'string' ||
      (origins.mission !== 'default' && origins.mission !== 'user-input') ||
      (origins.priorities !== 'default' && origins.priorities !== 'user-input') ||
      (origins.style !== 'default' && origins.style !== 'user-input')) return undefined;
  const state: InterviewState = {
    version: 1,
    repository: value.repository,
    answers: { mission: answers.mission, priorities: answers.priorities, style: answers.style },
    origins: { mission: origins.mission, priorities: origins.priorities, style: origins.style },
    digest: value.digest,
  };
  try {
    interviewDraft(root, state);
    return state;
  } catch {
    return undefined;
  }
}

/** Source-linked, bounded local status; private interview text and generated project artifacts are not displayed or read. */
export function orchestratorStatusText(root: string, inventory: PackInventory, storedInterview?: unknown): string {
  const interview = savedInterviewFor(root, storedInterview);
  const hasSavedInterview = storedInterview !== undefined;
  const lines = [
    'Architect Code Coductor orchestrator status — local read-only inspection',
    `Observed at: ${new Date().toISOString()} (timestamped local snapshot).`,
    'This untitled document does not auto-refresh when local inputs change; rerun "Architect Code Coductor: Inspect Orchestrator Status" to refresh it.',
    `Repository: ${clean(root, 500)}`,
    '',
    'PACK INVENTORY',
    `Source metadata: apm.yml SHA-256 ${inventory.manifestSha256 ?? 'absent'}; apm.lock.yaml SHA-256 ${inventory.lockSha256 ?? 'absent'}.`,
    `Local pack records: ${inventory.packs.length}; declared ${inventory.packs.filter((pack) => pack.state === 'declared').length}, locked ${inventory.packs.filter((pack) => pack.state === 'locked').length}, mismatch ${inventory.packs.filter((pack) => pack.state === 'mismatch').length}, unsupported ${inventory.packs.filter((pack) => pack.state === 'unsupported').length}.`,
    `Catalog/version discovery: unknown — no remote catalog request was made.`,
    `APM audit: unknown — inventory and lock pins do not establish integrity.`,
    ...inventory.packs.slice(0, 100).map((pack) => `Pack: ${clean(pack.name)} · ${pack.state}${pack.version ? ` · version ${clean(pack.version, 80)}` : ''}${pack.commit ? ` · commit ${pack.commit}` : ''}`),
    ...(inventory.packs.length > 100 ? [`Additional pack records omitted: ${inventory.packs.length - 100}.`] : []),
    ...inventory.diagnostics.slice(0, 20).map((item) => `Inventory diagnostic: ${clean(item)}`),
    ...(inventory.diagnostics.length > 20 ? [`Additional inventory diagnostics omitted: ${inventory.diagnostics.length - 20}.`] : []),
    '',
    'ORCHESTRATOR PROPOSAL',
    `Saved interview: ${!hasSavedInterview ? 'absent' : interview ? 'valid for this repository' : 'present but invalid or for another repository'}.`,
    'Interview answers are private and omitted from this report.',
  ];
  if (interview) {
    const preview = previewInterview(interview);
    lines.push(
      `Interview digest: ${preview.interviewDigest}.`,
      'Interview-only context proposal: unreviewed and unapplied; the following template hashes are not a reviewed team blueprint.',
      ...preview.files.map((file) => `Draft template: ${file.path} · SHA-256 ${file.sha256}`),
    );
  } else {
    lines.push('Interview-only context proposal: unavailable until a valid repository-scoped interview is saved.');
  }
  lines.push(
    'Team metadata validation: pending; no validated TeamInputs were supplied.',
    'Approved AI review: pending / not run.',
    'Team blueprint: not generated; no reviewed team advice is available.',
    'Blueprint update/conflict plan: not run; no owner-private accepted baseline was supplied.',
    'Accepted baseline/receipt: unknown; project files are not treated as proof of acceptance.',
    'Artifact application: not performed. Runtime blueprint consumption: unknown; no activation claim is made.',
    '',
    'SOURCES',
    'APM inventory: apps/vscode/src/pack-inventory.ts; packages/apm-adapter/src/pack-state.ts; local apm.yml and apm.lock.yaml.',
    'Catalog discovery (not invoked): packages/apm-adapter/src/catalog.ts.',
    'Interview: apps/vscode/src/interview.ts; packages/runtime/src/interview.ts.',
    'Team review and proposal: packages/runtime/src/team-review.ts; packages/runtime/src/blueprint.ts.',
    'Ownership/update planning: packages/runtime/src/blueprint-update.ts.',
    'Required remaining gates: metadata validation, approved AI review, deterministic graph validation, and exact ownership/application review with fresh action-bound approval.',
    '',
    'No network/catalog request, provider, APM process, hook, MCP server or project file write was started by this inspection.',
  );
  return lines.join('\n');
}
