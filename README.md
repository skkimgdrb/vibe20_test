# 백화점 고객 설문조사 대시보드

구글 스프레드시트의 설문조사 데이터를 Next.js로 시각화하는 대시보드입니다.

## 기능

- 구글 스프레드시트에서 실시간 데이터 가져오기
- 7가지 차트로 데이터 시각화:
  - 통계 요약 카드 (총 응답 수, 평균 별점, 전체 만족도 평균)
  - 성별 분포 (파이 차트)
  - 연령대 분포 (막대 차트)
  - 방문 빈도 분포 (막대 차트)
  - 만족도 항목별 평균 (막대 차트)
  - 별점 분포 (막대 차트)
  - 방문 목적 분석 (막대 차트)

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```
GOOGLE_SHEETS_SPREADSHEET_ID=1n92IlawRcq6n5bh2vWQU0eGrRFkFhHMmvFQysn_36GU
GOOGLE_SHEETS_SHEET_GID=951142470
GOOGLE_APPLICATION_CREDENTIALS=./credentials/dashboard-study-483108-9eb3107ad688.json
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:3000` 접속

## 중요 사항

- 서비스 계정 키 파일(`credentials/dashboard-study-483108-9eb3107ad688.json`)은 보안상 `.gitignore`에 포함되어 있습니다.
- 구글 스프레드시트에 서비스 계정 이메일(`dashboard-bot@dashboard-study-483108.iam.gserviceaccount.com`)에 대한 읽기 권한을 부여해야 합니다.

## 문제 해결

### Google Sheets API 활성화 오류

에러 메시지: `Google Sheets API has not been used in project...`

**해결 방법:**

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 선택: `dashboard-study-483108`
3. "API 및 서비스" > "라이브러리" 메뉴로 이동
4. "Google Sheets API" 검색
5. "사용 설정" 클릭

또는 직접 링크:
- https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=dashboard-study-483108

### 스프레드시트 접근 권한 오류

에러 메시지: `스프레드시트 접근 권한이 없습니다`

**해결 방법:**

1. 구글 스프레드시트 열기
2. 우측 상단 "공유" 버튼 클릭
3. 서비스 계정 이메일 추가: `dashboard-bot@dashboard-study-483108.iam.gserviceaccount.com`
4. 권한: "뷰어" 선택
5. "완료" 클릭

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Google Sheets API

