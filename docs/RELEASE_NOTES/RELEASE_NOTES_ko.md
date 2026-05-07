# 릴리스 노트

k-sdd의 새 기능과 개선 정보를 전합니다. 기술적인 변경 이력은 [CHANGELOG.md](../../CHANGELOG.md)를 확인하세요.

---

## 🔬 개발 중 (Unreleased)

현재 미릴리스된 기능은 없습니다. 최신 안정 버전은 v3.0.5입니다.

---

## 🔧 Ver 3.0.5 (2026-04-06) - 패치 수정과 문서 정리

### 개요

Codex의 `spec-reviewer` role을 유효한 상태로 유지하기 위한 수정과, k-sdd의 방침에 맞지 않게 된 README 참조를 정리한 patch release입니다.

### 수정

- Codex의 `spec-reviewer` 템플릿에 누락되어 있던 `description` 필드를 추가하여, malformed로 무시되지 않고 cross-spec review용 custom role이 사용되도록 했습니다 ([#160](https://github.com/gaebalai/k-sdd/pull/160))

### 문서

- README의 Amazon 서적 참조를 삭제했습니다. 링크 대상 서적의 제목과 내용이, 귀속 표시 없는 closed-source clone인 `ai-sdd`를 홍보하는 형태로 변경되었기 때문입니다 ([#157](https://github.com/gaebalai/k-sdd/pull/157))

### 리소스

- **Pull Requests**: [#157](https://github.com/gaebalai/k-sdd/pull/157), [#160](https://github.com/gaebalai/k-sdd/pull/160)
- **Full Changelog**: [CHANGELOG.md](../../CHANGELOG.md#302---2026-04-06)
- **Release Notes**: [English](./RELEASE_NOTES_en.md) | [한국어](./RELEASE_NOTES_ko.md)

### 설치

```bash
npx k-sdd@latest
```

---

## 🛡️ Ver 3.0.1 (2026-04-11) - 경로 안전성 강화

### 개요

`k-sdd`의 파일 시스템 안전성을 높이는 patch release입니다. 더불어 mojibake 수정과 영어 문서의 사소한 표현 개선을 포함합니다.

### 수정

- Claude Code Skills의 `kiro-impl` 템플릿에서 발생하던 mojibake를 수정하여, Feature Flag Protocol의 `→`가 올바르게 표시되도록 했습니다 ([#154](https://github.com/gaebalai/k-sdd/pull/154))

### 보안

- manifest, template, shared-rules 유래의 경로 처리를 강화하여, 생성되는 파일 조작이 허용된 루트 내로 제한되도록 개선
- path traversal성 입력이나 symlink 경유 쓰기를 런타임에 거부하도록 변경 ([#155](https://github.com/gaebalai/k-sdd/pull/155))

### 문서

- 영어 문서 일부에서 `team-scale AI-driven development`를 보다 자연스러운 `AI-driven development at team scale`로 수정했습니다 ([#155](https://github.com/gaebalai/k-sdd/pull/155))

### 리소스

- **Pull Requests**: [#154](https://github.com/gaebalai/k-sdd/pull/154), [#155](https://github.com/gaebalai/k-sdd/pull/155)
- **Full Changelog**: [CHANGELOG.md](../../CHANGELOG.md#301---2026-04-11)
- **Release Notes**: [English](./RELEASE_NOTES_en.md) | [한국어](./RELEASE_NOTES_ko.md)

### 설치

```bash
npx k-sdd@latest
```

---

## 🎉 Ver 3.0.0 (2026-04-10) - Skills Mode와 자율 구현

### 🎯 하이라이트

- **Agent Skills가 주축으로**: k-sdd는 `--*-skills` 설치와, 8 플랫폼 공통의 17-skill 워크플로를 중심으로 재구성되었습니다.
- **실행 가능한 spec**: `/kiro-discovery`, `/kiro-spec-batch`, 장시간 실행되는 `/kiro-impl`을 통해, 승인된 spec을 단순한 문서가 아닌 실행의 control plane으로 다룰 수 있습니다.
- **네이티브 서브에이전트 dispatch**: 자율 구현, 리뷰, 디버그 루프가 k-sdd 내에 통합되어, 외부 Ralph Loop 의존성이 불필요해졌습니다.

### ✨ 추가

- Cursor / GitHub Copilot / OpenCode / Gemini CLI / Windsurf / Antigravity용 skills-based agents를 추가하고, Claude Code Skills / Codex Skills도 강화 ([#141](https://github.com/gaebalai/k-sdd/pull/141))
- 새로운 workflow entry points:
  - `/kiro-discovery`로 아이디어를 triage하여 roadmap에 분기
  - `/kiro-spec-batch`로 다수 spec을 병렬 작성
  - `/kiro-impl`로 reviewer/debugger loop가 포함된 autonomous implementation ([#141](https://github.com/gaebalai/k-sdd/pull/141))
- boundary-first planning, design synthesis, review gates, task decomposition, steering customization을 위한 `.kiro/settings/` rules/templates 추가 ([#141](https://github.com/gaebalai/k-sdd/pull/141))
- 새로운 `k-sdd-new-agent` skill을 추가하여, 지원 agent 추가나 skills mode로의 마이그레이션 절차를 SOP화 ([#141](https://github.com/gaebalai/k-sdd/pull/141))

### 🔧 변경

- 기본 설치 대상을 `claude-code-skills`로 변경하여, skills mode를 표준 경험으로 만들었습니다 ([#141](https://github.com/gaebalai/k-sdd/pull/141))
- 문서, 온보딩, 메시징을 v3 워크플로와 "long-running autonomous implementation"에 맞춰 재구성했습니다 ([#141](https://github.com/gaebalai/k-sdd/pull/141))
- issue 자동 클로즈는 maintainer가 `awaiting-response` 라벨을 명시적으로 붙였을 때만 동작하도록 변경했습니다 ([#138](https://github.com/gaebalai/k-sdd/pull/138))

### ⚠️ Breaking / Migration Notes

- 앞으로는 skills mode가 주 경로입니다. command-based installs는 deprecated이므로 `--*-skills`로 마이그레이션해 주세요.
- `--codex` prompts mode는 미지원이 되었습니다. `--codex-skills`를 사용해 주세요.
- 지금까지 외부 Ralph Loop를 전제로 하던 경우, 내장된 `/kiro-impl` autonomous flow로 마이그레이션해 주세요.

### 📖 Migration Guide

- 업그레이드 절차는 [docs/guides/migration-guide.md](../guides/migration-guide.md)를 참조해 주세요.

### 🔗 리소스

- **Pull Requests**: [#141](https://github.com/gaebalai/k-sdd/pull/141), [#138](https://github.com/gaebalai/k-sdd/pull/138)
- **Full Changelog**: [CHANGELOG.md](../../CHANGELOG.md#300---2026-04-10)
- **Release Notes**: [English](./RELEASE_NOTES_en.md) | [한국어](./RELEASE_NOTES_ko.md)

### 📦 설치

```bash
npx k-sdd@latest
```

---

## 🔧 Ver 2.1.1 (2026-02-02) - 버그 수정 & 보안

### 수정

- OpenCode 에이전트의 슬래시 명령에서 풀 에이전트 경로를 사용하도록 수정.

### 보안

- vitest를 v4로 업데이트하여 보안 취약점을 해결.

### 신규 컨트리뷰터

- @hiiamkazuto가 #134에서 첫 컨트리뷰트

* 리소스: [CHANGELOG.md](../../CHANGELOG.md#211---2026-02-02), PR: [#134](https://github.com/gaebalai/k-sdd/pull/134), [#135](https://github.com/gaebalai/k-sdd/pull/135)

---

## 🚀 Ver 2.1.0 (2026-02-01) - OpenCode 지원

### 🎯 하이라이트

- **OpenCode 지원**: 8번째 에이전트로서, 완전한 Spec-Driven Development 워크플로를 통합.
- **추천 모델 업데이트**: Opus 4.5, GPT-5.2, Gemini 3 Flash로 업데이트하여 성능을 향상.

### ✨ 추가

- **OpenCode** ([#117](https://github.com/gaebalai/k-sdd/pull/117), [#127](https://github.com/gaebalai/k-sdd/pull/127))
  - `.opencode/commands/`에 전체 11개의 kiro 명령
  - `.opencode/agents/`에 OpenCode Agents (서브에이전트 버전)
  - OPENCODE.md 프로젝트 메모리 템플릿
  - 설치: `npx k-sdd@latest --opencode` 또는 `--opencode-agent`

### 🔧 변경

- 추천 모델을 업데이트 ([#128](https://github.com/gaebalai/k-sdd/pull/128), [#129](https://github.com/gaebalai/k-sdd/pull/129))
  - Claude: Opus 4.5
  - OpenAI: GPT-5.2
  - Google: Gemini 3 Flash
- 템플릿에서 think 키워드를 삭제하여 프롬프트를 깔끔하게 정리

### 📈 주요 메트릭

- **지원 에이전트**: 8 (Claude Code, Cursor, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, Windsurf, **OpenCode**)
- **명령 수**: 각 에이전트 11
- **지원 언어**: 13

### 🙏 신규 컨트리뷰터

- @inovue가 #117에서 첫 컨트리뷰트

* 리소스: [CHANGELOG.md](../../CHANGELOG.md#210---2026-02-01), PR: [#117](https://github.com/gaebalai/k-sdd/pull/117), [#127](https://github.com/gaebalai/k-sdd/pull/127), [#128](https://github.com/gaebalai/k-sdd/pull/128), [#129](https://github.com/gaebalai/k-sdd/pull/129)

---

## 🌍 Ver 2.0.5 (2026-01-08) - 그리스어 지원 추가

### 추가

- 그리스어(el) 지원을 추가하여, 지원 언어 수가 13개 언어가 되었습니다.

### 신규 컨트리뷰터

- @tpapamichail이 #121에서 첫 컨트리뷰트

* 리소스: [CHANGELOG.md](../../CHANGELOG.md#205---2026-01-08), PR: [#121](https://github.com/gaebalai/k-sdd/pull/121)

---

## 📝 Ver 2.0.4 (2026-01-07) - 버그 수정 & 문서 업데이트

### 수정

- GitHub Copilot의 프롬프트 파일에서 비추천된 `mode` 속성을 `agent`로 치환하여, 최신 Copilot 사양에 대응.
- registry.ts의 리뷰 개선을 반영.

### 문서

- AI-Assisted SDD의 서적 참조를 문서에 추가.

### 신규 컨트리뷰터

- @irisTa56가 #118에서 첫 컨트리뷰트
- @leosamp가 #109에서 첫 컨트리뷰트
- @Kakenyan이 #107에서 첫 컨트리뷰트

* 리소스: [CHANGELOG.md](../../CHANGELOG.md#204---2026-01-07), PR: [#118](https://github.com/gaebalai/k-sdd/pull/118), [#109](https://github.com/gaebalai/k-sdd/pull/109), [#107](https://github.com/gaebalai/k-sdd/pull/107)

---

## 📝 Ver 2.0.3 (2025-11-15) - GPT-5.1 Codex용 추천 모델 조정

- Codex CLI / Cursor / GitHub Copilot / Windsurf용 추천 모델에 `gpt-5.1-codex medium/high`를 명시적으로 추가하여, 코드 중심 워크로드에서는 Codex 계열 모델을 우선하면서 `gpt-5.1 medium/high`를 범용 용도의 폴백으로 유지했습니다.
- DEV_GUIDELINES 관련 테스트 기대값을 v2.0.2에서 도입한 엄격한 언어 핸들링 사양에 맞춰 수정하여, 런타임 동작을 바꾸지 않고 `npm test`가 깔끔하게 통과하도록 했습니다.

- 리소스: [CHANGELOG.md](../../CHANGELOG.md#203---2025-11-15), PR: [#104](https://github.com/gaebalai/k-sdd/pull/104)

---

## 📝 Ver 2.0.2 (2025-11-15) - GPT-5.1 대응과 출력 안정성 향상

- Codex CLI / Cursor / GitHub Copilot / Windsurf용 추천 모델을 `GPT-5.1 high or medium`으로 업데이트하여, GPT-5.1 전제의 워크플로 최적화를 실시.
- requirements/design/tasks/research/validation 등의 Markdown 출력에 대해, `spec.json.language`의 언어를 반드시 사용하고, 미설정 시에는 영어(`en`)로 통일.
- EARS 패턴과 트레이스 가능성의 일관성을 높이기 위해, EARS의 트리거 구문(`When/If/While/Where/The system shall/The [system] shall`)은 영어 고정으로 하고 가변 부분만 타깃 언어로 생성하면서, `Requirement 1`, `1.1`, `2.3` 같은 숫자 ID만을 허용하여 requirements → design → tasks의 대응 관계를 안정화.

- 리소스: [CHANGELOG.md](../../CHANGELOG.md#202---2025-11-15), PR: [#102](https://github.com/gaebalai/k-sdd/pull/102)

---

## 📝 Ver 2.0.1 (2025-11-10) - 문서 업데이트

### 개요

문서 전용 업데이트. README의 명확성과 시각적 일관성을 개선.

### 리소스

- PR: [#93](https://github.com/gaebalai/k-sdd/pull/93), [#94](https://github.com/gaebalai/k-sdd/pull/94)
- [CHANGELOG.md](../../CHANGELOG.md#201---2025-11-10)

---

## 🎉 Ver 2.0.0 (2025-11-09) - 안정 버전 릴리스

### 하이라이트

- **`npx k-sdd@latest`로 전 기능 개방**: alpha.1~alpha.6에서 시험 투입한 Research.md, 검증 명령, Subagents, Windsurf 통합을 모두 GA화.
- **설계~구현의 일관성 강화**: 요약 표, Req Coverage, Supporting References를 갖춘 새 design 템플릿으로 SSoT를 견지.
- **Brownfield용 가드레일**: `/kiro:validate-*`, 병렬 태스크 분석, Steering 프로젝트 메모리로 디그레이드를 미연에 방지.
- **글로벌 대응**: 7 에이전트 × 12 언어가 동일한 템플릿과 명령 체계를 공유.

### 업그레이드 요점

1. 반드시 [마이그레이션 가이드](../guides/migration-guide.md)를 참조하여, `.kiro/settings/templates/*`의 재배치와 Steering의 디렉터리 로딩 변경을 반영.
2. 자동화나 README의 실행 예시를 `npx k-sdd@latest` 기준으로 통일 (`@next`는 향후 프리뷰 전용).
3. steering / research / design / tasks 템플릿을 재생성하여, Research.md, Supporting References, (P) 마커를 가져오기.

### 주요 강화 포인트

- **병렬 태스크 분석**: `(P)` 마커 자동 부여와 `--sequential` 플래그.
- **Research.md**: 조사 로그와 장문의 의사결정을 설계 본편에서 분리하여, design.md를 1차 정보로 완결.
- **Design 템플릿 개정**: 컴포넌트 요약 표, Req Coverage, Supporting References, 밀도 조정 룰을 추가.
- **에이전트/언어 패리티**: Claude Code + Subagents, Cursor, Gemini CLI, Codex CLI, Copilot, Qwen, Windsurf의 11 명령 세트를 통일 제공.
- **대화형 인스톨러**: 프로젝트 메모리 처리와 npm 배지 업데이트가 포함된 가이드형 셋업.

### 리소스

- 기술적인 상세: [CHANGELOG.md](../../CHANGELOG.md#200---2025-11-09)
- 절차, 회귀 대책: [docs/guides/migration-guide.md](../guides/migration-guide.md)
- 릴리스 작업 태스크: `docs/k-sdd/v2.0.0/PLAN.md`
- 템플릿 개선 태스크: `docs/k-sdd/v2.0.0/PLAN2.md`

v2.0.0으로 마이그레이션 후 템플릿을 재생성하면, 추가 플래그 없이 최신 Spec Driven Development 워크플로를 사용할 수 있습니다.

---

## 과거 Alpha 릴리스

---

## 🚀 Ver 2.0.0-alpha.5 (2025-11-05)

### 🎯 하이라이트

- **EARS 형식의 개선**: 요구사항 정의에 사용하는 EARS 형식을 소문자 구문으로 통일하여, 가독성이 향상되었습니다.
- **문서 충실화**: 설치 절차의 명확화와 npm 배지 추가로, 사용자 경험이 개선되었습니다.

### 🔧 개선

- EARS 형식을 소문자 구문으로 업데이트 ([#88](https://github.com/gaebalai/k-sdd/pull/88))
  - "WHILE/WHEN/WHERE/IF" → "while/when/where/if"
  - 보다 자연스럽고 읽기 쉬운 요구사항 기술이 가능
- 설치 문서의 명확화 ([#87](https://github.com/gaebalai/k-sdd/pull/87))
- npm `next` 버전 배지를 README에 추가 ([#86](https://github.com/gaebalai/k-sdd/pull/86))

---

## 📚 Ver 2.0.0-alpha.4 (2025-10-30)

### 🎯 하이라이트

- **포괄적인 커스터마이즈 가이드**: 7개의 실전 예시를 포함한 커스터마이즈 가이드와 완전한 명령 레퍼런스를 추가하여, 프로젝트에 맞춘 템플릿 조정이 용이해졌습니다.

### 📖 신규 문서

- **커스터마이즈 가이드** ([#83](https://github.com/gaebalai/k-sdd/pull/83))
  - 템플릿 커스터마이즈 패턴
  - 에이전트 고유의 워크플로 예시
  - 프로젝트 고유의 룰 예시
  - 7개의 실전적인 커스터마이즈 예시
- **명령 레퍼런스** ([#83](https://github.com/gaebalai/k-sdd/pull/83))
  - 전체 11개 `/kiro:*` 명령의 상세 사용법
  - 파라미터 설명과 실제 예시

### 🔧 개선

- 템플릿 커스터마이즈 절차의 명확화 ([#85](https://github.com/gaebalai/k-sdd/pull/85))
- 커스터마이즈 가이드의 리뷰 개선 ([#84](https://github.com/gaebalai/k-sdd/pull/84))

---

## 🤖 Ver 2.0.0-alpha.3.1 (2025-10-24)

### 🎯 하이라이트

- **GitHub Issue 자동 관리**: 10일간 비활성 issue를 자동 클로즈하여, 프로젝트 관리가 효율화되었습니다.

### ⚙️ 자동화

- GitHub issue 라이프사이클 관리의 자동화 ([#80](https://github.com/gaebalai/k-sdd/pull/80))
  - 10일간 비활성 issue를 자동 클로즈
  - 설정 가능한 stale 검출 워크플로
  - 영어 전용 워크플로 메시징 ([#81](https://github.com/gaebalai/k-sdd/pull/81))

### 🔧 개선

- stale 검출 기간을 10일로 업데이트
- GitHub Actions 워크플로의 개선

---

## 🚀 Ver 2.0.0-alpha.3 (2025-10-22)

### 🎯 하이라이트

- **Windsurf IDE 지원**: `.windsurf/workflows/`에 11개의 워크플로와 AGENTS.md를 전개하는 manifest를 추가하여, `npx k-sdd@next --windsurf`로 kiro 사양 주도 워크플로를 사용할 수 있게 되었습니다.
- **CLI 경험 쇄신**: 셋업 완료 메시지에 Windsurf용 추천 모델과 다음 명령을 표시하고, 문서에서는 수동 QA 플로를 안내하도록 개선했습니다.

### 🧪 품질 / 도구

- macOS / Linux의 dry-run, 적용 결과를 검증하는 `realManifestWindsurf` 통합 테스트를 추가.
- CLI 인수 파서에 `--windsurf` 플래그를 추가하고, 에이전트 레지스트리에 Windsurf의 레이아웃 정보를 등록.

### 📚 문서

- 루트 README, `tools/k-sdd/README*`, 그리고 `docs/README/README_{en,ko}.md`를 업데이트하여, Windsurf 도입 절차와 `npx k-sdd@next --windsurf`를 사용한 수동 QA 절차를 추가했습니다.

### 📈 지표

- **지원 플랫폼**: 7 (Claude Code, Cursor IDE, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, Windsurf IDE)
- **명령 / 워크플로 수**: 각 에이전트 11 (spec / validate / steering 공통 구성)
- **자동 테스트**: Windsurf 전용 real manifest 테스트를 1건 추가

## 🚀 Ver 2.0.0 (2025-10-13)

### 🎯 하이라이트

- **가이드형 CLI 인스톨러**: `npx k-sdd@latest` 실행 시, 작성/업데이트되는 파일을 Commands / Project Memory / Settings로 정리하여 표시하고, 프로젝트 메모리 문서는 덮어쓰기, 추가, 유지를 대화형으로 선택할 수 있게 되었습니다. 재설치 시의 안심감과 속도가 향상됩니다.
- **Spec-Driven 명령의 재설계**: 전체 에이전트의 11 명령(`spec-*`, `validate-*`, `steering*`)의 컨텍스트를 재설계. 사양서, 상세 설계, 태스크 계획 등의 산출물을 팀이나 프로젝트에 맞춰 유연하게 조정하기 쉬워졌습니다.
- **Steering의 강화**: 스티어링을 프로젝트 전체에 적용해야 하는 룰이나 패턴, 예시, 가이드라인의 프로젝트 메모리로서 적절히 기능하도록 개수했습니다. `product/tech/structure` 중심이었던 스티어링 로딩을 `steering/` 하위의 그 외 문서도 같은 무게로 채택.
- **설정/템플릿의 커스터마이즈성 향상**: `{{KIRO_DIR}}/settings`로 공통 룰/템플릿을 전개. 프로젝트에 맞춘 설계, 태스크 포맷 조정이 용이해졌습니다. 한 번의 커스터마이즈로, 다른 코딩 에이전트에서도 동일한 설정을 인계받을 수 있게 되었습니다.
- **Codex CLI 정식 지원**: `.codex/prompts/`에 11개의 프롬프트를 제공하여, Spec-Driven Development 워크플로를 정식 지원.
- **GitHub Copilot 정식 지원**: `.github/prompts/`에 11개의 프롬프트를 자동 배치. Codex CLI와 같은 스티어링/템플릿 구조를 공유하여, 크로스 플랫폼으로 공통 운용 가능.

### 🛠️ 내부 개선

- **템플릿 구조 쇄신**: 각 에이전트의 `os-mac / os-windows` 디렉터리를 폐지하고, 단일 `commands/` 구성으로 통일. 모든 템플릿을 `.md` / `.prompt.md` / `.toml` 같은 실제 확장자로 관리.
- **manifest와 CLI의 업데이트**: 모든 manifest를 새 구조에 맞춰 재정의하고, Codex / GitHub Copilot용 manifest를 추가. CLI도 `--codex`, `--github-copilot` 플래그와 헬프를 확장하고, `resolveAgentLayout`에 새 디렉터리를 등록.
- **테스트 체제의 강화**: 기존 에이전트용 리얼 manifest 테스트를 쇄신하여, `.kiro/settings` 전개를 포함한 동작을 검증. Codex / GitHub Copilot용 E2E 테스트를 추가.
- **문서 정비**: README (영어/한국어/번체자) 및 리포지토리 README를 업데이트하여, 지원 에이전트, 명령 수, 디렉터리 구조, CLI 예시를 최신 상태로 반영.

### 🔄 관련 풀 리퀘스트

- **[#74](https://github.com/gaebalai/k-sdd/pull/74)** - Claude Code Subagents 모드의 추가 (구현 중)
  - 컨텍스트 최적화를 위해, SDD 명령을 전용 서브에이전트에 위임
  - 메인 대화의 컨텍스트 윈도우를 보호하여, 세션 수명을 연장
  - 각 명령 전용의 시스템 프롬프트에 의한 품질 향상
  - 관련 Issue: [#68](https://github.com/gaebalai/k-sdd/issues/68)
- **[#73](https://github.com/gaebalai/k-sdd/pull/73)** - CLAUDE.md 문서의 추가
- **[#72](https://github.com/gaebalai/k-sdd/pull/72)** - 에이전트 메타데이터의 중앙 레지스트리로의 리팩토링
- **[#71](https://github.com/gaebalai/k-sdd/pull/71)** - 알파 버전 정보의 추가와 언어 테이블의 개선
- **[#70](https://github.com/gaebalai/k-sdd/pull/70)** - k-sdd v2.0.0-alpha 릴리스

### 📈 주요 메트릭

- **지원 플랫폼**: 6 (Claude Code, Cursor IDE, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code)
- **명령 수**: 11 (spec계 6 + validate계 3 + steering계 2)
- **배포 템플릿**: 공통 설정 + 각 에이전트 명령 + 프로젝트 메모리의 3 계통

---

## 🎯 Ver 1.1.0 (2025-09-08)

### ✨ 브라운필드 개발 기능 추가

기존 프로젝트에 대한 사양 주도 개발을 보다 효과적으로 실현

**품질 검증 명령의 신규 추가**

- 🔍 **`/kiro:validate-gap`** - 기존 기능과 요구사항의 갭 분석
  - spec-design 전에 실행하여, 현재 구현과 새 요구사항의 차이를 명확화
  - 기존 시스템의 이해와 새 기능의 통합 포인트를 특정
- ✅ **`/kiro:validate-design`** - 설계의 기존 아키텍처와의 호환성 검증
  - spec-design 후에 실행하여, 설계의 통합 가능성을 확인
  - 기존 시스템과의 충돌이나 비호환성을 사전에 검출

### 🚀 Cursor IDE 완전 지원

3번째 주요 플랫폼으로 정식 대응

- **11개의 명령** - Claude Code/Gemini CLI와 동등한 완전 기능
- **AGENTS.md 설정 파일** - Cursor IDE 전용의 최적화 설정
- **통일된 워크플로** - 전체 플랫폼에서 동일한 개발 경험

### 📊 명령 체계의 확충

사양 주도 개발의 완성도 향상

- **8→11 명령으로 확장** - validate계 명령과 구현 검증 명령의 추가로 충실
- **옵션 워크플로** - 필요에 따라 품질 게이트를 추가 가능
- **유연한 개발 경로** - 신규/기존 프로젝트에 따른 최적의 플로

### 📚 문서의 대폭 개선

보다 명확하고 간결한 설명으로 쇄신

**구조적 개선**

- **Quick Start의 분리** - 신규 프로젝트와 기존 프로젝트에서 다른 플로를 명시
- **스티어링의 위치 명확화** - 프로젝트 메모리로서의 중요성을 강조
- **장황한 설명의 간결화** - 각 섹션을 30-50% 축소하여 가독성 향상

**컨텐츠 강화**

- **AI-DLC "볼트" 개념** - AWS 기사로의 링크로 용어를 명확화
- **Kiro IDE 통합 설명** - 포터빌리티와 구현 가드레일을 강조
- **Speaker Deck 프레젠테이션 추가** - 「Claude Code는 사양 주도의 꿈을 꾸지 않는다」

### 🔧 기술적 개선

개발 경험과 유지 보수성의 향상

- **GitHub URL 업데이트** - gaebalai/k-sdd로의 마이그레이션 대응
- **오타 수정** - "Clade Code" → "Claude Code"
- **문서 정비** - README와 템플릿의 개선

### 📈 주요 메트릭

- **지원 플랫폼**: 5 (Claude Code, Cursor IDE, Gemini CLI, Codex CLI, GitHub Copilot)
- **명령 수**: 11 (spec계 6 + validate계 3 + steering계 2)
- **문서 언어**: 3 (영어, 일본어, 번체 중국어)
- **npm 주간 다운로드**: 안정적으로 성장 중

---

## 🎉 Ver 1.0.0 (2025-08-31)

### 🚀 멀티 플랫폼 대응 완성

4개의 플랫폼에서 통일된 사양서 주도 개발을 실현

- 🤖 **Claude Code** - 원조 플랫폼
- 🔮 **Cursor** - IDE 통합 대응
- ⚡ **Gemini CLI** - TOML 구조화 설정
- 🧠 **Codex CLI** - GPT-5 대응 프롬프트 설계

### 📦 k-sdd 패키지 배포 시작

[k-sdd](https://www.npmjs.com/package/k-sdd) - AI-DLC + Spec Driven Development

- Claude Code & Gemini CLI 대응
- `npx k-sdd@latest`로 설치 가능

### 🔄 개발 워크플로 전면 쇄신

스펙 주도 개발의 개발 워크플로 전체를 근본부터 재검토

- **거의 새로 만들기 수준**의 전면 쇄신을 실시
- 보다 산출물을 동일하게 사용할 수 있도록 통일화

---

## Ver 0.3.0 (2025-08-12)

### Kiro spec-driven development 명령 대폭 개선

**워크플로 효율화**

- `-y` 플래그 추가: `/kiro:spec-design feature-name -y`로 요구사항 승인을 스킵하여 설계 생성
- `/kiro:spec-tasks feature-name -y`로 요구사항+설계 승인을 스킵하여 태스크 생성
- argument-hint 추가: 명령 입력 시 `<feature-name> [-y]`가 자동 표시
- 기존의 단계적 승인도 유지 (spec.json 편집 또는 인터랙티브 승인)

**명령 경량화**

- spec-init.md: 162행→104행 (36% 축소, project_description 삭제와 템플릿 간소화)
- spec-requirements.md: 177행→124행 (30% 축소, 장황한 설명과 템플릿 간소화)
- spec-tasks.md: 295행→198행 (33% 축소, "Phase X:" 폐지, 기능 기반 명명, 입도 최적화)

**태스크 구조 최적화**

- 섹션 헤딩에 의한 기능 그룹화
- 태스크 입도 제한 (3-5 서브 항목, 1-2 시간 완료)
- _Requirements: X.X, Y.Y_ 형식의 통일

**Custom Steering 대응**

- 모든 spec 명령에서 프로젝트 고유의 컨텍스트 활용
- Always/Conditional/Manual 모드에 의한 유연한 설정 로딩

---

## Ver 0.2.1 (2025-07-27)

### CLAUDE.md 성능 최적화

**시스템 프롬프트의 경량화**

- CLAUDE.md 파일을 150행에서 66행으로 축소
- 중복 섹션과 장황한 설명을 삭제
- 한국어, 영어, 번체중문판 모두에서 통일적인 최적화를 실시

**기능성의 유지**

- 실행에 필요한 컨텍스트는 완전히 보유
- 스티어링 설정과 워크플로 정보는 유지
- 인터랙티브 승인의 동작에 영향 없음

**마이너 업데이트**

- spec-requirements.md에 「think」 키워드를 추가

---

## Ver 0.2.0 (2025-07-26)

### 인터랙티브 승인 시스템의 추가

**승인 플로의 개선**

- `/spec-design [feature-name]` 실행 시에 「requirements.md를 리뷰하셨습니까? [y/N]」의 확인 프롬프트를 표시
- `/spec-tasks [feature-name]` 실행 시에 requirements와 design 양쪽의 리뷰 확인을 표시
- 'y'로 승인하면 자동으로 spec.json을 업데이트하여, 다음 페이즈로 진행
- 'N'을 선택하면 실행을 정지하고, 리뷰를 촉구

**조작 절차의 간소화**

- 기존: 수동으로 spec.json 파일을 열어 `"approved": true`로 편집해야 했음
- 변경 후: 명령 실행 시의 확인 프롬프트에 응답하기만 하면 승인이 완료
- 수동 승인 방식도 계속 사용 가능

### 사양서 생성의 품질 향상

**requirements.md의 생성 품질 향상**

- EARS 형식의 출력이 보다 통일된 형식으로 생성되도록 되었습니다
- 계층적 요구사항 구조가 보다 정리된 형태로 출력되도록 되었습니다
- 인수 기준의 망라성과 구체성이 향상되었습니다

**design.md의 강화**

- 설계 단계에서 기술 조사, 연구 프로세스가 통합되도록 되었습니다
- 요구사항 매핑과 트레이서빌리티가 설계서에 반영되도록 되었습니다
- 아키텍처 도, 데이터 플로 도, ERD 등의 문서 구조로 개선했습니다
- 보안, 성능, 테스트 전략이 보다 상세하게 기술되도록 되었습니다

**tasks.md의 개선**

- 구현 태스크가 코드 생성 LLM용으로 최적화되었습니다
- 테스트 주도 개발 어프로치가 각 태스크에 통합되었습니다
- 태스크 간의 의존 관계가 보다 명확하게 관리되도록 되었습니다
- Kiro 설계 원칙에 적합한 독립 프롬프트 형식으로 개선했습니다

### 수정된 문제

**디렉터리 핸들링의 개선**

- `.kiro/steering/` 디렉터리가 존재하지 않는 경우에도 정상적으로 동작하도록 되었습니다
- 에러 메시지가 보다 알기 쉬워졌습니다

**내부 파일 관리의 개선**

- 개발용 프롬프트 파일을 버전 관리에서 제외했습니다

### 시스템 설계의 간소화

**progress 필드의 삭제**

- 장황하여 동기 에러의 원인이 되던 progress 필드를 완전 삭제
- phase + approvals만으로 보다 명확한 상태 관리를 실현
- spec.json의 구조를 간소화하여, 유지 보수성을 향상

**요구사항 생성 어프로치의 재검토**

- 과도하게 포괄적이었던 요구사항 생성을 원래의 Kiro 설계로 회귀
- 「CRITICAL」「MUST」 등의 강제적 표현을 삭제
- 핵심 기능에 초점을 맞춘 단계적인 요구사항 생성으로 변경
- 반복 개선 전제의 자연스러운 개발 플로를 부활

---

## Ver 0.1.5 (2025-07-25)

### 스티어링 시스템 대폭 강화

**보안 기능의 강화**

- 보안 가이드라인과 컨텐츠 품질 가이드라인을 추가했습니다
- 보다 안전하고 품질 높은 프로젝트 관리가 가능해졌습니다

**inclusion modes 기능의 개선**

- Always included, Conditional, Manual의 3개 모드가 보다 사용하기 쉬워졌습니다
- 상세한 사용 추천 사항과 가이던스를 추가했습니다

**스티어링 관리 기능의 통일**

- `/kiro:steering` 명령이 기존 파일을 적절히 처리하도록 되었습니다
- 스티어링 문서의 관리가 보다 직관적이 되었습니다

**시스템 안정성의 향상**

- Claude Code pipe bugs를 수정하여, 보다 신뢰성 높은 실행을 실현했습니다
- 비 Git 환경에서도 적절히 동작하도록 되었습니다

---

## Ver 0.1.0 (2025-07-18)

### 기본 기능

- Kiro IDE 스타일의 사양서 주도 개발 시스템을 구현
- 요구사항→설계→태스크→구현의 3단계 승인 워크플로
- EARS 형식에 의한 요구사항 정의 지원
- 계층적 요구사항 구조에서의 정리 기능
- 자동 진척 추적과 훅 기능
- 기본적인 Slash Commands 세트

### 품질 관리 기능

- 수동 승인 게이트에 의한 품질 보증
- 사양 준수 체크 기능
- 컨텍스트 보유 기능

---

## Ver 0.0.1 (2025-07-17)

### 신기능

- 프로젝트의 초기 구조를 작성

---

## 개발의 발자취

**2025년 7월 17일~18일: 기반 구축기**
프로젝트의 초기화와 Kiro-style 사양서 주도 개발의 핵심이 되는 프레임워크를 구현

**2025년 7월 18일~24일: 다언어화, 기능 확장기**
영어, 번체 중문 대응의 추가, GitHub Actions 통합, 문서 충실

**2025년 7월 25일: 스티어링 시스템 강화기**
보안 강화, inclusion modes 개선, 시스템 안정성 향상

**2025년 7월 26일: 사양서 생성 품질 혁신기 & 시스템 간소화**
requirements, design, tasks의 각 문서 생성 품질을 대폭 개선, 과도한 progress 추적을 삭제하여 Kiro 원본 설계로 회귀

---

## 사용 방법

### 멀티 플랫폼 대응

선호하는 플랫폼의 디렉터리를 복사:

- 🤖 Claude Code: `.claude/commands/` + `CLAUDE.md`
- 🔮 Cursor: `.cursor/commands/` + `AGENTS.md`
- ⚡ Gemini CLI: `.gemini/commands/` + 대응 TOML 설정
- 🧠 Codex CLI: `.codex/commands/` + GPT-5 최적화 프롬프트

### 기본 플로 (전체 플랫폼 공통)

1. 선택한 플랫폼의 파일을 프로젝트에 복사
2. `/kiro:steering`으로 프로젝트 정보를 설정
3. `/kiro:spec-init [기능 설명]`으로 새로운 사양서를 작성
4. 요구사항→설계→태스크→구현 순으로 단계적으로 개발을 진행

상세한 사용 방법은 [README_ko.md](docs/README/README_ko.md)를 참조하세요.

## 관련 링크

- **[한국어 문서](docs/README/README_ko.md)**
- **[English Documentation](docs/README/README_en.md)**
- **Claude Code 명령 쇄신**: `.tpl`을 폐지하고 10 → 11 명령 체제로 (`validate-impl`을 포함). 기존 OS별 템플릿보다 파일 수는 그대로 유지하면서, 크로스 플랫폼에서 동일 내용을 배포.
