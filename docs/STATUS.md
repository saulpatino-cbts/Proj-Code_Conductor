# Architect Code Coductor working status

Release status checked 2026-11-10 (UTC); earlier feature validation dates remain
as recorded below. This document distinguishes merged development work,
prepared changes and released/workstation evidence. GitHub and executable
validation remain authoritative; issue scope alone is not completion.

## Current position

**Product priority:** cloud architects are the primary audience; the target
workflow and current capability limits are recorded in
[`ARCHITECT-WORKFLOW.md`](ARCHITECT-WORKFLOW.md) and accepted ADR 0020 / D-081.
This direction does not make cloud-specific research, diagrams, IaC proposals,
or independent cloud-architecture assessments shipped capabilities. The
architect-prioritized [open-issue assessment](ARCHITECT-ISSUE-PRIORITIES.md)
records which open work is feasible now. The historical 0.1.3 release and
validation evidence below retain their original compatibility identity.

**0.1.3 is published on GitHub. Reliability, stored execution monitoring, optional
pack provenance/audit and read-only local knowledge navigation are merged on
main. The full workstreams and release validation are not complete.**

| Area | Evidence-backed status |
|---|---|
| Published release | [v0.1.3](https://github.com/saulpatinojr/Proj-Code_Conductor/releases/tag/v0.1.3), published November 7 from `7556349`, with VSIX, SBOM and checksums. Later development changes are unreleased. |
| Dependency remediation | [#136](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/136) merged at `f9130e8`: ACP 2.0.1 and dependency fixes. Local/CI validation is recorded in that PR. |
| Initial cockpit reliability | [#143](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/143) merged at `e3a145c`: task-end refresh, repository-scoped runs, multi-root selection and effective read-only configuration. |
| Stored execution overview | [#144](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/144) merged at `04ad126`: approved start observations, dependency/provider/authority details, evidence refresh, one-shot stale expiry and inert summary text. No new scheduler. |
| Optional APM inventory/audit | [#145](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/145) merged at `8e2b2cb`: pinned source metadata, mismatch diagnostics, explicit bounded audit and absolute executable resolution. Installation lifecycle remains open. |
| Selected pack preview | [#149](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/149) merged at `8c4ab4f`: reviewed fixed-catalog Codex projection comparisons in a Linux write boundary, conflict checks and staged audit. Full installation lifecycle remains open. |
| Native cockpit smoke | [#150](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/150) merged at `25c3524`: repeatable installed-VSIX Linux command/document/task evidence and exact bundle hashes. |
| Knowledge implementation | [#147](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/147) merged at `599b03a`: bounded local knowledge navigation and source provenance, initially trusted local Linux only. |
| Knowledge architecture | [#146](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/146) merged at `5cf27ea`: accepted ADR 0016/D-078, optional bounded read-only navigation with no cloud activation. |
| Workstation evidence | #4 is closed with recorded 0.1.1 Windows evidence: provider smoke tests, activation, R1/R2 and GitHub review. That is not clean-machine validation of 0.1.3 or current source. |

The v0.1.3 [release workflow](https://github.com/saulpatinojr/Proj-Code_Conductor/actions/runs/42345472964)
completed candidate, attestation and draft jobs, but its Marketplace publish job
failed at **Publish the verified package**. The run log shows Azure OIDC login
succeeded, then the Marketplace publisher denied the principal permission to
publish new extensions to `hybridcloudworks`. GitHub release publication does
not prove Marketplace availability. Marketplace listing and clean-machine
installation remain unverified; no permission change, retry or publication was
initiated by this status check. Marketplace prerelease packaging remains
separate work under #14.

## Merged evidence recovery

[PR #151](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/151) merged at `3c6b554`:
manifest-bound gate-output recovery and repository/trust-scoped evidence documents,
with capture-file invalidation and cached-document revalidation. Strong recovery
rejects altered, ambiguous, truncated and legacy combined captures; it preserves
original files. Local validation: **73 files, 661 passed / 33 skipped**, typecheck,
repository/bundle/default/package checks, plus **12 real installed-VSIX Linux
checks**. Independent review found no remaining blockers; required GitHub checks
and review passed before merge. Post-integration typecheck and 96 focused tests
(one skip) passed. See the [native evidence retest](validation/2026-10-28-evidence-recovery-smoke.md).

## Merged knowledge implementation

PR #147 adds explicit existing-vault/folder selection,
repository-bound typed metadata, local source hashes, stale/broken states,
click-time invalidation and native editor/Obsidian navigation. It creates no
notes, copies no private run content and starts no indexing/provider/network
operation at activation or connection. Indexing supports trusted local Linux
hosts only; Windows/macOS/remote indexing fails explicitly.

The implementation reuses descriptor-bound reads, excludes hidden/credential
and configured private-state paths, bounds traversal and total reads, and charges
failed/invalid UTF-8 reads against its budget. A lazy local Git origin lookup has
a two-second/4 KiB bound. Remote issues and run references remain unverified.
URI-ambiguous paths and an unavailable Obsidian client use the editor fallback.
See [Obsidian integration](OBSIDIAN-INTEGRATION.md) for schema and limitations.

Validation after integration with current main: **70 test files, 618 passed /
33 skipped**; typecheck, repository validation, standalone bundle/default smoke
and local VSIX packaging passed. The VSIX uses a test publisher, not publication.
Independent read-only review found no remaining blockers after corrections and
reran focused integration tests. Required GitHub checks passed before merge.
Post-merge on `main`: typecheck, 100 focused tests (one host-specific skip),
repository validation and standalone bundle smoke passed. Knowledge navigation in
a real installed Obsidian client remains unvalidated.

## Native installed-VSIX evidence

The packaged source at `76b903a`, repeated after integrating #149 at `8c4ab4f`,
passed eight real extension-host checks in an
installed test-publisher VSIX on Linux/VS Code 1.105.1 under Xvfb: activation,
command registration, packaged defaults, optional absent APM, scoped run summary,
open-summary refresh and a successful bundled native validation task. The
unrelated empty workspace remained empty. This does not establish Windows,
Restricted Mode, exhaustive click-through, accessibility or real Obsidian behavior.
The reusable runner and bundle hashes are in the [native smoke record](validation/2026-10-28-linux-vsix-smoke.md).
Post-integration validation: **72 files, 649 tests passed / 33 skipped**;
repository validation, standalone bundle/default smoke, test-publisher packaging
and all eight native checks passed again.

## APM evidence and remaining lifecycle

[PR #149](https://github.com/saulpatinojr/Proj-Code_Conductor/pull/149) merged at
`8c4ab4f`: explicit fixed-catalog Codex projection
comparison in a Linux bubblewrap write boundary (ADR 0017). The pinned native APM
run passed staged audit and compared **54 unchanged files** for both reviewed
packs against this repository. Local validation: **72 files, 645 passed / 33
skipped**, typecheck, repository validation, standalone bundle/default smoke and
test-publisher VSIX packaging passed. Independent critical review found and
verified fixes for shared legacy ownership and pre-creation staging containment.
Required GitHub CI passed and independent code/architecture review plus GitHub
review findings were addressed before merge.
This is not an installed-VSIX desktop walkthrough or a repository installation.

The official APM 0.33.0 Linux archive was checked against its published SHA-256.
`apm targets`, native audit and the built CLI audit passed all 31 checks with no
drift against this repository's unchanged package source/projections.

A disposable single-pack Codex fixture confirmed that native installation creates
agent/skill projections, a lock and `.gitignore`. Native `install --dry-run` lists
packages but explicitly omits per-package stale-file cleanup; it is not an exact
projected-file diff. The prepared comparison adds fixed-catalog selection and
exact selected Codex projection/conflict evidence. Full native diffs including
manifest/lock/local-source/all-target merging, action-bound install approval,
deployment-correlated audit evidence and safe update/removal remain required
under #142. See [APM workflows](APM-WORKFLOWS.md).

## Active delivery work

The owner accepted ADR 0019 on 2026-11-05 as the design baseline for **+**
catalog/version discovery, **− / ×**
pending removals committed through **Save**, an illuminated **Orchestrator**
refresh after additions, and Save-triggered reevaluation after removals. The
chosen quality path is metadata validation plus approved AI review, with delta
analysis and safe cache reuse. A short first-use/default/Redo interview produces
the supplied blueprint's ten context files and live routing/handoff contracts.
These controls/interview/files are **not implemented yet**. Acceptance does not
authorize provider calls, customer artifact application, cloud changes or
publication. See [APM workflows](APM-WORKFLOWS.md) and accepted [ADR 0019](adr/0019-pack-controls-and-orchestrator-blueprint.md).

A bounded VS Code **Orchestrator status** inspection now presents local pack
inventory and interview-draft evidence while labeling team review, accepted
baseline, application and runtime consumption as pending/unknown. It does not
implement the accepted pack controls or activate the blueprint; #140/#142 remain
open. See [APM workflows](APM-WORKFLOWS.md).

- [#139](https://github.com/saulpatinojr/Proj-Code_Conductor/issues/139): remaining
  cockpit action/state coverage and real installed-VSIX interaction/host evidence.
- [#140](https://github.com/saulpatinojr/Proj-Code_Conductor/issues/140): remaining
  orchestration UX acceptance, source-linked evidence and desktop validation.
- [#142](https://github.com/saulpatinojr/Proj-Code_Conductor/issues/142): full APM
  select/preview/approve/install/audit/update/removal workflow.
- [#141](https://github.com/saulpatinojr/Proj-Code_Conductor/issues/141):
  validate native navigation, then add incremental indexing and
  reviewed note-template/write workflows. No automatic vault write is authorized
  by connection.
- #137/#138 capture additional Second Brain/sidebar requests. Cloud sync needs
  separate reviewed architecture and protected deployment gates; it is not
  activated by the local adapter.
- #14 remains the Marketplace/release-engineering path. The v0.1.3 GitHub
  release exists, but its Marketplace publish was denied for publisher
  permission; recheck current owner/Entra authorization before any separately
  approved publication action.

## Limits to retain

- Linux installed-VSIX command/document/task smoke passed as recorded above.
  Clean Windows, exhaustive interactive click-through and real Obsidian walkthrough
  remain outstanding. Mocked extension-host/URI tests are separate evidence.
- Kiro modify remains fail-closed; Antigravity unattended execution stays blocked.
- Context file reads and initial knowledge indexing require supported local Linux
  descriptor protection. The context optimizer MCP transport remains experimental.
- No release, Marketplace publication, cloud provisioning or GitHub Project board
  change was performed during these implementation slices.
- PR creation and merge are owner-authorized after required checks; runtime
  provider/disclosure/commit/deployment approvals remain action-specific.

## Incremental knowledge parsing follow-up

The `feat/knowledge-incremental-index` branch adds a bounded metadata-only parsing
cache for explicit knowledge browsing. Descriptor-bound note/source reads and
click-time verification still run each time. Relationships are rebuilt, renamed
notes use their new path/title, and deleted entries are pruned. The cache is
owner-process memory only (200 entries / 2 MiB serialized metadata); connection,
repository/folder changes and disposal clear it. This is incremental parsing,
not a background watcher, persistent semantic index, remote verification or vault
write workflow. Local validation passed: typecheck, **78 files / 703 passed /
33 skipped**, repository validation and standalone bundle/default smoke.
Independent read-only review found no blockers; installed Obsidian/desktop and
whole-workstream acceptance remain separate. The associated PR records packaging
and GitHub gate evidence.

## Prepared plan-review details

Branch `feat/plan-review-details` adds a read-only plan-detail entry and summary
fields for stored requested specializations, acceptance criteria/constraints,
stance, billing lane and chosen versus result-reported provider identities. It
explains action-specific approval boundaries while labeling absent historical
command/readiness snapshots unknown. This presentation does not grant authority
or complete the full #140 acceptance; future snapshot capture and desktop
walkthroughs remain separate.

## Prepared future-plan snapshots

Branch `feat/plan-provenance-snapshot` adds optional version-1 planning provenance
for future CLI plans and persisted runtime runs: actual requested/inferred routing
hints, provided-inventory membership (not sign-in/trust), and non-executing gate
command/prerequisite previews. Older manifests remain readable and unknown. A
preview is provisional original-repository evidence; execution still resolves its
worktree command plan and obtains fresh approvals. This does not enable a client,
a gate, a package installation or deployment, and does not close #140.
