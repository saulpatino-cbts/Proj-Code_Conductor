import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type WelcomeView = { view: string; when: string; contents: string };
const manifest = JSON.parse(readFileSync(new URL('../../apps/vscode/package.json', import.meta.url), 'utf8')) as {
  contributes?: { viewsWelcome?: WelcomeView[] };
};

describe('sidebar first-use guidance', () => {
  it.each(['codeConductor.workstation', 'codeConductor.policy'])('explains how to populate %s when no folder is open', (view) => {
    const welcome = manifest.contributes?.viewsWelcome?.find((item) => item.view === view);
    expect(welcome?.when).toBe('workbenchState == empty');
    expect(welcome?.contents).toContain('[Open Folder](command:vscode.openFolder)');
    expect(welcome?.contents).toContain('repository');
  });
});
