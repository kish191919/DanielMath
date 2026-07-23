-- Realigns the concepts taxonomy with the Virginia 2023 Mathematics Standards
-- of Learning (the standards FCPS actually follows). The original seed
-- (0002_seed_concepts.sql) was explicitly a starter list based on IXL/
-- Singapore Math, not FCPS/VA SOL — this migration closes the gaps found by
-- diffing that seed against the official 2023 VA Math SOL for grades 3-6:
-- missing standards (probability entirely, grade 3 data/graphs, place value,
-- prime factorization, GCF/LCM, solid shapes, quadrilateral classification,
-- linear inequalities), wrong grade tags (mean/median is a grade 5 standard,
-- not grade 6; coordinate plane is grade 6 only, not 5-6; symmetry/
-- transformations is grade 6 only), a duplicate coordinate-plane concept,
-- and a "surface area" label on a concept where surface area isn't in scope
-- for grades 3-6 at all.
--
-- Strand structure: kept the academy's existing 7 practical Korean strands
-- (사칙연산/분수/소수/도형/측정/문장제/대수적 사고) rather than renaming
-- everything to the 5 official VA SOL strand names — decided with the
-- principal so "문장제" (word problems) stays a useful bucket for reviewing
-- wrong answers by problem type. The one structural fix: probability/graphs/
-- mean-median were miscategorized under "측정" (Measurement) and move to a
-- new "확률과 통계" (Probability and Statistics) strand.

-- 1. Fix existing rows in place. UPDATE only (never DELETE a referenced
--    concept — learning_items.concept_id and generated_problems.concept_id
--    have no ON DELETE clause, so a bare DELETE on a referenced row would
--    fail the migration with a FK violation). code is the stable match key;
--    ids are untouched so existing learning_items/generated_problems keep
--    pointing at the same row.

-- 4.CE.2b: multiplication-fact automaticity extends to 12x12 in grade 4.
update concepts set grades = array['3','4']
  where code = 'ops-mult-facts';

-- 6.CE.2c: absolute value is part of the integer-operations standard.
update concepts set label_ko = '정수와 음수, 절댓값', label_en = 'Integers, negative numbers, and absolute value'
  where code = 'ops-negative-numbers';

-- 6.NS.3: perfect squares and powers of 10 are part of the exponents standard.
update concepts set label_ko = '거듭제곱과 완전제곱수', label_en = 'Exponents and perfect squares'
  where code = 'ops-exponents';

-- 6.CE.1d: unlike-denominator fraction add/sub is revisited at grade 6.
update concepts set grades = array['5','6']
  where code = 'frac-add-sub-unlike';

-- 6.CE.1: fraction/mixed-number multiplication is a grade 6 standard too.
update concepts set grades = array['5','6']
  where code = 'frac-mult';

-- 4.NS.5 is the actual introduction grade for fraction-decimal equivalence
-- (halves/fourths/fifths/tenths/hundredths); 5.NS.1 extends it (thirds,
-- eighths, factors of 100). The seed only had grade 5.
update concepts set grades = array['4','5']
  where code = 'dec-frac-convert';

-- 4.MG.4 is identifying points/lines/segments/rays/angles, not angle
-- measurement (that's 5.MG.3) — the old label overstated this concept.
update concepts set label_ko = '점, 선, 선분, 반직선, 각의 이해', label_en = 'Points, lines, segments, rays, and angles'
  where code = 'geo-angles';

-- Connects 3.MG.2 (area by counting square units) to 4.MG.3 (area/perimeter
-- formula for rectangles/squares) as one progression.
update concepts set label_ko = '넓이 구하기', label_en = 'Area (counting squares to rectangle formula)', grades = array['3','4']
  where code = 'geo-area-rectangle';

-- Surface area is not part of the VA 2023 SOL for grades 3-6 (it's a later
-- grade topic) — only volume (5.MG.2) belongs here.
update concepts set label_ko = '부피', label_en = 'Volume'
  where code = 'geo-volume';

-- 6.MG.3 is the only grade with a coordinate-plane standard; grade 5 has none.
update concepts set grades = array['6']
  where code = 'geo-coordinate-plane';

-- 6.MG.4 (congruence, lines of symmetry on regular polygons) is grade 6
-- only — the 2023 SOL has no symmetry/transformation standard at grades 4-5.
update concepts set grades = array['6'], label_ko = '합동과 대칭 (정다각형)', label_en = 'Congruence and symmetry of regular polygons'
  where code = 'geo-symmetry-transformations';

-- 5.PFA.1 extends pattern work to fractions and decimals at grade 5.
update concepts set grades = array['3','4','5']
  where code = 'alg-patterns';

-- Move out of "측정" (Measurement) into the new "확률과 통계" strand, and
-- narrow to the grade-specific standard it actually matches: 4.PS.1 is line
-- graphs specifically (grade 3's pictographs/bar graphs and grade 5/6's
-- other graph types get their own new rows below).
update concepts
  set strand = '확률과 통계', label_ko = '꺾은선그래프', label_en = 'Line graphs', grades = array['4'], sort_order = 710
  where code = 'meas-data-graphs';

-- 5.PS.2 (mean/median/mode/range) is the actual standard grade, not 6 —
-- 6.PS.2 is a distinct grade-6-only extension (added as ps-mean-balance-
-- outliers below).
update concepts
  set strand = '확률과 통계', label_ko = '평균, 중앙값, 최빈값과 범위', label_en = 'Mean, median, mode, and range', grades = array['5'], sort_order = 740
  where code = 'meas-mean-median';

-- 2. Consolidate the coordinate-plane duplicate (geo-coordinate-plane and
--    alg-coordinate-graphing both cover 6.MG.3). Remap any existing history
--    onto the canonical row (geo-coordinate-plane, matching the official
--    Measurement and Geometry strand) before retiring the duplicate — a
--    bare is_active=false would silently split a student's coordinate-plane
--    accuracy history across two concept rows instead of merging it.
update learning_items
  set concept_id = (select id from concepts where code = 'geo-coordinate-plane')
  where concept_id = (select id from concepts where code = 'alg-coordinate-graphing');

update generated_problems
  set concept_id = (select id from concepts where code = 'geo-coordinate-plane')
  where concept_id = (select id from concepts where code = 'alg-coordinate-graphing');

delete from concepts where code = 'alg-coordinate-graphing';

-- 3. Add concepts for VA SOL standards that had no corresponding row at all.
insert into concepts (code, strand, label_ko, label_en, grades, sort_order) values
  ('ns-place-value', '사칙연산', '자릿값의 이해', 'Place value understanding', array['3','4'], 5),
  ('ns-compare-order-whole', '사칙연산', '정수 비교와 순서', 'Comparing/ordering whole numbers', array['3','4'], 6),
  ('ns-factors-gcf', '사칙연산', '약수와 최대공약수', 'Factors and greatest common factor', array['4'], 85),
  ('ns-prime-composite', '사칙연산', '소수와 합성수, 소인수분해', 'Prime and composite numbers, prime factorization', array['5'], 90),
  ('ns-lcm-lcd', '사칙연산', '최소공배수와 통분', 'Least common multiple and common denominators', array['5'], 95),

  ('geo-quadrilaterals', '도형', '사각형의 분류', 'Classifying quadrilaterals', array['4'], 315),
  ('geo-solid-shapes', '도형', '입체도형 (각기둥, 원기둥, 원뿔, 구)', '3D solid shapes', array['4'], 335),
  ('geo-angle-triangle-classify', '도형', '각과 삼각형의 분류·측정', 'Classifying and measuring angles and triangles', array['5'], 345),

  ('ps-pictograph-bargraph', '확률과 통계', '픽토그램과 막대그래프', 'Pictographs and bar graphs', array['3'], 700),
  ('ps-line-plot-stemleaf', '확률과 통계', '점그림표와 줄기와 잎 그림', 'Line plots and stem-and-leaf plots', array['5'], 720),
  ('ps-circle-graph', '확률과 통계', '원그래프', 'Circle graphs', array['6'], 730),
  ('ps-mean-balance-outliers', '확률과 통계', '평균의 균형점과 이상치의 영향', 'Mean as balance point; effect of outliers', array['6'], 750),
  ('ps-probability-basic', '확률과 통계', '확률의 기초', 'Basic probability of simple events', array['4'], 760),
  ('ps-sample-space-counting', '확률과 통계', '표본공간과 경우의 수', 'Sample space and the counting principle', array['5'], 770),

  ('alg-inequalities', '대수적 사고', '일차부등식', 'Linear inequalities in one variable', array['6'], 635)
on conflict (code) do nothing;
