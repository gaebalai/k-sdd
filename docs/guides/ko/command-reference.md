# 커맨드 레퍼런스

> 📖 **English guide:** [Command Reference](../command-reference.md)

k-sdd가 제공하는 11개의 AI-DLC 커맨드에 대해, 역할, 입력, 출력을 한눈에 정리한 레퍼런스다. 각 페이즈에서 확인해야 할 산출물과 다음 액션을 빠르게 파악할 수 있도록, 영어판 `docs/guides/command-reference.md`를 기반으로 한국어로 요약한 문서다.

> **보충**: 커맨드 템플릿은 Claude Code를 기준으로 되어 있지만, Cursor, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, Windsurf 등 다른 에이전트에서도 동일한 11개 커맨드를 사용할 수 있다(UI 상세는 각 에이전트의 문서를 참고할 것).
>
> 설치 및 워크스페이스 전제 조건은[프로젝트 README](../../README.md)를, 각 문서의 개요는 [Docs README](../README.md)를 참고할 것.

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

## 커맨드 매트릭스

| 커맨드 | 주요 인자 | 목적 | 다음에 실행할 커맨드 |
| --- | --- | --- | --- |
| `/kiro:steering` | – | 프로젝트 메모리 생성/업데이트 | `/kiro:spec-init` |
| `/kiro:steering-custom` | 대화형 | 도메인 특화 스티어링 정보를 추가 | `/kiro:spec-init` (필요 시 재실행) |
| `/kiro:spec-init <feature>` | 기능 설명 | `.kiro/specs/<feature>/` 생성 | `/kiro:spec-requirements <feature>` |
| `/kiro:spec-requirements <feature>` | 기능명 | `requirements.md` 생성 | `/kiro:spec-design <feature>` |
| `/kiro:validate-gap <feature>` | 선택 | 기존 코드와 요구사항 차이를 검증 | `/kiro:spec-design <feature>` |
| `/kiro:spec-design <feature> [-y]` | 기능명 | `research.md`(필요 시)와 `design.md` 생성 | `/kiro:spec-tasks <feature>` |
| `/kiro:validate-design <feature>` | 선택 | 설계 품질 평가 | `/kiro:spec-tasks <feature>` |
| `/kiro:spec-tasks <feature> [-y]` | 기능명 | 병렬 실행을 고려한 태스크 리스트 `tasks.md`(실행 순서 라벨 포함) 작성 | `/kiro:spec-impl <feature> [task-ids]` |
| `/kiro:spec-impl <feature> [task-ids]` | 태스크 번호 | 구현 및 테스트 주도 개발(TDD) 실행 | `/kiro:validate-impl [feature] [task-ids]` |
| `/kiro:validate-impl [feature] [task-ids]` | 선택 | 구현 리뷰/테스트 결과 확인 | `/kiro:spec-status <feature>` |
| `/kiro:spec-status <feature>` | 기능명 | 각 페이즈 진행/승인 상태 요약 | 추천에 따라 다음 페이즈로 |

---

## Steering 커맨드

### `/kiro:steering`
- **목적**: 프로젝트 전체의 룰과 가이드라인을 `.kiro/steering/`디렉터리에 집약해, 모든 커맨드가 공통의 프로젝트 메모리(Project Memory)를 참조할 수 있도록 한다. 특정 기능에 대한 구현 상세를 적는 장소는 아니다.
- **인자**: 없음.
- **출력**: `structure.md`、`tech.md`、`product.md`가 생성된다(기존 파일이 있으면 차이를 반영해 업데이트). 여기는 장기적으로 사용할 원칙과 표준만 기록하고, 개별 기능에 대한 메모는 `spec/research/design`에 남길 것.
- **전형적인 플로우**: 리포지토리 최초 세팅 시 또는 대규모 변경 시 실행하고, 생성된 내용을 개발자가 리뷰/조정한다. 이후 각 spec 커맨드는 이 정보를 자동 참조한다.
- **힌트**:
  - 빈 디렉터리에서 실행하면 실패하므로, 반드시 소스코드가 존재하는 프로젝트 루트에서 실행할 것.
  - Steering은 프로젝트 공통 패턴/룰을 기록하는 용도다. 기능 고유의 조사 내용은 `research.md`나 `design.md`에 작성할 것.
  - 생성 결과는 어디까지나 베이스라인이다. 프로젝트 고유 룰은 `/kiro:steering-custom`으로 추가할 것.

### `/kiro:steering-custom`
- **목적**: API 스펙, 테스트 계획, UI/UX 가이드라인, 접근성 요구사항 등 코어 3개 파일만으로는 커버하기 어려운 영역의 스티어링 정보를 추가하기 위한 대화형 커맨드다.
- **인자**: 없음(대화형으로 템플릿 선택).
- **출력 예시**: `api-standards.md`(REST/GraphQL 규약, 버저닝, 에러 설계), `testing.md`(자동/수동 테스트 판단 기준, 커버리지 목표), `ui-ux.md`(디자인 시스템, 라이팅 톤, 리뷰 절차),`product-tests.md`(QA 팀용 E2E 시나리오), `security.md`등. 필요하면 고유 이름의 파일도 생성 가능하다.
- **사용 시점**:
  - 프로젝트에서 반드시 지켜야 하는 표준(API 규약, 전사 테스트 가이드라인, UX 기본 원칙 등)을 AI에 1차 정보로 제공하고 싶을 때.
  - 여러 팀/에이전트 사이에서 공통 룰을 공유하고, 스펙/설계 산출물에 반영하고 싶을 때.
  - 기존 프로젝트(Brownfield)에서 UI/UX나 API 일관성을 유지하며 기능을 추가 개발하고 싶을 때.

---

## Spec Workflow 커맨드

### `/kiro:spec-init`
- **목적**: `.kiro/specs/<feature>/`디렉터리를 만들고, `overview.md`나 `context.json`같은 메타데이터를 초기화한다.
- **필수 인자**: `<feature>`(기능명 또는 이슈 ID).
- **실행 타이밍**: Steering 정보를 설정한 직후, 또는 새 기능을 추가할 때 실행한다.
- **다음 단계**: `/kiro:spec-requirements <feature>`

### `/kiro:spec-requirements`
- **목적**: 사용자 요구와 제약 조건을 정리하고, EARS(Easy Approach to Requirements Syntax) 형식으로 `requirements.md`를 작성한다.
- **플로우**: 커맨드를 실행한 뒤, AI가 던지는 보충 질문에 답한다. 생성된 초안을 개발자가 리뷰하고, 필요 시 추가/수정한다.
- **힌트**: 기존 프로젝트(Brownfield)에서는 `/kiro:validate-gap`을 같이 사용하면 기존 코드와의 차이를 더 명확히 할 수 있다.

### `/kiro:spec-design`
- **목적**: 조사 로그 `research.md`(필요할 때만 자동 생성)와 상세 설계서 `design.md`를 세트로 만든다. 요구사항 커버리지, 컴포넌트와 인터페이스, 참고 문헌 등 v1.0.0 템플릿을 준수한 내용이 출력된다.
- **옵션**: `-y`옵션을 붙이면 확인 프롬프트를 스킵할 수 있다(프로덕션 운영에서는 권장되지 않음).
- **리뷰 관점**: 아키텍처 경계, 트레이서빌리티(추적 가능성), 컴포넌트 결합도 관련 룰이 지켜졌는지, 그리고 긴 자료나 외부 링크가 참고 문헌(Supporting References)으로 적절히 분리되어 있는지 확인한다.

### `/kiro:spec-tasks`
- **목적**: `design.md`를 바탕으로 구현 태스크 리스트(`tasks.md`)를 만든다. 이때 `P0`(순차 실행 필수), `P1`(병렬 실행 가능) 같은 실행 순서 라벨을 붙여 병행 개발을 쉽게 한다.
- **포인트**: v1.0.0에서는 도메인/레이어 단위 블록이 표준화되어, 기능 추가나 리팩터링 작업에도 재사용하기 쉬워졌다. 요구사항 ID 연결, 체크박스, 실행 순서 라벨이 한 세트로 생성된다.

### `/kiro:spec-impl`
- **목적**: 지정된 태스크를 AI로 구현한다. 테스트 커맨드와 검증 내용도 함께 제안한다.
- **사용법**: `/kiro:spec-impl user-auth 3 4`처럼 태스크 ID를 넘기면, 지정된 태스크만 대상으로 하는 구현 프롬프트가 생성된다.
- **주의**: 실행 전 `tasks.md`의 태스크 리스트가 승인 완료 상태인지 확인할 것.

---

## Validation 커맨드

### `/kiro:validate-gap`
- **역할**: 기존 소스코드와 `requirements.md`의 차이를 자동 분석하고 `gap-report.md`를 생성한다. 기존 프로젝트(Brownfield) 수정 시 요구 누락을 검출하는 데 유효하다.
- **입력**: `<feature>`(선택).
- **출력**: 검출된 갭 목록, 권장 대응 태스크, 관련 가능성이 있는 파일 리스트가 출력된다.

### `/kiro:validate-design`
- **역할**: `design.md`의 정합성과 템플릿 준수 상태를 리뷰한다. 트레이서빌리티, 경계 설계, 참고 문헌(Supporting References) 사용 방식 등을 점검하고 개선 피드백을 제공한다.
- **권장 타이밍**: 개발자 리뷰 전후에 실행하면 설계 체크 항목의 누락 여부를 확인하는 데 도움이 된다.

### `/kiro:validate-impl`
- **역할**: 구현된 태스크가 `tasks.md`의 수용 조건(acceptance criteria)을 만족하는지 확인한다. 테스트 커맨드/로그 부족, Diff 요약 등을 정리해 보고한다.
- **입력**: `[feature-name] [task-ids]`(인자를 생략하면 최근 태스크를 자동 검출).

---

## Status 커맨드

### `/kiro:spec-status`
- **목적**: 특정 기능 개발 프로젝트에 대해 요구사항, 설계, 태스크 분할, 구현, 검증 각 페이즈의 진행 및 승인 상태를 목록으로 보여준다.
- **출력**: 체크리스트 형태의 요약이 CLI에 표시되며, 다음에 실행할 커맨드를 제안한다.
- **사용 시점**: 리뷰어 교체 시점이나, 여러 개발자/AI 에이전트가 병렬로 작업하는 상황에서 전체 진행 상황 파악에 유용하다.

---

## 자주 묻는 질문

| 질문 | 답변 |
| --- | --- |
| Claude 외 에이전트에서도 동일한 결과가 나오나? | 커맨드 체계는 공통이지만, 에이전트별 UI나 제약 때문에 응답 내용은 약간 달라질 수 있다. README에 기재된 설치 플래그를 사용해 대상 에이전트를 선택할 것. |
| 커맨드를 연속으로 자동 실행하려면 어떻게 하나? | `/kiro:spec-quick <feature>`를 사용하면 요구사항부터 태스크 분할까지 한 번에 실행할 수 있다. 다만 각 페이즈 사이에 확인이 들어가므로 개발자 리뷰를 끼워 넣을 수 있다. |
| 템플릿을 커스터마이징하려면? | `.kiro/settings/templates/` 및 `.kiro/settings/rules/` 내부 파일을 수정할 것. 변경사항은 즉시 모든 커맨드에 반영된다. |

---

이 문서는 v1.0.0 시점의 스펙을 기반으로 한다. 향후 버전에서 커맨드라인 스펙이나 템플릿 구조가 변경될 경우, 최신 영문 문서 `docs/guides/command-reference.md`의 내용을 정본으로 한다.
