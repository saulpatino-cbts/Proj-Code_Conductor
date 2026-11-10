# ADR 0020 — Architect-first cloud architecture workflow

- **Status:** Accepted
- **Date:** 2026-11-10
- **Scope:** Product priorities, architect workflow, and first-party product presentation
- **Related:** ADR 0008, ADR 0009, ADR 0011, ADR 0019; D-081

## Context

The owner directed the product to focus on cloud architects and to use the
user-facing name **Architect Code Coductor**. The product should optimize an
architect's end-to-end workflow, while retaining the existing multi-agent
orchestration foundations where they serve that goal.

The repository already has general planning/orchestration, provider/harness
boundaries, worktrees, structured evidence, human approval gates, and
deterministic validation. Those foundations do not establish that cloud-specific
research, architecture diagrams, IaC proposals, or independent cloud
Well-Architected reviews are implemented as integrated product capabilities.
The positioning must not overstate current behavior or reduce cloud architecture
to a provider-specific agent workflow.

## Decision

1. Prioritize cloud architects as the primary product audience and optimize
   product decisions for their requirements-to-evidence-to-handoff workflow.
2. Treat Azure, AWS, and Google Cloud as provider-neutral design alternatives.
   Select provider services only from workload requirements and verified
   constraints; do not privilege an agent's provider specialization.
3. Make security, resilience, cost, operations, performance, and sustainability
   explicit decision dimensions. Architecture outputs should show trade-offs,
   assumptions, evidence provenance, independent challenge, deterministic
   validation, human approvals, and remaining unknowns.
4. Use [`docs/ARCHITECT-WORKFLOW.md`](../ARCHITECT-WORKFLOW.md) as the
   authoritative workflow and capability-status reference. Other repository
   rules link to it rather than duplicating its detailed policy.
5. Distinguish the accepted product direction from shipped functionality.
   Cloud-specific workflows are not claimed as complete until independently
   validated against their requirements and evidence. No automatic cloud
   provisioning or production approval is introduced by this decision.
6. Use **Architect Code Coductor** for maintained first-party product prose and
   display labels. Preserve compatibility identifiers, repository/package
   identities, commands, state paths, API/extension contracts, generated APM
   projections, official names, and immutable historical evidence as described
   in the workflow document. This is a presentation change, not a runtime
   authority or routing change.
7. Maintain the decision in tracked repository files. No claim is made that
   global or external agent memory has been updated.

## Consequences

README and durable agent context lead with cloud-architect value; one workflow
document defines the future lifecycle and current capability limits. The
architect-prioritized issue assessment identifies which backlog items can be
completed now, but this ADR does not close or re-scope those issues. Provider,
model, harness, billing, authority, and approval boundaries remain unchanged.

Product naming is intentionally not a repository/package/extension/API
migration. Existing exact identifiers remain usable, and older decisions and
release evidence stay historically accurate.

## Validation

This ADR records the owner's explicit product direction. Validate implementation
of individual workflow stages against current source, official vendor
documentation where cloud-specific technical claims are made, deterministic
checks, and independent review. The documentation and presentation change must
not imply a cloud capability that is absent from the source or validation
evidence.

## Supersedes / Superseded by

None.
