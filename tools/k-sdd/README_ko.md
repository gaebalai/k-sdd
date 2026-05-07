# k-sdd: AI 코딩 에이전트를 위한 장시간 사양 주도 구현

[![npm version](https://img.shields.io/npm/v/k-sdd?logo=npm)](https://www.npmjs.com/package/k-sdd?activeTab=readme)
[![install size](https://packagephobia.com/badge?p=k-sdd)](https://packagephobia.com/result?p=k-sdd)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

<div align="center" style="margin-bottom: 1rem; font-size: 1.1rem;"><sub>
<a href="./README.md">English</a> | 한국어 
</sub></div>

**승인된 사양을, 장시간 실행해도 깨지지 않는 자율 구현 워크플로로 바꾼다.** 한 번의 명령으로 agentic SDLC 워크플로를 Agent Skills로 도입한다: discovery, requirements, design, tasks, 그리고 태스크별 independent review가 포함된 자율 구현. 8개의 AI coding agent를 지원하며, 동일한 17-skill 세트로 동작한다.

👻 **Kiro 스타일.** Kiro IDE의 spec-driven / agentic SDLC 스타일. 기존 Kiro 사양서도 그대로 사용할 수 있다.

## v3.0의 새로운 기능

k-sdd v3.0은 Agent Skills와 장시간 자율 구현을 축으로 한 재구축이다.

- **`/kiro-discovery`가 새로운 엔트리 포인트.** discovery는 신규 의뢰를 「기존 spec을 확장 / spec 없이 직접 구현 / 단일 신규 spec / 다수 spec으로 분해 / mixed decomposition」으로 분류한다. `brief.md`와 필요 시 `roadmap.md`를 작성하므로, 세션을 재개해도 scope를 다시 설명하지 않고 이어갈 수 있다.
- **`/kiro-impl`에 의한 장시간 자율 구현.** 각 태스크에 대해 fresh implementer가 feature flag를 통해 TDD (RED → GREEN)로 구현하고, 독립된 reviewer가 기계적으로 검증하며, 실패 시 auto-debug pass가 새로운 컨텍스트에서 근본 원인을 조사한다. 태스크 간 인사이트는 `tasks.md`의 `## Implementation Notes`를 통해 다음 implementer에게 인계된다. 1 iteration = 1 task이며, 중단 후 재실행도 안전하다.
- **경계 중심의 spec discipline.** `design.md`에 File Structure Plan이 포함되어 태스크 경계의 근거가 된다. 태스크에는 `_Boundary:_` / `_Depends:_` 어노테이션이 붙는다. review와 validation은 스타일이 아니라 경계 위반을 본다.
- **`/kiro-spec-batch`로 다수 spec의 병렬 작성.** roadmap에서 다수의 spec을 병렬로 생성하고, cross-spec review로 모순, 책임 중복, 인터페이스 미스매치를 검출한다.
- **8개의 AI coding agent에 Agent Skills 전개.** 17 skills × 8 플랫폼, on-demand 로드 (progressive disclosure). Claude Code와 Codex는 stable, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, Antigravity는 beta. 외부 의존성 없음, 서브에이전트는 각 플랫폼 표준 spawn으로 시작된다.

Skills 모드의 워크플로와 `/kiro-impl` 내부의 상세는 [스킬 레퍼런스](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/skill-reference.md)를 참조.

v1.x / v2.x로부터의 마이그레이션은 [Migration Guide](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/migration-guide.md#5-v2x--v30)를 참조.

## 왜 k-sdd인가

k-sdd는 spec을 시스템 각 부분 사이의 계약으로 다룬다. 에이전트에게 건네는 「명령서」가 아니다. 코드는 여전히 source of truth이며, spec은 코드 각 부분 사이의 계약을 명시화하기 위해 사용한다. 그렇게 함으로써 사람과 에이전트가 항상 동기화하지 않아도 병렬로 움직일 수 있게 된다.

도박은 이렇다. 적절한 입도(粒度)로 명시화된 계약은 팀 규모의 AI 주도 개발을 빠르게 한다. 느리게 하지 않는다. 에이전트가 spec을 작성하고, 사람은 phase gate에서 계약을 승인하며, 출시되는 것은 코드다.

경계는 오버헤드가 아니다. 경계가 있기 때문에 자유롭게 움직일 수 있다.

설계의 근거, 트레이드오프, 적합한 상황과 부적합한 상황의 상세는 [k-sdd라는 도박 (philosophy note)](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/why-k-sdd.md).

## 퀵 스타트

```bash
cd your-project
npx k-sdd@latest
```

기본값으로 **Claude Code Skills**와 영어 문서가 설치된다. 다른 에이전트나 언어를 지정할 경우:

```bash
npx k-sdd@latest --codex-skills --lang ko      # Codex, 한국어
npx k-sdd@latest --cursor-skills --lang zh-TW  # Cursor IDE, 번체 중국어
```

8개의 AI coding agent (Claude Code와 Codex는 stable, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, Antigravity는 beta)와 13개 언어를 지원한다. 전체 목록은 [지원 에이전트](#지원-에이전트)를 참조.

그 다음, 에이전트 위에서:

```bash
/kiro-discovery <하고 싶은 일>
```

어디서부터 시작해야 할지 모르겠다면, 먼저 `kiro-discovery`를 실행한다. 의뢰를 정리하여 다음에 입력할 명령을 알려준다.

### 자주 사용하는 워크플로

| 하고 싶은 일                                    | Skills 모드                                                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 새로운 기능이나 프로덕트 규모의 구상을 시작한다 | `kiro-discovery` → `kiro-spec-init` → `kiro-spec-requirements` → `kiro-spec-design` → `kiro-spec-tasks` → `kiro-impl`                            |
| 기존 시스템을 확장한다                          | `kiro-steering` → `kiro-discovery` 또는 `kiro-spec-init` → 선택적으로 `kiro-validate-gap` → `kiro-spec-design` → `kiro-spec-tasks` → `kiro-impl` |
| 큰 initiative를 분해한다                        | `kiro-discovery` → `kiro-spec-batch`                                                                                                             |
| spec 없이 작은 변경을 넣는다                    | `kiro-discovery` → 직접 구현                                                                                                                     |

레거시의 `/kiro:*` 명령 모드 (`--claude`, `--cursor` 등)도 계속 사용할 수 있지만, 비추천이다. 업그레이드 절차는 [Migration Guide](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/migration-guide.md)를 참조.

규모가 큰 승인된 task set에 대해서는, `kiro-impl`을 실행하면 태스크별 서브에이전트 spawn, independent review, 실패 시 auto-debug가 포함된 자율 구현이 시작된다.

## 실제 동작

예: 신규 Photo Albums 기능을 만든다.

```bash
/kiro-discovery Photo albums with upload, tagging, and sharing
# discovery가 brief.md (멀티 스펙이라면 roadmap.md도)를 작성하고, 다음 명령을 제안한다
/kiro-spec-init photo-albums
/kiro-spec-requirements photo-albums
/kiro-spec-design photo-albums
/kiro-spec-tasks photo-albums
/kiro-impl photo-albums
# 자율 실행: 태스크별 fresh implementer, independent reviewer, auto-debug
```

spec 단계의 전형적인 산출물 (10분 이내):

- `requirements.md`: EARS 형식의 요구사항과 인수 기준.
- `design.md`: Mermaid 다이어그램과 File Structure Plan이 포함된 아키텍처.
- `tasks.md`: 경계와 의존 관계 어노테이션이 붙은 구현 태스크.

이후 `/kiro-impl`이 feature flag를 통한 TDD (RED → GREEN), 독립 reviewer pass, 실패 시 auto-debug와 함께 태스크를 자율 실행한다.

## 지원 에이전트

전 8종의 skills variant는 동일한 17-skill 세트를 배포한다. 차이는 각 플랫폼 통합이 실제 운영에서 얼마나 검증되었는가이다.

| 에이전트           | Skills 모드         | 안정도              | 레거시 모드                                |
| ------------------ | ------------------- | ------------------- | ------------------------------------------ |
| **Claude Code**    | `--claude-skills`   | Stable              | `--claude` / `--claude-agent` (비추천)     |
| **Codex**          | `--codex-skills`    | Stable              | `--codex` (블록됨)                         |
| **Cursor IDE**     | `--cursor-skills`   | Beta                | `--cursor` (비추천)                        |
| **GitHub Copilot** | `--copilot-skills`  | Beta                | `--copilot` (비추천)                       |
| **Windsurf IDE**   | `--windsurf-skills` | Beta                | `--windsurf` (비추천)                      |
| **OpenCode**       | `--opencode-skills` | Beta                | `--opencode` / `--opencode-agent` (비추천) |
| **Gemini CLI**     | `--gemini-skills`   | Beta                | `--gemini` (비추천)                        |
| **Antigravity**    | `--antigravity`     | Beta (experimental) | —                                          |
| **Qwen Code**      | —                   | —                   | `--qwen`                                   |

여기서 "Beta"는 「기능이 부족하다」는 의미가 아니다. 17 skills와 템플릿은 전 8 플랫폼에서 동일하다. 플랫폼 통합 (서브에이전트 spawn 동작, 조작감, `SKILL.md` 로드)이 Claude Code와 Codex에 비해 실제 운영 실적이 적고 엣지 케이스가 남아 있을 가능성이 있다는 의미이다. 문제를 발견한 경우 [Issues](https://github.com/gaebalai/k-sdd/issues)에 보고해 주시면 도움이 된다.

## 설치 상세

### 언어

```bash
npx k-sdd@latest --lang ko    # 한국어
npx k-sdd@latest --lang zh-TW # 번체 중국어
npx k-sdd@latest --lang es    # 스페인어
# 지원 언어: en, ko, zh-TW, zh, es, pt, de, fr, ru, it, ja, ar, el
```

### 레거시 모드 (비추천)

```bash
npx k-sdd@latest --claude        # Claude Code 명령 (--claude-skills 사용)
npx k-sdd@latest --claude-agent  # Claude Code 서브에이전트 (--claude-skills 사용)
npx k-sdd@latest --cursor        # Cursor IDE 명령 (--cursor-skills 사용)
npx k-sdd@latest --copilot       # GitHub Copilot 프롬프트 (--copilot-skills 사용)
npx k-sdd@latest --windsurf      # Windsurf IDE 워크플로 (--windsurf-skills 사용)
npx k-sdd@latest --opencode      # OpenCode 명령 (--opencode-skills 사용)
npx k-sdd@latest --gemini        # Gemini CLI 명령 (--gemini-skills 사용)
npx k-sdd@latest --qwen          # Qwen Code
```

### 고급 옵션

```bash
# 변경 내용을 먼저 미리보기
npx k-sdd@latest --dry-run --backup

# 커스텀 specs 디렉터리
npx k-sdd@latest --kiro-dir docs
```

## 커스터마이즈

`{{KIRO_DIR}}/settings/` 이하의 템플릿과 룰을 편집하여 팀의 워크플로에 맞춘다.

- `templates/`: requirements, design, tasks의 문서 구조.
- `rules/`: AI의 생성 원칙과 판단 기준.

자주 있는 유스케이스: PRD 스타일의 요구사항, API와 데이터베이스 스키마, 승인 게이트, JIRA 연동, 도메인 고유의 표준.

실전 예시와 복붙 가능한 스니펫은 [커스터마이즈 가이드](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/customization-guide.md).

## 프로젝트 구조

설치 후, 프로젝트에 다음이 추가된다:

```
project/
# Skills 모드 (추천): 다음 중 하나가 설치된다
├── .claude/skills/           # 17 skills (Claude Code Skills, 기본)
├── .agents/skills/           # 17 skills (Codex Skills)
├── .cursor/skills/           # 17 skills (Cursor Skills)
├── .github/skills/           # 17 skills (GitHub Copilot Skills)
├── .windsurf/skills/         # 17 skills (Windsurf Skills)
├── .opencode/skills/         # 17 skills (OpenCode Skills)
├── .gemini/skills/           # 17 skills (Gemini CLI Skills)
├── .agent/skills/            # 17 skills (Antigravity Skills)
# 레거시 명령 모드 (비추천)
├── .claude/commands/kiro/    # 11 슬래시 명령 (--claude)
├── .github/prompts/          # 11 프롬프트 명령 (--copilot)
├── .windsurf/workflows/      # 11 워크플로 파일 (--windsurf)
# 프로젝트 메모리와 spec 상태 (공통)
├── .kiro/settings/templates/ # 공통 템플릿 ({{KIRO_DIR}}로 전개)
├── .kiro/settings/rules/     # 공통 룰 (비 skills 에이전트가 사용)
├── .kiro/specs/              # 기능 사양서
├── .kiro/steering/           # AI 지도 문서
└── CLAUDE.md / AGENTS.md     # 프로젝트 설정 (에이전트별)
```

실제로 작성되는 것은 설치한 에이전트에 대응하는 디렉터리뿐이다. 위의 트리는 전체 에이전트 분량을 보여주고 있다.

## 문서

- 스킬 레퍼런스: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/skill-reference.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/skill-reference.md)
- 명령 레퍼런스: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/command-reference.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/command-reference.md)
- 커스터마이즈 가이드: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/customization-guide.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/customization-guide.md)
- 사양 주도 개발 가이드: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/spec-driven.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/spec-driven.md)
- k-sdd라는 도박: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/why-k-sdd.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/why-k-sdd.md)
- Claude Subagents 가이드: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/claude-subagents.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/claude-subagents.md)
- 마이그레이션 가이드: [한국어](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/ko/migration-guide.md) | [English](https://github.com/gaebalai/k-sdd/blob/main/docs/guides/migration-guide.md)
- [Issues & 지원](https://github.com/gaebalai/k-sdd/issues) - 버그 리포트와 질문
- [Kiro IDE](https://kiro.dev)

---

**안정 버전 릴리스 v3.0.0** 프로덕션 환경 대응. [문제 보고](https://github.com/gaebalai/k-sdd/issues) | MIT License

### 플랫폼 지원

- 지원 OS: macOS, Linux, Windows (자동 감지).
- 모든 OS에서 통일된 명령 템플릿을 제공. `--os` 지정은 하위 호환용 선택 옵션.
