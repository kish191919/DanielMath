// Print-first SVG figures for worksheet problems. Strokes use the navy-900
// text color via currentColor; shading is light enough to stay readable on a
// black-and-white printer.

const SHADE = "#93afcf"; // navy-300

const r2 = (n: number) => Math.round(n * 100) / 100;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [r2(cx + r * Math.sin(rad)), r2(cy - r * Math.cos(rad))];
}

export function AnalogClock({
  hour,
  minute,
  className = "h-28 w-28",
}: {
  hour: number;
  minute: number;
  className?: string;
}) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const [hx, hy] = polar(60, 60, 27, hourAngle);
  const [mx, my] = polar(60, 60, 41, minuteAngle);

  return (
    <svg viewBox="0 0 120 120" className={`${className} text-navy-900`} role="img" aria-label="Analog clock">
      <circle cx="60" cy="60" r="55" fill="white" stroke="currentColor" strokeWidth="2.5" />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const [x1, y1] = polar(60, 60, major ? 47 : 50, i * 6);
        const [x2, y2] = polar(60, 60, 53, i * 6);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={major ? 2 : 0.8} />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = polar(60, 60, 38, (i + 1) * 30);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            {i + 1}
          </text>
        );
      })}
      <line x1="60" y1="60" x2={hx} y2={hy} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2={mx} y2={my} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill="currentColor" />
    </svg>
  );
}

function FractionCircle({ parts, shaded }: { parts: number; shaded: number }) {
  const step = 360 / parts;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 text-navy-900">
      {Array.from({ length: parts }, (_, i) => {
        const [x1, y1] = polar(32, 32, 29, i * step);
        const [x2, y2] = polar(32, 32, 29, (i + 1) * step);
        return (
          <path
            key={i}
            d={`M32 32 L${x1} ${y1} A29 29 0 ${step > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
            fill={i < shaded ? SHADE : "white"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
}

function FractionBar({ parts, shaded }: { parts: number; shaded: number }) {
  const w = 120 / parts;
  return (
    <svg viewBox="0 0 124 28" className="h-7 w-[124px] text-navy-900">
      {Array.from({ length: parts }, (_, i) => (
        <rect
          key={i}
          x={r2(2 + i * w)}
          y="2"
          width={r2(w)}
          height="24"
          fill={i < shaded ? SHADE : "white"}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export function FractionModel({
  shape,
  parts,
  shaded,
}: {
  shape: "circle" | "bar";
  parts: number;
  shaded: number[];
}) {
  const Whole = shape === "circle" ? FractionCircle : FractionBar;
  return (
    <div
      className={shape === "circle" ? "flex gap-2" : "flex flex-col gap-1.5"}
      role="img"
      aria-label={`Fraction model with ${shaded.length} whole${shaded.length > 1 ? "s" : ""}`}
    >
      {shaded.map((s, i) => (
        <Whole key={i} parts={parts} shaded={s} />
      ))}
    </div>
  );
}
