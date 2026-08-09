import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Info,
} from "lucide-react";
import type { BlogVisual } from "@/lib/blog-posts";

type ViewProps<T extends BlogVisual["type"]> = {
  visual: Extract<BlogVisual, { type: T }>;
  isKo: boolean;
};

export function BlogVisualBlock({ visual, isKo }: { visual: BlogVisual; isKo: boolean }) {
  switch (visual.type) {
    case "scale":
      return <ScaleView visual={visual} isKo={isKo} />;
    case "table":
      return <TableView visual={visual} isKo={isKo} />;
    case "comparison":
      return <ComparisonView visual={visual} isKo={isKo} />;
    case "pathway":
      return <PathwayView visual={visual} isKo={isKo} />;
    case "checklist":
      return <ChecklistView visual={visual} isKo={isKo} />;
    case "stat":
      return <StatView visual={visual} isKo={isKo} />;
    case "callout":
      return <CalloutView visual={visual} isKo={isKo} />;
  }
}

const SCALE_TONE: Record<NonNullable<import("@/lib/blog-posts").ScaleItem["tone"]>, string> = {
  high: "border-navy-900 bg-navy-900 text-white",
  mid: "border-navy-200 bg-navy-50 text-navy-800",
  low: "border-amber-200 bg-amber-50 text-amber-900",
  neutral: "border-gray-200 bg-gray-50 text-gray-600",
};

function ScaleView({ visual, isKo }: ViewProps<"scale">) {
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {visual.items.map((item) => (
          <div
            key={item.level}
            className={`flex-1 rounded-xl border p-3 ${SCALE_TONE[item.tone ?? "neutral"]}`}
          >
            <p className={`text-lg font-bold${isKo ? " font-ko" : ""}`}>{item.level}</p>
            <p className={`mt-0.5 text-xs font-semibold${isKo ? " font-ko" : ""}`}>{item.label}</p>
            <p className={`mt-1 text-xs leading-snug opacity-80${isKo ? " font-ko" : ""}`}>{item.desc}</p>
          </div>
        ))}
      </div>
      {visual.note && (
        <div
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-sm ${
            visual.note.tone === "myth"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-navy-100 bg-navy-50 text-navy-800"
          }`}
        >
          {visual.note.tone === "myth" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className={`leading-relaxed${isKo ? " font-ko" : ""}`}>{visual.note.text}</p>
        </div>
      )}
    </div>
  );
}

function TableView({ visual }: ViewProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-100 shadow-sm">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="bg-navy-50 text-navy-600">
            {visual.headers.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visual.rows.map((row) => (
            <tr key={row.label} className="border-t border-navy-100">
              <td className="px-4 py-2.5 font-semibold text-navy-900">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} className="px-4 py-2.5 text-navy-700">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonView({ visual, isKo }: ViewProps<"comparison">) {
  const gridClass = visual.columns.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 gap-3 ${gridClass}`}>
      {visual.columns.map((col) => {
        const isAdvanced = col.tone === "advanced";
        return (
          <div
            key={col.label}
            className={
              isAdvanced
                ? "rounded-2xl border border-gold-300/60 bg-amber-50/60 p-4"
                : "rounded-2xl border border-navy-100 bg-white p-4 shadow-sm"
            }
          >
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${
                isAdvanced ? "bg-gold-500" : "bg-navy-700"
              }`}
            >
              {col.label}
            </span>
            <ul className="mt-3 space-y-2">
              {col.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-navy-800">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isAdvanced ? "bg-gold-500" : "bg-navy-400"
                    }`}
                  />
                  <span className={isKo ? "font-ko" : ""}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function PathwayView({ visual, isKo }: ViewProps<"pathway">) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-2 px-1">
        {visual.steps.map((step, i) => {
          const isAdvanced = step.tone === "advanced";
          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex w-32 flex-col items-center justify-center gap-0.5 rounded-lg border px-3 py-2 text-center ${
                  isAdvanced
                    ? "border-gold-400/60 bg-amber-50"
                    : "border-navy-200 bg-white shadow-sm"
                }`}
              >
                <p className={`text-xs font-bold text-navy-900${isKo ? " font-ko" : ""}`}>{step.label}</p>
                {step.sublabel && (
                  <p className={`text-[11px] text-navy-500${isKo ? " font-ko" : ""}`}>{step.sublabel}</p>
                )}
              </div>
              {(i < visual.steps.length - 1 || visual.finalLabel) && (
                <ArrowRight className="h-4 w-4 shrink-0 text-navy-300" />
              )}
            </div>
          );
        })}
        {visual.finalLabel && (
          <div className="flex w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-gold-500 bg-navy-900 px-3 py-4 text-center">
            <GraduationCap className="h-5 w-5 text-gold-400" />
            <p className={`text-xs font-bold text-white${isKo ? " font-ko" : ""}`}>{visual.finalLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChecklistView({ visual, isKo }: ViewProps<"checklist">) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
      {visual.title && (
        <p className={`mb-3 text-xs font-bold uppercase tracking-wide text-navy-500${isKo ? " font-ko" : ""}`}>
          {visual.title}
        </p>
      )}
      <ul className="space-y-3">
        {visual.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
            <div>
              <p className={`text-sm font-medium text-navy-900${isKo ? " font-ko" : ""}`}>{item.text}</p>
              {item.note && (
                <p className={`mt-0.5 text-xs text-navy-500${isKo ? " font-ko" : ""}`}>{item.note}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatView({ visual, isKo }: ViewProps<"stat">) {
  return (
    <div className="rounded-2xl border border-navy-100 border-l-4 border-l-gold-500 bg-white p-5 shadow-sm">
      <p className="text-4xl font-bold text-navy-900">{visual.value}</p>
      <p className={`mt-1 text-sm text-navy-600${isKo ? " font-ko" : ""}`}>{visual.label}</p>
      {visual.source && <p className="mt-2 text-xs text-navy-400">{visual.source}</p>}
    </div>
  );
}

const CALLOUT_TONE = {
  warning: { icon: AlertTriangle, cls: "border-amber-200 bg-amber-50 text-amber-900" },
  tip: { icon: Lightbulb, cls: "border-gold-300/60 bg-amber-50/60 text-navy-800" },
  info: { icon: Info, cls: "border-navy-100 bg-navy-50 text-navy-800" },
};

function CalloutView({ visual, isKo }: ViewProps<"callout">) {
  if (visual.variant === "mythFact") {
    return (
      <div className="space-y-3">
        {visual.pairs.map((pair, i) => (
          <div key={i} className="space-y-2 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-2 text-sm text-navy-400">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className={isKo ? "font-ko" : ""}>{pair.myth}</p>
            </div>
            <div className="flex items-start gap-2 text-sm font-medium text-navy-900">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <p className={isKo ? "font-ko" : ""}>{pair.fact}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { icon: Icon, cls } = CALLOUT_TONE[visual.tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-2xl border p-4 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        {visual.title && <p className={`mb-1 font-semibold${isKo ? " font-ko" : ""}`}>{visual.title}</p>}
        <p className={`leading-relaxed${isKo ? " font-ko" : ""}`}>{visual.text}</p>
        {visual.linkHref && visual.linkLabel && (
          <Link
            href={visual.linkHref}
            className="mt-2 inline-flex items-center gap-1 font-semibold text-navy-700 hover:text-navy-900"
          >
            {visual.linkLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
