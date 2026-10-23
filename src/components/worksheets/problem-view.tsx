import type { ReactNode } from "react";
import { MathText } from "@/components/math-text";
import { cn } from "@/lib/utils";
import { longDivisionSteps, type VerticalWork } from "@/lib/worksheets/math";
import type { FigureSpec, ProblemBody } from "@/lib/worksheets/types";
import { AnalogClock, FractionModel, TriangleFigure } from "./figures";

// Filled-in answers in worked examples use this accent so they read as
// "the teacher's answer" next to the printed problem.
const SOLVED = "font-bold text-navy-500";

function Blank({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <span className={cn("inline-block border-b border-navy-500 text-center align-baseline", className)}>
      {children ?? <>&nbsp;</>}
    </span>
  );
}

const fracLength = (v: string) => v.split(".")[1]?.length ?? 0;

// Pads decimal operands on the right with invisible zeros so the decimal
// points line up in a right-aligned column (12.4 over 3.067).
function decimalPad(value: string, fracWidth: number): string {
  let pad = "0".repeat(fracWidth - fracLength(value));
  if (fracWidth > 0 && !value.includes(".")) pad = `.${pad}`;
  return pad;
}

function DecimalAligned({ value, fracWidth }: { value: string; fracWidth: number }) {
  const pad = decimalPad(value, fracWidth);
  return (
    <>
      {value}
      {pad && <span className="invisible">{pad}</span>}
    </>
  );
}

// Small carry digits sitting over the top number's columns. Each column keeps
// the width of the character under it (an invisible copy), so carries line up
// even across a decimal point.
function CarryRow({ top, carries }: { top: string; carries: (number | null)[] }) {
  const chars = [...top];
  let column = chars.filter((c) => c !== ".").length;
  return (
    <div className="h-3.5 overflow-hidden pl-6 text-right">
      {chars.map((c, i) => {
        if (c !== ".") column--;
        const carry = c === "." ? null : carries[column];
        return (
          <span key={i} className="relative inline-block">
            <span className="invisible">{c}</span>
            {carry != null && (
              <span className="absolute inset-x-0 top-0 text-center text-[11px] leading-none text-navy-500">
                {carry}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function VerticalProblem({
  body,
  work,
}: {
  body: Extract<ProblemBody, { kind: "vertical" }>;
  /** Present on worked examples: shows carries, partial products and the answer. */
  work?: VerticalWork;
}) {
  const decimal = body.align === "decimal";
  const fracWidth = decimal ? Math.max(...[body.top, body.bottom, work?.result ?? ""].map(fracLength)) : 0;
  const render = (v: string) => (decimal ? <DecimalAligned value={v} fracWidth={fracWidth} /> : v);
  // Multi-digit multiplication needs room for partial products.
  const digitsBelow = body.bottom.replace(".", "").length;
  const workSpace = body.operator === "×" && digitsBelow > 1 ? "h-28" : "h-12";

  return (
    <div className="inline-grid font-math text-xl leading-snug tabular-nums text-navy-900">
      {work && work.carries.some((c) => c != null) && (
        <CarryRow top={body.top + (decimal ? decimalPad(body.top, fracWidth) : "")} carries={work.carries} />
      )}
      <div className="pl-6 text-right">{render(body.top)}</div>
      <div className="flex justify-between gap-3 border-b-2 border-navy-900 pb-0.5">
        <span>{body.operator}</span>
        <span>{render(body.bottom)}</span>
      </div>
      {work ? (
        <>
          {work.partials.length > 0 && (
            <div className="border-b-2 border-navy-900 pb-0.5 text-navy-700">
              {work.partials.map((p, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <span>{i === work.partials.length - 1 ? "+" : ""}</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}
          <div className={cn("text-right", SOLVED)}>{render(work.result)}</div>
        </>
      ) : (
        <div className={workSpace} />
      )}
    </div>
  );
}

function LongDivisionBracket({ divisor, dividend }: { divisor: string; dividend: string }) {
  return (
    <div className="flex items-start">
      <span className="pr-1.5 pt-1">{divisor}</span>
      <span className="rounded-tl-xl border-l-2 border-t-2 border-navy-900 pl-2 pr-2 pt-1">{dividend}</span>
    </div>
  );
}

/**
 * Long division with every step written out: quotient over the bar, then a
 * product / difference pair for each digit, with the next digit brought down.
 * Laid out on a grid of fixed-width digit columns so the steps stay aligned.
 */
export function LongDivisionWorked({ divisor, dividend }: { divisor: number; dividend: number }) {
  const { quotient, remainder, steps } = longDivisionSteps(dividend, divisor);
  const digits = String(dividend);
  // Grid columns: 1 = divisor, 2 = bracket / minus sign, 3… = dividend digits, last = remainder.
  const at = (digitCol: number) => digitCol + 3;
  const cells: ReactNode[] = [];
  const put = (row: number, digitCol: number, text: string, className?: string) =>
    cells.push(
      <span key={cells.length} className={cn("text-center", className)} style={{ gridRow: row, gridColumn: at(digitCol) }}>
        {text}
      </span>,
    );
  // Writes `value` right-aligned so its last digit sits in `endCol`.
  const putNumber = (row: number, endCol: number, value: string, className?: string) =>
    [...value].forEach((ch, i) => put(row, endCol - value.length + 1 + i, ch, className));

  putNumber(1, digits.length - 1, String(quotient), SOLVED);
  if (remainder) {
    cells.push(
      <span key="r" className={cn("pl-1.5", SOLVED)} style={{ gridRow: 1, gridColumn: at(digits.length) }}>
        R{remainder}
      </span>,
    );
  }
  cells.push(
    <span key="divisor" className="pr-1.5 text-right" style={{ gridRow: 2, gridColumn: 1 }}>
      {divisor}
    </span>,
    <span
      key="bracket"
      className="rounded-tl-xl border-l-2 border-t-2 border-navy-900"
      style={{ gridRow: 2, gridColumn: 2 }}
    />,
  );
  [...digits].forEach((d, i) => put(2, i, d, "border-t-2 border-navy-900"));
  steps.forEach((step, i) => {
    const productRow = 3 + i * 2;
    const product = String(step.product);
    put(productRow, step.col - product.length, "−", "text-navy-700");
    putNumber(productRow, step.col, product, "border-b border-navy-700 text-navy-700");
    const last = i === steps.length - 1;
    const working = (step.difference || last ? String(step.difference) : "") + (last ? "" : digits[step.col + 1]);
    putNumber(productRow + 1, last ? step.col : step.col + 1, working, "text-navy-700");
  });

  return (
    <div
      className="inline-grid font-math text-base leading-tight tabular-nums text-navy-900"
      style={{ gridTemplateColumns: `auto 0.6em repeat(${digits.length}, 0.56em) auto` }}
      aria-label={`${dividend} divided by ${divisor} is ${quotient}${remainder ? ` remainder ${remainder}` : ""}`}
    >
      {cells}
    </div>
  );
}

export function CompareView({ left, right, symbol }: { left: string; right: string; symbol?: string }) {
  return (
    <div className="flex items-center gap-3 py-1 text-lg text-navy-900">
      <MathText text={left} />
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-navy-500",
          symbol && SOLVED,
        )}
      >
        {symbol}
      </span>
      <MathText text={right} />
    </div>
  );
}

export function FigureView({
  figure,
  prompt,
  answer,
  compact,
}: {
  figure: FigureSpec;
  prompt: string;
  answer?: string;
  /** Smaller figure with the answer beside it — for the example box. */
  compact?: boolean;
}) {
  // Longer prompts (triangles) get an answer line that runs to the cell edge.
  const wide = !compact && figure.type === "triangle";
  return (
    <div className={compact ? "flex items-center gap-4" : "flex flex-col items-start gap-3"}>
      {figure.type === "clock" ? (
        <AnalogClock hour={figure.hour} minute={figure.minute} className={compact ? "h-20 w-20" : undefined} />
      ) : figure.type === "fraction-model" ? (
        <FractionModel shape={figure.shape} parts={figure.parts} shaded={figure.shaded} />
      ) : (
        <TriangleFigure {...figure} compact={compact} />
      )}
      <div className={cn("flex items-end gap-2 text-sm text-navy-700", wide && "self-stretch")}>
        <span>{prompt}</span>
        <Blank className={cn("px-1", answer ? cn("min-w-20 text-base", SOLVED) : cn("h-9 min-w-24", wide && "flex-1"))}>
          {answer && <MathText text={answer} />}
        </Blank>
      </div>
    </div>
  );
}

export function ProblemView({ body }: { body: ProblemBody }) {
  switch (body.kind) {
    case "text":
      // The answer line runs to the edge of the cell (or drops below a long
      // expression instead of overflowing), with headroom above it for big
      // handwriting.
      return body.blank === "inline" ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 pt-4 text-lg text-navy-900">
          <MathText text={body.text} />
          <Blank className="min-w-12 flex-1" />
        </div>
      ) : (
        <div className="text-lg text-navy-900">
          <MathText text={body.text} />
          {body.blank === "line" && <div className="mt-12 border-b border-navy-500" />}
        </div>
      );

    case "vertical":
      return <VerticalProblem body={body} />;

    case "longdiv":
      return (
        <div className="font-math text-xl tabular-nums text-navy-900">
          <div className="mt-8">
            <LongDivisionBracket divisor={body.divisor} dividend={body.dividend} />
          </div>
          <div className="h-22" />
        </div>
      );

    case "compare":
      return <CompareView left={body.left} right={body.right} />;

    case "figure":
      return <FigureView figure={body.figure} prompt={body.prompt} />;

    case "fields":
      return (
        <div className="text-navy-900">
          <p className="text-lg font-medium tracking-wide">{body.text}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
            {body.fields.map((f) => (
              <div key={f} className="flex items-end gap-2">
                <dt className="text-navy-700">{f}</dt>
                <dd className="h-9 flex-1 border-b border-navy-500">&nbsp;</dd>
              </div>
            ))}
          </dl>
        </div>
      );
  }
}
