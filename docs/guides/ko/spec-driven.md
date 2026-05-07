# Spec-Driven Development (SDD)

> 📖 **English guide:** [Spec-Driven Development Workflow](../spec-driven.md)

이 문서는, k-sdd가 agentic SDLC 워크플로 내에서 사양 주도 개발(Spec-Driven Development, SDD)을 어떻게 실천하고 있는가를 한국어로 해설하는 것이다. 어떤 슬래시 명령어(또는 Skill)를 실행하고, 어떤 산출물을 리뷰하며, 개발자에 의한 확인(게이트)을 어느 단계에 둘지를 신속히 판단하기 위한 레퍼런스로 활용할 수 있다.

## Core Ideas

k-sdd는, Spec-Driven Development를 "사람과 agent 양쪽 모두에 있어, 의도·경계·검증 조건을 읽기 쉽게 만드는 실천"으로 다룬다. 목적은 문서를 늘리는 것이 아니다. 아키텍처의 일관성을 잃지 않고, 작업을 독립적으로 진행할 수 있는 spec을 만드는 것이다.

### 경계 중심

k-sdd에서는, spec의 가장 중요한 가치는 책임 경계와 계약을 명확히 하는 데에 있다.

좋은 spec은 적어도 다음을 명확히 해야 한다.

- 이 spec이 무엇을 책임 범위로 가질 것인가
- 이 spec이 무엇을 명시적으로 가지지 않을 것인가
- 어떤 의존이 허용되는가
- 이 spec이 변경되었을 때, 어떤 downstream을 재검증해야 하는가

그래서 k-sdd에서는 workflow 전체에서 경계를 가지고 다닌다.

- discovery는 **Boundary Candidates**를 낸다
- requirements는 필요할 때 boundary context를 명확히 한다
- design은 **Boundary Commitments**로 고정한다
- tasks는 로컬한 ***Boundary:***를 가진다
- review / validation은 **Boundary Violations**를 찾는다

### spec은 독립한 delivery 단위

k-sdd에서는, spec을 단순한 계획서가 아니라, delivery와 revalidation의 단위로 다룬다.

실무상의 노림수는, 작업을 비동기로 진행할 수 있게 하는 데에 있다.

- 어떤 spec은 먼저 진행하고, 다른 spec은 기다릴 수 있다
- 계약이 안정적이라면 downstream은 진행할 수 있다
- upstream 수정이 들어왔을 때도, 광범위한 재동기가 아니라 대상 spec의 재검증으로 해결할 수 있다

discovery, mixed decomposition, spec batch generation, spec status는 그를 위해 있다. 작업을, 독립적으로 사고하고·리뷰하고·구현하고·재검증할 수 있는 단위로 나누기 위한 메커니즘이다.

### 좋은 아키텍처가 전제

경계 중심의 SDD는, 아래에 있는 아키텍처가 그것을 지탱할 수 있음을 전제로 하고 있다.

ownership이 모호하고, shared responsibility가 많고, 순환 의존이 있고, 책임의 경계가 불명확한 시스템에 spec을 늘려도, 독립성은 생기지 않는다. 혼란을 문서화하는 데 그치게 된다.

그래서 k-sdd는, architecture를 후공정이 아닌 전제 조건으로 다룬다. spec은 architecture를 대체하는 것이 아니다. 경계·의존·불변 조건을 일상 작업 artifact로 바꿈으로써, architecture를 운용 가능하게 만드는 것이다.

### spec을 중심에 두고, 기계적 검증으로 지탱한다

k-sdd는 spec을 중심에 둔다. 의도, 스코프, 경계, 제외 사항, 재검증 조건을 가진 주된 작업 artifact는 Markdown spec이다.

이는 기계적 검증의 중요성을 떨어뜨리는 것은 아니다. 테스트, build, lint, 타입 체크, runtime smoke check는 계속 중요하며, spec을 현실에 접속하기 위한 토대가 된다.

k-sdd에서는 이 두 층은 보완 관계에 있다.

- spec이 의도와 경계를 표현한다
- 기계적 검증이 execution-level의 grounding을 제공한다

### 변경 용이성을 전제로 설계

k-sdd는, 바꾸기 쉬움을 유지할 수 있을 정도로 단순할 것을 중시하고 있다.

이는 두 레벨에서 효과가 있다.

- 이해가 진행됨에 따라 spec 자체를 다시 잘라내기 쉽다
- k-sdd 자체도 팀에 맞춰 바꾸기 쉽다

templates, rules, skill workflows는 커스터마이즈되는 전제로 설계되어 있다. 목표는, 모든 팀에 1개의 canonical workflow를 강제하는 것이 아니다. 경계와 검증 루프를 유지한 채로, 각 팀의 구조나 delivery model에 맞춰 process를 진화시킬 수 있게 하는 것이다.

### 장시간 자율은 spec harness에 의존한다

k-sdd에서의 장시간 자율은 추상적인 약속이 아니다. `tasks.md`를 중심으로 한 workflow에 의해 지탱되고 있다.

`/kiro-impl`은 task를 하나씩 TDD, task-local review, bounded remediation으로 진행하며, 마지막 task까지 실행할 수 있다. spec, task boundary, validation expectation이 명확할 때는 진행하고, 사람의 확인·승인·판단이 정말로 필요한 곳에서는 멈춘다.

즉 자율은 spec의 대체가 아니다. 강한 spec harness 위에서만 성립한다.

## 우선 어디서부터 시작할까

skill 이름을 외우는 것보다, 어느 workstream에 들어갈지를 먼저 결정하는 쪽이 중요하다.

| 하고 싶은 일                                 | 스킬 모드                                                                                                                                           | 레거시 모드                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 새로운 작업을 시작한다(기능부터 큰 구상까지) | `/kiro-discovery` → `/kiro-spec-init` → `/kiro-spec-requirements` → `/kiro-spec-design` → `/kiro-spec-tasks` → `/kiro-impl`                         | `/kiro:spec-init` → `/kiro:spec-requirements` → `/kiro:spec-design` → `/kiro:spec-tasks` → `/kiro:spec-impl`                      |
| 기존 시스템을 확장한다                       | `/kiro:steering` → `/kiro-discovery` 또는 `/kiro:spec-init` → 임의로 `/kiro:validate-gap` → `/kiro-spec-design` → `/kiro-spec-tasks` → `/kiro-impl` | `/kiro:steering` → `/kiro:spec-init` → 임의로 `/kiro:validate-gap` → `/kiro:spec-design` → `/kiro:spec-tasks` → `/kiro:spec-impl` |
| 큰 initiative를 분해한다                     | `/kiro-discovery` → `/kiro-spec-batch`                                                                                                              | 비대응                                                                                                                            |
| spec 불필요한 소변경을 넣는다                | `/kiro-discovery` → 직접 구현                                                                                                                       | 직접 구현                                                                                                                         |

## 라이프사이클 개요

0. **디스커버리 (Discovery / 엔트리포인트)**: 스킬 모드에서 새로운 의뢰에 들어갈 때의 권장 입구다(`/kiro-discovery`, 스킬 모드 전용). 의뢰를 5가지 결과로 분류한다: 기존 spec의 확장, spec 불필요한 직접 구현, 1개의 신규 spec, 여러 spec으로의 분해, 또는 기존 spec 갱신·신규 spec·직접 구현 후보가 혼재하는 mixed decomposition. 신규 single/multi/mixed에서는 `brief.md`와 필요에 따라 `roadmap.md`를 작성하므로, 나중에 세션을 재개하더라도 scope를 다시 설명할 필요가 없다.
1. **스티어링 (Steering / 컨텍스트 수집)**: `/kiro:steering` 및 `/kiro:steering-custom` 명령어를 사용하여, 아키텍처, 명명 규칙, 도메인 지식 등을 `.kiro/steering/*.md` 파일군에 수집한다. 이들은 프로젝트 메모리(Project Memory)로서, 이후의 모든 명령어에서 참조된다.
2. **사양 책정의 시작 (Spec Initiation)**: `/kiro:spec-init <feature>` 명령어가 `.kiro/specs/<feature>/` 디렉터리를 생성하고, 기능 단위의 워크스페이스를 확보한다.
3. **요구사항 정의 (Requirements)**: `/kiro:spec-requirements <feature>` 명령어가, AI와의 대화를 통해 `requirements.md`를 작성한다. 여기에는 EARS 형식의 요구사항이나 미해결 과제가 기록된다.
4. **설계 (Design)**: `/kiro:spec-design <feature>` 명령어가, 우선 조사 로그로서 `research.md`를 생성·갱신한다(조사가 불필요한 경우는 스킵된다). 그 내용에 기반하여, 상세 설계서 `design.md`가 출력된다. 이 설계서는, 요구사항 커버리지, 컴포넌트와 인터페이스 정의, 참고 문헌 등을 갖춘, 리뷰에 적합한 문서다. v3.0.0에서는, `design.md`에 **File Structure Plan**(디렉터리 구조와 파일 책임의 정의)이 포함되게 되었다. 행수 상한은 1500행으로 확대되어 있다.
5. **태스크 계획 (Task Planning)**: `/kiro:spec-tasks <feature>` 명령어로, 구현 태스크를 `tasks.md` 파일에 TODO 형식으로 분해한다. 각 태스크는 요구사항 ID와 연결되며, 도메인이나 레이어별 블록으로 표준화된다. 동시에, `P0`(축차 실행)이나 `P1`(병렬 실행 가능)과 같은 실행 순서 라벨이 부여되어, 병행 개발의 경계가 제시된다.
6. **구현 (Implementation)**: `/kiro:spec-impl <feature> <task-ids>` 명령어(커맨드 모드), 또는 `/kiro-impl`(스킬 모드)이, 지정된 태스크 단위에서의 구현과 테스트 프로세스를 지원한다. 스킬 모드에서는, 자율 모드(태스크 인수 없음)와 매뉴얼 모드(태스크 인수 있음)의 2가지 동작 형태가 있다(상세는 후술의 "Skills 워크플로" 섹션을 참조).
7. **품질 게이트 (Quality Gates)**: `/kiro:validate-gap`, `/kiro:validate-design`, `/kiro:validate-impl`과 같은 검증 명령어가, 기존 코드와의 정합성이나, 설계·구현의 품질을 체크한다. v3.0.0에서는, `/kiro:validate-impl`(및 스킬 모드의 `/kiro-validate-impl`)은 **인테그레이션 검증**(태스크 횡단의 정합성 체크)으로 초점이 옮겨졌으며, 개별 태스크의 검증은 리뷰어 서브에이전트가 담당한다.
8. **진행 상황 추적 (Status Tracking)**: `/kiro:spec-status <feature>` 명령어가, 각 개발 페이즈의 승인 상황과 미완료 태스크를 요약하여 표시한다.

> 모든 페이즈는, 개발자에 의한 리뷰를 위해 일단 정지한다. `-y` 옵션이나 `--auto` 플래그로 이 확인을 스킵하는 것도 가능하지만, 본번 환경 대상의 작업에서는 수동에 의한 승인 프로세스를 유지하는 것이 권장된다. 템플릿에 체크리스트를 포함시켜 두면, 일관된 품질 게이트를 매번 강제할 수 있다.

## 명령어와 산출물의 대응

| 명령어                                     | 역할                                    | 주요 산출물                                                         |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------- |
| `/kiro:steering`                           | 프로젝트 메모리 생성                    | `.kiro/steering/*.md`                                               |
| `/kiro:steering-custom`                    | 도메인 고유의 스티어링 정보 추가        | `.kiro/steering/custom/*.md`                                        |
| `/kiro-discovery` (Skills)                 | 새로운 작업의 입구(임의)                | `brief.md` / `roadmap.md`와 다음 액션                               |
| `/kiro:spec-init <feature>`                | 신규 사양 책정의 시작                   | `.kiro/specs/<feature>/`                                            |
| `/kiro:spec-requirements <feature>`        | 요구사항 정의                           | `requirements.md`                                                   |
| `/kiro:spec-design <feature>`              | 조사와 상세 설계                        | `research.md` (필요한 경우), `design.md` (File Structure Plan 포함) |
| `/kiro:spec-tasks <feature>`               | 구현 태스크의 분해(실행 순서 라벨 포함) | `tasks.md`                                                          |
| `/kiro:spec-impl <feature> <task-ids>`     | 구현의 실행(커맨드 모드)                | 코드 변경과 태스크 진척의 갱신                                      |
| `/kiro-impl` (Skills)                      | 구현의 실행(자율/매뉴얼)                | 코드 변경과 태스크 진척의 갱신                                      |
| `/kiro:validate-gap <feature>`             | 갭 분석                                 | `gap-report.md`                                                     |
| `/kiro:validate-design <feature>`          | 설계 리뷰                               | `design-validation.md`                                              |
| `/kiro:validate-impl [feature] [task-ids]` | 인테그레이션 검증                       | `impl-validation.md`                                                |
| `/kiro:spec-status <feature>`              | 진행 상황 가시화                        | CLI 요약                                                            |

## Skills 워크플로(v3.0.0)

`--claude-skills`, `--codex-skills`, `--cursor-skills`, `--copilot-skills`, `--windsurf-skills`, `--opencode-skills`, `--gemini-skills`, `--antigravity`로 install한 경우, 명령어(`/kiro:*`) 대신 **Skills**(`/kiro-*`)를 사용한다. 스킬 모드에서는, 외부 플러그인에 의존하지 않고, 각 플랫폼 표준의 subagent primitive만으로 동작한다. 스킬 모드의 완전한 레퍼런스(`/kiro-impl`의 subagent flow, 커스터마이즈 방법 포함)는 [스킬 레퍼런스](skill-reference.md)를 참조.

### 커맨드 모드와 스킬 모드의 대응

| 커맨드 모드                            | 스킬 모드             | 비고                                                                                  |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| (없음)                                 | `/kiro-discovery`     | 임의. 새로운 의뢰를 1 spec / 여러 spec / mixed decomposition / spec 불필요로 분류한다 |
| `/kiro:spec-impl <feature> <task-ids>` | `/kiro-impl`          | 자율 모드/매뉴얼 모드의 전환이 가능                                                   |
| `/kiro:validate-impl`                  | `/kiro-validate-impl` | 인테그레이션 검증(태스크 횡단)에 특화                                                 |

> 그 외의 Steering, spec-init, spec-requirements, spec-design, spec-tasks의 각 명령어는, 커맨드 모드와 스킬 모드에서 공통이다.

### `/kiro-impl`의 2가지 모드

- **자율 모드(태스크 인수 없음)**: 태스크별로 서브에이전트를 spawn하고, 독립한 구현과 리뷰를 수행한다. 각 태스크에 대해, 구현자 서브에이전트가 태스크 브리프(Task Brief: 사양에서 도출된 구체적인 수용 기준)를 작성한 후 코딩에 들어간다. 리뷰어 서브에이전트는, TODO 잔존 체크, 테스트 실행, git diff에 의한 경계 확인 등의 기계적인 검증을 수행한다. 구현자가 BLOCKED를 반환한 경우나 리뷰어가 2회 연속 REJECTED한 경우, **디버그 서브에이전트**가 새로운 컨텍스트로 기동되어, Web 검색을 사용해 근본 원인을 조사한다(최대 2라운드). 태스크 사이에 얻어진 지견은 **Implementation Notes**로서 다음 구현자에게 인계된다. 1태스크 1이터레이션의 규율에 의해, 장시간 실행 시의 컨텍스트 위생을 유지한다.
- **매뉴얼 모드(태스크 인수 있음)**: 메인 컨텍스트 내에서 TDD 베이스의 구현을 수행한다. 커맨드 모드의 `/kiro:spec-impl`과 동등한 동작이다.

### 세션 재개

`/kiro-impl`은 중단 후의 재실행에 대응하고 있다. `tasks.md`의 진행 상태에 기반하여 미완료 태스크부터 처리를 재개한다.

## Discovery 후

`/kiro-discovery`는 auto-runner가 아니라 router다. 새로운 의뢰가, 1 spec, 여러 spec, mixed decomposition, spec 불필요 중 어느 것에 해당하는지를 판단하고, 필요하면 `brief.md` / `roadmap.md`를 작성하며, 올바른 다음 명령어를 제시하고 멈춘다.

| Discovery의 결과    | 의미                                                    | 기본의 다음 단계                                       | 보충                                                                 |
| ------------------- | ------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| Existing spec       | 기존 spec에 들어가야 할 의뢰                            | `/kiro-spec-requirements {feature}`                    | 없음                                                                 |
| Spec 불필요         | 직접 구현하는 편이 좋은 소변경                          | 직접 구현                                              | 없음                                                                 |
| Single spec         | 1개의 신규 spec으로 해야 할 의뢰                        | `/kiro-spec-init <feature>`                            | 명시적으로 fast path를 취하고 싶을 때만 `/kiro-spec-quick <feature>` |
| Multi-spec          | 여러 spec으로 분할해야 할 의뢰                          | `/kiro-spec-batch`                                     | 처음 1 spec만 먼저 확인하고 싶다면 `/kiro-spec-init <first-feature>` |
| Mixed decomposition | 기존 spec 갱신·신규 spec·직접 구현 후보가 혼재하는 의뢰 | `brief.md` / `roadmap.md`에 분해 결과를 작성한 후 진행 | 신규 spec 측의 다음 단계부터 시작하고, 나머지는 순서대로 회수한다    |

## 여러 spec에 걸친 결함의 책임과 재검증

어떤 spec에서 증상이 보이고 있어도, 진짜 원인이 upstream, foundation, shared spec 측에 있는 경우는 드물지 않다. 그 경우는 downstream spec에 회피책을 쌓지 않고, 우선 책임을 가진 upstream spec을 수정해야 한다.

upstream 수정 후에는, 그 변경에 의존하고 있는 spec을 대상으로 `/kiro-validate-impl`과 필요한 runtime smoke를 재실행하고, 시스템 전체로서 건전한지를 확인한다. 운용상은 다음을 지킨다.

- failure가 current spec의 책임인지, upstream spec의 책임인지, 불명한지를 분리한다
- upstream 기인의 defect는 downstream remediation에 밀어 넣지 않고, 소유하고 있는 spec으로 되돌린다
- 계약, 배선, 기동 경로, 공유 인터페이스가 upstream 수정에 의존하는 downstream spec은 재검증한다

## 워크플로를 커스터마이즈하려면

- **템플릿**: `.kiro/settings/templates/{requirements,design,tasks}.md`를 수정함으로써, 각 개발 페이즈의 생성물의 아웃라인이나 체크리스트를, 자사의 프로세스에 맞춰 조정할 수 있다. v2.0.0의 설계 템플릿은, 요약 테이블, 컴포넌트 밀도에 관한 룰, 참고 문헌과 같은 요소를 갖추고 있어, 리뷰 담당자의 인지 부하를 경감하도록 설계되어 있다.
- **룰**: `.kiro/settings/rules/*.md` 파일에, "해야 할 것(DO)" "해서는 안 되는 것(DO NOT)"이나 평가 기준 등을 기술하면, 그것들은 모든 에이전트 및 명령어에서 공통의 가이드라인으로 읽혀 들어간다. 구버전과 같이, 명령어의 프롬프트에 직접 지시를 기술할 필요는 없다.
- **승인 플로**: 템플릿의 헤더 부분에, 리뷰 담당자(Reviewer)나 승인자(Approver)의 칸, 체크리스트, 트레이서빌리티를 확보하기 위한 컬럼 등을 추가함으로써, 각 품질 게이트에서의 확인 사항을 단일 문서에 집약할 수 있다.

## 신규 안건 vs 기존 안건

- **신규 프로젝트 (Greenfield)**: 공유해야 할 룰이나 원칙이 이미 존재하는 경우는, `/kiro:steering`(이나 `/kiro:steering-custom`)을 실행하여 프로젝트 메모리에 저장한다. 아직 룰이 정비되어 있지 않은 경우는, 우선 `/kiro:spec-init`로 개발을 시작하고, 프로세스를 진행하면서 점차 스티어링 정보를 충실하게 해 나가는 것이 좋다.
- **기존 프로젝트 (Brownfield)**: `/kiro:validate-gap`, `/kiro:spec-requirements`, `/kiro:spec-design` 순으로 프로세스를 진행함으로써, 기존 코드와의 정합성을 조기에 확인할 수 있다. 설계 템플릿 내의 요구사항 커버리지(Req Coverage)나 참고 문헌(Supporting References) 섹션이, 기존 사양서와의 관련성을 담보하는 역할을 한다.

## 관련 리소스

- [Docs README](../README.md)
- [스킬 레퍼런스](skill-reference.md)
- [명령어 레퍼런스](command-reference.md)
- [Claude Code Subagents 워크플로](claude-subagents.md)

이 가이드는 v3.0.0 시점의 내용에 기반하고 있다. 템플릿이나 명령어의 동작에 변경이 있는 경우는, 공식의 영어판 문서 `docs/guides/spec-driven.md`를 정으로 하고, 그것에 추종하는 형태로 본 문서도 갱신할 필요가 있다.
