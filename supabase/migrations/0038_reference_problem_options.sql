-- 객관식 보기(A/B/C.../1)/2)/3)... 등)를 지문(problem_text)에 통째로 묻어두지 않고
-- 구조화된 데이터로 저장한다. print/page.tsx가 보기를 지문에서 분리해 별도
-- 그리드로 그릴 수 있도록(학습지 디자인 리뷰에서 확인된 가독성 문제 해결), 추출
-- 단계(extract-reference-problems.ts)에서부터 채워 넣는다.
--
-- reference_problems에는 transcribed_problem/translated_problem과 동일한 이중
-- 구조로 전사 단계와 번역 단계 양쪽에 options를 둔다 — 번역이 아직 안 됐거나
-- 실패했을 때도 workspace 미리보기(practice-sheet-generator-workspace.tsx)가
-- 깨끗하게 구조화된 보기를 보여줄 수 있어야 하기 때문이다.
--
-- 모두 nullable — 서술형(주관식) 문제는 지금처럼 options가 항상 null이며, 모든
-- 소비처는 options == null 여부로만 분기해야 한다(텍스트 내용으로 객관식 여부를
-- 추측하지 않는다). 기존 행에 대한 소급 백필은 하지 않는다.
alter table reference_problems
  add column transcribed_options jsonb,
  add column transcribed_correct_option text,
  add column translated_options jsonb,
  add column translated_correct_option text,
  -- solved_answer(0037)와 병행. 원본에 정답이 인쇄되어 있지 않아 AI가 직접
  -- 풀었을 때, 계산한 값이 주어진 보기 중 하나와 확실히 일치할 때만 채운다 —
  -- solved_answer와 달리 not required. 애매하면 억지로 letter를 지어내지 않고
  -- null로 남긴다(잘못된 letter가 값보다 더 위험하기 때문).
  add column solved_correct_option text;

alter table generated_problems
  add column options jsonb,
  add column correct_option text;

-- RLS: reference_problems/generated_problems 모두 기존 정책이 테이블 단위로
-- 걸려 있어(0022/0005) 컬럼 추가만으로는 정책 변경이 필요 없다.
