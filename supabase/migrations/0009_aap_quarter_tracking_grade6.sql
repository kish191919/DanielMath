-- AAP curriculum quarter tracking for grade 6.
--
-- Parents want to see whether their child is ahead of / on pace with the
-- school's AAP (advanced) pacing guide, not just "recent accuracy" — that
-- requires knowing (a) which pacing track a student is actually on, and
-- (b) which quarter each concept belongs to on that track. Neither existed
-- before this migration: `students` had no way to distinguish AAP from
-- standard-pace students, and `concepts` had no notion of "when" within
-- the school year a concept is taught.
--
-- Scope is deliberately grade-6-only for this pass (matches the academy's
-- own Q1-Q4 pacing content in src/lib/curriculum-data.ts, which is the
-- best-effort source these quarter tags are transcribed from). Grades 3-5
-- get the same new columns but no values yet — a future pass can tag them
-- the same way.

-- students.track: which pacing guide this student follows. Default
-- 'standard' backfills existing rows safely; the principal flips
-- individual students to 'advanced' via the edit form as needed.
alter table students
  add column track text not null default 'standard'
    check (track in ('standard', 'advanced'));

-- concepts: two independent nullable quarter columns rather than a single
-- quarter+track pair, because the same concept can sit at a different
-- quarter position per track (e.g. ops-order-of-operations: not an
-- explicit standard-track grade-6 topic since it's already mastered in
-- grade 5, but AAP grade 6 Q2 reintroduces it with brackets/absolute
-- value). Values below are grade-6-scoped only — a concept spanning
-- multiple grades (e.g. frac-mult, grades=['5','6']) gets ONE quarter
-- value applied regardless of which grade's heatmap is viewing it; a
-- future multi-grade AAP pass would need per-grade quarter columns or a
-- join table if that turns out to matter in practice.
alter table concepts
  add column quarter_standard text check (quarter_standard in ('Q1','Q2','Q3','Q4')),
  add column quarter_advanced text check (quarter_advanced in ('Q1','Q2','Q3','Q4'));

-- Tag the 21 existing grade-6 concepts against src/lib/curriculum-data.ts's
-- grade-6 standard/advanced quarter breakdown. UPDATE in place, keyed by
-- code, per the 0008 convention — ids stay untouched so learning_items
-- history keeps pointing at the same rows.
--
-- Where a standard-track topic reappears in a later quarter (원그래프:
-- Q1+Q4; 비/단위율 and 비례관계: Q2+Q4) only the first-introduction
-- quarter is tagged — the reinforcement/review pass isn't represented.

-- Q1: statistics + prerequisite algebra (standard); number system + stats (advanced)
update concepts set quarter_standard = 'Q1' where code = 'ps-circle-graph';
update concepts set quarter_standard = 'Q1' where code = 'ps-mean-balance-outliers';
update concepts set quarter_standard = 'Q1', quarter_advanced = 'Q2' where code = 'alg-inequalities';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q1' where code = 'ops-negative-numbers';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q1' where code = 'ops-exponents';
update concepts set quarter_advanced = 'Q1' where code = 'percent-basic';

-- Q2: rational numbers/ratio + coordinate plane (standard); algebra + two-step equations (advanced)
update concepts set quarter_standard = 'Q2', quarter_advanced = 'Q3' where code = 'word-ratio-rate';
update concepts set quarter_standard = 'Q2', quarter_advanced = 'Q3' where code = 'word-proportion';
update concepts set quarter_standard = 'Q2', quarter_advanced = 'Q3' where code = 'geo-coordinate-plane';
update concepts set quarter_standard = 'Q2' where code = 'geo-symmetry-transformations';
update concepts set quarter_advanced = 'Q2' where code = 'ops-order-of-operations';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q2' where code = 'alg-variables';

-- Q3: integer/fraction ops + one-step equations (standard); proportional reasoning + slope + similarity (advanced)
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q4' where code = 'frac-mult';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q4' where code = 'frac-div';
update concepts set quarter_standard = 'Q3' where code = 'alg-expressions';
update concepts set quarter_standard = 'Q3' where code = 'alg-equations-basic';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q4' where code = 'word-multi-step';

-- Q4: proportional reasoning + circle/area formulas (standard); probability + quadrilaterals + cylinders (advanced)
update concepts set quarter_standard = 'Q4' where code = 'geo-circles';
update concepts set quarter_standard = 'Q4' where code = 'geo-area-triangle-parallelogram';

-- frac-add-sub-unlike, dec-div: neither track's grade-6 quarter breakdown
-- names these as a standalone topic (already assumed prerequisite skill),
-- so both quarter columns stay null — cells render with no pace badge,
-- same as before this migration.

-- New AAP-only concepts: topics with zero existing matching row, so the
-- grading pipeline (src/lib/ai/grade-worksheet.ts) has nothing to tag them
-- with today. listConcepts()/the grading prompt read concepts dynamically
-- from this table, so these rows become taggable immediately, no code
-- change needed. sort_order values slot adjacent to the closest existing
-- sibling in the same strand; exact gaps don't matter, ordering is
-- relative-only.
insert into concepts (code, strand, label_ko, label_en, grades, sort_order, quarter_advanced) values
  ('ps-histogram', '확률과 통계', '히스토그램 만들기·비교·분석', 'Histograms', array['6'], 755, 'Q1'),
  ('ops-negative-exponents', '사칙연산', '음의 지수', 'Negative exponents', array['6'], 82, 'Q1'),
  ('ops-scientific-notation', '사칙연산', '과학적 표기법', 'Scientific notation', array['6'], 84, 'Q1'),
  ('ns-compare-rationals-signed', '사칙연산', '유리수(정수·분수·소수·백분율) 비교', 'Comparing signed rational numbers', array['6'], 86, 'Q1'),
  ('alg-simplify-expressions', '대수적 사고', '대수식 간소화와 동류항', 'Simplifying expressions', array['6'], 612, 'Q2'),
  ('alg-equations-two-step', '대수적 사고', '이단계 방정식', 'Two-step equations', array['6'], 632, 'Q2'),
  ('alg-slope-direct-variation', '대수적 사고', '기울기와 정비례 (y = mx)', 'Slope and direct variation', array['6'], 645, 'Q3'),
  ('geo-similar-figures-dilations', '도형', '닮음도형과 확대·축소', 'Similar figures and dilations', array['6'], 385, 'Q3'),
  ('ps-probability-theoretical-experimental', '확률과 통계', '이론적 확률 vs 실험적 확률', 'Theoretical vs experimental probability', array['6'], 765, 'Q4'),
  ('geo-cylinder-volume-surface-area', '도형', '원기둥의 부피와 겉넓이', 'Cylinder volume and surface area', array['6'], 390, 'Q4')
on conflict (code) do nothing;
