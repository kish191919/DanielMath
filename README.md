# Daniel Math · 다니엘 수학공부방

북버지니아(NoVa) 한인 K-6 학생을 위한 영재 수학 공부방 웹사이트.
AAP(Fairfax County Advanced Academic Program) 진입·유지를 목표로 하는 학생 대상.

운영 인프라: **Vercel + Supabase + Claude API**.

## Phase

- **Phase A (현재)**: 마케팅 사이트 — 랜딩, 프로그램, 수업료, 상담 신청 폼
- **Phase B (예정)**: 관리자 도구 — 학생 관리, 학습지 생성, 사진 업로드 → AI 채점
- **Phase C (예정)**: 학부모 포털 — 일·월 리포트 열람

## Tech

- **Next.js 16** (App Router, src/, Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (`@theme` CSS-first config)
- **Inter + Noto Sans KR** (next/font/google)
- **react-hook-form + zod** (폼 검증)
- **lucide-react** (아이콘)

## 개발

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 프로덕션 빌드 검증
npm run lint   # ESLint
```

## 환경변수

`.env.example` 참고. Phase A에서는 환경변수 없이도 동작합니다.
Phase B에서 Supabase / Anthropic / Resend 변수가 활성화됩니다.

## 라우트

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 (Hero, Programs preview, Why Us, Curriculum, Testimonials, CTA) |
| `/programs` | 두 트랙 비교 |
| `/programs/aap-entry` | K-2 AAP 진입 트랙 상세 |
| `/programs/aap-honors` | 3-6 AAP 유지·심화 트랙 상세 |
| `/tuition` | 수업료 안내 (수치는 placeholder) |
| `/inquire` | 상담 신청 폼 |
| `/thanks` | 폼 제출 완료 |
| `/sitemap.xml`, `/robots.txt` | 자동 생성 |

## Placeholder로 남긴 콘텐츠

실제 운영 정보로 교체 필요한 곳:

- `/tuition` 의 월 수업료 (`$XXX`)
- `/programs/aap-entry`, `/programs/aap-honors` 의 시간·정원 (예시 값)
- `/` 랜딩의 학부모 후기 (3개, 익명 placeholder)
- `src/lib/site-config.ts` 의 `contactEmail`

## 디자인 결정사항

- **컬러**: 딥 네이비 (`navy-900` = `#0a1f3d`) + 화이트
- **언어**: 한영 병기 (마케팅), 부모 화면 한국어, 학생 학습 영어 (Phase B+)
- **강사 정보**: 노출하지 않음
- **다크모드**: 미사용 (학부모 친화 라이트 모드)
- **COPPA**: 학부모만 회원가입, 학생 직접 등록 차단 (Phase B+)

## 배포

Vercel에 자동 배포. 도메인: `danielmath.com`.
