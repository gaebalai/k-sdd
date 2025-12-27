# 릴리스 노트

k-sdd의 신규 기능 및 개선 정보를 안내합니다. 기술적인 변경 이력은 [CHANGELOG.md](../../CHANGELOG.md)를 확인하세요.

---

## 개발 중(Unreleased)

현재 미릴리스 기능은 없습니다. 최신 안정 버전은 v1.0.0입니다.

---

## Ver 1.0.0 (2025-12-24) - GPT-5.1 Codex용 추천 모델 조정

- Codex CLI / Cursor / GitHub Copilot / Windsurf용 추천 모델에 `gpt-5.1-codex medium/high`를 명시적으로 추가하고, 코드 중심 워크로드에서는 Codex 계열 모델을 우선하되 `gpt-5.1 medium/high`는 범용 용도의 폴백으로 유지했습니다.
- DEV_GUIDELINES 관련 테스트 기대값을 v0.5.0에서 도입한 엄격한 언어 핸들링 사양에 맞춰 수정하고, 런타임 동작을 바꾸지 않으면서 `npm test` 가 깨끗하게 통과하도록 했습니다.
- requirements / design / tasks / research / validation 등 Markdown 출력에 대해 `spec.json.language`의 언어를 반드시 사용하고, 미설정 시 영어(`en`)로 통일했습니다.
- EARS 패턴과 트레이서빌리티(추적 가능성)의 일관성을 높이기 위해, EARS 트리거 구문(`When/If/While/Where/The system shall/The [system] shall`)은 영어 고정으로 하고 가변 부분만 대상 언어로 생성하며, `Requirement 1`, `1.1`, `2.3` 같은 숫자 ID만 허용하여 requirements → design → tasks의 대응 관계를 안정화했습니다.
- **`npx k-sdd@latest`로 모든 기능 오픈**: alpha.1~alpha.6에서 시험 도입한 Research.md, 검증 커맨드, Subagents, Windsurf 통합을 모두 GA(정식)로 전환했습니다.
- **설계~구현의 일관성 강화**: 요약 표, Req Coverage, Supporting References를 포함한 신규 design 템플릿으로 SSoT(단일 정보원)를 유지했습니다.
- **Brownfield용 가드레일**: `/kiro:validate-*`, 병렬 태스크 분석, Steering 프로젝트 메모리로 회귀(데그레)를 사전에 방지합니다.
- **글로벌 대응**: 7개 에이전트 × 12개 언어가 동일 템플릿과 커맨드 체계를 공유합니다.

### 📦 k-sdd패키지 배포 시작
[k-sdd](https://www.npmjs.com/package/k-sdd) - AI-DLC + Spec Driven Development
- Claude Code & Gemini CLI지원
- `npx k-sdd@latest`로 설치 가능

---

## Ver 0.5.0 (2025-11-10)

- **EARS 형식 개선**：요구사항 정의에 사용하는 EARS 형식을 소문자 문법으로 통일해 가독성이 개선되었습니다.
- **문서 강화**：설치 절차 명확화 및 npm 배지 추가로 사용자 경험이 개선되었습니다.
- **포괄적인 커스터마이즈 가이드**: 7가지 실전 예시를 포함한 커스터마이즈 가이드와 완전한 커맨드 레퍼런스를 추가하여, 프로젝트에 맞춘 템플릿 조정이 쉬워졌습니다.
- **GitHub Issue 자동 관리**: 10일간 비활성인 이슈를 자동 종료하여 프로젝트 관리가 효율화되었습니다.
- **Windsurf IDE 지원**: `.windsurf/workflows/`에 11개 워크플로우와 AGENTS.md를 전개하는 매니페스트를 추가하여, `npx k-sdd@next --windsurf`로 kiro 사양 기반 워크플로우를 사용할 수 있게 되었습니다.
- **CLI 경험 개선**: 셋업 완료 메시지에 Windsurf용 추천 모델과 다음 커맨드를 표시하고, 문서에서는 수동 QA 플로우를 안내하도록 개선했습니다.
- **가이드형 CLI 인스톨러**: `npx cc-sdd@latest` 실행 시 생성/업데이트되는 파일을 Commands / Project Memory / Settings로 정리해 표시하고, 프로젝트 메모리 문서는 덮어쓰기·추가·유지를 대화형으로 선택할 수 있게 되었습니다. 재설치 시 안정감과 속도가 향상됩니다.
- **Spec-Driven 커맨드 재설계**: 모든 에이전트의 11개 커맨드(`spec-*, validate-*, steering*`)의 컨텍스트를 재설계했습니다. 사양서, 상세 설계, 태스크 계획 등의 산출물을 팀/프로젝트에 맞게 유연하게 조정하기 쉬워졌습니다.
- **Steering 강화**: 스티어링이 프로젝트 전체에 적용해야 할 룰/패턴/예시/가이드라인을 담는 프로젝트 메모리로 적절히 기능하도록 개편했습니다. `product/tech/structure` 중심이었던 스티어링 로딩을 steering/ 아래의 다른 문서도 동일 비중으로 채택하도록 변경했습니다.
- **설정/템플릿 커스터마이즈성 향상**: `{{KIRO_DIR}}/settings`에 공통 룰/템플릿을 전개. 프로젝트에 맞춘 설계/태스크 포맷 조정이 쉬워졌습니다. 한 번의 커스터마이즈로 다른 코딩 에이전트에서도 동일 설정을 이어받을 수 있게 되었습니다.
- **Codex CLI 정식 지원**: `.codex/prompts/`에 11개 프롬프트를 제공하여 Spec-Driven Development 워크플로우를 정식 지원합니다.
- **GitHub Copilot 정식 지원**: `.github/prompts/`에 11개 프롬프트를 자동 배치. Codex CLI와 같은 스티어링/템플릿 구조를 공유하여 크로스플랫폼에서 공통 운영이 가능해졌습니다.
- **품질 검증 커맨드 신규 추가**: 
  - **`/kiro:validate-gap`** - 기존 기능과 요구사항의 갭 분석
    - spec-design 전에 실행해 현재 구현과 신규 요구사항의 차이를 명확화
    - 기존 시스템 이해와 신규 기능 통합 포인트를 식별
  - **`/kiro:validate-design`** - 설계의 기존 아키텍처 호환성 검증
    - spec-design 후에 실행해 설계의 통합 가능성을 확인
    - 기존 시스템과의 충돌/비호환을 사전에 감지
- **Cursor IDE 완전 지원**
  - 11개 커맨드 - Claude Code/Gemini CLI와 동등한 완전 기능
  - AGENTS.md 설정 파일 - Cursor IDE 전용 최적화 설정
  - 통일된 워크플로우 - 모든 플랫폼에서 동일한 개발 경험
- **Quick Start 분리** - 신규 프로젝트와 기존 프로젝트에서 다른 플로우를 명시
- **스티어링의 포지셔닝 명확화** - 프로젝트 메모리로서 중요성을 강조
- **중복 설명 간소화** - 각 섹션을 30~50% 축소해 가독성 향상
- **AI-DLC ‘볼트’ 개념** - AWS 글 링크로 용어를 명확화
- **Kiro IDE 통합 설명** - 포터빌리티(이식성)와 구현 가드레일 강조

---

## Ver 0.1.0 (2025-10-18)

### Kiro spec-driven development 커맨드 대폭 개선

**워크플로우 효율화**
- -y 플래그 추가: `/kiro:spec-design feature-name -y`로 요구사항 승인을 스킵하고 설계 생성
- `/kiro:spec-tasks feature-name -y`로 요구사항+설계 승인을 스킵하고 태스크 생성
- argument-hint 추가: 커맨드 입력 시 <feature-name> [-y]가 자동 표시
- 기존의 단계적 승인도 유지(spec.json 편집 또는 대화형 승인)

**커맨드 경량화**
- spec-init.md: 162행 → 104행(36% 감소, project_description 제거 및 템플릿 단순화)
- spec-requirements.md: 177행 → 124행(30% 감소, 중복 설명 및 템플릿 단순화)
- spec-tasks.md: 295행 → 198행(33% 감소, "Phase X:" 폐지, 기능 기반 명명, 그레인(단위) 최적화)

**태스크 구조 최적화**
- 섹션 헤딩을 통한 기능 그룹화
- 태스크 그레인 제한(서브 아이템 3~5개, 1~2시간 내 완료)
- Requirements: X.X, Y.Y 형식 통일

**Custom Steering 지원**
- 모든 spec 커맨드에서 프로젝트 고유 컨텍스트 활용
- Always / Conditional / Manual 모드로 유연한 설정 로딩

### CLAUDE.md 성능 최적화

**시스템 프롬프트 경량화** 
- CLAUDE.md 파일을 150행에서 66행으로 축소
- 중복 섹션과 중복 설명 삭제
- 한국어/영어 모두에서 통일된 최적화 적용

**기능 유지**
- 실행에 필요한 컨텍스트는 완전 유지
- 스티어링 설정과 워크플로우 정보 유지
- 대화형 승인 동작에 영향 없음

---

## Ver 0.0.1 (2025-09-10)

### 신규 기능
- 프로젝트 초기 구조 생성

---

## 사용 방법

### 멀티 플랫폼 대응
원하는 플랫폼 디렉터리를 복사:
- Claude Code: `.claude/commands/` + `CLAUDE.md`
- Cursor: `.cursor/commands/` + `AGENTS.md`  
- Gemini CLI: `.gemini/commands/` + 대응 TOML 설정
- Codex CLI: `.codex/commands/` + GPT-5 최적화 프롬프트

### 기본 플로우(전 플랫폼 공통)
1. 선택한 플랫폼 파일을 프로젝트에 복사
2. `/kiro:steering`으로 프로젝트 정보를 설정
3. `/kiro:spec-init [기능 설명]`으로 새로운 사양 문서를 작성
4. 요구사항 → 설계 → 태스크 → 구현 순서로 단계적으로 개발 진행

자세한 사용 방법은[README_ko.md](docs/README/README_ko.md)를 확인하세요.

## 관련링크

- **[기숣블로그](https://blog.naver.com/beyond-zero)** 
- **[한국어 문서](docs/README/README_ko.md)**
- **[English Documentation](docs/README/README_en.md)**
- **Claude Code커맨드 개편**：`.tpl` 을 제거하고 10 → 11 커맨드 체계로 전환(`validate-impl`포함). 기존 OS별 템플릿 대비 파일 수는 그대로 유지하면서, 크로스플랫폼에서 동일 내용을 배포합니다.
