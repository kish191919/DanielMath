import { MathText } from "@/components/math-text";
import { describeData, verticalWork } from "@/lib/worksheets/math";
import type { ExampleShow, WorksheetExample } from "@/lib/worksheets/types";
import { CompareView, FigureView, LongDivisionWorked, VerticalProblem } from "./problem-view";

function ExampleWork({ show }: { show: ExampleShow }) {
  switch (show.kind) {
    case "math":
      return (
        <div className="flex flex-wrap gap-x-10 gap-y-1 text-lg text-navy-900">
          {show.lines.map((line, i) => (
            <p key={i}>
              <MathText text={line} />
            </p>
          ))}
        </div>
      );

    case "vertical":
      return <VerticalProblem body={show} work={verticalWork(show.operator, show.top, show.bottom)} />;

    case "longdiv":
      return <LongDivisionWorked divisor={show.divisor} dividend={show.dividend} />;

    case "compare":
      return <CompareView left={show.left} right={show.right} symbol={show.symbol} />;

    case "figure":
      return <FigureView figure={show.figure} prompt={show.prompt} answer={show.answer} compact />;

    case "stats": {
      const { mean, median, mode, range } = describeData(show.data);
      const values: [string, number][] = [
        ["Mean", mean],
        ["Median", median],
        ["Mode", mode],
        ["Range", range],
      ];
      return (
        <div className="text-navy-900">
          <p className="text-lg font-medium tracking-wide">{show.data.join(", ")}</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4 print:grid-cols-4">
            {values.map(([label, value]) => (
              <div key={label} className="flex items-end gap-1.5">
                <dt className="text-navy-700">{label}</dt>
                <dd className="min-w-8 flex-1 border-b border-navy-500 text-center font-bold text-navy-500">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    }
  }
}

// Short worked lines sit beside the label with the explanation underneath;
// taller layouts (columns, long division, figures) put the label, the work
// and the explanation side by side to keep the box low.
const TALL: ExampleShow["kind"][] = ["vertical", "longdiv", "figure", "stats"];

export function WorksheetExampleBox({ example }: { example: WorksheetExample }) {
  const tall = TALL.includes(example.show.kind);
  const think = (
    <p className="text-sm leading-relaxed text-navy-700">
      <span className="font-semibold text-navy-900">Think:</span> <MathText text={example.think} />
    </p>
  );

  return (
    <section aria-label="Example" className="mt-2 break-inside-avoid border-l-4 border-navy-500 bg-navy-50 px-4 py-3">
      {tall ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="self-start">
            <ExampleLabel />
          </span>
          <div className="shrink-0">
            <ExampleWork show={example.show} />
          </div>
          <div className="min-w-56 flex-1">{think}</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <ExampleLabel />
            <ExampleWork show={example.show} />
          </div>
          <div className="mt-1.5">{think}</div>
        </>
      )}
    </section>
  );
}

function ExampleLabel() {
  return <span className="text-xs font-bold uppercase tracking-[0.2em] text-navy-500">Example</span>;
}
