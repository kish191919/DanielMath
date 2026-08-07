-- "원본 그대로"(verbatim) 학습지 생성 시, 원본 스캔에 정답이 없던 문제도
-- "(정답 미확인)" placeholder 대신 AI가 실제로 풀이한 답을 채워 넣을 수
-- 있도록 한다 (extractReferenceProblems / solve-reference-problems.ts).
-- 정확도보다 커버리지가 우선이라 이 답은 틀릴 수 있음을 전제로 하며,
-- 그래서 절대 translated_answer 자체를 대체하지 않는다 —
-- translated_answer는 "원본에서 실제로 옮겨 적은 정답, 절대 추측 금지"라는
-- 기존 계약(translate-reference-problems.ts PERSONA)을 계속 지켜야 하므로
-- 별도 컬럼에 넣는다.
alter table reference_problems
  -- 번역 직후 같은 백그라운드 잡에서(best-effort) 채워짐. translated_problem이
  -- null이 아니고 translated_answer가 여전히 null인 행에 대해서만 시도한다.
  add column solved_answer text,
  -- 풀이 호출 자체가 실패했을 때만 채워짐(잘못된 답을 내놓는 것은 정상
  -- 동작이며 에러가 아님) — translation_error와 동일한 역할, 워크스페이스에서
  -- resolveReferenceAnswerAction으로 재시도 가능.
  add column solve_error text;

alter table generated_problems
  -- verbatim 항목의 answer_text가 원본 스캔에서 나온 실제 정답이 아니라
  -- solved_answer(또는 그마저 없어 "(정답 미확인)" placeholder)로 채워졌을
  -- 때만 true. 리뷰 테이블(practice-sheet-review-table.tsx)이 "AI 추정 정답 ·
  -- 확인 필요" 배지를 띄우는 데 쓰인다. print/page.tsx는 problem_text/
  -- answer_text/crop_image_url만 읽고 이 컬럼을 참조하지 않으므로 인쇄물에는
  -- 구조적으로 노출되지 않는다.
  add column answer_needs_review boolean not null default false;

-- RLS: 두 테이블 모두 0022/0005에서 이미 is_principal() 단위(테이블 단위)로
-- 정책이 걸려 있어 컬럼 추가만으로는 정책 변경이 필요 없다.
