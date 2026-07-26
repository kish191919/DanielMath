import type { CSSProperties, ReactElement } from "react";

const NAVY_900 = "#0a1f3d";
const GOLD_500 = "#c9a961";

/**
 * Padding is ~17% per side so the same artwork is safe to mark
 * `purpose: "any maskable"` in the manifest without a separate variant.
 */
export function iconMonogram(size: number): ReactElement {
  const padding = Math.round(size * 0.17);

  const containerStyle: CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: NAVY_900,
  };

  const textStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size - padding * 2,
    height: size - padding * 2,
    color: GOLD_500,
    fontSize: Math.round((size - padding * 2) * 0.62),
    fontWeight: 700,
    letterSpacing: "-0.02em",
    fontFamily: "sans-serif",
  };

  return (
    <div style={containerStyle}>
      <div style={textStyle}>DM</div>
    </div>
  );
}
