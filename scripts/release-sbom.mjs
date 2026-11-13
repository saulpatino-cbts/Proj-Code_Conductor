import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// Writes the CycloneDX SBOM of what the VS Code package bundles: npm's dependency graph of
// the two bundled workspaces (the extension and the ccon runtime), development dependencies
// marked as such. It then checks that the SBOM lists every package esbuild actually put in
// a bundle (apps/vscode/dist/bundled-packages.json, written by build-vscode.mjs), so a
// package npm leaves out fails the release instead of going unlisted.
//
//   node scripts/release-sbom.mjs <out.cdx.json>
const out = process.argv[2];
if (!out) throw new Error('Usage: node scripts/release-sbom.mjs <out.cdx.json>');
const npmArgs = ['sbom', '--sbom-format', 'cyclonedx', '--sbom-type', 'application', '--workspace', 'apps/vscode', '--workspace', 'packages/cli'];
// Node cannot spawn a .cmd shim with shell:false on Windows. Invoke the npm JS CLI
// alongside this Node executable instead, retaining the repository's shell-free boundary.
const npmCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
if (process.platform === 'win32' && !existsSync(npmCli)) throw new Error(`The npm CLI was not found beside Node at ${npmCli}.`);
const npm = process.platform === 'win32' ? process.execPath : 'npm';
const args = process.platform === 'win32' ? [npmCli, ...npmArgs] : npmArgs;
const text = execFileSync(npm, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: false });
const sbom = JSON.parse(text);
if (sbom.bomFormat !== 'CycloneDX' || !Array.isArray(sbom.components)) throw new Error('npm sbom did not produce a CycloneDX document.');
// npm writes scoped workspace names without their scope, so components are matched by purl.
const purl = (spec) => { const at = spec.lastIndexOf('@'); return `pkg:npm/${spec.slice(0, at).replace(/^@/, '%40')}@${spec.slice(at + 1)}`; };
const listed = new Set(sbom.components.map((component) => component.purl));
const bundled = JSON.parse(readFileSync('apps/vscode/dist/bundled-packages.json', 'utf8'));
const missing = bundled.filter((spec) => !listed.has(purl(spec)) && purl(spec) !== sbom.metadata?.component?.purl);
if (missing.length) throw new Error(`The SBOM does not list bundled packages: ${missing.join(', ')}`);
writeFileSync(out, `${JSON.stringify(sbom, null, 2)}\n`);
console.log(`${out}: ${sbom.components.length} components, covering all ${bundled.length} bundled packages.`);
