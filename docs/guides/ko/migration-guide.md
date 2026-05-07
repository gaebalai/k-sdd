# k-sdd 마이그레이션 가이드

> 📖 **English guide:** [Migration Guide](../migration-guide.md)

v1계(특히 1.1.5)와 v2.0.0은, **명령어나 agentic SDLC의 기본 사상은 공통**이지만, 설계 템플릿이나 스티어링(steering)의 구조가 대폭 변경되어 있다. 이 가이드에서는, "v1.1.5를 그대로 계속 사용한다"인지, "비연속적인 업데이트로 받아들이고 v2로 이행한다"인지의 선택지를 제시한다. 후자를 선택한 경우에, 템플릿과 룰(rules)을 사용해 신속하게 커스터마이즈를 수행하는 절차를 해설한다.

---

## TL;DR – 어느 쪽을 선택할 것인가?

| 목적                                                                                                       | 권장 액션                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 기존의 1.x계 워크플로를 유지하고 싶다                                                                      | `npx k-sdd@1.1.5`를 명시적으로 지정하고, 구버전의 CLI를 계속 이용한다. 에이전트 고유의 프롬프트를 직접 편집하는 종래의 스타일을 유지할 수 있지만, 이용 가능한 명령어는 종래의 8개에 한정된다. |
| 8종류의 에이전트에서 공통의 템플릿이나, 조사(Research)와 설계(Design)의 분리와 같은 신기능을 이용하고 싶다 | `npx k-sdd@latest`(v2.0.0 상당)를 재인스톨하고, `.kiro/settings/templates/*`와 `rules/`만을 커스터마이즈한다. 이로써, `validate-*` 명령어군을 포함한 전체 11개 명령어가 이용 가능해진다.      |

> ⚠️ 1.x계와 2.x계의 `.kiro` 디렉터리 구성의 혼재는 권장되지 않는다. 리포지토리나 브랜치 단위로, 사용하는 버전을 어느 한쪽으로 고정할 것.

### 변하지 않는 것

- 기존의 `.kiro/specs/<feature>/` 디렉터리는, 그대로 이용 가능하다. 필요하다면, 새로운 템플릿을 사용하여 재생성하면 된다.
- `.kiro/steering/` 디렉터리(또는 단일의 `steering.md` 파일)의 내용은, 종래대로 프로젝트 메모리(Project Memory)로서 읽혀 들어간다.
- 11개의 명령어군(`spec-*`, `validate-*`, `steering*`)과, "사양→설계→태스크→구현"이라는 큰 흐름의 개발 프로세스는 공통이다. 주요 변경점은, 템플릿 내부가 agentic하고 just-in-time한 설계 사상에 기반하여 일신된 것에 있다.

---

## 1. k-sdd 1.1.5를 계속 사용한다 (폴백)

1.1.5는 `@latest` 태그의 대상 외이지만, 버전을 직접 지정함으로써 호출 가능하다.

```bash
npx k-sdd@1.1.5 --claude-code  # 예: Claude Code (구 플래그명)
npx k-sdd@1.1.5 --lang ko      # 종래의 언어 옵션
```

- `.claude/commands/*`나 `.cursor/prompts/*`와 같은 에이전트 고유의 디렉터리를 직접 편집하는, 종래의 운용을 계속할 수 있다.
- 에이전트 고유의 디렉터리(예: `.claude/commands/*`)도, v1의 구조가 그대로 유지된다.
- 다만, 신기능은 `@latest`(v2계)에만 추가되며, v1.1.5로의 백포트는 이루어지지 않는다.
- `/kiro:validate-gap`, `/kiro:validate-design`, `/kiro:validate-impl`과 같은 검증 명령어는 v1.1.5에는 존재하지 않는다. 이들 기능이 필요한 경우는, v2로의 이행이 필수가 된다.

---

## 2. v2.0.0으로 진행하는 메리트

> 기본적인 흐름(사양 책정 → 설계 → 태스크화 → 구현 + 검증)은 불변이다. **주요 변경점은, 커스터마이즈의 대상 개소와, 생성되는 설계서의 구조화의 정도**에 있다.

- **템플릿과 룰에 의한 일원적인 커스터마이즈**: 명령어의 프롬프트를 직접 편집할 필요는 없어지고, `.kiro/settings/templates/`와 `.kiro/settings/rules/`를 수정하는 것만으로, 모든 에이전트에 설정이 반영된다.
- **사양 주도 개발(Spec-Driven Development)의 일관성 향상**: `research.md`가 조사 로그, `design.md`가 리뷰 가능한 일차 정보(요약, 요구사항 커버리지, 참고 문헌, 적절한 입도로 조정된 컴포넌트 정의 등)로서, 각각의 역할을 명확히 담당한다.
- **프로젝트 메모리로서의 스티어링**: `.kiro/steering/*.md`처럼, 도메인 지식을 여러 파일로 분할하여 체계적으로 관리할 수 있게 되었다.
- **기존 프로젝트(Brownfield)에의 안전한 기능 추가**: `/kiro:validate-gap`, `validate-design`, `validate-impl`과 같은 검증 명령어나, 조사와 설계의 분리에 의해, 기존 기능의 추가·개수 시의 안전성이 향상된다.
- **v2에서 대응하는 8종류의 에이전트에서 공통의 체험**: Claude Code, Cursor, Codex CLI, Gemini CLI, GitHub Copilot, Qwen Code, OpenCode, Windsurf가 같은 11개 명령어를 공유한다. 이로써, 예를 들어 Claude와 Cursor를 병용하는 경우에도, 추가의 템플릿 수정은 불필요하다. Claude Code에서는, `spec-quick`에 서브에이전트를 짜 넣는 `--claude-agent` 옵션도 선택할 수 있다.

---

## 3. v2.0.0으로의 이행 단계

1. **백업**

   ```bash
   cp -r .kiro .kiro.backup
      cp -r .claude .claude.backup   # 이용 중인 에이전트에 따라 백업
   ```

2. **v2를 클린 인스톨(대화적 옵션을 활용)**

   ```bash
   npx k-sdd@latest                 # 디폴트 (Claude Code)
   npx k-sdd@latest --cursor        # 그 외 에이전트
   npx k-sdd@latest --claude-agent  # Subagents 모드
   ```

   - 인스톨러가 파일군별로 "덮어쓰기(overwrite)" "추기(append)" "보존(keep)" 중 어느 것을 선택할지 묻는다. 기존의 스티어링 정보나 사양서를 유지하고 싶은 경우는 "keep"을, 차분을 추가하고 싶은 경우는 "append"를 선택할 수 있다.

3. **템플릿／rules의 재생성 & 차분 머지**
   - 신구성: `.kiro/settings/templates/` (중앙 집약)와 `.kiro/settings/rules/`.
   - 구버전에서 에이전트 고유의 프롬프트에 직접 기술하고 있던 로직은, 필요에 따라 새로운 템플릿이나 룰 파일 측으로 이식할 것.

4. **커스텀 룰을 이식**
   - `.kiro/settings/rules/*.md`에 Markdown 형식으로 룰을 기술하면, 사양, 설계, 태스크 생성의 모든 프로세스에서 그 룰이 참조된다.
   - 종래, 명령어의 프롬프트에 직접 기술하고 있던 가이드라인은, 룰 파일에 집약함으로써, 모든 에이전트 사이에서 공유 가능해진다.

5. **Steering (Project Memory)을 재구성**
   - `project-context.md`나 `architecture.md`처럼, 정보를 목적별로 파일 분할하고, AI가 참조하는 일차 정보로서 정비한다.
   - 조사·설계 페이즈의 템플릿도 스티어링 정보를 참조하므로, 기존의 메모나 각서는 여기로 이행하는 것이 바람직하다.

6. **자동화 스크립트를 갱신**
   - CI/CD 스크립트 등은, 모두 `npx k-sdd@latest`를 기준으로 하도록 통일하고, 구식의 `@next` 지정은 삭제한다.
   - 구버전의 CLI를 직접 실행하고 있던 개소는, v2에서 제공되는 11개의 명령어 (`spec-*`, `validate-*`, `steering*`)를 사용하도록 치환한다.

---

## 4. 구→신 커스터마이즈 대응표

| v1.x에서 편집하고 있던 장소                                                  | v2.0.0에서의 치환처                                                | 포인트                                                                                                                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.claude/commands/spec-design.prompt.md` 등, 에이전트 고유의 명령어 프롬프트 | `.kiro/settings/templates/specs/design.md`                         | `.kiro/settings/templates/`로 통일된 템플릿을 배치한다. 요약(Summary)이나 참고 문헌(Supporting References)이 자동으로 출력되게 된다.                               |
| `.claude/commands/<cmd>.prompt`, `.cursor/prompts/*` 등                      | `.kiro/settings/rules/*.md`                                        | 프롬프트로의 직접적인 지시 기술은 비권장. "～해야 할 것(DO)" "～해서는 안 되는 것(DO NOT)"과 같은 룰을 룰 파일에 기술함으로써, 전체 에이전트가 그 지시를 공유한다. |
| `.kiro/steering/`(단일 파일 또는 여러 파일)                                  | `.kiro/steering/*.md`에 원칙이나 가이드라인을 정리                 | 디렉터리 패스는 같지만, v2에서는 프로젝트 메모리로서의 역할이 강화되어, 여러 파일로의 분할이 권장된다.                                                             |
| `design.md` 내에 직접 기술하고 있던 조사 메모                                | `.kiro/specs/<feature>/research.md`와 `Supporting References` 섹션 | 설계서(Design)는 리뷰 대상의 산출물, 조사 로그(Research)는 보조적인 기록으로서 명확히 분리하고, 설계서의 가독성을 유지한다.                                        |

---

## 5. v2.x → v3.0

> v3.0은 모든 `--*-skills` 인스톨에 적용. 스킬 모드는 8 플랫폼에서 이용 가능: Claude Code, Codex, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, Antigravity. 명령어 베이스의 에이전트(`--claude`, `--cursor` 등)는 계속해서 동작하지만 비권장이며, 장래 삭제 예정.

| 영역               | v2.x                        | v3.0                                                                                            |
| ------------------ | --------------------------- | ----------------------------------------------------------------------------------------------- |
| 스킬 수            | 12-13                       | **17**                                                                                          |
| `/kiro-discovery`  | 기본적인 아이디어 정리      | **라우팅/스코프 정리의 엔트리포인트**; `brief.md`를 작성하고, 필요한 경우만 `roadmap.md`도 작성 |
| `/kiro-spec-batch` | 없음                        | 병렬 멀티스펙 작성 + cross-spec 리뷰                                                            |
| `/kiro-impl`       | `kiro-spec-impl`(단일 패스) | 통합 스킬(implementer + reviewer + debugger)                                                    |
| 실패 시 디버그     | 없음                        | **Debug subagent** — 프레시 컨텍스트로 근본 원인 조사(최대 2라운드)                             |
| 지견 인계          | 없음                        | **Implementation Notes**가 태스크 사이에서 다음 implementer에 주입된다                          |
| Skills 대응        | Claude Code, Codex          | **8 플랫폼**: Claude, Codex, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, Antigravity       |
| TDD                | 기본 TDD                    | **Feature Flag TDD**: RED → GREEN 프로토콜                                                      |
| 세션 영속화        | 없음                        | **`brief.md`**가 세션 사이에서 영속화                                                           |

### 주요 이행 절차

1. **재인스톨**(이용하는 플랫폼의 스킬 모드로):
   ```bash
   npx k-sdd@latest --claude-skills     # Claude Code(디폴트)
   npx k-sdd@latest --codex-skills      # Codex
   npx k-sdd@latest --cursor-skills     # Cursor IDE
   npx k-sdd@latest --copilot-skills    # GitHub Copilot
   npx k-sdd@latest --windsurf-skills   # Windsurf IDE
   npx k-sdd@latest --opencode-skills   # OpenCode
   npx k-sdd@latest --gemini-skills     # Gemini CLI
   npx k-sdd@latest --antigravity       # Antigravity
   ```
2. **레거시 모드에서 이행** — `--claude`, `--cursor`, `--copilot`, `--windsurf`, `--opencode`, `--gemini`는 비권장. `--codex`는 블록 완료. 대응하는 `--*-skills` 플래그를 사용.
3. **`/kiro-discovery`**를 엔트리포인트로 사용 — `brief.md` + `roadmap.md`가 하류 스킬에 인계된다.
4. **`/kiro-spec-batch`**를 멀티 피처 작업에 사용.

---

## 6. FAQ / 트러블슈팅

**Q. v2에서 구버전의 템플릿을 그대로 사용하고 싶다**  
템플릿 파일의 복사는 가능하지만, 요구사항 커버리지(Req Coverage)나 참고 문헌(Supporting References)과 같은 v2의 구조화 데이터가 누락되므로, 생성물의 품질이 저하될 가능성이 있다. 새로운 템플릿으로 내용을 이식하는 편이 안전하다.

**Q. v1.1.5와 v2.0.0을 동일 리포지토리 내에서 전환하여 사용하고 싶다**  
`.kiro` 디렉터리의 구성이 양쪽 버전에서 다르므로, 버전별로 브랜치를 나누거나, `.kiro` 디렉터리 자체를 전환하는 스크립트를 준비할 필요가 있다.

**Q. 템플릿 갱신 후에 최저한 실행해야 할 명령어는?**  
`/kiro:steering`, `/kiro:spec-init`, `/kiro:spec-design` 순서로 한 번 실행하고, 새로운 서식의 조사·설계·태스크 파일이 생성되는 것을 확인한다.

---

## 7. 정리

- **v1.1.5의 계속 이용자**: `npx k-sdd@1.1.5`처럼 버전을 고정하고, 종래대로 템플릿이나 명령어 프롬프트를 직접 편집한다.
- **v2.x의 이용자**: 스킬 모드(`--*-skills`)로의 이행을 권장. 레거시 커맨드 모드는 장래 삭제 예정.
- **v3.0으로의 이행자**: 스킬 모드로 재인스톨하고, `/kiro-discovery` → `/kiro-spec-batch` → `/kiro-impl`의 워크플로를 활용한다. 8 플랫폼 대응, 디버그 자동화, 태스크 사이 지견 인계가 이용 가능.
