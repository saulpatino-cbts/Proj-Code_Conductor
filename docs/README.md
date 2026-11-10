# Architect Code Coductor documentation

This directory contains maintained design, operating, and validation
documentation for Architect Code Coductor. The architect-first workflow and
shipped-versus-direction boundaries have one authoritative home.

## Start here

- [`../README.md`](../README.md) — project overview and quick start.
- [`../AGENTS.md`](../AGENTS.md) — repository constitution for human and AI contributors.
- [`../STARTER.md`](../STARTER.md) — concise continuity handoff for a new work session.
- [`STATUS.md`](STATUS.md) — current implementation checkpoint and next milestone.
- [`DECISIONS.md`](DECISIONS.md) — durable register of locked decisions and validation facts.
- [`ARCHITECT-WORKFLOW.md`](ARCHITECT-WORKFLOW.md) — architect-first workflow, evidence standard, current capability boundaries and compatibility naming rules.
- [`ARCHITECT-ISSUE-PRIORITIES.md`](ARCHITECT-ISSUE-PRIORITIES.md) — architect-prioritized open-issue completion feasibility and priority assessment.

## Architecture and implementation

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — system boundaries, layers, team model, and source-of-truth architecture.
- [`adr/0020-architect-first-cloud-architecture-workflow.md`](adr/0020-architect-first-cloud-architecture-workflow.md) — accepted cloud-architect-first product priority.
- [`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) — v0.1 release plan and phased implementation scope.
- [`UI.md`](UI.md) — VS Code cockpit scope and deliberate non-features.

## Operations and integrations

- [`BOOTSTRAP.md`](BOOTSTRAP.md) — repository/workstation bootstrap sequence.
- [`WORKSTATION-VALIDATION.md`](WORKSTATION-VALIDATION.md) — official-client authentication and harness smoke validation.
- [`AUTHENTICATION.md`](AUTHENTICATION.md) — authentication, credential, and subscription/API billing boundaries.
- [`APPROVALS.md`](APPROVALS.md) — pre-action approvals bound to the exact recipient, revision, content and diff.
- [`NATIVE-INTERFACES.md`](NATIVE-INTERFACES.md) — next actions, native Source Control/GitHub/sign-in hand-offs and manual fallback.
- [`GITHUB.md`](GITHUB.md) — read-only pull-request gate (`ccon github-gate`) and approval-gated draft pull requests (`ccon pr`).
- [`HANDOFFS.md`](HANDOFFS.md) — versioned handoff packets between assignments and local evidence retention.
- [`WORKTREES.md`](WORKTREES.md) — agent worktree isolation, commit safeguards, retention/cleanup and provider environment.
- [`GATE-PROFILES.md`](GATE-PROFILES.md) — deterministic gate profiles, prerequisites, bounded execution and the validate/plan/apply boundary.
- [`INSTALL.md`](INSTALL.md) — installing the VS Code extension, prerequisites, compatibility, updates, running `ccon` from it, and uninstalling.
- [`DOGFOOD-FIXTURE.md`](DOGFOOD-FIXTURE.md) — the separate practice repository for quick runs: what it is, how to use it, whether it is archived, and how to rebuild it.
- [`RELEASE.md`](RELEASE.md) — tagged releases: tests, SBOM, signed provenance, draft release, verification, versions, rollback and Marketplace setup.
- [`MARKETPLACE-PUBLISHING.md`](MARKETPLACE-PUBLISHING.md) — the owner's step-by-step Marketplace setup: publisher, Entra ID application and federated credential, environment secrets, the publish switch.
- [`PACKAGED-DEFAULTS.md`](PACKAGED-DEFAULTS.md) — packaged configuration defaults and bounded user/workspace preferences.
- [`MCP-CATALOG.md`](MCP-CATALOG.md) — approved MCP/reference strategy and tool-plane rules.
- [`REPOSITORY-GOVERNANCE.md`](REPOSITORY-GOVERNANCE.md) — branch, PR, required-check, and repository-setting baseline.

## Decisions

- [`adr/`](adr/) — architecture decision records. ADRs are required when a change supersedes a locked decision or alters a major system/security boundary.
- [`adr/README.md`](adr/README.md) — ADR format and lifecycle.

## Repository governance

Repository-wide contributor/review documentation lives at the root or under `.github/`:

- [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- [`../REVIEW.md`](../REVIEW.md)
- [`../SECURITY.md`](../SECURITY.md)
- [`../CHANGELOG.md`](../CHANGELOG.md)
- [`../.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md)

## Documentation ownership

Avoid duplicating authoritative content. When possible, update the authoritative document and link to it elsewhere. `STATUS.md` is the living checkpoint; `DECISIONS.md` is the durable decision
record; `AGENTS.md` is the operating constitution. The architect workflow doc
is authoritative for product-facing workflow and capability claims; other
documents link to it instead of duplicating its full guidance.

## Optional knowledge navigation

- [Obsidian integration](OBSIDIAN-INTEGRATION.md) — current implementation boundary.
- [ADR 0016](adr/0016-local-first-knowledge-navigation.md) — reviewed local-first
  design proposal and its quality/implementation gates.

## Optional pack workflows

- [APM workflows](APM-WORKFLOWS.md) — provenance, staged projection preview and audit.
- [ADR 0017](adr/0017-write-isolated-pack-projection-preview.md) — write-isolated
  fixed-catalog previews and their authority limits.
