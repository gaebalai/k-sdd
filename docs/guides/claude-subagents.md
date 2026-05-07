# Claude Code Subagents Workflow (Spec-Quick Focus)

> 📖 **한국어 가이드는 여기:** [Claude 서브에이전트 가이드 (한국어)](ko/claude-subagents.md)

> **Scope:** this page covers the legacy **`--claude-agent` / `--claude-code-agent`** install target, which uses static Subagent files under `.claude/agents/kiro/*.md` to accelerate `spec-quick`. If you installed with `--claude-skills` (or any other `--*-skills` flag) and are looking for how skills mode dispatches implementer / reviewer / debugger roles, see the [Skill Reference](skill-reference.md) — specifically the "Inside `/kiro-impl`" and "Skills mode vs `--claude-agent`" sections.

This guide explains how the **Claude Code Subagents** install target (`--claude-agent` / `--claude-code-agent`) accelerates the spec workflow via the `spec-quick` command. Other `/kiro:*` commands reuse the same Subagents, but this document focuses on the spec-quick orchestration because it is the only Subagent-enabled command with its own control logic.

## Installation Recap

- Install with `npx k-sdd@latest --claude-agent --lang <code>`.
- Files are placed under:
  - `.claude/commands/kiro/` – 12 high-level commands (spec, steering, validation).
  - `.claude/agents/kiro/` – 9 Subagent definitions used for deeper analysis, file expansion, and reporting.
  - `CLAUDE.md` – quickstart and usage tips.

## How `spec-quick` Orchestrates Subagents

`spec-quick` is a macro-command that calls four Subagents in sequence—`spec-init` (inline), `spec-requirements`, `spec-design`, and `spec-tasks`—to generate a brand-new spec in one run. Internally, the command follows the same instructions defined in `tools/k-sdd/templates/agents/claude-code-agent/commands/spec-quick.md`.

### Modes

- **Interactive (default)** – Stops after each phase and asks whether to continue. Ideal for first-time runs or complex features.
- **Automatic (`--auto`)** – Runs all phases without pausing, using TodoWrite to track progress. Best for quick drafts or low-risk features.

Both modes skip `/kiro:validate-gap` and `/kiro:validate-design`. The completion message reminds you to run these manually if the feature is risky.

### Phase Breakdown

| Phase           | Triggered Subagent                | What happens                                                                                                                                                                       |
| --------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Initialize   | Inline instructions (no Subagent) | Creates `.kiro/specs/{feature}/`, writes `spec.json` + `requirements.md` skeleton from templates. TodoWrite marks "Initialize spec" as complete.                                   |
| 2. Requirements | `agents/spec-requirements.md`     | Runs `/kiro:spec-requirements {feature}` to fill out requirements.md. In automatic mode, ignores "Next step" prompts from this Subagent and proceeds immediately.                  |
| 3. Design       | `agents/spec-design.md`           | Executes `/kiro:spec-design {feature} -y`, which generates/updates `research.md` (if needed) and `design.md`. TodoWrite now marks three phases complete.                           |
| 4. Tasks        | `agents/spec-tasks.md`            | Calls `/kiro:spec-tasks {feature} -y` to build `tasks.md` with Req coverage and P-wave labels. When finished, TodoWrite hits 4/4 complete and spec-quick prints the final summary. |

In automatic mode the command never pauses, even when Subagents emit “다음 단계” instructions intended for standalone usage. Interactive mode prompts after each phase (“Continue to requirements?”, “Continue to design?”, etc.).

### Outputs and Skipped Gates

Upon completion you get:

- `spec.json` (metadata)
- `requirements.md`
- `design.md` (with research-backed decisions)
- `tasks.md` (parallel-ready plan)

What it **doesn’t** do:

- No `/kiro:validate-gap` integration check
- No `/kiro:validate-design` quality gate
- No `/kiro:validate-impl` (implementation hasn’t started)

Plan to run at least the first two validation commands manually for brownfield work.

### Manual Subagent Invocation

Need to re-run just one phase? Mention `@agents-spec-design`, `@agents-spec-tasks`, etc. in Claude Code chat. These aliases were generated during install and map directly to `.claude/agents/kiro/*.md`.

## Recommended Usage Pattern

1. Run `npx k-sdd@latest --claude-agent --lang <code>` to ensure Subagent assets exist.
2. Prepare Project Memory via `/kiro:steering` (and optionally `/kiro:steering-custom`) so Subagents inherit accurate architecture/product rules.
3. Use `spec-quick <feature> [--auto]` for rapid drafts, then review `requirements.md`, `design.md`, `tasks.md` just like the manual flow.
4. Run validation commands manually if the feature touches existing systems or critical boundaries.
5. Proceed with `/kiro:spec-impl` and `/kiro:spec-status` once the spec is approved.

## Customising Subagent Behaviour

1. **Start with shared templates/rules** – Reflect team-specific checklists and review viewpoints into `{{KIRO_DIR}}/settings/templates/*.md` and `{{KIRO_DIR}}/settings/rules/*.md` so that every agent and Subagent references the same primary source.
2. **Then adjust Subagent prompts if needed** – Add company-specific heuristics (prioritization, risk classification, testing strategy, etc.) to `.claude/agents/kiro/*.md`.
3. **Tune command triggers** – Edit the `call_subagent` section in `.claude/commands/kiro/*.md` to control invocation conditions and additional guardrails.
4. **Keep prompts concise** – The Task Tool's context is short, so place long explanations in templates/rules and keep Subagent prompts to the essentials.

## Troubleshooting

- **Subagent not triggering** – ensure you have installed with `--claude-agent` flag and that `.claude/agents/kiro/` exists.
- **Too many files analysed** – edit the file pattern expansion step in the relevant Subagent prompt to narrow the search.
- **Outputs differ from templates** – update `{{KIRO_DIR}}/settings/templates` so that Subagent summaries point to the latest document sections.

## See Also

- [Skill Reference](skill-reference.md) — skills-mode workflow, including "Inside `/kiro-impl`" dispatch details and the Skills mode vs `--claude-agent` comparison
- [Spec-Driven Development Workflow](spec-driven.md)
- [Project README — Supported Agents](../../README.md#supported-agents)
