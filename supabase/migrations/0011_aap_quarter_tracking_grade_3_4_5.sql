-- AAP curriculum quarter tracking for grades 3-5 (0009 covered grade 6 only,
-- and explicitly deferred this as "a future pass" — see 0009's own comment).
-- Same purpose as 0009: let the heatmap tell a parent/principal whether a
-- student is ahead of / on pace with / behind the school's quarter-by-quarter
-- pacing, for every grade, not just 6.
--
-- Source: src/lib/curriculum-data.ts's grade-3/4/5 standard+advanced Q1-Q4
-- breakdowns (the academy's own best-effort FCPS pacing transcription — same
-- source 0009 used for grade 6). Matched to existing `concepts` rows by grade
-- + topical meaning, the same way 0008/0009 already did; UPDATE only, keyed
-- by `code`, ids untouched.
--
-- Three structural notes carried over from 0009, now hit repeatedly here:
--
-- 1. "Advanced" track for grade N is literally grade-(N+1) SOL content taught
--    a year early. Where that content already has a concept row scoped to
--    the later grade only, this migration EXTENDS that row's `grades` array
--    to include the earlier grade — otherwise getConceptHeatmap's
--    `concept.grades.includes(grade)` filter would silently drop it from
--    that earlier grade's heatmap even after this migration. This closes a
--    real pre-existing gap, not something newly introduced.
--
-- 2. A concept has only two quarter columns total, so more than two
--    grade/track combinations can legitimately want to write to the same
--    column on a shared row. Rule applied throughout: NEVER overwrite a
--    quarter value 0009 already set for grade 6 — extend `grades` so the
--    concept becomes visible to the earlier grade, but leave the existing
--    value in place and comment on the approximation. Where two grades in
--    THIS migration's own scope collide on the same column (e.g. grade 3
--    introduces a topic in one quarter, grade 4 revisits it in another), the
--    earlier grade's quarter wins (mirrors 0009's own "first introduction
--    quarter only" convention for reappearing standard-track topics).
--
-- 3. Several curriculum-data.ts bullets are generic combined-skill sentences
--    ("solve addition/subtraction problems using graph data") with no
--    standalone concept row and none is invented for them here — same
--    treatment 0009 gave frac-add-sub-unlike/dec-div for grade 6.
--
-- No schema change needed; quarter_standard/quarter_advanced already exist.

-- ── Grade 3 ──────────────────────────────────────────────────────────────
-- standard = Virginia SOL 3; advanced = Virginia SOL 4 taught a year early.

-- Q1 (standard): data collection/pictographs/bar graphs; 6-digit place value.
-- Q1 (advanced): same data strand extended to line graphs (grade-4 std
-- content); 6- and 9-digit place value/comparison (also grade-4 std's own
-- Q1 topic — same quarter, no collision).
update concepts set quarter_standard = 'Q1', quarter_advanced = 'Q1' where code = 'ps-pictograph-bargraph';
update concepts set grades = array['3','4'], quarter_standard = 'Q1', quarter_advanced = 'Q1' where code = 'meas-data-graphs';
update concepts set quarter_standard = 'Q1', quarter_advanced = 'Q1' where code = 'ns-place-value';
update concepts set quarter_standard = 'Q1', quarter_advanced = 'Q1' where code = 'ns-compare-order-whole';
update concepts set quarter_standard = 'Q1' where code = 'ops-add-sub-multi-digit';

-- Q2 (standard): multiplication/division facts to 10x10; polygon
-- classification. (advanced): same fact fluency extended to 12x12 + GCF
-- (grade-4 std's own Q2 topics, same quarter); long division; points/
-- lines/angles and quadrilateral classification (grade-4 std content).
update concepts set quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'ops-mult-facts';
update concepts set quarter_standard = 'Q2' where code = 'ops-division-basic';
update concepts set quarter_standard = 'Q2' where code = 'geo-2d-shapes';
update concepts set grades = array['3','4'], quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'ns-factors-gcf';
update concepts set grades = array['3','4','5'], quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'ops-division-long';
update concepts set grades = array['3','4'], quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'geo-angles';
update concepts set grades = array['3','4'], quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'geo-quadrilaterals';

-- Q3 (standard): fraction basics; length/weight/volume measuring; area
-- (counting squares) and perimeter. (advanced): 2-/3-digit x 1-digit
-- multiplication (grade-4 std's own Q2 topic — earlier quarter for grade 4,
-- kept as-is per the first-introduction rule; grade 3 advanced meets it a
-- quarter later at its own Q3, a different column so no collision); deeper
-- unit measuring; rectangle area/perimeter FORMULA development (grade 4's
-- own VA SOL 4.MG.3 standard, not otherwise restated in curriculum-data.ts's
-- grade-4-standard section, so tagged here from its grade-3-advanced
-- appearance).
update concepts set quarter_standard = 'Q3' where code = 'frac-basic-concept';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q3' where code = 'geo-perimeter';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q3' where code = 'geo-area-rectangle';
update concepts set grades = array['3','4'], quarter_standard = 'Q3', quarter_advanced = 'Q3' where code = 'meas-units-length-weight';
-- ops-mult-multi-digit: grade-4 std introduces 2-/3-digit x 1-digit at its
-- own Q2 (kept for quarter_standard); grade-3 advanced meets the identical
-- skill at its own Q3 (quarter_advanced) — different columns, no collision.
-- Grade-4 advanced (=grade-5 std) revisits it again at Q2 for 2-digit x
-- 2-digit; not separately representable with two columns, left as the Q3
-- approximation below.
update concepts set grades = array['3','4','5'], quarter_standard = 'Q2', quarter_advanced = 'Q3' where code = 'ops-mult-multi-digit';

-- Q4 (standard): comparing/ordering fractions to benchmarks (extends
-- frac-compare-order down from grade 4 only); equivalent fractions; time to
-- the minute and elapsed time; money. (advanced): fraction
-- composing/decomposing + comparison (grade-4 std's own Q2 topic).
update concepts set grades = array['3','4'], quarter_standard = 'Q4', quarter_advanced = 'Q2' where code = 'frac-compare-order';
update concepts set quarter_standard = 'Q4', quarter_advanced = 'Q2' where code = 'frac-equivalence';
update concepts set quarter_standard = 'Q4', quarter_advanced = 'Q4' where code = 'meas-time-elapsed';
update concepts set quarter_standard = 'Q4' where code = 'meas-money';

-- ── Grade 4 ──────────────────────────────────────────────────────────────
-- standard = Virginia SOL 4; advanced = Virginia SOL 5 taught a year early.
-- (Several grade-4-standard concepts were already tagged above alongside
-- their grade-3-advanced counterpart, since curriculum-data.ts's grade-3-
-- advanced and grade-4-standard sections cover the same VA SOL 4 content.)

-- Q1 (standard, not already covered above): probability as a fraction.
-- (advanced): prime/composite + prime factorization; order of operations
-- (PEMDAS) — grade-5 std's own Q1 topic, same quarter as grade-6-advanced's
-- existing 0009 tag on this row (quarter_advanced left untouched, PEMDAS
-- quarter_standard was empty so it's set fresh here).
update concepts set quarter_standard = 'Q1' where code = 'ps-probability-basic';
update concepts set grades = array['4','5','6'], quarter_standard = 'Q1', quarter_advanced = 'Q2' where code = 'ns-prime-composite';
update concepts set quarter_standard = 'Q1' where code = 'ops-order-of-operations';

-- Q2 (advanced): line plots + stem-and-leaf plots (grade-5 std's own Q1
-- topic).
update concepts set grades = array['4','5'], quarter_standard = 'Q1', quarter_advanced = 'Q1' where code = 'ps-line-plot-stemleaf';

-- Q3 (standard): decimal place value, comparison, fraction<->decimal
-- conversion, decimal add/sub. (advanced): same four skills one quarter
-- earlier for grade-4-advanced kids, i.e. grade-5-std content — except
-- dec-compare-order/dec-frac-convert, where grade-5-std's OWN restatement of
-- these (its Q2) collides with grade-4-std's Q3 introduction on the same
-- quarter_standard column; grade 4 (earlier grade) wins per the first-
-- introduction rule, grade 5's Q2 mention is left as an unrepresented
-- reinforcement.
update concepts set quarter_standard = 'Q3' where code = 'dec-place-value';
update concepts set grades = array['4','5'], quarter_standard = 'Q3' where code = 'dec-compare-order';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q3' where code = 'dec-add-sub';
update concepts set quarter_standard = 'Q3', quarter_advanced = 'Q3' where code = 'dec-frac-convert';

-- Q4 (standard): like-denominator fraction add/sub; whole number x unit
-- fraction; probability outcomes; points/lines/angles; quadrilaterals;
-- solid shapes; unit measuring + conversion. (advanced): unlike-denominator
-- fraction add/sub (grade-5 std's own Q3 topic); angle/triangle
-- classification (grade-5 std's own Q4 topic).
update concepts set quarter_standard = 'Q4' where code = 'frac-add-sub-like';
update concepts set grades = array['4','5','6'], quarter_standard = 'Q3', quarter_advanced = 'Q4' where code = 'frac-add-sub-unlike';
-- ps-probability-basic also reappears here as a Q4 word-problem/creation
-- exercise; first-introduction quarter (Q1, tagged above) is kept, this
-- reinforcement pass is intentionally not re-tagged.
update concepts set quarter_standard = 'Q4' where code = 'geo-solid-shapes';
update concepts set grades = array['4','5'], quarter_standard = 'Q4', quarter_advanced = 'Q4' where code = 'geo-angle-triangle-classify';
update concepts set grades = array['3','4','5'], quarter_standard = 'Q4' where code = 'meas-unit-conversion';

-- ── Grade 5 ──────────────────────────────────────────────────────────────
-- standard = Virginia SOL 5; advanced = Virginia SOL 6 taught a year early
-- (this is the grade whose advanced track lines up with grade 6's own
-- pacing, already tagged by 0009 — most of this section is `grades`
-- extensions onto already-tagged grade-6 rows, not new quarter values).

-- Q1 (standard): mean/median/mode/range; variables + writing expressions
-- from word problems (both collide with 0009's existing grade-6 tags on
-- alg-variables/alg-expressions — those stay untouched below).
update concepts set quarter_standard = 'Q1' where code = 'meas-mean-median';
-- alg-variables, alg-expressions: grade-5-std introduces both at its own Q1,
-- but 0009 already fixed quarter_standard = 'Q3' on both rows for grade 6's
-- pacing. Per the no-overwrite rule, left as-is — grade-5-std kids will see
-- these tagged Q3 rather than their own true Q1 introduction, a known
-- approximation of the two-column schema.

-- Q1 (advanced, = grade-6 std): circle graphs, mean-as-balance-point,
-- outlier analysis, prime/composite + LCM/GCD, inequalities all already
-- match 0009's existing grade-6-standard Q1 tags exactly — just extend
-- `grades` so grade-5-advanced students can see them.
update concepts set grades = array['5','6'] where code = 'ps-circle-graph';
update concepts set grades = array['5','6'] where code = 'ps-mean-balance-outliers';
update concepts set grades = array['5','6'] where code = 'alg-inequalities';
update concepts set grades = array['5','6'], quarter_standard = 'Q3' where code = 'ns-lcm-lcd'; -- grade-5-std's own intro quarter kept; grade-6's own Q1 restatement of LCM/GCD (per curriculum-data.ts) left unrepresented, same two-column limitation as above

-- Q2 (standard): unlike-den. fraction ops setup (LCM as LCD, folded into
-- ns-lcm-lcd above), decimal estimation/mult/div, fraction-decimal
-- equivalence.
update concepts set quarter_standard = 'Q2' where code = 'dec-mult';
update concepts set quarter_standard = 'Q2' where code = 'dec-div';

-- Q2 (advanced, = grade-6 std): ratio/rate/proportion match 0009's existing
-- grade-6-standard Q2 tags exactly (extend `grades` only); coordinate plane
-- and symmetry/transformations are grade-6-only rows (0008 narrowed them
-- deliberately) that grade-5-advanced also reaches — extend `grades`, and
-- for quarter_advanced only set a fresh value where 0009 left it null
-- (symmetry-transformations); geo-coordinate-plane's quarter_advanced is
-- already fixed by 0009 to grade-6-advanced's own Q3, so grade-5-advanced's
-- more natural Q2 fit is left unrepresented, same known limitation.
update concepts set grades = array['5','6'] where code = 'word-ratio-rate';
update concepts set grades = array['5','6'] where code = 'word-proportion';
update concepts set grades = array['5','6'] where code = 'geo-coordinate-plane';
update concepts set grades = array['5','6'], quarter_advanced = 'Q2' where code = 'geo-symmetry-transformations';

-- Q3 (standard): unlike-denominator fraction add/sub (tagged above under
-- frac-add-sub-unlike); metric unit selection/measuring/conversion (grade-5
-- std's own Q3 restatement of meas-unit-conversion collides with grade 4's
-- earlier Q4 introduction on the same column — grade 4 kept per the first-
-- introduction rule, no change needed here beyond the grades extension
-- already applied above).

-- Q3 (advanced, = grade-6 std): negative numbers/integers, exponents/
-- perfect squares, fraction mult/div all match 0009's existing grade-6-
-- advanced Q1 tags... except grade-5-advanced's natural fit for these is Q3
-- (matching grade-6-STANDARD's own Q3), not Q1 (grade-6-advanced's own
-- pacing) — 0009's quarter_advanced values are left untouched per the no-
-- overwrite rule; `grades` extended so the concepts are at least visible to
-- grade-5-advanced heatmaps, with the same known Q1-vs-Q3 approximation
-- flagged in 0009's own precedent for this exact scenario.
update concepts set grades = array['5','6'] where code = 'ops-negative-numbers';
update concepts set grades = array['5','6'] where code = 'ops-exponents';
-- frac-mult/frac-div: grades already include 5; 0009's existing Q3(std)/
-- Q4(adv) values are left as-is (no explicit grade-5-standard restatement of
-- fraction mult/div was found in curriculum-data.ts to justify a std change).
-- alg-equations-basic: grade-5-advanced's one-step equations match grade-6-
-- std's existing Q3 tag exactly.
update concepts set grades = array['5','6'] where code = 'alg-equations-basic';

-- Q4 (standard): angle/triangle classification (tagged above); right-
-- triangle area/rectangular-prism volume formula development folds into
-- geo-area-triangle-parallelogram/geo-volume; probability via tree diagrams
-- and the counting principle; statistics review (reinforcement of Q1's
-- mean-median-mode-range, not separately tagged).
update concepts set quarter_standard = 'Q4' where code = 'geo-volume';
update concepts set quarter_standard = 'Q4' where code = 'ps-sample-space-counting';

-- Q4 (advanced, = grade-6 std): parallelogram/triangle area and
-- circle/circumference formulas match grade-6-standard's existing Q4 tags on
-- geo-area-triangle-parallelogram and geo-circles exactly (0009 had left
-- quarter_advanced null on both — set fresh here, no collision) plus extend
-- `grades`.
update concepts set grades = array['5','6'], quarter_advanced = 'Q4' where code = 'geo-area-triangle-parallelogram';
update concepts set grades = array['5','6'], quarter_advanced = 'Q4' where code = 'geo-circles';

-- percent-basic: grade-5-advanced's ratio-notation unit ("분수·소수·백분율로
-- 나타내기") is the closest match to VA SOL 6's percent standard; 0009 left
-- quarter_standard null (grade-6-standard doesn't restate percent on its
-- own), so set it fresh here rather than overwrite anything.
update concepts set grades = array['5','6'], quarter_standard = 'Q2' where code = 'percent-basic';
