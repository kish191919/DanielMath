import { Fragment } from "react";
import katex from "katex";

// Matches paired `$...$` inline-math delimiters (see src/lib/ai/math-notation.ts
// for the authoring convention). An unpaired `$` (e.g. a stray currency sign in
// generated text) never matches, so it just passes through as plain text.
const MATH_DELIMITER = /\$([^$]+)\$/g;

// On a printed worksheet `\square` is where the student writes the answer,
// but KaTeX's □ is only as big as a digit. It becomes an empty box with room
// for two or three handwritten digits; `\boxed` (not CSS on the glyph) keeps
// fractions laid out around the box's real size. In a table the cell's own
// borders already frame the answer, so the blank there is just room to write.
const ANSWER_BOX = { "\\square": "\\boxed{\\rule[-0.06em]{0pt}{0.72em}\\hspace{1.2em}}" };
const ANSWER_CELL = { "\\square": "\\rule[-0.4em]{0pt}{1.3em}\\hspace{1.1em}" };

function Latex({ latex, macros }: { latex: string; macros?: Record<string, string> }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, { throwOnError: false, output: "html", macros }),
      }}
    />
  );
}

// Answer boxes make a problem much wider, so it may wrap — but only right
// after its first top-level "=" (worksheets otherwise keep each expression on
// one line), which moves the whole right-hand side down together.
function splitAfterEquals(latex: string): string[] {
  let depth = 0;
  for (let i = 0; i < latex.length; i++) {
    const c = latex[i];
    if (c === "\\") {
      if (latex.startsWith("\\begin", i)) depth++;
      else if (latex.startsWith("\\end", i)) depth--;
      i++; // an escaped character (\{, \\) is never a brace or "="
    } else if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === "=" && depth === 0) {
      return [latex.slice(0, i + 1), latex.slice(i + 1)].filter((p) => p.trim());
    }
  }
  return [latex];
}

function AnswerBoxMath({ latex }: { latex: string }) {
  const macros = latex.includes("\\begin{array}") ? ANSWER_CELL : ANSWER_BOX;
  return splitAfterEquals(latex).map((piece, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <Latex latex={piece} macros={macros} />
    </Fragment>
  ));
}

// No "use client": this has no hooks or browser-only APIs, so it renders
// identically on the server (print page, answers page) and inside client
// component trees (workspace previews, review tables).
export function MathText({ text, answerBoxes = false }: { text: string; answerBoxes?: boolean }) {
  const parts = text.split(MATH_DELIMITER);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : answerBoxes && part.includes("\\square") ? (
          <AnswerBoxMath key={i} latex={part} />
        ) : (
          <Latex key={i} latex={part} />
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
