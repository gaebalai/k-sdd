# Claude Code Subagents Workflow (Spec-Quick Focus)

> 📖 **한국어 가이드:** [Claude Code Subagents 워크플로우(한국어)](ko/claude-subagents.md)

This guide explains how the **Claude Code Subagents** install target (`--claude-agent` / `--claude-code-agent`) accelerates the spec workflow via the `spec-quick` command. Other `/kiro:*` commands reuse the same Subagents, but this document focuses on the spec-quick orchestration because it is the only Subagent-enabled command with its own control logic.

## Installation Recap

- Install with `npx k-sdd@latest --claude-agent --lang <code>`.
- Files are placed under:
  - `.claude/commands/kiro/` – 12 high-level commands (spec, steering, validation).
  - `.claude/agents/kiro/` – 9 Subagent definitions used for deeper analysis, file expansion, and reporting.
  - `CLAUDE.md` – quickstart and usage tips.

## How `spec-quick` Orchestrates Subagents

`spec-quick` is a macro-command that calls four Subagents in sequence—`spec-init` (inline), `spec-requirements`, `spec-design`, and `spec-tasks`—to generate a brand-new spec in one run. Internally、the command follows the same instructions defined in `tools/k-sdd/templates/agents/claude-code-agent/commands/spec-quick.md`.

### Modes

- **Interactive (default)** – Stops after each phase and asks whether to continue. Ideal for first-time runs or complex features.
- **Automatic (`--auto`)** – Runs all phases without pausing, using TodoWrite to track progress. Best for quick drafts or low-risk features.

Both modes skip `/kiro:validate-gap` and `/kiro:validate-design`. The completion message reminds you to run these manually if the feature is risky.

### Phase Breakdown

| Phase | Triggered Subagent | What happens |
|-------|--------------------|--------------|
| 1. Initialize | Inline instructions (no Subagent) | Creates `.kiro/specs/{feature}/`, writes `spec.json` + `requirements.md` skeleton from templates. TodoWrite marks "Initialize spec" as complete. |
| 2. Requirements | `agents/spec-requirements.md` | Runs `/kiro:spec-requirements {feature}` to fill out requirements.md. In automatic mode, ignores "Next step" prompts from this Subagent and proceeds immediately. |
| 3. Design | `agents/spec-design.md` | Executes `/kiro:spec-design {feature} -y`, which generates/updates `research.md` (if needed) and `design.md`. TodoWrite now marks three phases complete. |
| 4. Tasks | `agents/spec-tasks.md` | Calls `/kiro:spec-tasks {feature} -y` to build `tasks.md` with Req coverage and P-wave labels. When finished, TodoWrite hits 4/4 complete and spec-quick prints the final summary. |

In automatic mode the command never pauses, even when Subagents emit “次のステップ” instructions intended for standalone usage. Interactive mode prompts after each phase (“Continue to requirements?”, “Continue to design?”, etc.).

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

1. **Start with shared templates/rules** – Update `{{KIRO_DIR}}/settings/templates/*.md`, `{{KIRO_DIR}}/settings/rules/*.md`에 팀별 체크리스트나 리뷰 관점을 반영하면 모든 에이전트 Subagent가 동일한 일차 정보를 추가한다.
2. **Then adjust Subagent prompts if필요** – `.claude/agents/kiro/*.md`에 회사 고유의 휴리스틱(우선도, 리스크 분류, 테스트 정책 등)을 추가한다.
3. **Tune command triggers** – `.claude/commands/kiro/*.md`의 `call_subagent`섹션을 편집하여 호출 조건과 추가 가드 레일을 제어합니다.
4. **Keep prompts concise** – Task Tool의 컨텍스트가 짧기 때문에 긴 설명은 템플리/룰 측에 놓고 Subagent 프롬프트는 요점만 기재한다.

## Troubleshooting

- **Subagent not triggering** – ensure you have installed with `--claude-agent` flag and that `.claude/agents/kiro/` exists.
- **Too many files analysed** – edit the file pattern expansion step in the relevant Subagent prompt to narrow the search.
- **Outputs differ from templates** – update `{{KIRO_DIR}}/settings/templates` so that Subagent summaries point to the latest document sections.

## See Also

- [Spec-Driven Development Workflow](spec-driven.md)
