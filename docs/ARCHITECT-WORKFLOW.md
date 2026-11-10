# Architect Code Coductor workflow

Architect Code Coductor is prioritized for cloud architects who need to turn
requirements into reviewable, evidence-backed architecture decisions and safe
delivery plans. The workflow is provider-neutral across Azure, AWS and Google
Cloud. Choose services from the workload's requirements and constraints—not
from the agent, model, or cloud provider that happens to be available.

This is the product direction and review standard, not a claim that every
cloud-architecture capability is already built into the current release. The
repository currently provides general task planning and orchestration,
provider/harness boundaries, worktree isolation, structured evidence, human
approval checkpoints, and configured deterministic validation. Cloud-specific
research, diagrams, IaC proposals, and independent architecture assessments
depend on configured tools and specialists; there is no built-in guarantee of
complete or current cloud coverage, nor an automatic end-to-end architecture
wizard. See [`STATUS.md`](STATUS.md) and the architect-prioritized
[open-issue assessment](ARCHITECT-ISSUE-PRIORITIES.md) for what is available
and what remains open.

## Desired lifecycle

1. **Frame the requirements.** Record business outcomes, workload and data
   boundaries, users, regions, compliance constraints, service levels,
   operating model, budget, migration constraints, and acceptance criteria.
   Label unknowns; do not silently invent requirements or account facts.
2. **Research authoritative sources.** Use current official Azure, AWS, Google
   Cloud, and relevant standards documentation for provider-specific claims.
   Capture source URLs, dates/versions where available, and what each source
   supports. Search summaries and agent recollections are leads, not proof.
   Distinguish vendor-specific guidance from provider-neutral reasoning.
3. **Compare architecture options.** Present at least the viable options and
   the reasons for selecting or rejecting each. Make explicit trade-offs in
   **security, resilience, cost, operations, performance, and sustainability**.
   Identify assumptions, failure modes, blast radius, dependencies, and
   decision triggers. A provider-neutral decision is a comparative outcome,
   not a lowest-common-denominator design.
4. **Produce reviewable artifacts.** Where requested and supported, prepare
   architecture diagrams, ADRs, and IaC proposals as versioned files or diffs.
   Label each artifact as proposed, reviewed, validated, or applied; a diagram
   or generated plan does not establish that the implementation is correct.
5. **Obtain independent challenge.** Assign independent cloud-architecture,
   security, resilience, and cost review when the risk and available specialists
   warrant it. Reviewers should challenge evidence, assumptions, threat and
   failure models, cost drivers, operational readiness, and sustainability
   implications—not merely restate the proposal. Missing expertise or evidence
   remains an explicit limitation, not an implied pass.
6. **Run deterministic checks.** Select the repository's configured,
   policy-allowed checks (for example format, validate, policy, test, or a
   bounded plan review). Record exact commands, prerequisites, and results.
   A check proves only its declared scope; a successful plan is not deployment
   approval, and a skipped or unavailable check is not a pass.
7. **Hand off through human-controlled gates.** Keep changes in an isolated
   reviewable branch/worktree. Obtain action-specific approval before
   consequential disclosure, provider execution, commit, or deployment. Use
   native cloud/pipeline interfaces for apply and production approval. Report
   who must act next, what evidence they need, and what remains unverified.

## Evidence and decision quality

- Separate requirements, assumptions, constraints, options, chosen decisions,
  evidence, validation results, approvals, and unresolved questions.
- Attribute claims to official source documents, repository evidence, or named
  reviewer analysis. Preserve enough provenance for another architect to
  reproduce a material conclusion.
- Evaluate total lifecycle cost and operational ownership, not only initial
  resource price. Include reliability targets, recovery objectives, identity
  and data protection, performance envelopes, and material sustainability
  considerations where the workload makes them relevant.
- Keep recommendations provider-neutral until requirements or verified
  provider constraints justify a provider-specific choice. Do not equate
  provider neutrality with forcing the same service or design onto all clouds.
- AI output is a proposal. It cannot grant permissions, create credentials,
  certify compliance, authorize IaC apply, approve a release, or declare a
  production deployment successful.
- Human approval and native platform controls remain authoritative for
  consequential, shared, or production actions. Read-only research and a
  local plan do not authorize mutation.

## Current capability versus direction

| Workflow stage | Current repository foundation | What is not implied |
|---|---|---|
| Requirements and planning | General task envelopes, planning, role/stance/risk and acceptance criteria support scoped work. | No cloud-specific requirements interview or completeness certification. |
| Official research | An approved, profile-driven MCP/reference plane and manual/provider-native lanes are documented. | No guarantee that a provider reference is enabled, current, exhaustive, or consulted on every task. |
| Diagrams, ADRs and options | Repository docs and ADR conventions can hold reviewable decisions; configured specialists/tools may contribute. | No built-in diagram generator or validated cloud reference architecture library. |
| IaC proposal | Isolated worktrees and configured deterministic tools support reviewable repository changes. | No automatic IaC generation, account discovery, provisioning, or deployment authorization. |
| Independent review | Risk-based roles, structured findings, and deterministic evidence support review workflows. | Cloud-specific specialist availability and review are not guaranteed by default. |
| Validation and handoff | Configured gates, stored evidence, human approval, native interfaces, and handoff records exist. | A passing configured check is not a complete Well-Architected assessment or production sign-off. |

Future work should close these gaps in small, testable increments. Preserve the
existing separation between runtime orchestration, APM packaging, MCP tools and
references, provider-native clients, deterministic tools, and human authority.

## Product naming and compatibility

**Architect Code Coductor** is the requested product and user-facing
positioning. `Code Conductor` remains where required for compatibility or
provenance: the GitHub repository and URLs, npm/APM package and extension
identifiers, the `ccon` command and configuration/API/extension IDs, on-disk
state paths, and previously published release artifacts. Exact sibling and
vendor product names remain unchanged. Older accepted ADRs, changelogs,
validation reports, dated archived plans, and immutable release history preserve
their original wording; they document what was decided or shipped at that time,
not the current product priority. The APM package identity/metadata and lock
state, schema titles, serialized runtime markers, and runtime task/evidence
contract text are also not changed for this display-name pivot.

Canonical first-party agent memory is the tracked repository context
(`AGENTS.md`, `STARTER.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`)
plus the linked product/decision documents. There is no global memory service
whose state this repository can update. APM-generated third-party agent/skill
projections are not hand-edited for this branding change; their canonical
source and package pins remain untouched.
