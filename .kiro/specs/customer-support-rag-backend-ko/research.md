# Research & Design Decisions

---
**Purpose**: 본 문서는 고객 지원용 RAG 백엔드 API의 설계를 뒷받침하는 조사 결과, 아키텍처 검토, 그리고 근거를 기록한다.

**Usage**:
- 디스커버리 단계의 조사 활동과 산출물을 기록
- design.md에 담기에는 너무 상세한 설계 판단의 트레이드오프를 문서화
- 향후 감사 및 재사용을 위한 참조 자료와 근거를 제공
---

## Summary
- **Feature**: `customer-support-rag-backend`
- **Discovery Scope**: New Feature (Greenfield)
- **Key Findings**:
  - RAG 구현에는 단계적 아키텍처 패턴(Simple RAG → Agentic RAG)이 확립되어 있으며, 본 프로젝트는 모듈러 RAG 패턴을 채택
  - LLM 스트리밍에는 SSE(Server-Sent Events)가 표준적이며, WebSocket보다 가볍고 HTTP 호환성이 높음
  - 벡터 데이터베이스는 용도에 따라 선정이 필요(Pinecone: 풀 매니지드, Qdrant: 고급 필터링, pgvector: PostgreSQL 통합)
  - 임베딩 생성은 OpenAI text-embedding-3가 성능과 비용의 균형이 우수(대안: sentence-transformers로 로컬 배포 가능)
  - FastAPI에서 SSE 구현 시에는 `sse-starlette` 라이브러리와 async generators가 권장됨

## Research Log

### RAG 아키텍처 패턴 조사

- **Context**: RAG 시스템의 설계 방침을 결정하기 위해, 2025년 시점의 최신 아키텍처 패턴을 조사
- **Sources Consulted**:
  - [RAG Architecture Explained: A Comprehensive Guide [2025] | Orq.ai](https://orq.ai/blog/rag-architecture)
  - [8 RAG Architectures You Should Know in 2025 | Humanloop](https://humanloop.com/blog/rag-architectures)
  - [RAG in 2025: From Quick Fix to Core Architecture | Medium](https://medium.com/@hrk84ya/rag-in-2025-from-quick-fix-to-core-architecture-9a9eb0a42493)
  - [IBM Architecture Patterns - Retrieval Augmented Generation](https://www.ibm.com/architectures/patterns/genai-rag)

- **Findings**:
  - **기본 아키텍처**: Simple RAG는 정적 데이터베이스에서 관련 문서를 검색하여 LLM에 전달하는 기본 패턴
  - **발전 패턴**:
    - Simple RAG with Memory: 대화 기록을 보존하여 컨텍스트 연속성을 실현
    - Agentic RAG: 자율 에이전트가 태스크 계획과 실행을 수행
    - Long RAG: 대량의 문서를 다루기 위해, 청크 분할이 아닌 섹션/문서 단위로 처리
    - Self-RAG: 검색 타이밍, 관련성 평가, 출력 비평을 자체적으로 판단하는 고급 프레임워크
  - **모듈러 RAG 패턴**: Retriever, Generator, Orchestration logic을 분리하여, 디버깅과 업데이트가 용이해짐(권장)
  - **검색 전략**: 벡터 검색과 키워드 검색의 하이브리드가 시맨틱 이해와 정확한 용어 매칭을 양립시키는 데 유효
  - **2025년의 트렌드**: RAG는 환각(hallucination) 대책의 일시적 기법에서, 신뢰성 높은 동적 지식 그라운딩 AI 시스템의 기초 패턴으로 진화

- **Implications**:
  - 본 프로젝트는 모듈러 RAG 패턴을 채택하여, Retriever(검색), Generator(생성), Orchestrator(제어)를 독립 컴포넌트로 설계
  - 초기 구현은 Simple RAG로 하고, 향후 Memory 기능이나 Agentic 확장에 대응할 수 있는 경계를 설정
  - 하이브리드 검색(벡터 + 키워드)을 채택하여 문서 검색 정확도를 향상

### LLM 스트리밍 API 조사

- **Context**: 사용자 경험 향상을 위해 LLM 응답을 실시간 스트리밍하는 구현 방식을 조사
- **Sources Consulted**:
  - [How to Stream LLM Responses Using SSE | Apidog](https://apidog.com/blog/stream-llm-responses-using-sse/)
  - [The Streaming Backbone of LLMs: Why SSE Still Wins in 2025 | Procedure Technologies](https://procedure.tech/blogs/the-streaming-backbone-of-llms-why-server-sent-events-(sse)-still-wins-in-2025)
  - [How streaming LLM APIs work | Simon Willison's TILs](https://til.simonwillison.net/llms/streaming-llm-apis)
  - [OpenAI SSE Streaming API | Better Programming](https://betterprogramming.pub/openai-sse-sever-side-events-streaming-api-733b8ec32897)

- **Findings**:
  - **SSE의 우위성**: WebSocket이나 gRPC와 비교하여, SSE는 가볍고 표준 HTTP 위에서 동작하며 자동 재연결 기능을 가짐
  - **프로토콜 사양**: 이벤트는 `data: <your_data>\n\n` 형식으로 포맷하고, Content-Type: text/event-stream 헤더를 반환
  - **OpenAI 구현**: `stream: true` 플래그로 스트리밍 활성화, "delta" 객체로 토큰을 점진적으로 전달, `[DONE]` 메시지로 완료 통지
  - **베스트 프랙티스**:
    - 응답의 단편화를 적절히 처리(Auto-Merge 기능 권장)
    - 다양한 LLM 모델(OpenAI, Gemini, DeepSeek)에서 테스트하여 호환성 확보
    - Timeline View로 디버깅 시의 스트림 진행을 시각화
    - 비표준 포맷 대응에는 JSONPath나 Post-Processor 스크립트를 활용
  - **UX 효과**: "Latency Theater"에 의해, 총 생성 시간이 같아도 점진적 피드백으로 사용자 체감 속도가 향상

- **Implications**:
  - 본 API는 SSE 프로토콜로 LLM 응답을 스트리밍(WebSocket은 미채택)
  - OpenAI Chat Completions API의 `stream: true` 모드를 이용
  - 에러 처리에서는 연결 단절 시의 자동 재연결과 graceful shutdown 구현이 필요
  - 인프라 고려사항: Nginx 사용 시에는 `X-Accel-Buffering: no` 헤더 설정이 필수

### 벡터 데이터베이스 선정 조사

- **Context**: 시맨틱 검색을 실현하는 벡터 데이터베이스의 선정
- **Sources Consulted**:
  - [The 7 Best Vector Databases in 2025 | DataCamp](https://www.datacamp.com/blog/the-top-5-vector-databases)
  - [Vector Database Comparison: Pinecone vs Weaviate vs Qdrant vs FAISS vs Milvus vs Chroma | Medium](https://medium.com/tech-ai-made-easy/vector-database-comparison-pinecone-vs-weaviate-vs-qdrant-vs-faiss-vs-milvus-vs-chroma-2025-15bf152f891d)
  - [Pinecone vs Qdrant vs Weaviate | Xenoss](https://xenoss.io/blog/vector-database-comparison-pinecone-qdrant-weaviate)
  - [Top Vector Database for RAG: Qdrant vs Weaviate vs Pinecone | AIM Multiple](https://research.aimultiple.com/vector-database-for-rag/)

- **Findings**:
  - **Pinecone**:
    - 성능: 삽입 속도 50k ops/sec, 쿼리 속도 5k ops/sec(벤치마크 톱)
    - 특징: 풀 매니지드 서비스, 수십억 벡터 대응, 운영 오버헤드 최소
    - 보안: SOC 2 Type II, ISO 27001, GDPR 준수, HIPAA 인증
    - 적용: 턴키로 스케일이 필요한 경우에 최적
  - **Weaviate**:
    - 특징: 지식 그래프 기능, GraphQL 인터페이스
    - 적용: 벡터 검색과 복잡한 데이터 관계성의 조합이 필요한 경우
  - **Qdrant**:
    - 성능: 삽입 속도 45k ops/sec, 쿼리 속도 4.5k ops/sec
    - 특징: Rust 구현, 고급 메타데이터 필터링 기능
    - 적용: 벡터 유사도와 복잡한 메타데이터 필터링의 양립이 필요한 경우
  - **pgvector**:
    - 특징: PostgreSQL 확장으로 동작, 정형 데이터와 벡터 검색을 통합
    - 제약: 대규모 시 전용 벡터 DB보다 느리고, Postgres 튜닝이 필요
    - 적용: 기존 PostgreSQL 환경에서 벡터 검색을 추가하고자 하는 경우
  - **선정 가이던스**: 워크로드에 따른 선택이 중요(Pinecone: 턴키 스케일, Weaviate: OSS 유연성, Qdrant: 복잡 필터, pgvector: SQL 통합)

- **Implications**:
  - 초기 구현에서는 Pinecone 또는 Qdrant를 권장(요구사항에 따라 선택)
  - Pinecone: 풀 매니지드로 운영 부담 낮음, 확장성 높음
  - Qdrant: 셀프 호스팅 가능, 비용 최적화와 데이터 주권이 중요한 경우에 유효
  - pgvector는 기존 PostgreSQL 환경이 있는 경우의 대안 옵션
  - 연결 실패 시의 재시도 로직과 서킷 브레이커 패턴을 구현

### 임베딩 모델 선정 조사

- **Context**: 문서와 문의의 벡터화에 사용할 임베딩 모델을 조사
- **Sources Consulted**:
  - [13 Best Embedding Models in 2025 | Elephas](https://elephas.app/blog/best-embedding-models)
  - [Embedding Models Comparison: OpenAI vs Sentence-Transformers | Markaicode](https://markaicode.com/embedding-models-comparison-openai-sentence-transformers/)
  - [OpenAI's Text Embeddings v3 | Pinecone](https://www.pinecone.io/learn/openai-embeddings-v3/)
  - [New embedding models and API updates | OpenAI](https://openai.com/index/new-embedding-models-and-api-updates/)

- **Findings**:
  - **OpenAI text-embedding-3**:
    - 모델: text-embedding-3-small(비용 효율), text-embedding-3-large(고성능)
    - 가격: text-embedding-3-small $0.02/백만 토큰, text-embedding-3-large $0.13/백만 토큰
    - 차원 수: text-embedding-3-small 최대 8191 토큰, text-embedding-3-large 최대 3072 차원
    - 성능: MTEB(Massive Text Embedding Benchmark)에서 톱 스코어
    - 레이트 제한: Usage Tier에 기반(Tier 5에서 10M TPM, 10k RPM)
    - 통합: 단순한 REST API, 모델 관리 불필요
  - **Sentence-Transformers(오픈 소스)**:
    - 모델: all-MiniLM-L6-v2(384차원, 균형형), all-mpnet-base-v2(768차원, 고정밀)
    - 비용: 완전 무료, 로컬 실행 가능
    - 배포: 완전한 데이터 제어, 외부 API 호출 불필요
    - 성능: CPU 실행에서도 레이턴시 테스트에서 가장 빠름
  - **권장**:
    - 시맨틱 검색·검색 정확도 우선: OpenAI embeddings 권장
    - 오프라인/프라이버시 중시 환경: Sentence-Transformers 권장

- **Implications**:
  - 초기 구현은 OpenAI text-embedding-3-small 채택(비용 효율과 성능의 균형)
  - 고정밀 요구 시에는 text-embedding-3-large로의 전환 옵션을 설계
  - 프라이버시 요구사항이나 비용 최적화가 중요한 경우, Sentence-Transformers로의 로컬 구현을 대안으로 보유
  - 레이트 제한 대책으로 지수 백오프 재시도를 구현

### FastAPI SSE 구현 조사

- **Context**: Python 백엔드에서 SSE를 구현하는 베스트 프랙티스를 조사
- **Sources Consulted**:
  - [Server-Sent Events with Python FastAPI | Medium](https://medium.com/@nandagopal05/server-sent-events-with-python-fastapi-f1960e0c8e4b)
  - [Real-Time Notifications in Python: Using SSE with FastAPI | Medium](https://medium.com/@inandelibas/real-time-notifications-in-python-using-sse-with-fastapi-1c8c54746eb7)
  - [sse-starlette · PyPI](https://pypi.org/project/sse-starlette/)
  - [Streaming Responses in FastAPI | Random Thoughts](https://hassaanbinaslam.github.io/posts/2025-01-19-streaming-responses-fastapi.html)

- **Findings**:
  - **권장 라이브러리**: `sse-starlette`가 W3C SSE 사양에 준거한 프로덕션 환경 대응 구현을 제공
  - **Async Generators**: FastAPI의 async 기능과 async generators를 사용하여 확장성 향상
  - **EventSourceResponse vs StreamingResponse**: 기본적인 StreamingResponse보다 EventSourceResponse가 SSE 처리에 적합
  - **연결 관리**: 각 SSE 클라이언트가 1개의 서버 스레드/코루틴을 사용하므로, 대규모 시스템에서는 연결 수와 메모리 사용량을 모니터링하고, I/O 최적화된 async 서버(Uvicorn, Daphne)를 사용
  - **인프라 고려사항**:
    - Nginx 사용 시에는 `X-Accel-Buffering: no` 헤더 추가(기본적으로 버퍼링되기 때문)
    - 호스팅 환경이 스트리밍 응답에 대응하는지 확인(Content-Length를 요구하는 서버는 비대응)
  - **프로토콜 요건**: 메시지는 UTF-8 인코딩 필수, 헤더에 `Cache-Control: no-cache` 포함
  - **ASGI 서버**: Python의 WSGI 서버는 적절히 스트리밍할 수 없는 경우가 있으므로, ASGI 서버(Uvicorn, Daphne)를 권장

- **Implications**:
  - FastAPI + `sse-starlette` + Uvicorn의 조합으로 구현
  - Async generator 패턴을 사용하여 LLM 응답을 스트리밍
  - Nginx/로드 밸런서 설정에서 버퍼링 비활성화
  - 연결 수와 메모리 사용량의 모니터링 구현

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Modular RAG | Retriever, Generator, Orchestrator를 독립 컴포넌트로 분리 | 명확한 경계, 테스트 용이성, 단계적 확장 가능, 디버깅하기 쉬움 | 어댑터 계층의 구축 필요, 컴포넌트 간 통신 오버헤드 | 2025년의 베스트 프랙티스에 준거, 향후 Agentic RAG 확장에 대응 가능 |
| Simple RAG | 검색과 생성을 일체화한 단순한 플로우 | 구현이 신속, 초기 비용 낮음 | 확장성 제약, 테스트가 곤란, 경계가 불명확 | 프로토타입에는 적합하지만, 프로덕션 환경에서는 권장되지 않음 |
| Hexagonal Architecture | 포트&어댑터로 코어 도메인을 추상화 | 테스트 용이성 높음, 외부 의존성으로부터의 분리 | 초기 설계 비용 높음, 소규모 프로젝트에는 과잉 | 엔터프라이즈 환경에서는 유효하지만, 본 프로젝트의 규모에는 과잉 |

**선정 결과**: Modular RAG 패턴 채택
- 요구사항의 복잡성(검색, 생성, 스트리밍, 에러 처리)에 대응
- 각 컴포넌트가 독립적으로 테스트·배포 가능
- 향후 확장(Memory, Agentic 기능)에 대응할 수 있는 경계 설계

## Design Decisions

### Decision: `스트리밍 프로토콜 선정(SSE vs WebSocket)`

- **Context**: LLM 응답을 실시간으로 클라이언트에 전송하는 프로토콜의 선정
- **Alternatives Considered**:
  1. **Server-Sent Events (SSE)** — 단방향의 경량 스트리밍, 표준 HTTP, 자동 재연결
  2. **WebSocket** — 양방향 통신, 스테이트풀 연결, 보다 복잡한 연결 관리

- **Selected Approach**: Server-Sent Events (SSE)
  - W3C 표준 프로토콜, Content-Type: text/event-stream
  - FastAPI에서는 `sse-starlette` 라이브러리를 사용
  - Async generator 패턴으로 LLM 응답을 점진적으로 전송

- **Rationale**:
  - LLM 응답은 단방향 전송이므로, 양방향 통신은 불필요
  - SSE는 표준 HTTP에서 동작하며, 기존 인프라(CDN, 로드 밸런서)와의 호환성이 높음
  - 자동 재연결 기능에 의해 연결 단절 시의 복구가 용이
  - WebSocket과 비교하여 구현이 단순하고 운영 오버헤드가 낮음

- **Trade-offs**:
  - **Benefits**: 경량, HTTP 호환, 자동 재연결, 구현 단순, 인프라 호환성 높음
  - **Compromises**: 단방향 통신만 가능(양방향이 불필요하므로 문제 없음), 브라우저 연결 수 제한(6 연결/도메인, 실용상 문제 없음)

- **Follow-up**:
  - Nginx/로드 밸런서에서 `X-Accel-Buffering: no` 설정 확인
  - 연결 수와 메모리 사용량의 모니터링 구현
  - 연결 단절 시의 graceful shutdown과 에러 통지의 구현 검증

### Decision: `벡터 데이터베이스 선정(Pinecone vs Qdrant vs pgvector)`

- **Context**: 시맨틱 검색을 위한 벡터 데이터베이스 선정
- **Alternatives Considered**:
  1. **Pinecone** — 풀 매니지드, 고성능(50k insertion/sec), 운영 부담 최소
  2. **Qdrant** — 셀프 호스팅 가능, 고급 필터링, Rust 구현
  3. **pgvector** — PostgreSQL 확장, 기존 DB 통합, 비용 낮음

- **Selected Approach**: Pinecone(초기 구현), Qdrant를 대안 옵션으로 보유
  - Pinecone을 프라이머리 선택지로 설계
  - 인터페이스 추상화에 의해 향후 Qdrant/pgvector로의 전환을 가능하게 함

- **Rationale**:
  - 초기 단계에서는 개발 속도와 운영 안정성을 우선
  - Pinecone은 풀 매니지드로 확장성과 보안(SOC 2, GDPR)이 보장됨
  - Qdrant는 비용 최적화나 데이터 주권이 필요한 경우의 대안

- **Trade-offs**:
  - **Benefits(Pinecone)**: 운영 부담 제로, 확장성 보장, 보안 준수
  - **Compromises**: 벤더 락인 리스크, 종량제 비용, 커스터마이징 제약
  - **Benefits(Qdrant)**: 셀프 호스팅 가능, 비용 제어, 필터링 고급화
  - **Compromises**: 운영 부담 증가, 스케일링 관리 필요

- **Follow-up**:
  - VectorStore 인터페이스를 정의하여 Pinecone/Qdrant/pgvector의 전환을 가능하게 함
  - 구현 초기 단계에서 비용 시산과 스케일링 테스트를 실시
  - 셀프 호스팅 요건이 발생한 경우의 Qdrant 마이그레이션 경로를 설계

### Decision: `임베딩 모델 선정(OpenAI vs Sentence-Transformers)`

- **Context**: 문서와 문의의 벡터화에 사용할 임베딩 모델 선정
- **Alternatives Considered**:
  1. **OpenAI text-embedding-3-small** — API형, $0.02/백만 토큰, 고정밀
  2. **OpenAI text-embedding-3-large** — API형, $0.13/백만 토큰, 최고 정밀도
  3. **Sentence-Transformers(all-MiniLM-L6-v2)** — 로컬 실행, 무료, 프라이버시 보호

- **Selected Approach**: OpenAI text-embedding-3-small
  - 초기 구현은 text-embedding-3-small을 사용
  - 고정밀 요구 시 text-embedding-3-large로의 전환 옵션을 보유
  - EmbeddingService 인터페이스로 구현을 추상화

- **Rationale**:
  - text-embedding-3-small은 비용과 성능의 균형이 우수
  - API형이므로 인프라 관리 불필요, 확장성 높음
  - MTEB 벤치마크에서 톱 클래스의 정밀도

- **Trade-offs**:
  - **Benefits**: 고정밀, 인프라 불필요, 간단한 통합, 확장성
  - **Compromises**: API 의존, 종량제 비용, 레이트 제한, 오프라인 비대응
  - **Alternative Benefits(Sentence-Transformers)**: 완전 무료, 프라이버시 보호, 오프라인 가능
  - **Alternative Compromises**: 인프라 관리 필요, 정밀도가 다소 낮음, 스케일링 대응 필요

- **Follow-up**:
  - 레이트 제한 대책으로 지수 백오프 재시도 구현
  - 비용 모니터링 대시보드 구축
  - 프라이버시 요건이 엄격해진 경우의 Sentence-Transformers 마이그레이션 경로를 설계

### Decision: `백엔드 프레임워크 선정(FastAPI)`

- **Context**: RAG API 백엔드의 Python 프레임워크 선정
- **Alternatives Considered**:
  1. **FastAPI** — 고속, async 대응, 타입 안전, 자동 문서 생성
  2. **Flask** — 단순, 성숙, 풍부한 에코시스템
  3. **Django** — 풀스택, ORM 통합, 관리 화면

- **Selected Approach**: FastAPI
  - Uvicorn(ASGI 서버)으로 실행
  - `sse-starlette` 라이브러리로 SSE 구현
  - Pydantic으로 타입 안전한 요청/응답 정의

- **Rationale**:
  - Async/await 대응에 의해 SSE 스트리밍과 LLM API 호출의 병렬 처리가 효율적
  - Pydantic에 의한 타입 안전성으로 구현 에러를 방지
  - 자동 OpenAPI 문서 생성으로 API 사양 관리가 용이
  - 2025년 시점에서 Python API 백엔드의 표준적 선택지

- **Trade-offs**:
  - **Benefits**: 고속, 타입 안전, async 대응, 자동 문서, 모던한 개발 경험
  - **Compromises**: Flask보다 역사가 짧음, 에코시스템이 다소 작음

- **Follow-up**:
  - Uvicorn의 프로덕션 환경 설정(워커 수, 타임아웃)을 최적화
  - Pydantic 모델로 모든 요청/응답을 타입 정의
  - OpenAPI 문서를 자동 생성하여, 프론트엔드 개발과 연계

## Risks & Mitigations

- **Risk 1: LLM API 레이트 제한 초과로 인한 서비스 정지**
  - Mitigation: 지수 백오프 재시도 구현, 레이트 제한 모니터링 알림, 요청 큐잉, 다중 API 키/엔드포인트의 페일오버 구성

- **Risk 2: 벡터 데이터베이스 연결 장애**
  - Mitigation: 서킷 브레이커 패턴 구현, 폴백 검색(키워드 검색), 커넥션 풀링과 자동 재시도, 헬스 체크 엔드포인트

- **Risk 3: 스트리밍 중의 연결 단절**
  - Mitigation: SSE의 자동 재연결 기능 활용, graceful shutdown 구현, 에러 이벤트 송신과 클라이언트 측 에러 처리, 타임아웃 설정

- **Risk 4: 컨텍스트 윈도우 초과로 인한 LLM 에러**
  - Mitigation: 토큰 수 카운트와 사전 검증, 낮은 랭크 문서의 단계적 잘라내기, 청크 사이즈 최적화, 컨텍스트 압축 기술 적용

- **Risk 5: 보안 취약점(Prompt Injection, PII 누출)**
  - Mitigation: 입력 새니타이제이션 구현, 프롬프트 템플릿 고정화, PII 검출과 마스킹, 로그 출력 시의 기밀 정보 제외

- **Risk 6: 확장성 문제(고부하 시의 성능 저하)**
  - Mitigation: 수평 확장 대응(스테이트리스 설계), 커넥션 풀링, 캐싱 전략(검색 결과, 임베딩), 부하 테스트와 성능 튜닝

## References

- [RAG Architecture Explained: A Comprehensive Guide [2025] | Orq.ai](https://orq.ai/blog/rag-architecture)
- [8 RAG Architectures You Should Know in 2025 | Humanloop](https://humanloop.com/blog/rag-architectures)
- [The Streaming Backbone of LLMs: Why SSE Still Wins in 2025 | Procedure Technologies](https://procedure.tech/blogs/the-streaming-backbone-of-llms-why-server-sent-events-(sse)-still-wins-in-2025)
- [The 7 Best Vector Databases in 2025 | DataCamp](https://www.datacamp.com/blog/the-top-5-vector-databases)
- [Vector Database Comparison: Pinecone vs Weaviate vs Qdrant | Medium](https://medium.com/tech-ai-made-easy/vector-database-comparison-pinecone-vs-weaviate-vs-qdrant-vs-faiss-vs-milvus-vs-chroma-2025-15bf152f891d)
- [13 Best Embedding Models in 2025 | Elephas](https://elephas.app/blog/best-embedding-models)
- [OpenAI's Text Embeddings v3 | Pinecone](https://www.pinecone.io/learn/openai-embeddings-v3/)
- [sse-starlette · PyPI](https://pypi.org/project/sse-starlette/)
- [Streaming Responses in FastAPI | Random Thoughts](https://hassaanbinaslam.github.io/posts/2025-01-19-streaming-responses-fastapi.html)
- [OpenAI SSE Streaming API | Better Programming](https://betterprogramming.pub/openai-sse-sever-side-events-streaming-api-733b8ec32897)
