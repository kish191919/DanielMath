import katex from "katex";

// Matches paired `$...$` inline-math delimiters (see src/lib/ai/math-notation.ts
// for the authoring convention). An unpaired `$` (e.g. a stray currency sign in
// generated text) never matches, so it just passes through as plain text.
const MATH_DELIMITER = /\$([^$]+)\$/g;

// No "use client": this has no hooks or browser-only APIs, so it renders
// identically on the server (print page, answers page) and inside client
// component trees (workspace previews, review tables).
export function MathText({ text }: { text: string }) {
  const parts = text.split(MATH_DELIMITER);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part, { throwOnError: false, output: "html" }),
            }}
          />
        ) : (
          part
        ),
      )}
    </>
  );
}

// For editable form fields: shown only once the field actually contains a
// `$...$` LaTeX span, so a plain-text field doesn't get a redundant echo.
export function MathPreview({ text }: { text: string }) {
  if (!text.includes("$")) return null;
  return (
    <p className="mt-1 rounded-md bg-navy-50 px-2 py-1 text-sm text-navy-700">
      <MathText text={text} />
    </p>
  );
}
