# Claude Code Subagents 워크플로(spec-quick 특화)

> 📖 **English guide:** [Claude Code Subagents Workflow](../claude-subagents.md)

> **대상**: 이 페이지는 레거시의 **`--claude-agent` / `--claude-code-agent`** 인스톨처에 대해 해설한다. `.claude/agents/kiro/*.md`의 정적 서브에이전트 파일로 `spec-quick`을 가속하는 메커니즘. `--claude-skills`(혹은 다른 `--*-skills` 플래그)로 install하여 스킬 모드의 implementer / reviewer / debugger의 dispatch 상세를 알고 싶은 경우는, [스킬 레퍼런스](skill-reference.md)의 "`/kiro-impl`의 내부" "스킬 모드와 `--claude-agent`의 비교" 절을 참조할 것.

이 가이드에서는, `npx k-sdd@latest --claude-agent`(또는 `--claude-code-agent`)로 제공되는 **Claude Code Subagents** 중에서, 독자의 제어 로직을 가진 `spec-quick` 명령어에 초점을 맞추어 해설한다. 그 외의 `/kiro:*` 명령어도 같은 서브에이전트를 재이용하지만, 동작은 표준판과 다르지 않으므로, 여기에서의 설명은 생략한다.

## 인스톨 확인

- `npx k-sdd@latest --claude-agent --lang <언어 코드>`를 실행한다.
- 전개되는 파일은 다음과 같다.
  - `.claude/commands/kiro/`: Spec/Steering/Validation 관련의 명령어(12개)
  - `.claude/agents/kiro/`: 상세 분석용의 서브에이전트 정의 파일(9개)
  - `CLAUDE.md`: 퀵스타트 가이드

## spec-quick에 의한 서브에이전트의 연계 플로

`spec-quick`은, `spec-init`(인라인 구현), `spec-requirements`, `spec-design`, `spec-tasks`의 4 페이즈를 자동으로 연속 실행하는 매크로 명령어다. 이 기능의 구현은 `tools/k-sdd/templates/agents/claude-code-agent/commands/spec-quick.md`에 정의되어 있다.

### 모드

- **인터랙티브 모드(디폴트)**: 각 페이즈의 완료 후에 실행을 계속할지 확인한다. 첫 실행 시나, 복잡한 기능 개발에 적합하다.
- **자동 모드 (`--auto`)**: TodoWrite로 진척 (4/4)을 추적하면서, 확인 없이 마지막까지 실행한다. 리스크가 낮은 기능의 드래프트 작성에 적합하다.

어느 모드에서도 `/kiro:validate-gap`과 `/kiro:validate-design`은 스킵된다. 완료 시의 메시지에서 수동 실행이 권장되므로, 기존의 프로젝트(Brownfield)에 기능을 추가하는 경우는, 잊지 말고 추가 실행할 것.

### 각 페이즈의 동작

| 페이즈          | 호출하는 서브에이전트         | 주요 처리                                                                                                                                                                                                         |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. 초기화       | 인라인(서브에이전트 없음)     | `.kiro/specs/{feature}/` 디렉터리를 생성하고, 템플릿으로부터 `spec.json`과 `requirements.md`의 골격을 생성한다. TodoWrite의 첫 항목을 완료 스테이터스로 갱신한다.                                                 |
| 2. Requirements | `agents/spec-requirements.md` | `/kiro:spec-requirements {feature}`를 실행하고, 사용자와의 질의응답을 통해 요구사항의 초안을 작성한다. 자동 모드의 경우, 서브에이전트가 제시하는 "다음 단계"를 무시하고, 즉시 페이즈 3으로 진행한다.              |
| 3. Design       | `agents/spec-design.md`       | `/kiro:spec-design {feature} -y`를 호출하고, 필요에 따라 `research.md`와 `design.md`를 갱신한다. TodoWrite의 진척이 3/4 완료가 된다.                                                                              |
| 4. Tasks        | `agents/spec-tasks.md`        | `/kiro:spec-tasks {feature} -y`를 실행하고, `tasks.md`를 출력한다. 이 태스크 리스트에는, 요구사항 커버리지와 병렬 실행 가능성을 나타내는 `(P)` 라벨이 포함된다. 완료 후, TodoWrite가 4/4가 되고, 요약이 표시된다. |

자동 모드에서는, 서브에이전트가 보이는 가이던스에 관계없이, 자동적으로 다음 페이즈로 진행한다. 한편, 인터랙티브 모드에서는, 각 페이즈 사이에 "요구사항 정의로 진행하시겠습니까?" "설계로 진행하시겠습니까?"와 같은 확인이 들어간다.

### 출력과 스킵되는 게이트

출력되는 파일:

- `spec.json`
- `requirements.md`
- `design.md`(필요에 따라 `research.md` 갱신)
- `tasks.md`(병렬 실행 가능성을 나타내는 `(P)` 라벨 포함)

스킵되는 것:

- `/kiro:validate-gap`
- `/kiro:validate-design`
- `/kiro:validate-impl`

### 서브에이전트의 수동 실행

특정 페이즈만 재실행하고 싶은 경우는, Claude Code의 채팅에서 `@agents-spec-design`이나 `@agents-spec-tasks`와 같이 멘션함으로써, 대응하는 서브에이전트를 직접 호출할 수 있다. 이때, 인스톨 시에 작성된 `.claude/agents/kiro/*.md` 내의 프롬프트가 사용된다.

## 추천 유스케이스

1. `npx k-sdd@latest --claude-agent --lang <code>`를 실행하여, 서브에이전트를 워크스페이스에 전개한다.
2. `/kiro:steering`(또는 필요에 따라 `/kiro:steering-custom`)을 실행하고, 프로젝트의 기억(Project Memory)을 최신 상태로 한 후 작업을 시작한다.
3. `spec-quick <feature> [--auto]`를 사용하여 사양의 드래프트를 생성하고, `requirements.md`, `design.md`, `tasks.md`의 내용을 확인한다.
4. 변경이 기존 시스템에 영향을 줄 가능성이 있는 경우는, `/kiro:validate-gap`과 `/kiro:validate-design`을 반드시 추가로 실행할 것.
5. 사양이 승인되면, `/kiro:spec-impl`이나 `/kiro:spec-status`를 사용하여 구현과 진행 상황 관리를 진행한다.

## 서브에이전트의 커스터마이즈

1. **템플릿과 룰의 갱신**: `{{KIRO_DIR}}/settings/templates/*.md`나 `{{KIRO_DIR}}/settings/rules/*.md`에 공통의 체크리스트 등을 기재함으로써, 서브에이전트를 포함한 모든 에이전트가 같은 기본 정보를 참조하게 된다.
2. **서브에이전트 프롬프트의 편집**: `.claude/agents/kiro/*.md` 파일을 편집하고, 독자의 휴리스틱(우선도 부여, 리스크 분류, 테스트 방침 등)을 프롬프트에 추가한다.
3. **명령어에 의한 기동 조건의 제어**: `.claude/commands/kiro/*.md` 파일 내의 `call_subagent` 섹션을 조정함으로써, 서브에이전트를 호출하는 타이밍을 세밀하게 제어할 수 있다.
4. **프롬프트의 간결화**: Task Tool의 표시 영역은 한정되어 있으므로, 장문의 지시는 템플릿이나 룰 파일에 기술하고, 서브에이전트의 프롬프트는 요점에 집중함으로써, 동작이 안정되기 쉬워진다.

## 트러블슈팅

| 증상                            | 원인                                                                                              | 해결책                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 서브에이전트가 호출되지 않는다  | `--claude-agent`를 사용해 인스톨하지 않았거나, `.claude/agents/kiro/` 디렉터리가 존재하지 않는다. | `npx k-sdd@latest --claude-agent`로 재인스톨하고, 디렉터리 구성을 확인할 것.                                          |
| 해석 범위가 너무 넓다           | 파일 검색 패턴이 너무 넓다(예: `*.*`).                                                            | 해당하는 서브에이전트의 프롬프트를 편집하고, 검색 패턴을 보다 구체적으로 좁힐 것.                                     |
| 출력이 템플릿과 일치하지 않는다 | 서브에이전트가 오래된 템플릿을 참조하고 있다.                                                     | `{{KIRO_DIR}}/settings/templates`를 최신 내용으로 갱신하고, 서브에이전트가 그것을 올바르게 참조하고 있는지 확인할 것. |

## 관련 링크

- [스킬 레퍼런스](skill-reference.md) — 스킬 모드의 워크플로, `/kiro-impl`의 내부 dispatch, 스킬 모드와 `--claude-agent`의 비교
- [Spec-Driven Development 워크플로](spec-driven.md)
- [Docs README](../README.md)
- [Project README — 대응 에이전트](../../README.md#supported-agents)
