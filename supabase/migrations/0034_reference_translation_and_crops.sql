-- Adds English translation + diagram-crop support to the reference problem
-- bank, so a teacher can print a scanned problem verbatim (translated text +
-- the original figure/graph, if any) instead of only generating an
-- AI-rewritten similar problem (generate-similar-problems.ts, unchanged).

alter table reference_problems
  -- Populated automatically right after extraction (see
  -- extractReferenceProblems / translate-reference-problems.ts) — null until
  -- then, or if translation failed (see translation_error below).
  add column translated_problem text,
  -- Mirrors transcribed_answer's nullability: null in, null out.
  add column translated_answer text,
  -- Set by the same extraction pass (Claude Vision already sees the image),
  -- not by the text-only translation call. True means the problem needs a
  -- figure/graph/table to be solved, which the crop UI then lets a teacher
  -- attach manually (extraction still never returns crop coordinates itself).
  add column has_diagram boolean not null default false,
  -- Path within the existing problem-bank bucket, e.g. "crops/{id}.jpg".
  -- Manually cropped by a teacher (src/components/dashboard/
  -- reference-problem-crop-dialog.tsx) — the AI is never asked for bounding
  -- boxes, since that has proven unreliable for this kind of scanned content.
  add column crop_storage_path text,
  -- Set when the background translation call fails, so the UI can surface a
  -- retry action; translated_problem is null and this stays null for rows
  -- that have never had translation attempted (e.g. pre-migration rows).
  add column translation_error text;

-- Verbatim reprint rows (translated original text, optionally paired with a
-- crop image) need a source distinct from 'ai' (AI-rewritten similar
-- problem) and 'teacher' (freehand teacher entry) so print/page.tsx can tell
-- "safe to attach the original figure" apart from both of those.
alter table generated_problems drop constraint generated_problems_source_check;
alter table generated_problems add constraint generated_problems_source_check
  check (source in ('ai', 'teacher', 'reference_verbatim'));
