# k-sdd 빠른 시작 가이드

승인된 스펙(Spec)을 장기 자율 구현으로 전환하는 에이전틱 SDLC 워크플로우. 한 번의 설치로 8개 AI 코딩 에이전트에 동일한 17개 Skill을 배포합니다.

## 1. k-sdd란?

- **Kiro 스타일 Spec-Driven Development**를 에이전틱 SDLC로 구현한 도구.
- **Spec = 시스템 부분 간의 계약**. 코드가 진실의 원천(source of truth), 스펙은 경계(boundary)를 명시.
- 스펙 작성은 에이전트가, 단계별 게이트 승인은 사람이, 실제 출하는 코드가 담당.

## 2. 설치 (30초)

```bash
cd your-project
npx k-sdd@latest
```

기본값: **Claude Code Skills + 영문 문서**. 다른 에이전트나 언어로 설치하려면:

```bash
npx k-sdd@latest --claude-skills --lang ko    # Claude Code, 한국어
npx k-sdd@latest --codex-skills --lang ko     # Codex, 한국어
npx k-sdd@latest --cursor-skills --lang zh-TW # Cursor, 번체 중문
```

지원 에이전트: Claude Code · Codex (Stable) · Cursor · Copilot · Windsurf · OpenCode · Gemini CLI · Antigravity (Beta).
지원 언어: en, ko, zh-TW, zh, es, pt, de, fr, ru, it, ja, ar, el.

미리보기:

```bash
npx k-sdd@latest --dry-run    # 변경 사항만 확인
```

## 3. 핵심 명령어 한눈에 보기

| 단계         | 명령어                                                                            | 역할                                                            |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| 0. 스티어링(선택) | `/kiro-steering`, `/kiro-steering-custom`                                      | 프로젝트 전반 규칙·컨텍스트를 `.kiro/steering/`에 저장                         |
| 1. 디스커버리    | `/kiro-discovery "아이디어"`                                                       | 어떤 경로로 갈지 라우팅 (확장/직접 구현/단일 스펙/멀티 스펙). `brief.md`, `roadmap.md` 작성 |
| 2. 스펙 작성    | `/kiro-spec-quick {feature}` 또는 `init → requirements → design → tasks` 단계별 실행 | 요구사항 → 설계 → 작업으로 3단계 게이트 진행                                   |
| 3. 검증(선택)   | `/kiro-validate-gap`, `/kiro-validate-design`                                  | 기존 코드와의 갭 분석 / 디자인 리뷰                                         |
| 4. 구현       | `/kiro-impl {feature}`                                                         | TDD(RED→GREEN) + 독립 리뷰 + 자동 디버그를 태스크별로 자율 수행                   |
| 5. 진행 확인    | `/kiro-spec-status {feature}`                                                  | 어느 단계까지 완료됐는지 점검                                              |

## 4. 가장 빠른 워크플로우 (단일 기능)

```bash
# 에이전트 안에서
/kiro-discovery 사진 앨범 - 업로드, 태그, 공유 기능
# → brief.md 작성 후 다음 명령 추천

/kiro-spec-init photo-albums
/kiro-spec-requirements photo-albums   # EARS 형식 요구사항
/kiro-spec-design photo-albums         # Mermaid + File Structure Plan
/kiro-spec-tasks photo-albums          # 경계/의존성 주석이 달린 태스크

/kiro-impl photo-albums                # 자율 구현 시작
```

`/kiro-impl`은 태스크 1개씩:
1. 새 implementer 서브에이전트 spawn → TDD RED → GREEN (피처 플래그 뒤)
2. 독립 reviewer가 검증
3. 막히거나 reviewer가 두 번 거절하면 깨끗한 컨텍스트로 자동 디버그 진입
4. 학습 사항은 `tasks.md`의 `## Implementation Notes`로 다음 태스크에 전달

중단되어도 안전하게 재실행 가능.

## 5. 흔한 시나리오별 경로

| 하고 싶은 일               | 경로                                                                             |
| --------------------- | ------------------------------------------------------------------------------ |
| 새 기능/제품 시작            | `discovery → spec-init → requirements → design → tasks → impl`                |
| 기존 시스템 확장             | `steering → discovery → (validate-gap) → design → tasks → impl`               |
| 큰 이니셔티브를 다중 스펙으로 분해   | `discovery → spec-batch` (의존성 wave 단위로 병렬 스펙 생성, 교차 리뷰 포함)                    |
| 작은 변경을 스펙 없이 바로 구현    | `discovery → 직접 구현`                                                            |
| 빠르게 한 번에 진행 (인간 게이트 생략) | `spec-quick {feature} --auto` 또는 단계별 명령에 `-y` 추가                                |

## 6. 프로젝트 구조 (설치 후)

```
project/
├── .claude/skills/        # 17개 Skill (선택한 에이전트 디렉터리에 설치)
├── .kiro/
│   ├── settings/
│   │   ├── templates/     # requirements/design/tasks 템플릿
│   │   └── rules/         # AI 생성 원칙 및 판단 기준
│   ├── specs/             # 기능별 스펙 ({{feature}}/requirements.md 등)
│   └── steering/          # 프로젝트 전역 가이드 (product.md, tech.md, structure.md)
└── CLAUDE.md / AGENTS.md  # 에이전트 설정
```

`{{KIRO_DIR}}/settings/templates/`와 `rules/`를 편집해 팀 워크플로우(예: PRD형 요구사항, JIRA 연동, 도메인 표준)에 맞게 커스터마이즈할 수 있습니다.

## 7. 운영 규칙 (놓치면 손해 보는 것들)

- **3단계 승인**: Requirements → Design → Tasks → Implementation. 각 단계마다 사람의 리뷰가 기본.
- **`-y` 플래그는 의도적으로만**: 빠른 트랙이 필요할 때만 게이트 스킵.
- **언어 일관성**: 스펙 문서(`requirements.md`, `design.md`, `tasks.md` 등)는 `spec.json.language`에 설정된 언어로 작성됨.
- **경계 우선 규율**: `design.md`의 File Structure Plan이 태스크 경계를 결정. `_Boundary:_`/`_Depends:_` 주석을 신뢰.
- **Skill은 적극 사용**: "1%라도 적용 가능성이 있으면 호출". `kiro-review`, `kiro-debug`, `kiro-verify-completion` 등.

## 8. 진행 상황과 디버깅

```bash
/kiro-spec-status photo-albums    # 어느 단계까지 왔는지
/kiro-validate-impl photo-albums  # 구현 후 독립 재검증
```

문제가 생기면 `kiro-debug` Skill이 루트 원인 우선으로 분석합니다. 완료 선언 전에는 `kiro-verify-completion` Skill이 새 증거(테스트 통과 등)를 요구하여 거짓 성공을 차단합니다.

## 9. 더 깊이 알고 싶다면

- [Skill Reference](guides/skill-reference.md) — Skills 모드 워크플로우와 `/kiro-impl` 내부 동작
- [Spec-Driven Guide](guides/spec-driven.md) — 요구사항부터 구현까지의 방법론
- [Customization Guide](guides/customization-guide.md) — 템플릿과 룰 커스터마이즈 예시
- [Why k-sdd?](guides/why-k-sdd.md) — 설계 철학과 사용/비사용 기준
- [Migration Guide](guides/migration-guide.md) — v1.x/v2.x → v3.0 업그레이드 경로
- 한국어 가이드는 [docs/guides/ko/](guides/ko/) 참고

## 10. 한 줄 요약

> `npx k-sdd@latest` → 에이전트에서 `/kiro-discovery <아이디어>` → 추천대로 따라가면 됩니다. 막히면 `/kiro-spec-status`.
