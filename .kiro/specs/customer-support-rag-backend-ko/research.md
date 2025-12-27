# Research & Design Decisions

---
**Purpose**: 본 문서는 고객지원용 RAG 백엔드 API 설계를 뒷받침하는 조사 결과, 아키텍처 검토, 그리고 근거를 기록한다.

**Usage**:
- 디스커버리 단계에서의 조사 활동과 결과를 기록
- design.md에는 너무 상세한 설계 판단의 트레이드오프를 문서화
- 향후 감사(Audit)나 재사용을 위한 참고 자료와 증빙(Evidence)을 제공
---

## Summary
- **Feature**: `customer-support-rag-backend`
- **Discovery Scope**: New Feature (Greenfield)
- **Key Findings**:
  - RAG 구현에는 단계적 아키텍처 패턴(Simple RAG → Agentic RAG)이 확립되어 있으며, 본 프로젝트는 모듈형 RAG 패턴을 채택
  - LLM 스트리밍에는 SSE(Server-Sent Events)가 표준적이며, WebSocket보다 가볍고 HTTP 호환성이 높음
  - 벡터 데이터베이스는 용도에 따라 선택이 필요(Pinecone: 완전관리형, Qdrant: 고급 필터링, pgvector: PostgreSQL 통합)
  - 임베딩 생성은 OpenAI text-embedding-3가 성능과 비용의 균형이 우수함(대안: sentence-transformers를 로컬로 배포 가능)
  - FastAPI에서 SSE를 구현할 때는 `sse-starlette`라이브러리와 async generator 사용이 권장됨

## Research Log

### RAG 아키텍처 패턴 조사

- **Context**: RAG 시스템의 설계 방침을 결정하기 위해 2025년 시점 최신 아키텍처 패턴을 조사
- **Sources Consulted**:
  - [RAG Architecture Explained: A Comprehensive Guide [2025] | Orq.ai](https://orq.ai/blog/rag-architecture)
  - [8 RAG Architectures You Should Know in 2025 | Humanloop](https://humanloop.com/blog/rag-architectures)
  - [RAG in 2025: From Quick Fix to Core Architecture | Medium](https://medium.com/@hrk84ya/rag-in-2025-from-quick-fix-to-core-architecture-9a9eb0a42493)
  - [IBM Architecture Patterns - Retrieval Augmented Generation](https://www.ibm.com/architectures/patterns/genai-rag)

- **Findings**:
  - **기본 아키텍처**: Simple RAG는 정적 데이터베이스에서 관련 문서를 검색해 LLM에 전달하는 기본 패턴
  - **발전 패턴**:
    - Simple RAG with Memory: 대화 이력을 유지하여 컨텍스트 연속성을 구현
    - Agentic RAG: 자율 에이전트가 작업 계획과 실행을 수행
    - Long RAG: 대량 문서를 다루기 위해 청크 분할이 아니라 섹션/문서 단위로 처리
    - Self-RAG: 검색 타이밍, 관련성 평가, 출력 비평을 스스로 판단하는 고도화 프레임워크
  - **모듈형 RAG 패턴**: Retriever, Generator, Orchestration 로직을 분리하여 디버깅과 업데이트가 쉬워짐(권장)
  - **검색 전략**: 벡터 검색과 키워드 검색의 하이브리드가 시맨틱 이해와 정확한 용어 매칭을 동시에 달성하는 데 유효
  - **2025년 트렌드**: RAG는 환각(Hallucination) 방지의 임시 기법에서, 신뢰성 높은 동적 지식 접지형 AI 시스템의 기반 패턴으로 진화

- **Implications**:
  - 본 프로젝트는 모듈형 RAG 패턴을 채택하고 Retriever(검색), Generator(생성), Orchestrator(제어)를 독립 컴포넌트로 설계
  - 초기 구현은 Simple RAG로 하고, 향후 Memory 기능이나 Agentic 확장에 대응 가능한 경계(Boundary)를 설정
  - 하이브리드 검색(벡터 + 키워드)을 채택하여 문서 검색 정확도를 향상

### LLM 스트리밍 API 조사

- **Context**: 사용자 경험 향상을 위해 LLM 응답을 실시간 스트리밍하는 구현 방식을 조사
- **Sources Consulted**:
  - [How to Stream LLM Responses Using SSE | Apidog](https://apidog.com/blog/stream-llm-responses-using-sse/)
  - [The Streaming Backbone of LLMs: Why SSE Still Wins in 2025 | Procedure Technologies](https://procedure.tech/blogs/the-streaming-backbone-of-llms-why-server-sent-events-(sse)-still-wins-in-2025)
  - [How streaming LLM APIs work | Simon Willison's TILs](https://til.simonwillison.net/llms/streaming-llm-apis)
  - [OpenAI SSE Streaming API | Better Programming](https://betterprogramming.pub/openai-sse-sever-side-events-streaming-api-733b8ec32897)

- **Findings**:
  - **SSE의 우위**: WebSocket이나 gRPC와 비교했을 때, SSE는 가볍고 표준 HTTP 위에서 동작하며 자동 재연결 기능을 제공
  - **프로토콜 사양**: 이벤트는 `data: <your_data>\n\n`형태로 포맷하고, Content-Type: text/event-stream헤더를 반환
  - **OpenAI 구현**: `stream: true`플래그로 스트리밍 활성화, "delta" 오브젝트로 토큰을 단계적으로 전송, `[DONE]`메시지로 완료 통지
  - **베스트 프랙티스**:
    - 응답 조각화(Fragmentation)를 적절히 처리(Auto-Merge 기능 권장)
    - 서로 다른 LLM 모델(OpenAI, Gemini, DeepSeek)에서 테스트하여 호환성 확보
    - Timeline View로 디버깅 시 스트림 진행 상황을 가시화
    - 비표준 포맷 대응에는 JSONPath 또는 Post-Processor 스크립트를 활용
  - **UX 효과**: "Latency Theater"로 인해 총 생성 시간이 같더라도 단계적 피드백이 사용자 체감 속도를 향상

- **Implications**:
  - 본 API는 SSE 프로토콜로 LLM 응답을 스트리밍(WebSocket은 채택하지 않음)
  - OpenAI Chat Completions API의 `stream: true`모드를 사용
  - 에러 핸들링에서는 연결 단절 시 자동 재연결 및 graceful shutdown 구현이 필요
  - 인프라 고려사항: Nginx 사용 시 `X-Accel-Buffering: no`헤더 설정이 필수

### 벡터 데이터베이스 선정 조사

- **Context**: 시맨틱 검색을 구현하기 위한 벡터 데이터베이스 선정
- **Sources Consulted**:
  - [The 7 Best Vector Databases in 2025 | DataCamp](https://www.datacamp.com/blog/the-top-5-vector-databases)
  - [Vector Database Comparison: Pinecone vs Weaviate vs Qdrant vs FAISS vs Milvus vs Chroma | Medium](https://medium.com/tech-ai-made-easy/vector-database-comparison-pinecone-vs-weaviate-vs-qdrant-vs-faiss-vs-milvus-vs-chroma-2025-15bf152f891d)
  - [Pinecone vs Qdrant vs Weaviate | Xenoss](https://xenoss.io/blog/vector-database-comparison-pinecone-qdrant-weaviate)
  - [Top Vector Database for RAG: Qdrant vs Weaviate vs Pinecone | AIM Multiple](https://research.aimultiple.com/vector-database-for-rag/)

- **Findings**:
  - **Pinecone**:
    - 성능: 삽입 속도 50k ops/sec, 쿼리 속도 5k ops/sec(벤치마크 상위)
    - 특징: 완전관리형 서비스, 수십억 벡터 대응, 운영 오버헤드 최소
    - 보안: SOC 2 Type II, ISO 27001, GDPR 준수, HIPAA 인증
    - 적용: 턴키로 스케일이 필요한 경우 최적
  - **Weaviate**:
    - 특징: 지식 그래프 기능, GraphQL 인터페이스
    - 적용: 벡터 검색과 복잡한 데이터 관계를 결합해야 하는 경우
  - **Qdrant**:
    - 성능: 삽입 속도 45k ops/sec, 쿼리 속도 4.5k ops/sec
    - 특징: Rust 구현, 고급 메타데이터 필터링 기능
    - 적용: 벡터 유사도와 복잡한 메타데이터 필터링을 동시에 요구하는 경우
  - **pgvector**:
    - 특징: PostgreSQL 확장으로 동작, 정형 데이터와 벡터 검색을 통합
    - 제약: 대규모에서는 전용 벡터 DB보다 느릴 수 있으며 Postgres 튜닝이 필요
    - 적용: 기존 PostgreSQL 환경에 벡터 검색을 추가하고 싶은 경우
  - **선정 가이드**: 워크로드에 맞춘 선택이 중요(Pinecone: 턴키 스케일, Weaviate: OSS 유연성, Qdrant: 복잡 필터, pgvector: SQL 통합)

- **Implications**:
  - 초기 구현에서는 Pinecone 또는 Qdrant를 권장(요구사항에 따라 선택)
  - Pinecone: 완전관리형으로 운영 부담이 낮고 스케일링이 용이
  - Qdrant: 셀프 호스팅 가능, 비용 최적화와 데이터 주권이 중요할 때 유효
  - pgvector는 기존 PostgreSQL 환경이 있을 때의 대체 옵션
  - 연결 실패 시 재시도 로직과 서킷 브레이커 패턴을 구현

### Embedding모델 선정 조사

- **Context**: 문서와 문의를 벡터화하는 데 사용할 임베딩 모델을 조사
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
    - 성능: MTEB(Massive Text Embedding Benchmark)에서 상위 점수
    - 레이트 리밋: Usage Tier 기반(Tier 5에서 10M TPM, 10k RPM)
    - 통합: 단순한 REST API, 모델 관리 불필요
  - **Sentence-Transformers(오픈소스)**:
    - 모델: all-MiniLM-L6-v2(384차원, 균형형), all-mpnet-base-v2(768차원, 고정확도)
    - 비용: 완전 무료, 로컬 실행 가능
    - 배포: 완전한 데이터 제어, 외부 API 호출 불필요
    - 성능: CPU 실행에서도 레이턴시 테스트에서 가장 빠름
  - **권장**:
    - 시맨틱 검색/검색 정확도 우선: OpenAI embeddings 권장
    - 오프라인/프라이버시 중시 환경: Sentence-Transformers 권장

- **Implications**:
  - 초기 구현은 OpenAI text-embedding-3-small 채택(비용 효율과 성능의 균형)
  - 고정확도 요구 시 text-embedding-3-large로 전환 가능한 옵션을 설계
  - 프라이버시 요구나 비용 최적화가 중요할 경우 Sentence-Transformers 로컬 구현을 대안으로 유지
  - 레이트 리밋 대응을 위해 지수 백오프 재시도를 구현

### FastAPI SSE 구현 조사

- **Context**: 백엔드에서 SSE를 구현하는 베스트 프랙티스를 조사
- **Sources Consulted**:
  - [Server-Sent Events with Python FastAPI | Medium](https://medium.com/@nandagopal05/server-sent-events-with-python-fastapi-f1960e0c8e4b)
  - [Real-Time Notifications in Python: Using SSE with FastAPI | Medium](https://medium.com/@inandelibas/real-time-notifications-in-python-using-sse-with-fastapi-1c8c54746eb7)
  - [sse-starlette · PyPI](https://pypi.org/project/sse-starlette/)
  - [Streaming Responses in FastAPI | Random Thoughts](https://hassaanbinaslam.github.io/posts/2025-01-19-streaming-responses-fastapi.html)

- **Findings**:
  - **권장 라이브러리**: `sse-starlette`는 W3C SSE 사양을 준수하는 프로덕션 대응 구현을 제공
  - **Async Generators**: FastAPI의 async 기능과 async generator로 확장성을 향상
  - **EventSourceResponse vs StreamingResponse**: 기본 StreamingResponse보다 EventSourceResponse가 SSE 처리에 더 적합
  - **연결 관리**: 각 SSE 클라이언트가 서버의 1 스레드/코루틴을 사용하므로, 대규모 시스템에서는 연결 수와 메모리 사용량을 모니터링하고 I/O 최적화된 async 서버(Uvicorn, Daphne)를 사용
  - **인프라 고려사항**:
    - Nginx 사용 시 `X-Accel-Buffering: no`헤더 추가(기본 설정이 버퍼링이므로)
    - 호스팅 환경이 스트리밍 응답을 지원하는지 확인(Content-Length를 요구하는 서버는 비호환)
  - **프로토콜 요구사항**: 메시지는 UTF-8 인코딩 필수, 헤더에 `Cache-Control: no-cache`포함
  - **ASGI 서버**: Python WSGI 서버는 스트리밍을 제대로 처리하지 못할 수 있으므로 ASGI 서버(Uvicorn, Daphne) 권장

- **Implications**:
  - FastAPI + `sse-starlette` + Uvicorn 조합으로 구현
  - Async generator패턴으로 LLM 응답을 스트리밍
  - Nginx/로드밸런서 설정에서 버퍼링 비활성화
  - 연결 수와 메모리 사용량 모니터링을 구현

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Modular RAG | Retriever, Generator, Orchestrator를 독립 컴포넌트로 분리 | 명확한 경계, 테스트 용이성, 단계적 확장 가능, 디버깅이 쉬움 | 어댑터 계층 구축 필요, 컴포넌트 간 통신 오버헤드 | 2025년 베스트 프랙티스에 부합, 향후 Agentic RAG 확장에 대응 가능 |
| Simple RAG | 검색과 생성을 일체화한 단순 플로우 | 구현이 빠름, 초기 비용 낮음 | 확장성 제약, 테스트가 어려움, 경계가 모호함 | 프로토타입에는 적합하나 프로덕션 환경에서는 비권장 |
| Hexagonal Architecture | 포트&어댑터로 코어 도메인을 추상화 | 테스트 용이성이 높음, 외부 의존성으로부터 분리 | 초기 설계 비용이 높고 소규모 프로젝트에는 과함 | 엔터프라이즈 환경에서는 유효하나 본 프로젝트 규모에는 과함 |

**선정 결과**: Modular RAG 패턴 채택
- 요구사항 복잡성(검색, 생성, 스트리밍, 에러 핸들링)에 대응
- 각 컴포넌트를 독립적으로 테스트/배포 가능
- 향후 확장(Memory, Agentic 기능)에 대응 가능한 경계 설계

## Design Decisions

### Decision: `스트리밍 프로토콜 선정(SSE vs WebSocket)`

- **Context**: LLM 응답을 실시간으로 클라이언트에 전송할 프로토콜 선정
- **Alternatives Considered**:
  1. **Server-Sent Events (SSE)** — 단방향의 경량 스트리밍, 표준 HTTP, 자동 재연결
  2. **WebSocket** — 양방향 통신, 스테이트풀 연결, 더 복잡한 연결 관리

- **Selected Approach**: Server-Sent Events (SSE)
  - W3C 표준 프로토콜, Content-Type: text/event-stream
  - FastAPI에서는 `sse-starlette` 라이브러리를 사용
  - async generator 패턴으로 LLM 응답을 단계적으로 전송

- **Rationale**:
  - LLM 응답은 단방향 전송이므로 양방향 통신이 불필요
  - SSE는 표준 HTTP에서 동작해 기존 인프라(CDN, 로드밸런서)와 호환성이 높음
  - 자동 재연결 기능으로 연결 단절 시 복구가 쉬움
  - WebSocket 대비 구현이 단순하고 운영 오버헤드가 낮음

- **Trade-offs**:
  - **Benefits**: 경량, HTTP 호환, 자동 재연결, 구현 단순, 인프라 호환성 우수
  - **Compromises**: 단방향 통신만 가능(양방향 불필요하므로 문제 없음), 브라우저 연결 수 제한(도메인당 6개 연결, 실무상 문제 없음)

- **Follow-up**:
  - Nginx/로드밸런서에서 `X-Accel-Buffering: no`설정을 확인
  - 연결 수와 메모리 사용량 모니터링 구현
  - 연결 단절 시 graceful shutdown 및 에러 통지 구현 검증

### Decision: `벡터 데이터베이스 선정(Pinecone vs Qdrant vs pgvector)`

- **Context**: 시맨틱 검색을 위한 벡터 데이터베이스 선정
- **Alternatives Considered**:
  1. **Pinecone** — 완전관리형, 고성능(50k insertion/sec), 운영 부담 최소
  2. **Qdrant** — 셀프 호스팅 가능, 고급 필터링, Rust 구현
  3. **pgvector** — PostgreSQL 확장, 기존 DB 통합, 비용 낮음

- **Selected Approach**: Pinecone(초기 구현), Qdrant를 대체 옵션으로 유지
  - Pinecone을 주 선택지로 설계
  - 인터페이스 추상화로 향후 Qdrant/pgvector 전환을 가능하게 함

- **Rationale**:
  - 초기 단계에서는 개발 속도와 운영 안정성을 우선
  - Pinecone은 완전관리형으로 확장성과 보안(SOC 2, GDPR)이 보장됨
  - Qdrant는 비용 최적화 또는 데이터 주권이 필요한 경우의 대안

- **Trade-offs**:
  - **Benefits(Pinecone)**: 운영 부담 최소, 확장성 보장, 보안 준수
  - **Compromises**: 벤더 락인 리스크, 사용량 기반 비용, 커스터마이징 제약
  - **Benefits(Qdrant)**: 셀프 호스팅 가능, 비용 통제, 필터링 고도화
  - **Compromises**: 운영 부담 증가, 스케일링 관리 필요

- **Follow-up**:
  - VectorStore 인터페이스를 정의하여 Pinecone/Qdrant/pgvector 전환 가능하게 함
  - 초기 구현 단계에서 비용 추정과 스케일링 테스트를 수행
  - 셀프 호스팅 요구가 발생하면 Qdrant로의 마이그레이션 경로를 설계

### Decision: `임베딩 모델 선정(OpenAI vs Sentence-Transformers)`

- **Context**: 문서와 문의를 벡터화하는 데 사용할 임베딩 모델 선정
- **Alternatives Considered**:
  1. **OpenAI text-embedding-3-small** — API 방식, $0.02/백만 토큰, 고정확도
  2. **OpenAI text-embedding-3-large** — API 방식, $0.13/백만 토큰, 최고 정확도
  3. **Sentence-Transformers(all-MiniLM-L6-v2)** — 로컬 실행, 무료, 프라이버시 보호

- **Selected Approach**: OpenAI text-embedding-3-small
  - 초기 구현은 text-embedding-3-small 사용
  - 고정확도 요구 시 text-embedding-3-large로 전환 가능한 옵션을 유지
  - EmbeddingService 인터페이스로 구현을 추상화

- **Rationale**:
  - text-embedding-3-small은 비용과 성능의 균형이 우수
  - API 방식이므로 인프라 관리가 불필요하며 확장성이 높음
  - MTEB 벤치마크에서 상위권 정확도

- **Trade-offs**:
  - **Benefits**: 고정확도, 인프라 불필요, 통합 용이, 확장성
  - **Compromises**: API 의존, 사용량 기반 비용, 레이트 리밋, 오프라인 미지원
  - **Alternative Benefits(Sentence-Transformers)**: 완전 무료, 프라이버시 보호, 오프라인 가능
  - **Alternative Compromises**: 인프라 관리 필요, 정확도 다소 낮음, 스케일링 대응 필요

- **Follow-up**:
  - 레이트 리밋 대응을 위해 지수 백오프 재시도 구현
  - 비용 모니터링 대시보드 구축
  - 프라이버시 요구가 강화되면 Sentence-Transformers 마이그레이션 경로를 설계

### Decision: `백엔드 프레임워크 선정(FastAPI)`

- **Context**: RAG API 백엔드의 Python 프레임워크 선정
- **Alternatives Considered**:
  1. **FastAPI** — 고속, async 지원, 타입 안정성, 자동 문서 생성
  2. **Flask** — 단순, 성숙, 풍부한 에코시스템
  3. **Django** — 풀스택, ORM 통합, 관리자 화면

- **Selected Approach**: FastAPI
  - Uvicorn(ASGI 서버)으로 실행
  - `sse-starlette`라이브러리로 SSE 구현
  - Pydantic으로 타입 안정적인 요청/응답 정의

- **Rationale**:
  - async/await 지원으로 SSE 스트리밍과 LLM API 호출을 병렬(동시) 처리하기 효율적
  - Pydantic 타입 안정성으로 구현 오류를 방지
  - 자동 OpenAPI 문서 생성으로 API 사양 관리가 용이
  - 2025년 기준 Python API 백엔드의 표준 선택지

- **Trade-offs**:
  - **Benefits**: 고속, 타입 안정, async 지원, 자동 문서, 모던한 개발 경험
  - **Compromises**: Flask보다 역사가 짧고 에코시스템이 다소 작음

- **Follow-up**:
  - Uvicorn의 프로덕션 설정(워커 수, 타임아웃)을 최적화
  - Pydantic 모델로 모든 요청/응답을 타입 정의
  - OpenAPI 문서를 자동 생성하고 프론트엔드 개발과 연계

## Risks & Mitigations

- **Risk 1: LLM API 레이트 리밋 초과로 인한 서비스 중단**
  - Mitigation: 지수 백오프 재시도 구현, 레이트 리밋 모니터링 알림, 요청 큐잉, 다중 API 키/엔드포인트 페일오버 구성

- **Risk 2: 벡터 데이터베이스 연결 장애**
  - Mitigation: 서킷 브레이커 패턴 구현, 폴백 검색(키워드 검색), 커넥션 풀링 및 자동 재시도, 헬스체크 엔드포인트

- **Risk 3: 스트리밍 중 연결 단절**
  - Mitigation: SSE 자동 재연결 기능 활용, graceful shutdown 구현, 에러 이벤트 전송 및 클라이언트 측 에러 핸들링, 타임아웃 설정

- **Risk 4: 컨텍스트 윈도우 초과로 인한 LLM 에러**
  - Mitigation: 토큰 수 카운트 및 사전 검증, 낮은 랭크 문서의 단계적 제거, 청크 크기 최적화, 컨텍스트 압축 기법 적용

- **Risk 5: セキュリティ脆弱性(Prompt Injection、PII漏洩)**
  - Mitigation: 入力サニタイゼーション実装、プロンプトテンプレート固定化、PII検出とマスキング、ログ出力時の機密情報除外

- **Risk 6: 보안 취약점(Prompt Injection, PII 유출)**
  - Mitigation: 입력 정제(sanitization) 구현, 프롬프트 템플릿 고정, PII 탐지 및 마스킹, 로그 기록 시 민감정보 제외

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
