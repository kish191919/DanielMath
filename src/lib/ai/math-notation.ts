// Shared LaTeX notation convention for every AI pipeline that produces
// problem/answer/option text (extraction, translation, solving, generation).
// Rendered client-side by src/components/math-text.tsx (KaTeX) — keep this
// text in sync with that component's delimiter regex if it ever changes.
export const MATH_NOTATION_INSTRUCTIONS =
  "수식 표기: 분수·지수·곱셈/나눗셈 기호 등 실제 수식 부분은 반드시 LaTeX으로 작성하고 단일 달러 기호 한 쌍으로 감싸세요 " +
  '(예: "Calculate: $(2\\times 3)^2 \\times (1\\frac{3}{4} - \\frac{1}{2}) + 4^2$"). ' +
  "\\frac{}{}(분수), ^{}(지수), _{}(아래첨자), \\times, \\div, \\sqrt{} 같은 기본 LaTeX 매크로만 사용하고 새 매크로를 만들지 마세요. " +
  "문장 설명 부분은 달러 기호 밖에 일반 텍스트로 쓰세요. " +
  '달러 기호는 수식 구분자로 예약되어 있으므로, 화폐 금액은 "$5"가 아니라 "5 dollars"처럼 풀어서 쓰세요.';
