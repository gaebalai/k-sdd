# 명령어 레퍼런스

> 📖 **English guide:** [Command Reference](../command-reference.md)

k-sdd의 레거시 `/kiro:*` 명령어 대상 레퍼런스다. 각 페이즈에서 확인해야 할 산출물과 다음의 액션을 즉시 파악할 수 있도록, 영어판의 `docs/guides/command-reference.md`를 기반으로 한국어로 요약하고 있다.

스킬 모드를 사용하고 있는 경우는, 먼저 [스킬 레퍼런스](skill-reference.md)를 참조할 것.

> **보충**: 명령어의 템플릿은 Claude Code를 기준으로 하고 있지만, Cursor, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, Windsurf 등, 다른 에이전트에서도 같은 11개의 명령어가 이용 가능하다(UI의 상세는 각 에이전트의 문서를 참조할 것).
>
> 인스톨이나 워크스페이스의 전제 조건에 대해서는 [프로젝트의 README](../../README.md)를, 각 문서의 개요에 대해서는 [Docs README](../README.md)를 참조할 것.

## 목차

### Steering(프로젝트 메모리)

- [`/kiro:steering`](#kirosteering)
- [`/kiro:steering-custom`](#kirosteering-custom)

### Spec Workflow

- [`/kiro:spec-init`](#kirospec-init)
- [`/kiro:spec-requirements`](#kirospec-requirements)
- [`/kiro:spec-design`](#kirospec-design)
- [`/kiro:spec-tasks`](#kirospec-tasks)
- [`/kiro:spec-impl`](#kirospec-impl)

### Validation

- [`/kiro:validate-gap`](#kirovalidate-gap)
- [`/kiro:validate-design`](#kirovalidate-design)
- [`/kiro:validate-impl`](#kirovalidate-impl)

### Status

- [`/kiro:spec-status`](#kirospec-status)

---

## 명령어 매트릭스

| 명령어                                     | 주요 인수   | 목적                                                                    | 다음에 실행할 명령어                       |
| ------------------------------------------ | ----------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| `/kiro:steering`                           | –           | 프로젝트 메모리의 작성/갱신                                             | `/kiro:spec-init`                          |
| `/kiro:steering-custom`                    | 대화 형식   | 도메인 고유의 스티어링 정보를 추가                                      | `/kiro:spec-init` (필요에 따라 재실행)     |
| `/kiro:spec-init <feature>`                | 기능 설명   | `.kiro/specs/<feature>/`를 작성                                         | `/kiro:spec-requirements <feature>`        |
| `/kiro:spec-requirements <feature>`        | 기능명      | `requirements.md`를 생성                                                | `/kiro:spec-design <feature>`              |
| `/kiro:validate-gap <feature>`             | 임의        | 기존 코드와 요구사항 차분을 검증                                        | `/kiro:spec-design <feature>`              |
| `/kiro:spec-design <feature> [-y]`         | 기능명      | `research.md`(필요에 따라)와 `design.md`를 생성                         | `/kiro:spec-tasks <feature>`               |
| `/kiro:validate-design <feature>`          | 임의        | 설계의 품질 평가                                                        | `/kiro:spec-tasks <feature>`               |
| `/kiro:spec-tasks <feature> [-y]`          | 기능명      | 병렬 실행을 고려한 태스크 리스트 `tasks.md`(실행 순서 라벨 포함)를 작성 | `/kiro:spec-impl <feature> [task-ids]`     |
| `/kiro:spec-impl <feature> [task-ids]`     | 태스크 번호 | 구현과 테스트 주도 개발(TDD)의 실행                                     | `/kiro:validate-impl [feature] [task-ids]` |
| `/kiro:validate-impl [feature] [task-ids]` | 임의        | 구현의 리뷰/테스트 결과를 확인                                          | `/kiro:spec-status <feature>`              |
| `/kiro:spec-status <feature>`              | 기능명      | 각 페이즈의 진행 상황·승인 상황을 요약                                  | 추천에 따라 다음 페이즈로                  |

---

## Steering 명령어

### `/kiro:steering`

- **목적**: 프로젝트 전체의 룰이나 가이드라인을 `.kiro/steering/` 디렉터리에 집약하고, 모든 명령어가 공통의 프로젝트 메모리(Project Memory)를 참조할 수 있도록 한다. 특정 기능에 관한 구현의 상세를 기술하는 장소가 아니다.
- **인수**: 없음.
- **출력**: `structure.md`, `tech.md`, `product.md`가 생성된다(기존의 경우는 차분을 갱신). 여기에는 장기적으로 사용하는 원칙이나 표준만을 기재하고, 개별 기능에 관한 메모는 `spec/research/design`에 남길 것.
- **전형적인 플로**: 리포지토리의 첫 셋업 시나 대규모의 변경 시에 실행하고, 생성된 내용을 개발자가 리뷰·조정한다. 이후, 각 spec 명령어가 이 정보를 자동적으로 참조한다.
- **힌트**:
  - 빈 디렉터리에서 실행하면 실패하므로, 반드시 소스코드가 존재하는 프로젝트의 루트 디렉터리에서 실행할 것.
  - Steering은, 프로젝트 횡단적인 패턴이나 룰을 기술하기 위한 것이다. 기능 고유의 조사 내용은 `research.md`나 `design.md`에 기술한다.
  - 생성되는 것은 어디까지나 베이스라인이다. 프로젝트 독자의 룰은 `/kiro:steering-custom`을 사용하여 추가할 것.

### `/kiro:steering-custom`

- **목적**: API의 사양, 테스트 계획, UI/UX 가이드라인, 접근성 요건 등, 코어가 되는 3개의 파일만으로는 커버할 수 없는 영역의 스티어링 정보를 추가하기 위한, 대화형 명령어다.
- **인수**: 없음(대화 형식으로 템플릿 선택).
- **출력 예**: `api-standards.md`(REST/GraphQL의 규약, 버전 관리, 에러 설계), `testing.md`(자동 테스트와 수동 테스트의 판단 기준, 커버리지 목표), `ui-ux.md`(디자인 시스템, 라이팅의 톤, 리뷰 절차), `product-tests.md`(QA팀 대상의 E2E 시나리오), `security.md` 등. 필요에 따라, 독자의 이름을 가진 파일도 생성할 수 있다.
- **이용 시나리오**:
  - 프로젝트에서 준수해야 할 표준(API 규약, 전사적인 테스트 가이드라인, UX의 기본 원칙 등)을 AI에 일차 정보로서 제공하고 싶은 경우.
  - 여러 팀이나 에이전트 사이에서 공통의 룰을 공유하고, 사양서나 설계서의 출력에 반영하고 싶은 경우.
  - 기존의 프로젝트(Brownfield)에서, UI/UX나 API의 정합성을 유지하면서 기능을 추가 개발하고 싶은 경우.

---

## Spec Workflow 명령어

### `/kiro:spec-init`

- **목적**: `.kiro/specs/<feature>/` 디렉터리를 작성하고, `overview.md`나 `context.json` 등의 메타데이터를 초기화한다.
- **필수 인수**: `<feature>`(기능명이나 이슈 ID).
- **실행 타이밍**: Steering 정보의 설정 직후, 또는 새로운 기능을 추가할 때 실행한다.
- **다음 단계**: `/kiro:spec-requirements <feature>`.

### `/kiro:spec-requirements`

- **목적**: 사용자의 요구나 제약 조건을 추출하고, EARS (Easy Approach to Requirements Syntax) 형식으로 `requirements.md`를 작성한다.
- **플로**: 명령어를 실행하고, AI로부터의 보충 질문에 회답한다. 생성된 드래프트를 개발자가 리뷰하고, 필요에 따라 추기·수정한다.
- **힌트**: 기존의 프로젝트(Brownfield)에서는, `/kiro:validate-gap`을 병용함으로써, 기존 코드와의 차분을 명확히 할 수 있다.

### `/kiro:spec-design`

- **목적**: 조사 로그 `research.md`(필요한 경우만 자동 생성)와, 상세 설계서 `design.md`를 세트로 작성한다. 요구사항 커버리지, 컴포넌트와 인터페이스, 참고 문헌 등, v2.0.0의 템플릿에 준거한 내용이 출력된다.
- **옵션**: `-y` 옵션을 붙이면, 확인 프롬프트를 스킵할 수 있다(본번 운용에서의 사용은 권장되지 않는다).
- **리뷰의 관점**: 아키텍처의 경계, 트레이서빌리티, 컴포넌트의 결합도에 관한 룰이 지켜지고 있는가, 또한, 장문의 자료나 외부 링크가 참고 문헌(Supporting References)으로서 적절히 분리되어 있는가를 확인한다.

### `/kiro:spec-tasks`

- **목적**: `design.md`를 기반으로 구현 태스크 리스트 (`tasks.md`)를 작성한다. 그때, `P0`(축차 실행이 필수)나 `P1`(병렬 실행이 가능)과 같은 실행 순서의 라벨을 붙이고, 병행 개발을 용이하게 한다.
- **포인트**: v2.0.0에서는, 도메인이나 레이어별 블록이 표준화되어, 기능 추가나 리팩터링의 안건에도 재이용하기 쉬워졌다. 요구사항 ID와의 연결, 체크박스, 실행 순서 라벨이 세트로 생성된다.

### `/kiro:spec-impl`

- **목적**: 지정 태스크를 AI로 구현. 테스트 명령어나 검증 내용도 함께 제안.
- **사용법**: `/kiro:spec-impl user-auth 3 4`처럼 태스크 ID를 건네줌으로써, 지정된 태스크만을 대상으로 한 구현 프롬프트가 생성된다.
- **주의**: 실행하기 전에, `tasks.md`의 태스크 리스트가 승인된 상태인지 확인할 것.
- **스킬 모드에서의 상당 명령어**: `/kiro-impl`(후술의 "스킬 모드" 섹션을 참조).

---

## Validation 명령어

### `/kiro:validate-gap`

- **역할**: 기존의 소스코드와 `requirements.md`와의 차분을 자동으로 분석하고, `gap-report.md`를 생성한다. 기존 프로젝트(Brownfield)의 개수 시에, 요구의 누락을 검출하는 데에 유효하다.
- **입력**: `<feature>`(임의).
- **출력**: 검출된 갭의 일람, 권장되는 대응 태스크, 관련될 가능성이 있는 파일 리스트가 출력된다.

### `/kiro:validate-design`

- **역할**: `design.md`의 정합성이나 템플릿에의 준거 상황을 리뷰한다. 트레이서빌리티, 경계 설계, 참고 문헌(Supporting References)의 적절한 사용법 등을 체크하고, 개선을 위한 피드백을 제공한다.
- **추천 타이밍**: 개발자에 의한 리뷰의 전후로 실행하면, 설계상의 체크 항목의 망라성을 확인하는 데에 도움이 된다.

### `/kiro:validate-impl`

- **역할**: 구현이 끝난 태스크가 `tasks.md`에 기재된 수용 조건을 충족하는지를 확인한다. 테스트 명령어나 로그의 부족, 차분(Diff)의 개요 등을 정리하여 보고한다.
- **입력**: `[feature-name] [task-ids]`(인수를 생략한 경우는, 직근의 태스크를 자동적으로 검출한다).
- **v3.0.0에서의 변경**: 스킬 모드(`/kiro-validate-impl`)에서는, **인테그레이션 검증**(태스크 횡단의 정합성 체크)으로 초점이 옮겨졌다. 개별 태스크의 검증은 리뷰어 서브에이전트가 자율적으로 실시한다.

---

## Status 명령어

### `/kiro:spec-status`

- **목적**: 특정 기능 개발 프로젝트에 대해, 요구사항 정의, 설계, 태스크 분할, 구현, 검증의 각 페이즈의 진행 상황과 승인 상황을 일람으로 표시한다.
- **출력**: 체크리스트 형식의 요약이 CLI에 표시되며, 다음에 실행해야 할 명령어가 제안된다.
- **이용 시나리오**: 담당 리뷰어의 교대 시나, 여러 개발자·AI 에이전트가 병행하여 작업을 진행하고 있는 상황에서, 전체의 진행 상황을 파악하는 데에 편리하다.

---

## 스킬 모드(v3.0.0)

`--claude-skills`, `--codex-skills`, `--cursor-skills`, `--copilot-skills`, `--windsurf-skills`, `--opencode-skills`, `--gemini-skills`, `--antigravity`로 인스톨한 경우, 일부의 명령어가 Skills(`/kiro-*`)로서 제공된다. 스킬 모드에서는 외부 플러그인에 의존하지 않고, 각 플랫폼 표준의 subagent primitive만으로 동작한다.

### `/kiro-discovery`

- **목적**: 모호한 아이디어나 막연한 요망을, `/kiro:spec-init`에 건네줄 수 있는 구체적인 기능 제안으로 정리한다.
- **이용 타이밍**: 스킬 모드에서 `spec-init`의 전에 사용하는 임의의 엔트리포인트. 레거시의 커맨드 모드에는 상당 명령어는 없으며, 거기서는 `/kiro:spec-init`로부터 직접 시작한다.

### `/kiro-impl`

- **목적**: 커맨드 모드의 `/kiro:spec-impl`에 상당하는 구현 Skill. 2개의 모드를 가진다.
- **자율 모드(태스크 인수 없음)**: 태스크별로 구현자·리뷰어·디버거의 3종류의 서브에이전트를 spawn. 구현자가 BLOCKED 또는 리뷰어가 2회 REJECTED한 경우, 디버그 서브에이전트가 새로운 컨텍스트로 근본 원인을 조사(Web 검색 포함, 최대 2라운드). 태스크 사이의 지견은 Implementation Notes로서 다음 구현자에게 인계된다.
- **매뉴얼 모드(태스크 인수 있음)**: 메인 컨텍스트 내에서 TDD 베이스의 구현을 수행한다. 커맨드 모드의 `/kiro:spec-impl`과 동등의 동작.
- **세션 재개**: 중단 후에 재실행하면, `tasks.md`의 진행 상태에 기반하여 미완료 태스크부터 처리를 재개한다.

### `/kiro-validate-impl`

- **목적**: 커맨드 모드의 `/kiro:validate-impl`에 상당하는 검증 Skill. **인테그레이션 검증**(태스크 횡단의 정합성 체크)에 특화되어 있다. 개별 태스크의 품질 체크는 `/kiro-impl`의 자율 모드에서 리뷰어 서브에이전트가 담당하므로, 이 Skill에서는 태스크 사이의 경계 정합성을 검증한다.

---

## 자주 묻는 질문

| 질문                                                            | 회답                                                                                                                                                                             |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude 이외의 에이전트에서도 같은 결과가 되는가?                | 명령어 체계는 공통이지만, 각 에이전트의 UI나 제약에 의해, 응답의 내용은 다소 다른 경우가 있다. README에 기재되어 있는 인스톨 플래그를 사용하여, 대상의 에이전트를 선택할 것.     |
| 명령어를 연속으로 자동 실행하고 싶은 경우는 어떻게 하면 되는가? | `/kiro:spec-quick <feature>`를 사용하면, 요구사항 정의부터 태스크 분할까지를 한번에 실행할 수 있다. 다만, 각 페이즈 사이에 확인이 들어가므로, 개발자에 의한 리뷰를 끼울 수 있다. |
| 템플릿을 커스터마이즈하려면 어떻게 하면 되는가?                 | `.kiro/settings/templates/` 및 `.kiro/settings/rules/` 내의 파일을 수정할 것. 변경은 즉시 모든 명령어에 반영된다.                                                                |

---

이 문서는, v3.0.0 시점의 사양에 기반하고 있다. 장래의 버전에서 명령어 라인의 사양이나 템플릿의 구조가 변경된 경우는, 최신의 영어판 문서 `docs/guides/command-reference.md`의 내용을 정으로 할 것.
