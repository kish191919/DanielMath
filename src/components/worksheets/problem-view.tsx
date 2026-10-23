import { MathText } from "@/components/math-text";
import { cn } from "@/lib/utils";
import type { ProblemBody } from "@/lib/worksheets/types";
import { AnalogClock, FractionModel } from "./figures";

function Blank({ className }: { className?: string }) {
  return <span className={cn("inline-block border-b border-navy-400 align-baseline", className)}>&nbsp;</span>;
}

// Pads decimal operands on the right with invisible zeros so the decimal
// points line up in a right-aligned column (12.4 over 3.067).
function DecimalAligned({ value, fracWidth }: { value: string; fracWidth: number }) {
  const frac = value.split(".")[1] ?? "";
  let pad = "0".repeat(fracWidth - frac.length);
  if (fracWidth > 0 && !value.includes(".")) pad = `.${pad}`;
  return (
    <>
      {value}
      {pad && <span className="invisible">{pad}</span>}
    </>
  );
}

function VerticalProblem({ body }: { body: Extract<ProblemBody, { kind: "vertical" }> }) {
  const fracWidth =
    body.align === "decimal"
      ? Math.max(...[body.top, body.bottom].map((v) => v.split(".")[1]?.length ?? 0))
      : 0;
  const render = (v: string) => (body.align === "decimal" ? <DecimalAligned value={v} fracWidth={fracWidth} /> : v);
  // Multi-digit multiplication needs room for partial products.
  const digitsBelow = body.bottom.replace(".", "").length;
  const workSpace = body.operator === "×" && digitsBelow > 1 ? "h-24" : "h-10";

  return (
    <div className="inline-grid font-mono text-lg leading-snug tabular-nums text-navy-900">
      <div className="pl-6 text-right">{render(body.top)}</div>
      <div className="flex justify-between gap-3 border-b-2 border-navy-900 pb-0.5">
        <span>{body.operator}</span>
        <span>{render(body.bottom)}</span>
      </div>
      <div className={workSpace} />
    </div>
  );
}

export function ProblemView({ body }: { body: ProblemBody }) {
  switch (body.kind) {
    case "text":
      return (
        <div className="text-lg text-navy-900">
          <MathText text={body.text} />
          {body.blank === "inline" && (
            <>
              {" "}
              <Blank className="w-16" />
            </>
          )}
          {body.blank === "line" && <div className="mt-9 border-b border-navy-300" />}
        </div>
      );

    case "vertical":
      return <VerticalProblem body={body} />;

    case "longdiv":
      return (
        <div className="font-mono text-lg tabular-nums text-navy-900">
          <div className="mt-7 flex items-start">
            <span className="pr-1.5 pt-1">{body.divisor}</span>
            <span className="rounded-tl-xl border-l-2 border-t-2 border-navy-900 pl-2 pr-2 pt-1">{body.dividend}</span>
          </div>
          <div className="h-20" />
        </div>
      );

    case "compare":
      return (
        <div className="flex items-center gap-3 py-1 text-lg text-navy-900">
          <MathText text={body.left} />
          <span className="inline-block h-9 w-9 shrink-0 rounded-full border-2 border-navy-400" />
          <MathText text={body.right} />
        </div>
      );

    case "figure":
      return (
        <div className="flex flex-col items-start gap-3">
          {body.figure.type === "clock" ? (
            <AnalogClock hour={body.figure.hour} minute={body.figure.minute} />
          ) : (
            <FractionModel shape={body.figure.shape} parts={body.figure.parts} shaded={body.figure.shaded} />
          )}
          <div className="flex items-end gap-2 text-sm text-navy-700">
            <span>{body.prompt}</span>
            <Blank className="w-20" />
          </div>
        </div>
      );

    case "fields":
      return (
        <div className="text-navy-900">
          <p className="text-lg font-medium tracking-wide">{body.text}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {body.fields.map((f) => (
              <div key={f} className="flex items-end gap-2">
                <dt className="text-navy-700">{f}</dt>
                <dd className="flex-1 border-b border-navy-400">&nbsp;</dd>
              </div>
            ))}
          </dl>
        </div>
      );
  }
}
