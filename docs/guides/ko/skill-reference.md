# 스킬 레퍼런스

> 📖 **English guide:** [Skill Reference](../skill-reference.md)

k-sdd의 스킬 모드 대상 레퍼런스다. `--claude-skills`, `--codex-skills`, `--cursor-skills`, `--copilot-skills`, `--windsurf-skills`, `--opencode-skills`, `--gemini-skills`, `--antigravity`를 사용하고 있는 경우는, 이 페이지를 참조한다.

레거시의 `/kiro:*` 명령어를 사용하고 있는 경우는, [명령어 레퍼런스](command-reference.md)를 참조할 것.

## 우선 어디서부터 시작할까

처음에 외워야 할 것은 skill 이름의 일람이 아니라, "무엇을 하고 싶을 때 어디서부터 들어갈까"이다.

| 하고 싶은 일                           | 처음에 사용하는 것                            | 다음의 전형 액션                                                      |
| -------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| 새로운 의뢰를 분류하고 싶다            | `/kiro-discovery`                             | `kiro-spec-init`, `kiro-spec-batch`, 또는 직접 구현                   |
| 1개의 신규 spec을 만들고 싶다          | `/kiro-spec-init`                             | `/kiro-spec-requirements`                                             |
| 큰 구상을 여러 spec으로 나누고 싶다    | `/kiro-spec-batch`                            | 생성된 spec을 리뷰하고, 승인된 것부터 진행                            |
| 승인된 태스크를 구현하고 싶다          | `/kiro-impl`                                  | `/kiro-validate-impl`                                                 |
| feature 전체를 검증하고 싶다           | `/kiro-validate-impl`                         | findings를 고치거나, `GO` / `NO-GO` / `MANUAL_VERIFY_REQUIRED`를 반환 |
| 프로젝트 공통 컨텍스트를 정비하고 싶다 | `/kiro-steering` 또는 `/kiro-steering-custom` | spec workflow를 시작 또는 재개                                        |

## 워크플로의 중심이 되는 skills

### `/kiro-discovery`

새로운 작업은 있지만, 그것이 1 spec인지, 여러 spec인지, spec 불필요인지, 아직 모를 때 사용한다.

- 역할:
  - 의뢰를 route한다
  - scope를 정리한다
  - `brief.md`와 필요하면 `roadmap.md`를 작성한다
  - 다음의 명령어를 제시하고 멈춘다
- 전형적인 분기:
  - 기존 spec으로 되돌린다
  - spec 불필요로서 직접 구현한다
  - 1개의 신규 spec을 작성한다
  - 여러 spec으로 분해한다

### `/kiro-spec-batch`

discovery나 roadmap의 결과, 여러 spec으로 나눠야 한다고 분명해졌을 때 사용한다.

- 역할:
  - 여러 spec을 병렬 생성한다
  - cross-spec의 정합성을 유지한다
  - 1개의 거대한 spec이 아니라 roadmap 베이스의 backlog를 만든다

### `/kiro-impl`

`tasks.md`가 승인되어 있고, 구현을 진행하고 싶을 때 사용한다.

- 모드:
  - 자율 모드: task 인수 없음. task별로 fresh implementer + reviewer + debugger
  - 매뉴얼 모드: task 인수 있음. main context에서 TDD + review gate
- 보장하고 싶은 것:
  - reviewer 승인 전에 완료하지 않는다
  - success claim 전에 `kiro-verify-completion`을 통과시킨다
  - remediation / debug는 bounded로 한다

### `/kiro-validate-impl`

구현 후에, task 단체가 아니라 feature 전체를 횡단하여 검증하고 싶을 때 사용한다.

- 주로 보는 것:
  - task 사이 integration
  - requirements coverage
  - design alignment
  - full-suite의 증거
- 반환값:
  - `GO`
  - `NO-GO`
  - `MANUAL_VERIFY_REQUIRED`

## 보조적이지만 중요한 skills

이것들은 독립 skill이지만, 많은 이용자는 `/kiro-impl` 안에서 간접적으로 사용한다.

### `kiro-review`

task-local의 adversarial review protocol.

- 주요 이용 개소:
  - 자율 모드의 reviewer subagent
  - 매뉴얼 모드의 review gate
- 주로 확인하는 것:
  - spec compliance
  - boundary fit
  - mechanical verification
  - 필요하면 RED-phase evidence

### `kiro-debug`

root-cause-first의 debug protocol.

- 사용되는 장면:
  - implementer가 blocked
  - reviewer rejection이 수렴되지 않는다
  - validation에서 deeper issue가 발견된다
- 주요 출력:
  - `ROOT_CAUSE`
  - `CATEGORY`
  - `FIX_PLAN`
  - `NEXT_ACTION`

### `kiro-verify-completion`

success claim 전에 fresh evidence를 요구하는 gate.

- 주요 이용 개소:
  - task 완료 전
  - fix가 효과 있다고 주장하기 전
  - feature success를 보고하기 전
- 반환값:
  - `VERIFIED`
  - `NOT_VERIFIED`
  - `MANUAL_VERIFY_REQUIRED`

## `/kiro-impl`의 내부: dispatch와 iteration

"여기서의 subagent란 무엇인가?"라는 의문의 대부분은 `/kiro-impl` 안에서 발생하고 있다. 레거시의 `--claude-agent` 인스톨처와 달리, 스킬 모드에서는 `.claude/agents/kiro/` 아래의 사전 정의 파일에 의존하지 않는다. 구현 dispatch는 skill 자신이 가지고 있다.

### 동적 dispatch(정적 agent 파일이 아님)

- `tdd-task-implementer.md`와 같은 사전 정의 파일은 `.claude/agents/` 아래에 존재하지 않는다
- `/kiro-impl`은 각 플랫폼 표준의 subagent primitive(예: Claude Code의 Task tool) 경유로 fresh 실행 컨텍스트를 매번 spawn한다. 사용하는 프롬프트 템플릿은 skill이 가지고 있다
- 이 설계 덕분에, 같은 `/kiro-impl` skill이 Claude Code, Codex, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, Antigravity의 8 플랫폼에서, 플랫폼별로 별도의 파일을 가지지 않고 동작한다

### 태스크별 3 롤

각 태스크는 최대 3개의 롤로 진행한다:

- **Implementer** — 사양으로부터 Task Brief를 작성하고, TDD(Feature Flag Protocol의 RED → GREEN)로 구현하는 fresh 실행 컨텍스트
- **Reviewer** — 독립한 reviewer pass. `git diff`, TODO grep, 테스트 스위트, 태스크 경계의 검증을 수행한다
- **Debugger** — implementer가 BLOCKED를 반환했거나, reviewer가 2라운드 reject했을 때 기동. 실패 이력을 가지지 않는 클린한 컨텍스트로 root cause를 조사하고(Web 검색 있음), 수정 플랜을 다음의 implementer에 건넨다. 1 태스크당 최대 2라운드

이들 3개의 롤은 위에서 언급한 3개의 supporting skill(`kiro-review`, `kiro-debug`, `kiro-verify-completion`)에 대응한다. dispatch는 동적이며, `.claude/agents/` 아래에 파일을 둘 필요는 없다.

### 지견의 전파

태스크로부터 횡단적인 지견(예: "better-sqlite3은 Electron 대상의 ABI rebuild가 필요")이 얻어진 경우, `tasks.md`의 `## Implementation Notes`에 기록되며, 이후의 implementer 프롬프트에 주입된다. 이것이 "후속 태스크가 이전 태스크의 발견을 활용한다"는 메커니즘.

### 1 task per iteration

각 이터레이션은 1 태스크만 처리한다. 장시간의 자율 실행에서도 컨텍스트 위생을 유지하고, 중단 후의 `/kiro-impl` 재실행을 안전하게 하며, review / debug의 스코프를 유계로 유지하기 위해서다.

## 스킬 모드와 `--claude-agent`의 비교

스킬 모드와 레거시의 `--claude-agent`는 subagent의 다루기가 근본적으로 다르다. 양쪽 모두 유효한 선택지로, 워크플로에 맞는 쪽을 선택한다.

| 관점                     | `--claude-agent`(레거시)               | 스킬 모드                                                  |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------- |
| Subagent 정의            | `.claude/agents/kiro/*.md`의 정적 파일 | Skill 내의 프롬프트 템플릿, 동적 dispatch                  |
| 크로스 플랫폼            | Claude Code만                          | 8 플랫폼                                                   |
| Spec 생성 (`spec-quick`) | 4 페이즈를 Subagent로 조정             | `kiro-spec-quick` skill이 4개의 spec skill을 순서대로 호출 |
| 병렬 spec batch          | 없음                                   | `/kiro-spec-batch` + cross-spec review                     |
| 구현                     | `/kiro:spec-impl`로 수동               | `/kiro-impl`의 자율 or 매뉴얼                              |
| 리뷰                     | 수동 or `validate-impl`                | 내장 independent reviewer pass                             |
| 실패 시의 디버그         | 없음                                   | 자동 debug pass(최대 2라운드, Web 검색 있음)               |
| 세션 재개                | 처음부터                               | 중단 후의 재실행이 안전                                    |
| 외부 의존                | 없음                                   | 없음(native subagent primitive만)                          |

`--claude-agent`의 상세는 [Claude Code Subagents 워크플로](claude-subagents.md)를 참조.

## 스킬 모드 dispatch의 커스터마이즈

스킬 모드는 프롬프트를 동적으로 생성하므로, `.claude/agents/kiro/*.md`를 직접 편집하는 것과는 메커니즘이 다르다.

1. **Steering 문서** — 주요 커스터마이즈 포인트. Implementer와 reviewer는 steering으로부터 룰을 상속하므로, 아키텍처나 규약의 변경은 `{{KIRO_DIR}}/steering/*.md`에 반영한다
2. **Templates와 rules** — `{{KIRO_DIR}}/settings/templates/*.md`와 `{{KIRO_DIR}}/settings/rules/*.md`를 갱신하여 Task Brief와 review 관점에 영향을 준다
3. **Skill 파일** — 상급자 대상. dispatch 동작·review gate·iteration 전략을 조정하고 싶은 경우는, 인스톨된 `.claude/skills/`(또는 플랫폼 대응 디렉터리) 아래의 `SKILL.md`를 직접 편집한다

## Skills와 Commands의 차이

| 영역                         | 스킬 모드               | 레거시 커맨드                             |
| ---------------------------- | ----------------------- | ----------------------------------------- |
| 신규 work의 입구             | `/kiro-discovery`       | 없음                                      |
| 여러 spec의 생성             | `/kiro-spec-batch`      | 없음                                      |
| 구현                         | `/kiro-impl`            | `/kiro:spec-impl`                         |
| integration validation       | `/kiro-validate-impl`   | `/kiro:validate-impl`                     |
| review/debug/completion gate | 명시적인 skill로서 존재 | 명령어 내나 외부 프로세스에 매립되기 쉽다 |

## 읽는 순서의 추천

1. [사양 주도 개발 가이드](spec-driven.md)
2. 이 스킬 레퍼런스
3. 레거시 모드가 필요한 경우만 [명령어 레퍼런스](command-reference.md)
