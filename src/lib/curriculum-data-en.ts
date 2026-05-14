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
    advanced: "Grade 6 level",
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
      "Estimation & rounding; fractions on number lines",
      "Multiplication & Division facts 0–12 (fluent)",
      "Area, perimeter, elapsed time, volume & mass",
      "Pictographs, bar/line graphs, probability",
    ],
    advanced: [
      "Place value to millions, decimals (tenths, hundredths)",
      "Multi-digit multiplication & division",
      "Unit conversions, angle measurement, polygon classification",
      "Equivalent fractions, fraction & decimal comparisons",
    ],
  },
  "grade-4": {
    standard: [
      "Place value to millions, decimals (tenths, hundredths)",
      "Multi-digit multiplication & division; same-denominator fractions",
      "Unit conversions, angle measurement, area & perimeter",
      "Bar/line/circle graphs, probability comparisons",
    ],
    advanced: [
      "Decimals to thousandths, prime & composite numbers",
      "Decimal & fraction arithmetic (all four operations)",
      "Order of operations (PEMDAS), integer introduction",
      "Probability (experimental & theoretical)",
    ],
  },
  "grade-5": {
    standard: [
      "Decimals to thousandths, prime/composite, number lines",
      "Decimal & fraction arithmetic (unlike denominators), PEMDAS",
      "Surface area, volume of 3D shapes, transformations",
      "Stem-and-leaf plots, histograms, probability",
    ],
    advanced: [
      "Ratios, proportions, and percent applications",
      "Integer operations; rational number arithmetic",
      "Algebraic expressions; one-variable equations & inequalities",
      "Statistics: mean absolute deviation, box plots",
    ],
  },
  "grade-6": {
    standard: [
      "Ratios, proportions, and percent applications",
      "Integer & rational number arithmetic (all four operations)",
      "Algebraic expressions; one-step equations & inequalities",
      "Statistics: MAD, box plots, histograms",
    ],
    advanced: [
      "Proportional relationships (tables, graphs, equations)",
      "Percent applications (interest, discounts, tax, tips)",
      "Two-variable equations, multi-step inequalities",
      "Probability (experimental & theoretical), data sampling",
    ],
  },
}
