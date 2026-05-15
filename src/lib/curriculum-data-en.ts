/** English metadata for curriculum data — keeps curriculum-data.ts unchanged */

export const gradeEquivalentEn: Record<string, { standard: string; advanced: string }> = {
  kindergarten: {
    standard: "Kindergarten level (Virginia SOL K)",
    advanced: "Grade 1 level",
  },
  "grade-1": {
    standard: "Grade 1 level (Virginia SOL 1)",
    advanced: "Grade 2 level",
  },
  "grade-2": {
    standard: "Grade 2 level (Virginia SOL 2)",
    advanced: "Grade 3 level",
  },
  "grade-3": {
    standard: "Grade 3 level (Virginia SOL 3)",
    advanced: "Grade 4 level",
  },
  "grade-4": {
    standard: "Grade 4 level (Virginia SOL 4)",
    advanced: "Grade 5 level",
  },
  "grade-5": {
    standard: "Grade 5 level (Virginia SOL 5)",
    advanced: "Grade 6 level (Virginia SOL 6)",
  },
  "grade-6": {
    standard: "Grade 6 level (Virginia SOL 6)",
    advanced: "Grade 7 / Pre-Algebra level",
  },
}

export const highlightsEn: Record<string, { standard: string[]; advanced: string[] }> = {
  kindergarten: {
    standard: [
      "Counting to 100 by 1s and 10s",
      "Addition & Subtraction within 10",
      "2D & 3D shape recognition",
      "Length & weight comparison (non-standard units)",
    ],
    advanced: [
      "Place value: tens and ones",
      "Addition & Subtraction within 20 (fluent)",
      "Length measurement with standard units",
      "Fractions (halves, quarters) and shape sorting",
    ],
  },
  "grade-1": {
    standard: [
      "Place value to 120, comparing 2-digit numbers",
      "Addition & Subtraction within 18 (fluent)",
      "Telling time (hour/half-hour), coin recognition",
      "Data with bar graphs and tally charts",
    ],
    advanced: [
      "3-digit place value, rounding to nearest 10/100",
      "Addition & Subtraction within 999 with regrouping",
      "Multiplication concept via repeated addition",
      "2D & 3D shape classification",
    ],
  },
  "grade-2": {
    standard: [
      "Place value to 999, estimation & rounding",
      "Addition & Subtraction within 999 with regrouping",
      "Measuring length (rulers), time to 5 min",
      "Pictographs, bar graphs, probability basics",
    ],
    advanced: [
      "Multiplication & Division facts 0–12 (fluent)",
      "Multi-digit addition & subtraction, rounding",
      "Area, perimeter, elapsed time",
      "Function tables (input/output), algebraic reasoning",
    ],
  },
  "grade-3": {
    standard: [
      "Data cycle: pictographs, bar graphs, inference and prediction",
      "Multiplication & Division facts 0–10 (fluent recall); real-life word problems",
      "Fractions: unit fractions, compose/decompose (denominators 2–10); compare fractions",
      "Measurement (US & metric), area (unit squares), perimeter; time to minute; money ≤ $5",
    ],
    advanced: [
      "Data: adds line graphs; place value extended to 9-digit numbers",
      "Mult/Div with all 5 representations; multi-digit multiplication (2- and 3-digit × 1-digit)",
      "Geometry: lines, angles, symbolic notation; classify quadrilaterals by properties",
      "Measurement with fractional units, unit conversions, rectangle area/perimeter formula",
    ],
  },
  "grade-4": {
    standard: [
      "Line graphs, probability as fractions 0–1 (≤24 outcomes); 9-digit place value & comparison",
      "Multiplication facts through 12×12; factor pairs & GCF; 2- & 3-digit × 1-digit; division with remainders",
      "Decimals through thousandths; fraction–decimal equivalence (halves to hundredths); decimal addition/subtraction",
      "Like-denominator fraction & mixed number +/−; whole number × unit fraction; quadrilateral & solid classification; US/metric conversions",
    ],
    advanced: [
      "Line graphs + stem-and-leaf plots; probability with justification; order of operations; 9-digit place value",
      "Prime/composite & prime factorization (up to 100); multi-step ×÷ problems; factor pairs & GCF",
      "Decimals through thousandths; fraction–decimal equivalence extended (thirds, eighths, factors of 100); mixed fraction & decimal comparison",
      "Angle classification & measurement (protractor); triangle classification; unlike-denominator fraction +/−; perimeter, area & volume",
    ],
  },
  "grade-5": {
    standard: [
      "Data cycle: line plots, stem-and-leaf plots; mean, median, mode, and range",
      "PEMDAS; prime/composite numbers; patterns, input/output tables, and variables",
      "Fraction & decimal arithmetic (unlike denominators, multi-step); metric measurement conversions",
      "Geometry: angles & triangle classification, area, volume; probability with Counting Principle",
    ],
    advanced: [
      "Circle graphs with statistics; outlier analysis; LCM & GCD; linear inequalities",
      "Integer operations; exponents & perfect squares (to 20²); absolute value on number line",
      "Ratios, proportional relationships; four-quadrant coordinate plane; one-step linear equations",
      "Circle geometry (π, circumference, area); parallelogram & triangle area; proportional reasoning",
    ],
  },
  "grade-6": {
    standard: [
      "Circle graphs, outliers & statistical measures (mean, median, mode, range)",
      "Integer & rational number operations; absolute value; exponents & perfect squares",
      "Ratios, unit rates & proportional relationships; four-quadrant coordinate plane",
      "One-step equations & inequalities; circles (π), parallelogram & triangle area",
    ],
    advanced: [
      "Histograms; negative exponents, scientific notation; comparing rational numbers",
      "Two-step equations & inequalities with rational coefficients; algebraic expressions",
      "Slope & direct variation (y = mx); similar figures, proportions & dilations",
      "Quadrilateral properties; volume of cylinders; surface area; probability",
    ],
  },
}
