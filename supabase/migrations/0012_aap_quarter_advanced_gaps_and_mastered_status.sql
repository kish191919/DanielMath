-- Fills the 23 remaining quarter_advanced gaps left after 0009/0011, and adds
-- a new mechanism for a case those two migrations couldn't represent at all.
--
-- Context: 0010 defaulted every student to track='advanced', so almost every
-- heatmap now reads quarter_advanced instead of quarter_standard. 23 concepts
-- had quarter_advanced still null, dumping them all into the generic
-- "분기 미지정" bucket regardless of *why* they were null — some had a real,
-- simply-untagged AAP quarter (this migration fixes those); three
-- (frac-basic-concept, geo-volume, meas-money) are genuinely NOT scheduled in
-- any AAP quarter because the advanced-track student already covered them a
-- full year or more earlier, which the existing two-quarter-column schema
-- has no way to express (see the new advanced_status column below); the rest
-- are genuinely not standalone AAP quarter topics on either track (assumed
-- prerequisite skill), matching 0009's existing frac-add-sub-unlike/dec-div
-- precedent — left null with an explanatory comment, same as before.
--
-- Source for every value below: src/lib/curriculum-data.ts, same
-- methodology as 0009/0011 — matched by topical meaning (not exact string)
-- against the RELEVANT grade's advanced.quarters, "earlier grade wins" on
-- collision, first-introduction-quarter-only for reappearing topics.

-- ── New column: "already mastered in an earlier grade" marker ──────────────
-- Distinct from quarter_advanced staying null for other reasons (assumed
-- prerequisite / genuinely no AAP topic). Nullable text (not boolean) to
-- match this schema's existing track/quarter_* check-constraint idiom and
-- leave room for future values without another migration.
alter table concepts
  add column advanced_status text
    check (advanced_status in ('mastered_prior_grade'));

-- ── Bucket A: real AAP-quarter matches, simply untagged until now ──────────

-- Q1: addition/subtraction word problems from graph data (grade-3-advanced
-- AND grade-4-advanced both restate this at their own Q1 — same quarter,
-- no collision).
update concepts set quarter_advanced = 'Q1' where code = 'ops-add-sub-multi-digit';

-- Q1: probability as a fraction (grade-4-advanced Q1, mirrors quarter_standard exactly).
update concepts set quarter_advanced = 'Q1' where code = 'ps-probability-basic';

-- Q1: LCM/GCD (grade-5-advanced Q1 = grade-6-standard's own Q1 restatement,
-- the same match 0011's comment already noted but never wrote to this column).
update concepts set quarter_advanced = 'Q1' where code = 'ns-lcm-lcd';

-- Q1: circle graphs / mean-as-balance-point + outliers (grade-5-advanced Q1
-- = grade-6-standard's own Q1, matching 0009's existing quarter_standard
-- tags on both rows exactly — same "earlier grade wins" treatment 0011
-- already used for these two rows' `grades` extension). Known limitation:
-- grade-6-advanced's own Q1 has moved on to histograms and assumes circle
-- graphs / mean-as-balance-point are already known, so a grade-6-advanced
-- viewer will see "Q1" here even though they mastered it the year before —
-- the same two-column-schema limitation 0011 already documented elsewhere.
update concepts set quarter_advanced = 'Q1' where code = 'ps-circle-graph';
update concepts set quarter_advanced = 'Q1' where code = 'ps-mean-balance-outliers';

-- Q2: multiplication/division through 10x10 (grade-3-advanced Q2, same
-- quarter as quarter_standard).
update concepts set quarter_advanced = 'Q2' where code = 'ops-division-basic';

-- Q2: "compose and decompose fractions (proper, improper, and mixed
-- numbers)" is the closest curriculum-data.ts wording for mixed-number <->
-- improper-fraction conversion; grade-4-std and grade-4-advanced both state
-- it at their own Q2 (frac-mixed-numbers had BOTH columns null since 0002 —
-- fixing both here).
update concepts set quarter_standard = 'Q2', quarter_advanced = 'Q2' where code = 'frac-mixed-numbers';

-- Q3: decimal place value / compare-order through thousandths
-- (grade-4-advanced Q3, same quarter as quarter_standard both times).
update concepts set quarter_advanced = 'Q3' where code = 'dec-place-value';
update concepts set quarter_advanced = 'Q3' where code = 'dec-compare-order';

-- Q3: unit conversion (grade-3-advanced Q3 "inches<->feet<->yards;
-- ounces<->pounds; cups<->pints<->quarts<->gallons" — earliest listed grade
-- wins per 0011's convention, even though quarter_standard's own intro is
-- grade-4's later Q4).
update concepts set quarter_advanced = 'Q3' where code = 'meas-unit-conversion';

-- Q3: one-step linear equations (grade-5-advanced Q3 "Solving one-step
-- linear equations using properties of equality" — 0011's own comment
-- already identified this exact match for alg-equations-basic but only
-- extended `grades`, never wrote the value; fixing that here). Known
-- limitation carried over from 0011: grade-6-advanced kids already mastered
-- this a year earlier (their own pacing jumps straight to two-step
-- equations), but the two-column schema can't express both grades at once —
-- earlier grade (5) wins, same convention used throughout 0011.
update concepts set quarter_advanced = 'Q3' where code = 'alg-equations-basic';

-- Q3: writing expressions from word problems. Grade-5-advanced Q3 only
-- explicitly states the vocabulary term "expression" (no standalone
-- "write an expression from a word problem" skill bullet on either advanced
-- grade) — a thinner match than the others above, so mirror quarter_standard
-- (also Q3) rather than leave this null, per academy direction to prefer the
-- closest available quarter over an empty cell.
update concepts set quarter_advanced = 'Q3' where code = 'alg-expressions';

-- Q4: like-denominator fraction add/sub with regrouping (grade-4-advanced
-- Q4, near-identical wording to the grade-4-standard Q4 bullet already
-- tagged).
update concepts set quarter_advanced = 'Q4' where code = 'frac-add-sub-like';

-- Q4: solid shapes 6-type identification (grade-4-advanced Q4, same
-- quarter as quarter_standard).
update concepts set quarter_advanced = 'Q4' where code = 'geo-solid-shapes';

-- Patterns and rules. Grade 3 has no patterns bullet on either track;
-- grade-4-standard Q1 is the actual introduction (quarter_standard was null
-- since 0002 — fixing it here alongside quarter_advanced). grade-3-advanced
-- Q4 "Multiplication/division patterns with input/output tables and
-- function machines; identify and extend rules" is the earliest
-- advanced-track appearance (earlier grade wins over grade-4-advanced's own
-- Q1 restatement).
update concepts set quarter_standard = 'Q1', quarter_advanced = 'Q4' where code = 'alg-patterns';

-- ── Bucket B: mastered a full year or more earlier under the advanced pace ─
-- Neither concept's own listed `grades` has an advanced-quarter match — the
-- real match sits one or more grades EARLIER than this concept's `grades`
-- array covers, in a grade where the topic is NOT a standard-track standard
-- (so `grades` can't simply be extended the way 0011 extended it for
-- ps-circle-graph et al., without falsely claiming that earlier grade's
-- *standard*-track students cover it too).

-- frac-basic-concept (grades=['3']): grade-3-advanced Q2 jumps straight to
-- "compose and decompose fractions and mixed numbers" — basic fraction
-- representation is already assumed. The real first appearance under the
-- advanced track is grade-2-advanced Q2: "Fractions: halves, thirds,
-- fourths" + "Fractions on the number line" (a year early, grade 2 is not
-- in this concept's grades).
update concepts set advanced_status = 'mastered_prior_grade' where code = 'frac-basic-concept';

-- geo-volume (grades=['5']): grade-5-advanced (= grade-6-standard pace) has
-- no volume standard at all — VA SOL 6 doesn't cover volume (0008 narrowed
-- geo-volume to grade 5 only for exactly this reason). The real match is
-- grade-4-advanced Q4: "Area of right triangles; volume of rectangular
-- prisms (develop formula)" — a year early, grade 4 is not in this
-- concept's grades.
update concepts set advanced_status = 'mastered_prior_grade' where code = 'geo-volume';

-- meas-money (grades=['3']): no money bullet in grade-2-advanced or
-- grade-3-advanced; the closest match is grade-1-advanced Q3 "Word problems
-- with money", two years early. Weaker evidence than the two rows above,
-- but per academy direction, treated the same way rather than left fully
-- unscheduled.
update concepts set advanced_status = 'mastered_prior_grade' where code = 'meas-money';

-- ── Bucket C: genuinely no AAP-quarter topic on either track ───────────────
-- Same treatment 0009 gave frac-add-sub-unlike/dec-div originally: not a
-- standalone quarter topic anywhere in curriculum-data.ts's advanced
-- breakdown (checked the concept's own grades AND one grade earlier),
-- treated as an assumed prerequisite skill. Both quarter columns stay null
-- (or quarter_advanced stays null where quarter_standard was already set) —
-- no UPDATE needed, this comment documents the decision so a future pass
-- doesn't re-investigate the same gap:
--
--   dec-mult (grades=['5']): decimal multiplication/division never appears
--     in grade-4-advanced (grade-5-standard pace) at all, only decimal
--     add/sub does; no earlier-grade evidence exists since decimals aren't
--     introduced before grade 4.
--   dec-div (grades=['5','6']): reaffirms 0009's original grade-6 finding;
--     grade-4-advanced also omits decimal division entirely, same as
--     dec-mult above.
--   geo-2d-shapes (grades=['3']): grade-3-advanced Q2 and grade-2-advanced
--     Q4 both only restate quadrilateral-specific classification (its own
--     concept, geo-quadrilaterals), never generic polygon-type
--     classification.
--   meas-mean-median (grades=['5']): grade-5-advanced (grade-6-standard
--     pace) skips straight to the balance-point/outlier extension, already
--     its own concept (ps-mean-balance-outliers); basic mean/median/mode/
--     range is assumed prerequisite, not restated on the advanced track.
--   ps-sample-space-counting (grades=['5']): tree-diagram/counting-
--     principle probability never appears in grade-5-advanced (grade-6-
--     standard pace has no probability standard) nor a year earlier in
--     grade-4-advanced.
