# k-sdd: Spec-driven development for your team's workflow

<!-- npm badges -->
[![npm version](https://img.shields.io/npm/v/k-sdd?logo=npm)](https://www.npmjs.com/package/k-sdd?activeTab=readme)
[![install size](https://packagephobia.com/badge?p=k-sdd)](https://packagephobia.com/result?p=k-sdd)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

- Claude Code / Cursor IDE / Gemini CLI / Codex CLI / GitHub Copilot / Qwen Code / Windsurf를 프로토타입 단계에서 프로덕션 사양 기반으로 전환합니다. 요구사항, 설계, 태스크, 프로젝트 메모리를 팀 워크플로우에 맞게 커스터마이즈할 수 있습니다.

- **Kiro 호환** — Kiro IDE와 유사한 Spec-Driven / AI-DLC 스타일을 제공하며, 기존 Kiro 사양 문서도 그대로 사용할 수 있습니다.

**v1.0.0 기능**
- ✅ **리뷰하기 쉬운 설계 문서** — 구조화 포맷과 요약 테이블로 리뷰 시간을 5배 단축
- ✅ **Research 분리** — 조사 메모(Research.md)와 최종 설계(Design.md)를 분리 관리
- ✅ **품질 게이트** — validate-gap / validate-design / validate-impl 명령으로 코딩 전 통합 문제를 사전 감지
- ✅ **1회성 커스터마이즈** — 템플릿을 팀 프로세스에 맞게 한 번만 조정하면 모든 에이전트에 동일 적용
- ✅ **통합 워크플로우** — 7개 에이전트 × 12개 언어에서 동일한 11단계 커맨드 프로세스 공유

> 설치방법이 필요한 경우 [설치](#-설치)로 이동합니다. 

Claude Code, Cursor IDE, Gemini CLI, Codex CLI, GitHub Copilot, Qwen Code, Windsurf를 **AI-DLC(AI Driven Development Life Cycle) 기반으로 전환**합니다.
**AI 네이티브 프로세스 + 최소한의 인간 승인 게이트**: AI가 실행을 주도하고, 인간은 각 단계에서 중요한 판단만 검증합니다.

## 🚀 설치
```bash
# 기본 설치 (기본값: 영어, Claude Code)
npx k-sdd@latest

# 언어 옵션 (기본값: --lang en)
npx k-sdd@latest --lang ko    # 한국어
npx k-sdd@latest --lang es    # 스페인어
...(지원언어: en, ko, ja, zh-TW, zh, es, pt, de, fr, ru, it, ar)

# 에이전트 옵션 (기본값: claude-code / --claude)
npx k-sdd@latest --claude --lang ko        # Claude Code(11가지 명령, 대응 언어는 임의)
npx k-sdd@latest --claude-agent --lang ko  # Claude Code Subagents(12가지 명령 + 9 서브에이전트)
npx k-sdd@latest --cursor --lang ko        # Cursor IDE
npx k-sdd@latest --gemini --lang ko        # Gemini CLI
npx k-sdd@latest --codex --lang ko         # Codex CLI
npx k-sdd@latest --copilot --lang ko       # GitHub Copilot
npx k-sdd@latest --qwen --lang ko          # Qwen Code
npx k-sdd@latest --windsurf --lang ko      # Windsurf IDE

# 참고: 참고: @next는 향후 알파/베타 버전용
```
## 🌐 지원언어

| 언어 | 코드 |  |
|------|--------|------|
| 영어 | `en` | 🇬🇧 |
| 한국어 | `ko` | 🇰🇷 |
| 일본어 | `ja` | 🇯🇵 |
| 중국어 번체 | `zh-TW` | 🇹🇼 |
| 중국어 간체 | `zh` | 🇨🇳 |
| 스페인어 | `es` | 🇪🇸 |
| 포르투칼어 | `pt` | 🇵🇹 |
| 독일어 | `de` | 🇩🇪 |
| 프랑스어 | `fr` | 🇫🇷 |
| 러시아어 | `ru` | 🇷🇺 |
| 이탈리아어 | `it` | 🇮🇹 |
| 아랍어 | `ar` | 🇸🇦 |

사용 방법: npx k-sdd@latest --lang <코드>

## ✨ 퀵스타트

### 신규 프로젝트인 경우
```bash
# AI 에이전트를 실행하고, 즉시 스펙주도개발(Spec-Driven Development)을 시작
/kiro:spec-init OAuth로 사용자 인증 시스템 구축           # AI가 구조화된 계획을 생성
/kiro:spec-requirements auth-system                 # AI가 명확화를 위한 질문
/kiro:spec-design auth-system                       # 사람이 검증, AI가 설계
/kiro:spec-tasks auth-system                        # 구현 태스크로 분해
/kiro:spec-impl auth-system                         # TDD로 실행

![design.md - System Flow Diagram](https://aivibecoding.kr/design-system_flow.png)
*설계 단계 `design.md`에서의 시스템 플로우 예시*

### 기존 프로젝인 경우 (권장)
```bash
# 먼저 프로젝트 컨텍스트를 확립한 뒤 개발을 진행
/kiro:steering                                      # AI가 기존 프로젝트 컨텍스트를 학습

/kiro:spec-init 기존 인증에 OAuth 추가                  # AI가 확장 계획을 생성
/kiro:spec-requirements oauth-enhancement           # AI가 명확화를 위한 질문
/kiro:validate-gap oauth-enhancement                # 옵션: 기존 기능과 요구사항을 분석
/kiro:spec-design oauth-enhancement                 # 사람이 검증, AI가 설계
/kiro:validate-design oauth-enhancement             # 옵션: 설계 통합을 검증
/kiro:spec-tasks oauth-enhancement                  # 구현 태스크로 분해
/kiro:spec-impl oauth-enhancement                   # TDD로 실행
```

**30초 셋업** → **AI 구동 ‘볼트’(스프린트가 아니라)** → **시간 단위 결과**

### k-sdd를 선택하는 이유
1. **사양이 단일 정보원(Single Source of Truth)**: 요구사항, 설계, 태스크, Supporting References까지 한 세트로 정리되어 승인 속도가 빨라집니다.
2. **Greenfield / Brownfield 모두 대응**: 신규 기능은 minutes 단위로 시작, 기존 시스템은 validate 계열 커맨드와 Project Memory로 안전하게 확장합니다.
3. **여러 에이전트를 동시에 활용**: Claude / Cursor / Codex / Gemini / Copilot / Qwen / Windsurf가 동일한 템플릿/룰을 공유합니다.
4. **커스터마이즈는 한 번만**: `.kiro/settings/templates/`와 `.kiro/settings/rules/`를 수정하면 모든 에이전트에 즉시 반영됩니다.

## 주요 기능

- **AI-DLC 방식**: 사람 승인 포함 AI 네이티브 프로세스입니다. 코어 패턴: AI 실행, 사람 검증
- **사양 우선 개발(Spec-First)**: 포괄적 사양을 단일 정보원으로 삼아 라이프사이클 전체를 구동
- **‘볼트’(스프린트가 아니라)**: [AI-DLC](https://aws.amazon.com/ko/blogs/tech/ai-driven-development-life-cycle/)로 주 단위 스프린트를 대체하는 시간/일 단위 집중 사이클입니다. 관리 오버헤드 70%에서 탈출
- **영속적 프로젝트 메모리**: AI가 스티어링 문서를 통해 모든 세션에 걸쳐 포괄적 컨텍스트(아키텍처, 패턴, 룰, 도메인 지식)를 유지
- **템플릿 유연성**: `{{KIRO_DIR}}/settings/templates`（steering / requirements / design / tasks）를 팀 문서 형식에 맞게 커스터마이즈 가능
- **AI 네이티브 + 사람 게이트**: AI 계획 → AI 질문 → 사람 검증 → AI 구현(품질 관리 포함 고속 사이클)
- **팀 대응**: 품질 게이트 포함 12개 언어 대응의 크로스플랫폼 표준 워크플로우

## 지원 AI 에이전트

| 에이전트 | 상태 | 커맨드 수 |
|-------|--------|----------|
| **Claude Code** | ✅ 완전 지원 | 11개 슬래시 커맨드 |
| **Claude Code Subagents** | ✅ 완전 지원 | 12개 커맨드 + 9개 서브에이전트 |
| **Cursor IDE** | ✅ 완전 지원 | 11개 커맨드 |
| **Gemini CLI** | ✅ 완전 지원 | 11개 커맨드 |
| **Codex CLI** | ✅ 완전 지원 | 11개 프롬프트 |
| **GitHub Copilot** | ✅ 완전 지원 | 11개 프롬프트 |
| **Qwen Code** | ✅ 완전 지원 | 11개 커맨드 |
| **Windsurf IDE** | ✅ 완전 지원 | 11개 워크플로우 |
| 기타(Factory AI Droid) | 예정 | - |

## 커맨드

### 사양 기반 개발 워크플로우(Specs)
```bash
/kiro:spec-init <description>             # 기능 사양을 초기화
/kiro:spec-requirements <feature_name>    # 요구사항을 생성
/kiro:spec-design <feature_name>          # 기술 설계를 작성
/kiro:spec-tasks <feature_name>           # 구현 태스크로 분해
/kiro:spec-impl <feature_name> <tasks>    # TDD로 실행
/kiro:spec-status <feature_name>          # 진행 상황을 확인
```
> **사양을 기반으로**: [Kiro의 사양기반방식](https://kiro.dev/docs/specs/)에 기반: 사양이 애드혹 개발을 체계적인 워크플로우로 변환하고, 명확한 AI-사람 협업 포인트를 통해 아이디어에서 구현까지 연결합니다.

> **Kiro IDE통합**: 생성된 사양은[Kiro IDE](https://kiro.dev)에서 사용/구현도 가능: 강화된 구현 가드레일과 팀 협업 기능을 활용할 수 있습니다.

### 기존 코드에 대한 품질 향상(옵션 - 브라운필드 개발)
```bash
# spec-design 전(기존 기능과 요구사항 분석):
/kiro:validate-gap <feature_name>         # 기존 기능과 요구사항의 갭을 분석

# spec-design 후(기존 시스템과의 설계 검증):
/kiro:validate-design <feature_name>      # 기존 아키텍처와의 설계 호환성을 리뷰
```

> **브라운필드 개발용 옵션**: `validate-gap`은 기존과 필요한 기능을 분석하고, `validate-design`은 통합 호환성을 확인합니다. 둘 다 기존 시스템을 위한 옵션 품질 게이트입니다.

### 프로젝트 메모리와 컨텍스트(필수)
```bash
/kiro:steering                            # 프로젝트 메모리와 컨텍스트를 생성/갱신
/kiro:steering-custom                     # 전문 도메인 지식을 추가
```

> **중요한 기반 커맨드**: 스티어링은 영속적 프로젝트 메모리를 생성 - AI가 모든 세션에서 사용하는 컨텍스트, 룰, 아키텍처. 기존 프로젝트에서는 **먼저 실행하면 사양 품질**이 극적으로 향상됩니다. 

## 커스터마이즈

`{{KIRO_DIR}}/settings/templates/`의 템플릿을 편집해 워크플로우에 맞출 수 있습니다. 코어 구조(요구사항 번호, 체크박스, 헤딩)는 유지하면서 팀 컨텍스트를 추가하면 — AI가 자동으로 적응합니다.

**자주 하는 커스터마이즈**:
- **PRD 스타일 요구사항**: 비즈니스 컨텍스트와 성공 지표 포함
- **프론트엔드/백엔드 설계**: React 컴포넌트나 엔드포인트 사양에 최적화
- **승인 게이트**: 보안, 아키텍처, 컴플라이언스 리뷰용
- **JIRA/Linear 대응 태스크**: 견적, 우선순위, 라벨 포함
- **도메인 스티어링**: - API 표준, 테스트 규약, 코딩 가이드라인

📖 **[커스터마이즈 가이드](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/customization-guide.md)** — 7가지 실전 예시와 복붙 가능한 스니펫

## 설정

```bash
# 언어와 플랫폼
npx k-sdd@latest --lang ko            # macOS / Linux / Windows(자동 감지)
npx k-sdd@latest --lang ko --os mac   # 레거시 플래그로서 선택 지정 가능

# 안전한 작업
npx k-sdd@latest --dry-run --backup

# 커스텀 디렉터리
npx k-sdd@latest --kiro-dir docs
```

## 프로젝트 구조

설치 후 프로젝트에 아래가 추가됩니다:

```
project/
├── .claude/commands/kiro/    # 11개 슬래시 커맨드
├── .codex/prompts/           # 11개 프롬프트 커맨드(Codex CLI)
├── .github/prompts/          # 11개 프롬프트 커맨드(GitHub Copilot)
├── .windsurf/workflows/      # 11개 워크플로우 파일(Windsurf IDE)
├── .kiro/settings/           # 공통 룰과 템플릿({{KIRO_DIR}} 확장)
├── .kiro/specs/              # 기능 사양서
├── .kiro/steering/           # AI 가이드 룰
└── CLAUDE.md (Claude Code)   # 프로젝트 설정
```

> 참고: 실제로 생성되는 것은 설치한 에이전트에 해당하는 디렉터리만입니다. 위 트리는 모든 에이전트 기준 예시입니다.

## 문서 & 지원

- 커맨드 레퍼런스: [한국어](../../docs/guides/ko/command-reference.md) | [English](../../docs/guides/command-reference.md)
- 커스터마이즈 가이드: [한국어](../../docs/guides/ko/customization-guide.md) | [English](../../docs/guides/customization-guide.md)
- 사양 주도 개발 가이드: [한국어](../../docs/guides/ko/spec-driven.md) | [English](../../docs/guides/spec-driven.md)
- Claude 서브에이전트 가이드: [한국어](../../docs/guides/ko/claude-subagents.md) | [English](../../docs/guides/claude-subagents.md)
- 마이그레이션 가이드: [한국어](../../docs/guides/ko/migration-guide.md) | [English](../../docs/guides/migration-guide.md)
- **[이슈 및 지원](https://github.com/gaebalai/k-sdd/issues)** - 버그 리포트 및 질문
- **[Kiro IDE](https://kiro.dev)**

---

**안정판 릴리스 v1.0.0** - 프로덕션 환경 대응. [문제보고](https://github.com/gaebalai/k-sdd/issues) | MIT License

### 플랫폼 지원
- 지원 OS: macOS / Linux / Windows(통상 자동 감지).
- 모든 OS에 대해 통합 커맨드 템플릿을 제공합니다. `--os` 지정은 하위 호환을 위한 선택 옵션입니다.

> **참고:** `--os`플래그를 지정해도 동작하지만, 현재는 전 플랫폼 공통 템플릿이 전개됩니다.

## License

MIT License
