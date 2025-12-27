# Spec-Driven Development (SDD) WIP

> 📖 **English guide:** [Spec-Driven Development Workflow](../spec-driven.md)

이 문서는 k-sdd가 AI 구동 개발 라이프사이클(AI-Driven Development Life Cycle, AI-DLC)에서 사양 기반 개발(Spec-Driven Development, SDD)을 어떻게 실천하는지 한국어로 설명한 것이다. 어떤 슬래시 커맨드를 실행하고, 어떤 산출물을 리뷰하며, 개발자 확인(게이트)을 어느 단계에 둘지 빠르게 판단하기 위한 레퍼런스로 활용할 수 있다.

## 라이프사이클 개요

1. **스티어링(Steering / 컨텍스트 수집)**: `/kiro:steering` 및 `/kiro:steering-custom` 커맨드를 사용해 아키텍처, 네이밍 규칙, 도메인 지식 등을 `.kiro/steering/*.md`파일들에 수집한다. 이들은 프로젝트 메모리(Project Memory)로서 이후 모든 커맨드에서 참조된다.
2. **사양 수립 시작(Spec Initiation)**: `/kiro:spec-init <feature>` 커맨드가 `.kiro/specs/<feature>/`디렉터리를 생성해 기능 단위 워크스페이스를 확보한다.
3. **요구사항 정의(Requirements)**: `/kiro:spec-requirements <feature>`커맨드가 AI와의 대화를 통해 `requirements.md`를 만든다. 여기에는 EARS 형식의 요구사항과 미해결 이슈가 기록된다.
4. **설계(Design)**: `/kiro:spec-design <feature>`커맨드가 먼저 조사 로그로 `research.md` 를 생성·업데이트한다(조사가 불필요한 경우 스킵된다). 그 내용에 기반해 상세 설계서 `design.md`가 출력된다. 이 설계서는 요구사항 커버리지, 컴포넌트 및 인터페이스 정의, 참고 문헌 등을 갖춘 리뷰 친화 문서다.
5. **태스크 계획(Task Planning)**: `/kiro:spec-tasks <feature>` 커맨드로 구현 태스크를 `tasks.md` 파일에 TODO 형태로 분해한다. 각 태스크는 요구사항 ID와 연결되며, 도메인/레이어별 블록으로 표준화된다. 동시에 `P0`(순차 실행) 또는 `P1`(병렬 실행 가능) 같은 실행 순서 라벨이 부여되어 병렬 개발의 경계가 제시된다.
6. **구현(Implementation)**: `/kiro:spec-impl <feature> <task-ids>`커맨드가 지정된 태스크 단위의 구현 및 테스트 프로세스를 지원한다.
7. **품질 게이트(Quality Gates)**: `/kiro:validate-gap`、`/kiro:validate-design`、`/kiro:validate-impl`같은 검증 커맨드가 기존 코드와의 정합성, 설계·구현 품질을 체크한다. 이를 통해 기존 프로젝트(Brownfield)에서도 안전하게 개발을 진행하기 위한 가드레일을 제공한다.
8. **진행 추적(Status Tracking)**: `/kiro:spec-status <feature>`커맨드가 각 개발 페이즈의 승인 상태와 미완료 태스크를 요약해 표시한다.

> 모든 페이즈는 개발자 리뷰를 위해 한 번 멈춘다. `-y` 옵션이나 `--auto` 플래그로 이 확인을 스킵하는 것도 가능하지만, 프로덕션 환경 대상 작업에서는 수동 승인 프로세스를 유지하는 것을 권장한다. 템플릿에 체크리스트를 내장해두면, 일관된 품질 게이트를 매번 강제할 수 있다.

## 커맨드와 산출물 매핑

| 커맨드 | 역할 | 주요 산출물 |
| --- | --- | --- |
| `/kiro:steering` | 프로젝트 메모리 생성 | `.kiro/steering/*.md` |
| `/kiro:steering-custom` | 도메인 고유 스티어링 정보 추가 | `.kiro/steering/custom/*.md` |
| `/kiro:spec-init <feature>` | 신규 사양 수립 시작 | `.kiro/specs/<feature>/` |
| `/kiro:spec-requirements <feature>` | 요구사항 정의 | `requirements.md` |
| `/kiro:spec-design <feature>` | 조사 및 상세 설계 | `research.md`(필요 시), `design.md` |
| `/kiro:spec-tasks <feature>` | 구현 태스크 분해(실행 순서 라벨 포함) | `tasks.md` |
| `/kiro:spec-impl <feature> <task-ids>` | 구현 실행 | 코드 변경 및 태스크 진행 업데이트 |
| `/kiro:validate-gap <feature>` | 갭 분석 | `gap-report.md` |
| `/kiro:validate-design <feature>` | 설계 리뷰 | `design-validation.md` |
| `/kiro:validate-impl [feature] [task-ids]` | 구현 리뷰 | `impl-validation.md` |
| `/kiro:spec-status <feature>` | 진행 가시화 | CLI 요약 |

## 워크플로우를 커스터마이징하려면

- **템플릿**: `.kiro/settings/templates/{requirements,design,tasks}.md`를 수정해 각 개발 페이즈 산출물의 아웃라인과 체크리스트를 자사 프로세스에 맞게 조정할 수 있다. v1.0.0 설계 템플릿은 요약 테이블, 컴포넌트 밀도에 관한 룰, 참고 문헌 같은 요소를 포함하며, 리뷰어의 인지 부담을 낮추도록 설계되어 있다.
- **룰**: `.kiro/settings/rules/*.md`파일에 “해야 할 것(DO)”, “하면 안 되는 것(DO NOT)”과 평가 기준 등을 작성하면, 이는 모든 에이전트 및 커맨드에서 공통 가이드라인으로 로드된다. 구버전처럼 커맨드 프롬프트에 직접 지시를 작성할 필요가 없다.
- **승인 플로우**: 템플릿 헤더에 리뷰 담당자(Reviewer)나 승인자(Approver) 칸, 체크리스트, 트레이서빌리티를 확보하기 위한 컬럼 등을 추가하면, 각 품질 게이트에서 확인해야 할 항목을 단일 문서로 집약할 수 있다.

## 신규 프로젝트 vs 기존 프로젝트

- **신규 프로젝트(Greenfield)**: 공유해야 할 룰이나 원칙이 이미 있다면 `/kiro:steering`(또는`/kiro:steering-custom`)을 실행해 프로젝트 메모리에 저장한다. 아직 룰이 정비되지 않았다면, 먼저 `/kiro:spec-init`으로 개발을 시작하고 진행하면서 점진적으로 스티어링 정보를 보강하는 방식이 좋다.
- **기존 프로젝트(Brownfield)**: `/kiro:validate-gap`, `/kiro:spec-requirements`, `/kiro:spec-design`순으로 프로세스를 진행하면, 기존 코드와의 정합성을 조기에 확인할 수 있다. 설계 템플릿 내 요구사항 커버리지(Req Coverage) 및 참고 문헌(Supporting References) 섹션이 기존 사양서와의 연관성을 보장하는 역할을 한다.

## 관련 리소스

- [Docs README](../README.md)
- [커맨드 레퍼런스](command-reference.md)
- [Claude Code Subagents 워크플로우](claude-subagents.md)

이 가이드는 v1.0.0 시점의 내용에 기반한다. 템플릿이나 커맨드 동작에 변경이 있는 경우, 공식 영문 문서 `docs/guides/spec-driven.md`를 정본으로 삼고, 이에 맞춰 본 문서도 업데이트해야 한다.
