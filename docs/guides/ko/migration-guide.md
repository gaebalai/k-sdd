# k-sdd 마이그레이션 가이드

> 📖 **English guide:** [Migration Guide](../migration-guide.md)

v0.5계열과 v1.0.0은 **AI-DLC의 커맨드와 기본 사상은 공통**이지만, 설계 템플릿과 스티어링(steering)의 구조가 크게 변경되었다.
이 가이드는 “v0.5.0을 그대로 계속 사용할 것인지”, 또는 **“비연속적인 업데이트로 받아들이고 v1로 이동할 것인지”**라는 선택지를 제시한다.
후자를 선택한 경우, 템플릿과 룰(rules)을 사용해 빠르게 커스터마이징하는 절차를 설명한다.

---

## TL;DR – 무엇을 선택할 것인가?

| 목적 | 권장 액션 |
| --- | --- |
| 기존 0.5.x 계열 워크플로우를 유지하고 싶다 | `npx k-sdd@0.5.0`를 명시적으로 지정해 구버전 CLI를 계속 사용한다. 에이전트별 프롬프트를 직접 수정하는 기존 스타일을 유지할 수 있으나, 사용 가능한 커맨드는 기존 8개로 제한된다. |
| 7종 에이전트 공통 템플릿, 조사(Research)와 설계(Design) 분리 등 신규 기능을 활용하고 싶다 | `npx k-sdd@latest`(v1.0.0상당)를 재설치하고 `.kiro/settings/templates/*`와 `rules/`만 커스터마이징한다. 이를 통해 `validate-*`커맨드를 포함한 전체 11개 커맨드를 사용할 수 있다. |

> ⚠️ 0.5.x 계열과 1.x 계열의 `.kiro` 디렉터리 구조를 혼용하는 것은 권장되지 않는다.
리포지토리 또는 브랜치 단위로, 사용할 버전을 하나로 고정하는 것을 권장한다.

### 변하지 않는 것들

- 기존 `.kiro/specs/<feature>/` 디렉터리는 그대로 사용할 수 있다. 필요하다면 새로운 템플릿으로 재생성하면 된다.
- `.kiro/steering/` 디렉터리(또는 단일 `steering.md` 파일)의 내용은 기존과 동일하게 프로젝트 메모리(Project Memory)로 로드된다.
- 11개의 AI-DLC 커맨드(`spec-*`, `validate-*`, `steering*`）)와 “사양 → 설계 → 태스크 → 구현”이라는 큰 개발 흐름은 공통이다. 주요 변경점은 템플릿 내부가 Agentic(자율적)이고 Just-in-Time한 설계 사상을 기반으로 재설계되었다는 점이다.

---

## 1. k-sdd 0.5.0를 계속 사용하는 경우 (폴백)

0.5.0은 `@latest` 태그 대상은 아니지만, 버전을 직접 지정하면 실행할 수 있다.

```bash
npx k-sdd@0.5.0 --claude-code  # 예: Claude Code (구 플래그명)
npx k-sdd@0.5.0 --lang ko      # 기존 언어 옵션
```

- `.claude/commands/*`, `.cursor/prompts/*`등 에이전트별 디렉터리를 직접 편집하는 기존 운영 방식을 유지할 수 있다.
- 에이전트 전용 디렉터리(예:`.claude/commands/*`)도 v0.5 구조 그대로 유지된다.
- 단, 신규 기능은 `@latest`(v1 계열)에만 추가되며 v0.5.0로 백포트되지 않는다.
- `/kiro:validate-gap`, `/kiro:validate-design`, `/kiro:validate-impl`같은 검증 커맨드는 v0.5.0에 존재하지 않는다. 해당 기능이 필요하다면 v1로의 이동이 필수다.

---

## 2. v1.0.0으로 이동하는 장점

> AI-DLC의 기본 흐름(사양 정의 → 설계 → 태스크화 → 구현 + 검증)은 변하지 않는다. **주요 변화는 커스터마이징 대상 위치와, 생성되는 설계 문서의 구조화 수준**이다.

- **템플릿과 룰을 통한 중앙집중형 커스터마이징**: 커맨드 프롬프트를 직접 수정할 필요가 없으며, `.kiro/settings/templates/`와 `.kiro/settings/rules/`만 수정하면 모든 에이전트에 설정이 반영된다.
- **사양 주도 개발(Spec-Driven Development)의 일관성 강화**: `research.md` 는 조사 로그,`design.md`는 리뷰 가능한 1차 산출물(요약, 요구사항 커버리지, 참고 문헌, 적절한 단위로 분해된 컴포넌트 정의 등)로 역할이 명확히 분리된다.
- **프로젝트 메모리로서의 스티어링 강화**: `.kiro/steering/*.md`형태로 도메인 지식을 여러 파일로 분리해 체계적으로 관리할 수 있다.
- **기존 프로젝트(Brownfield)에 대한 안전한 기능 추가**: `/kiro:validate-gap`,`validate-design`, `validate-impl`같은 검증 커맨드와 조사·설계 분리를 통해, 기존 기능 확장이나 수정 시 안정성이 크게 향상된다.
- **7종 에이전트에서 동일한 사용자 경험**: Claude Code、Subagents、Cursor、Codex CLI、Gemini CLI、GitHub Copilot、Qwen Code、Windsurf가 동일한 11개 커맨드를 공유한다. 예를 들어 Claude와 Cursor를 병행 사용해도 추가 템플릿 수정이 필요 없다.

---

## 3. v1.0.0으로의 마이그레이션 절차

1. **백업**
   ```bash
   cp -r .kiro .kiro.backup
      cp -r .claude .claude.backup   # 사용 중인 에이전트에 따라 백업
   ```

2. **v1 클린 설치 (대화형 옵션 활용)**
   ```bash
   npx k-sdd@latest                 # 기본 (Claude Code)
   npx k-sdd@latest --cursor        # 다른 에이전트
   npx k-sdd@latest --claude-agent  # Subagents 모드
   ```
   - 설치 과정에서 파일 단위로 “덮어쓰기(overwrite)”, “추가(append)”, “유지(keep)” 중 하나를 선택하도록 안내된다. 기존 스티어링 정보나 사양 문서를 유지하려면 “keep”, 차이를 병합하려면 “append”를 선택한다.

3. **템플릿 / rules 재생성 및 차이 병합**
   - 신규 구조: `.kiro/settings/templates/`(중앙 관리), `.kiro/settings/rules/`
   - 기존 버전에서 에이전트 프롬프트에 직접 작성했던 로직은 필요에 따라 템플릿 또는 룰 파일로 이전한다.

4. **커스텀 룰 이관**
   - `.kiro/settings/rules/*.md`에 Markdown으로 룰을 작성하면, 사양·설계·태스크 생성 전 과정에서 해당 룰이 참조된다.
   - 과거에 커맨드 프롬프트에 직접 작성하던 가이드는 룰 파일로 집약함으로써 모든 에이전트에서 공유 가능해진다.

5. **Steering(Project Memory) 재구성**
   - `project-context.md`, `architecture.md`처럼 목적별로 파일을 분리해, AI가 참조하는 1차 정보로 정리한다.
   - 조사/설계 템플릿 역시 스티어링 정보를 참조하므로, 기존 메모나 메모장은 이 위치로 이동하는 것이 바람직하다.

6. **자동화 스크립트 업데이트**
   - CI/CD 스크립트 등은 `npx k-sdd@latest`기준으로 통일하고, 구식 `@next` 지정은 제거한다.
   - 이전 CLI를 직접 호출하던 부분은 v2의 11개 커맨드(`spec-*`, `validate-*`, `steering*`)로 교체한다.

---

## 4. 구버전 → 신버전 커스터마이징 대응표

| v0.5.x에서 수정하던 위치 | v1.0.0에서의 대체 위치 | 포인트 |
| --- | --- | --- |
| `.claude/commands/spec-design.prompt.md`등 에이전트별 커맨드 프롬프트 | `.kiro/settings/templates/specs/design.md` | `.kiro/settings/templates/`로 통합 관리. 요약(Summary), 참고 문헌(Supporting References)이 자동 출력된다. |
| `.claude/commands/<cmd>.prompt`, `.cursor/prompts/*`등 | `.kiro/settings/rules/*.md` | 프롬프트 직접 수정은 비권장. DO / DO NOT 형태의 룰로 정의하면 전 에이전트가 공유한다. |
| `.kiro/steering/`(단일 또는 다중 파일) | `.kiro/steering/*.md` | 경로는 동일하지만, v1에서는 프로젝트 메모리 역할이 강화되어 파일 분할이 권장된다. |
| `design.md`안에 직접 기록하던 조사 메모 | `.kiro/specs/<feature>/research.md` 및 `Supporting References` | 설계 산출물과 조사 로그를 명확히 분리해 가독성과 리뷰성을 높인다. |

---

## 5. FAQ / 트러블슈팅

**Q. v1에서 구버전 템플릿을 그대로 쓰고 싶다**  
파일 복사는 가능하지만, 요구사항 커버리지(Req Coverage), 참고 문헌(Supporting References) 등 v1의 구조화 정보가 빠져 산출물 품질이 저하될 수 있다. 신규 템플릿으로 내용을 이관하는 편이 안전하다.

**Q. v0.5.0와 v1.0.0을 동일 리포지토리에서 병행 사용하고 싶다**  
`.kiro`구조가 다르므로 브랜치를 분리하거나 `.kiro`디렉터리를 전환하는 스크립트를 별도로 준비해야 한다.

**Q. 템플릿 수정 후 최소한 실행해야 할 커맨드는?**  
`/kiro:steering`, `/kiro:spec-init`, `/kiro:spec-design`순으로 한 번 실행해, 신규 포맷의 조사·설계·태스크 파일이 생성되는지 확인한다.

---

## 6. 정리

- **v0.5.0 유지 사용자**: `npx k-sdd@0.5.0`로 버전을 고정하고, 기존처럼 템플릿과 커맨드 프롬프트를 직접 수정한다.
- **v1.0.0 이동 사용자**: 비연속적 업데이트임을 전제로, 템플릿과 룰 파일만으로 커스터마이징을 완료한다. 이를 통해 참고 문헌 분리, 조사·설계 분리 등 최신 SDD의 이점을 누릴 수 있다.
- 향후 기능 추가와 버그 수정은 v1 계열에 집중되므로, 사양 기반 개발(Spec-Driven Development)의 효과를 극대화하고 싶다면 v1로의 이동을 권장한다.
