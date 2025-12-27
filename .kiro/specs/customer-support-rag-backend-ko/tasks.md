# Implementation Plan

## 1. 프로젝트 기반과 셋업

- [ ] 1.1 (P) Python 개발 환경 및 프로젝트 구조 셋업
  - Python 3.11+ 설치 확인 및 버전 고정
  - FastAPI, Uvicorn, Pydantic, sse-starlette 의존성 정의
  - 프로젝트 디렉터리 구조 생성(app/, tests/, config/)
  - 환경 변수 관리 체계 구축(.env.example 템플릿 생성)
  - _Requirements: 6_

- [ ] 1.2 (P) 개발 도구 및 코드 품질 관리 셋업
  - linter(ruff), formatter(black), 타입 체커(mypy) 설정
  - pre-commit 훅 설정
  - pytest 테스트 환경 구축
  - _Requirements: 6_

- [ ] 1.3 (P) Docker 컨테이너화 환경 셋업
  - Dockerfile 작성(Python 3.11 베이스 이미지, 멀티 스테이지 빌드)
  - docker-compose.yml 작성(API, VectorDB 개발 환경)
  - 컨테이너 내부 개발 워크플로 확인
  - _Requirements: 6_

## 2. 외부 서비스 통합 레이어 구현

- [ ] 2.1 (P) OpenAI Embeddings API 통합
  - OpenAI Python SDK 설치 및 설정
  - 임베딩 생성 기능 구현(text-embedding-3-small 사용)
  - 토큰 수 카운트 기능 구현(tiktoken 사용)
  - 레이트 리밋 에러 핸들링 및 지수 백오프 재시도 구현
  - 커넥션 풀링 설정(타임아웃 10초)
  - _Requirements: 2_

- [ ] 2.2 (P) Vector Database(Pinecone) 통합
  - Pinecone Python SDK 설치 및 설정
  - 벡터 검색 기능 구현(Top-K 검색, cosine similarity)
  - relevance_score 임계값 필터링 구현(기본 0.7)
  - 커넥션 풀링 설정(최대 10 커넥션, 타임아웃 5초)
  - 연결 에러 재시도 로직 구현(지수 백오프)
  - _Requirements: 2_

- [ ] 2.3 (P) OpenAI LLM API 통합 및 스트리밍 구현
  - OpenAI Chat Completions API 스트리밍 호출 구현(stream=True)
  - 프롬프트 템플릿 구성 기능 구현
  - 토큰 제한 관리 및 컨텍스트 절단(Truncation) 로직 구현
  - 스트리밍 토큰 수신 및 이벤트 변환 처리
  - 타임아웃 설정(30초) 및 에러 핸들링
  - _Requirements: 3, 4_

## 3. 코어 서비스 로직 구현

- [ ] 3.1 RAG Orchestrator 구현
  - 문의 처리 플로우 전체 조정 로직 구현(Embedding → Retrieval → Generation)
  - 각 서비스 비동기 호출 및 에러 핸들링
  - relevance_score 임계값 체크 및 "정보 부족" 에러 생성
  - 컨텍스트 토큰 수 검증 및 LLM 제한 체크(80% 제한)
  - 서킷 브레이커 패턴 구현(30초 동안 5회 실패 시 회로 오픈)
  - 재시도 로직 통합(지수 백오프, 최대 3회)
  - _Requirements: 4, 5_

- [ ] 3.2 (P) 입력 검증 및 새니타이징 기능 구현
  - Pydantic 모델로 요청 스키마 정의(InquiryRequest)
  - 필수 필드 검증(inquiry_text, session_id)
  - 길이 제한 체크(inquiry_text 최대 10000자)
  - UTF-8 인코딩 검증
  - Prompt Injection 대응을 위한 입력 새니타이징
  - _Requirements: 1, 7_

- [ ] 3.3 (P) 에러 핸들링 및 응답 생성 기능 구현
  - 각 에러 카테고리 타입 정의(4xx, 5xx, 비즈니스 로직 에러)
  - 에러 응답 스키마 구현(ErrorResponse)
  - 구조화 로그 출력 기능 구현(JSON 형식, correlation ID 부여)
  - PII 정보 마스킹 처리
  - _Requirements: 5, 7, 8_

## 4. API Layer 구현

- [ ] 4.1 FastAPI 문의 엔드포인트 구현
  - POST /api/inquiries 엔드포인트 구현
  - 요청 수신 및 검증 처리 통합
  - RAG Orchestrator로 요청 위임
  - 동시 요청 처리 지원(async/await)
  - _Requirements: 1_

- [ ] 4.2 SSE 스트리밍 응답 구현
  - sse-starlette의 EventSourceResponse를 사용한 스트리밍 구현
  - Async generator로 토큰 스트림 생성
  - SSE 이벤트 스키마 구현(token, complete, error 이벤트)
  - 연결 상태 관리 및 graceful shutdown 처리
  - 스트리밍 중 에러 핸들링 및 에러 이벤트 전송
  - _Requirements: 3_

- [ ] 4.3 (P) 인증 미들웨어 구현
  - API Key 인증 기능 구현(X-API-Key 헤더 검증)
  - 레이트 리밋 기능 구현(API Key당 1000 req/min)
  - 인증 오류 시 401 에러 반환(상세 정보 비공개)
  - FastAPI Dependency Injection을 통한 미들웨어 통합
  - _Requirements: 7_

## 5. 관측 가능성 및 모니터링 기능 구현

- [ ] 5.1 (P) 헬스 체크 엔드포인트 구현
  - GET /health 엔드포인트 구현
  - 자기 진단 기능(메모리 사용률, CPU 사용률)
  - 외부 서비스 연결성 확인(VectorDB, OpenAI API) 병렬 실행
  - HealthCheckResponse 스키마 구현(healthy/degraded/unhealthy 판정)
  - 100ms 이내 응답 반환 보장
  - _Requirements: 6, 8_

- [ ] 5.2 (P) Prometheus 메트릭 엔드포인트 구현
  - GET /metrics 엔드포인트 구현(prometheus-client 사용)
  - 요청 메트릭 수집(http_requests_total, http_request_duration_seconds)
  - 컴포넌트별 레이턴시 메트릭(rag_retrieval_latency_seconds, rag_generation_latency_seconds, rag_total_latency_seconds)
  - 외부 API 메트릭 수집(external_api_calls_total, external_api_latency_seconds)
  - 에러 메트릭 수집(errors_total)
  - _Requirements: 8_

- [ ] 5.3 (P) 구조화 로그 출력 기능 구현
  - JSON 형식 로그 출력 구현(structlog 또는 표준 logging 모듈 확장)
  - 요청 ID 생성 및 전체 라이프사이클에서 트레이싱
  - 컴포넌트별 로그 레벨 설정
  - PII 정보 자동 마스킹
  - _Requirements: 8_

## 6. 통합 및 엔드투엔드 기능 구현

- [ ] 6.1 전체 컴포넌트 통합 및 FastAPI 애플리케이션 셋업
  - FastAPI 애플리케이션 인스턴스 생성
  - 각 엔드포인트 라우터 등록
  - 미들웨어 등록(인증, 로깅, 메트릭 수집)
  - CORS 설정(필요 시)
  - 환경 변수에서 설정 로드
  - Uvicorn 서버 기동 스크립트 생성
  - _Requirements: 1, 6_

- [ ] 6.2 에러 리커버리 및 레질리언스 기능 통합 테스트
  - 재시도 로직 동작 확인(Embedding, VectorDB, LLM API 장애 시)
  - 서킷 브레이커 동작 확인(연속 실패 시 회로 오픈)
  - 타임아웃 설정 검증(각 API 호출 및 전체 플로우)
  - 외부 서비스 장애 시 503 에러 반환 확인
  - _Requirements: 5_

## 7. 테스트 구현

- [ ] 7.1 (P) Embedding Service 유닛 테스트 구현
  - 정상 케이스: 유효 텍스트 임베딩 생성
  - 비정상 케이스: 토큰 제한 초과 에러
  - 비정상 케이스: 레이트 리밋 에러 및 재시도 로직
  - 비정상 케이스: 서비스 장애 시 에러 핸들링
  - _Requirements: 2_

- [ ] 7.2 (P) Document Retriever 유닛 테스트 구현
  - 정상 케이스: Top-K 검색 및 relevance_score 랭킹
  - relevance_score 임계값 필터링 검증
  - 연결 에러 시 재시도 로직 검증
  - 검색 결과 없음 시 NoResultsError 반환 확인
  - _Requirements: 2_

- [ ] 7.3 (P) Response Generator 유닛 테스트 구현
  - 프롬프트 템플릿 구성 로직 검증
  - 토큰 제한 관리 및 절단 로직 검증
  - 스트리밍 이벤트 생성 검증(token, complete, error)
  - LLM API 타임아웃 시 에러 핸들링 확인
  - _Requirements: 3, 4_

- [ ] 7.4 (P) 인증 미들웨어 유닛 테스트 구현
  - 정상 케이스: 유효 API Key 검증
  - 비정상 케이스: 무효 API Key에서 401 에러
  - 레이트 리밋 초과 시 429 에러 반환 확인
  - 인증 에러 상세 정보 비공개 확인
  - _Requirements: 7_

- [ ] 7.5 RAG Orchestrator 통합 테스트 구현
  - End-to-End 플로우 검증(임베딩 생성 → 문서 검색 → 응답 생성)
  - relevance_score 임계값 미만 시 "정보 부족" 에러 확인
  - 토큰 제한 초과 시 문서 절단 동작 확인
  - 외부 서비스 장애 시 재시도 및 서킷 브레이커 동작 확인
  - _Requirements: 2, 3, 4, 5_

- [ ] 7.6 SSE 스트리밍 통합 테스트 구현
  - 클라이언트 연결부터 스트림 수신까지의 플로우 검증
  - 토큰 이벤트 순서 확인
  - complete 이벤트 수신 확인(total_tokens, sources 정보)
  - 에러 이벤트 수신 및 연결 종료 확인
  - 연결 단절 시 graceful shutdown 확인
  - _Requirements: 3_

- [ ] 7.7 (P) 헬스 체크 및 메트릭 엔드포인트 테스트 구현
  - /health 엔드포인트 응답 검증(healthy/degraded/unhealthy)
  - 외부 서비스 장애 시 상태 변화 확인
  - 100ms 이내 응답 보장 확인
  - /metrics 엔드포인트 Prometheus 포맷 검증
  - _Requirements: 6, 8_

- [ ] 7.8 API 엔드포인트 E2E 테스트 구현
  - 정상 케이스 풀 플로우: 문의 전송 → 스트리밍 응답 수신
  - 에러 시나리오: 무효 요청(400), 인증 실패(401), 서비스 장애(503)
  - 동시 요청 처리 검증(100 동시 요청)
  - 타임아웃 시나리오 검증(504 에러)
  - _Requirements: 1, 3, 5, 7_

- [ ] 7.9* (P) 성능 테스트 구현
  - 부하 테스트: 1000 req/min 안정성 확인
  - p95 레이턴시 측정(문서 검색 2초 이내, 스트리밍 시작 3초 이내)
  - 벡터 검색 성능 테스트(10000 문서 인덱스)
  - 수평 스케일링 검증(3 인스턴스 부하 분산)
  - _Requirements: 6_

## 8. 배포 설정 및 문서화

- [ ] 8.1 (P) 환경 변수 및 설정(Configuration) 관리 정비
  - .env.example 템플릿 완성(전체 환경 변수 문서화)
  - 환경별 설정 파일 작성(dev, staging, production)
  - 설정 검증 기능 구현(기동 시 필수 환경 변수 체크)
  - _Requirements: 6, 7_

- [ ] 8.2 (P) OpenAPI 문서 생성 및 검증
  - FastAPI 자동 OpenAPI 문서 생성 확인
  - /docs 엔드포인트에서 Swagger UI 확인
  - 요청/응답 스키마 완전성 검증
  - 에러 응답 문서화 확인
  - _Requirements: 1_

## 작업 완료 조건

모든 작업이 완료되고 아래 조건을 만족하면 구현 완료로 간주한다:

- 전체 요구사항(1-8)이 구현 작업에 정확히 매핑되어 있다
- 전체 유닛 테스트가 성공한다
- 전체 통합 테스트가 성공한다
- E2E 테스트가 성공한다
- 성능 테스트에서 요구사항 6 기준(헬스 체크 100ms, 검색 2초, 스트리밍 3초)을 만족한다
- 전체 엔드포인트가 정상 동작한다
- OpenAPI 문서가 완전하게 생성되어 있다
