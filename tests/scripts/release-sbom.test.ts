import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

function exerciseWindowsSelection(platformShim: boolean): void {
  const root = mkdtempSync(join(tmpdir(), 'cc-release-sbom-'));
  try {
    // Use a copied Node executable so the test controls whether its adjacent npm CLI exists.
    const nodePath = join(root, 'node.exe');
    copyFileSync(process.execPath, nodePath);
    if (process.platform !== 'win32') chmodSync(nodePath, 0o755);
    const npmCli = join(root, 'node_modules', 'npm', 'bin', 'npm-cli.js');
    const recordPath = join(root, 'npm-arguments.json');
    const outputPath = join(root, 'release.cdx.json');
    const shimPath = join(root, 'simulate-windows.mjs');
    mkdirSync(dirname(npmCli), { recursive: true });
    mkdirSync(join(root, 'apps', 'vscode', 'dist'), { recursive: true });
    writeFileSync(join(root, 'apps', 'vscode', 'dist', 'bundled-packages.json'), '[]\n');
    writeFileSync(npmCli, [
      "const { writeFileSync } = require('node:fs');",
      "writeFileSync(process.env.RELEASE_SBOM_TEST_RECORD, JSON.stringify({ executable: process.execPath, args: process.argv.slice(2) }));",
      "process.stdout.write(JSON.stringify({ bomFormat: 'CycloneDX', components: [] }));",
      '',
    ].join('\n'));
    if (platformShim) {
      writeFileSync(shimPath, [
        "Object.defineProperty(process, 'platform', { value: 'win32' });",
        "Object.defineProperty(process, 'execPath', { value: process.env.RELEASE_SBOM_TEST_NODE });",
        '',
      ].join('\n'));
    }

    const scriptPath = resolve('scripts/release-sbom.mjs');
    const env = { ...process.env, RELEASE_SBOM_TEST_RECORD: recordPath, RELEASE_SBOM_TEST_NODE: nodePath };
    const run = () => spawnSync(
      platformShim ? process.execPath : nodePath,
      platformShim ? ['--import', pathToFileURL(shimPath).href, scriptPath, outputPath] : [scriptPath, outputPath],
      { cwd: root, encoding: 'utf8', env, timeout: 15_000 },
    );
    const success = run();
    expect(success.error).toBeUndefined();
    expect(success.status, success.stderr).toBe(0);
    expect(JSON.parse(readFileSync(recordPath, 'utf8'))).toEqual({
      executable: nodePath,
      args: ['sbom', '--sbom-format', 'cyclonedx', '--sbom-type', 'application', '--workspace', 'apps/vscode', '--workspace', 'packages/cli'],
    });
    expect(JSON.parse(readFileSync(outputPath, 'utf8'))).toMatchObject({ bomFormat: 'CycloneDX', components: [] });

    rmSync(npmCli);
    rmSync(recordPath);
    const missingCli = run();
    expect(missingCli.error).toBeUndefined();
    expect(missingCli.status).not.toBe(0);
    expect(missingCli.stderr).toContain(`The npm CLI was not found beside Node at ${npmCli}.`);
    expect(existsSync(recordPath)).toBe(false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('scripts/release-sbom.mjs Windows npm execution', () => {
  it('exercises Windows executable selection and missing-CLI failure with a platform shim', () => {
    exerciseWindowsSelection(true);
  });

  it.runIf(process.platform === 'win32')('also exercises the same behavior on a native Windows process', () => {
    exerciseWindowsSelection(false);
  });
});
