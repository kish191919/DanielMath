export type Topic = { en: string; ko: string };

export type QuarterData = {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  focusKo: string;
  topics: Topic[];
};

export type TrackData = {
  gradeEquivalentKo: string;
  highlights: string[];
  quarters: QuarterData[];
};

export type GradeData = {
  slug: string;
  grade: string;
  gradeKo: string;
  gradeNum: number;
  fcpsUrlStandard?: string;
  fcpsUrlAdvanced?: string;
  standard: TrackData;
  advanced: TrackData;
};

export const grades: GradeData[] = [
  // ── Kindergarten ──────────────────────────────────────────────────────────
  {
    slug: "kindergarten",
    grade: "Kindergarten",
    gradeKo: "유치원 (Kindergarten, K)",
    gradeNum: 0,
    standard: {
      gradeEquivalentKo: "유치원 수준",
      highlights: [
        "숫자 1~100 세기 (1씩·10씩)",
        "덧셈·뺄셈 기초 (합 10 이내)",
        "2차원·3차원 도형 인식",
        "길이·무게 비교 (비표준 단위)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "수 세기와 도형",
          topics: [
            { en: "Counting to 20", ko: "1~20 세기" },
            { en: "One-to-one correspondence", ko: "일대일 대응" },
            { en: "2D Shapes (circle, square, triangle, rectangle)", ko: "2차원 도형 (원·사각형·삼각형·직사각형)" },
            { en: "Repeating patterns", ko: "반복 패턴" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "비교와 측정",
          topics: [
            { en: "Counting to 50", ko: "1~50 세기" },
            { en: "More, fewer, same (comparing quantities)", ko: "더 많다·더 적다·같다" },
            { en: "Measurement: longer/shorter (non-standard)", ko: "비표준 단위로 측정 (더 길다·더 짧다)" },
            { en: "Ordinal numbers (1st through 5th)", ko: "순서수 (첫 번째~다섯 번째)" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "십대 수와 덧셈",
          topics: [
            { en: "Teen numbers = 10 + ones", ko: "십대 수 = 10 + 낱개" },
            { en: "Addition within 5", ko: "합이 5 이내인 덧셈" },
            { en: "Subtraction within 5", ko: "5 이내 뺄셈" },
            { en: "3D Shapes (cube, sphere, cone, cylinder)", ko: "3차원 도형 (정육면체·구·원뿔·원통)" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "100까지 세기와 연산",
          topics: [
            { en: "Counting to 100 by 1s and 10s", ko: "1씩·10씩 뛰어세어 100까지" },
            { en: "Addition & Subtraction within 10", ko: "합·차가 10 이내인 덧셈·뺄셈" },
            { en: "Sorting & data (graphs)", ko: "분류·정리와 그래프" },
            { en: "Decomposing numbers (e.g. 8 = 5+3)", ko: "수 분해 (예: 8 = 5 + 3)" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "1학년 수준",
      highlights: [
        "자릿값 (십의 자리·일의 자리) 조기 학습",
        "합이 20 이내인 덧셈·뺄셈 유창하게",
        "표준 단위로 길이·무게 측정",
        "분수 기초 (반, 4등분)와 도형 분류",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 120까지 세기",
          topics: [
            { en: "Place value: tens and ones", ko: "자릿값: 십의 자리·일의 자리" },
            { en: "Counting to 120", ko: "120까지 세기" },
            { en: "Comparing two-digit numbers", ko: "두 자리 수 비교" },
            { en: "Skip counting by 2s, 5s, 10s", ko: "2씩·5씩·10씩 건너뛰기 세기" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "20 이내 덧셈·뺄셈",
          topics: [
            { en: "Addition strategies (making 10, doubles)", ko: "덧셈 전략 (10 만들기, 두 배)" },
            { en: "Subtraction within 20", ko: "20 이내 뺄셈" },
            { en: "Fact families", ko: "수 가족 (덧셈·뺄셈 관계)" },
            { en: "Word problems (one-step)", ko: "한 단계 문장형 문제" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정과 시간",
          topics: [
            { en: "Measuring length (non-standard then standard)", ko: "비표준 → 표준 단위로 길이 측정" },
            { en: "Ordering objects by length/weight", ko: "길이·무게로 사물 순서 정하기" },
            { en: "Telling time to the hour", ko: "시각 읽기 (몇 시 정각)" },
            { en: "Composing shapes", ko: "도형 합쳐 새 도형 만들기" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 기초와 자료",
          topics: [
            { en: "Equal shares: halves and quarters of shapes", ko: "똑같이 나누기: 반·4등분 (도형)" },
            { en: "Organizing data in graphs", ko: "그래프로 자료 정리" },
            { en: "3D shapes and their attributes", ko: "3차원 도형의 특징" },
            { en: "Telling time to the half hour", ko: "시각 읽기 (몇 시 30분)" },
          ],
        },
      ],
    },
  },

  // ── Grade 1 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-1",
    grade: "Grade 1",
    gradeKo: "1학년 (Grade 1)",
    gradeNum: 1,
    standard: {
      gradeEquivalentKo: "1학년 수준",
      highlights: [
        "두 자리 수 자릿값 (십·일의 자리)",
        "합·차가 20 이내인 덧셈·뺄셈 유창하게",
        "시각 읽기 (정각·30분), 동전 인식",
        "2차원·3차원 도형 분류",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 건너뛰기 세기",
          topics: [
            { en: "Place value: tens and ones (to 99)", ko: "자릿값: 십·일의 자리 (99까지)" },
            { en: "Skip counting by 2s, 5s, 10s", ko: "2씩·5씩·10씩 건너뛰기 세기" },
            { en: "Comparing two-digit numbers (>, <, =)", ko: "두 자리 수 크기 비교 (>, <, =)" },
            { en: "Ordinal numbers", ko: "순서수" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "20 이내 덧셈·뺄셈",
          topics: [
            { en: "Addition & subtraction facts to 20 (fluency)", ko: "합·차 20 이내 기본 연산 유창하게" },
            { en: "Making 10 strategy", ko: "10 만들기 전략" },
            { en: "Adding three numbers", ko: "세 수 더하기" },
            { en: "Word problems: add to, take from, put together", ko: "문장형 문제: 더하기·빼기·합치기" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정·시간·돈",
          topics: [
            { en: "Measuring length (non-standard then ruler)", ko: "길이 측정 (비표준 → 자)" },
            { en: "Telling time to the hour and half hour", ko: "시각 읽기 (정각·30분)" },
            { en: "Identifying coins (penny, nickel, dime, quarter)", ko: "동전 이름과 가치" },
            { en: "Temperature: hot/cold comparison", ko: "온도: 따뜻하다·차갑다 비교" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 자료",
          topics: [
            { en: "2D shapes: sides and corners", ko: "2차원 도형: 변·꼭짓점 속성" },
            { en: "Partitioning shapes (halves, quarters)", ko: "도형 나누기 (반·4등분)" },
            { en: "Picture graphs and tally charts", ko: "그림 그래프·집계표" },
            { en: "Add and subtract multiples of 10", ko: "10의 배수 더하기·빼기" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "2학년 수준",
      highlights: [
        "세 자리 수 자릿값 (백·십·일의 자리)",
        "100 이내 덧셈·뺄셈 (받아올림·내림 포함)",
        "자로 길이 재기, 5분 단위 시각, 화폐 계산",
        "짝수·홀수, 배열로 곱셈 개념 입문",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "세 자리 수 자릿값",
          topics: [
            { en: "Place value to 999 (hundreds, tens, ones)", ko: "999까지 자릿값 (백·십·일의 자리)" },
            { en: "Comparing 3-digit numbers", ko: "세 자리 수 비교" },
            { en: "Skip counting by 5s, 10s, 100s", ko: "5씩·10씩·100씩 건너뛰기 세기" },
            { en: "Expanded form", ko: "전개형 표현 (예: 345 = 300+40+5)" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "100 이내 덧셈·뺄셈",
          topics: [
            { en: "Adding 2-digit numbers (with regrouping)", ko: "두 자리 수 덧셈 (받아올림 포함)" },
            { en: "Subtracting 2-digit numbers (with regrouping)", ko: "두 자리 수 뺄셈 (받아내림 포함)" },
            { en: "Even and odd numbers", ko: "짝수와 홀수" },
            { en: "Two-step word problems", ko: "두 단계 문장형 문제" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "표준 측정과 화폐",
          topics: [
            { en: "Measuring length with a ruler (inches, cm)", ko: "자로 길이 재기 (인치·센티미터)" },
            { en: "Telling time to the nearest 5 minutes", ko: "5분 단위로 시각 읽기" },
            { en: "Counting coins and bills", ko: "동전과 지폐 세기" },
            { en: "Word problems with money", ko: "화폐 문장형 문제" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "곱셈 개념 입문과 자료",
          topics: [
            { en: "Equal groups (intro to multiplication)", ko: "같은 수씩 묶기 (곱셈 개념 입문)" },
            { en: "Rectangular arrays", ko: "배열로 곱셈 개념 이해" },
            { en: "Picture graphs and bar graphs", ko: "그림 그래프·막대그래프" },
            { en: "3D shapes: faces, edges, vertices", ko: "3차원 도형의 면·모서리·꼭짓점" },
          ],
        },
      ],
    },
  },

  // ── Grade 2 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-2",
    grade: "Grade 2",
    gradeKo: "2학년 (Grade 2)",
    gradeNum: 2,
    standard: {
      gradeEquivalentKo: "2학년 수준",
      highlights: [
        "세 자리 수 자릿값과 비교",
        "100 이내 덧셈·뺄셈 (받아올림·내림 포함)",
        "자·컵·온도계·시계·화폐로 측정",
        "배열로 곱셈 개념 입문",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "999까지 자릿값",
          topics: [
            { en: "Place value: hundreds, tens, ones (to 999)", ko: "자릿값: 백·십·일의 자리 (999까지)" },
            { en: "Comparing and ordering 3-digit numbers", ko: "세 자리 수 비교·순서 정하기" },
            { en: "Counting patterns (skip counting)", ko: "건너뛰기 세기 패턴" },
            { en: "Even and odd numbers", ko: "짝수와 홀수" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "여러 자리 수 덧셈·뺄셈",
          topics: [
            { en: "Addition within 100 with regrouping", ko: "100 이내 받아올림 있는 덧셈" },
            { en: "Subtraction within 100 with regrouping", ko: "100 이내 받아내림 있는 뺄셈" },
            { en: "Mental math strategies", ko: "암산 전략" },
            { en: "Two-step word problems", ko: "두 단계 문장형 문제" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정과 화폐",
          topics: [
            { en: "Length: ruler (inches & centimeters)", ko: "길이: 자 (인치·센티미터)" },
            { en: "Telling time to the nearest 5 minutes", ko: "5분 단위 시각 읽기" },
            { en: "Money: counting coins and bills, making change", ko: "화폐: 동전·지폐 세기, 거스름돈" },
            { en: "Liquid volume (cups, pints, quarts)", ko: "액체 부피 (컵·파인트·쿼트)" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 곱셈 개념",
          topics: [
            { en: "2D and 3D shapes: properties and categories", ko: "2차원·3차원 도형: 속성과 분류" },
            { en: "Partitioning shapes (fractions: halves, thirds, fourths)", ko: "도형 나누기 (분수: 반·3분의1·4분의1)" },
            { en: "Equal groups and arrays (multiplication concept)", ko: "같은 묶음·배열 (곱셈 개념)" },
            { en: "Pictographs and bar graphs", ko: "그림 그래프·막대그래프" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "3학년 수준",
      highlights: [
        "곱셈 기본 사실 (×2, ×5, ×10) 학습",
        "분수 기초 (2분의 1, 3분의 1, 4분의 1)",
        "넓이·둘레 개념 입문",
        "나눗셈 개념 (똑같이 나누기)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 곱셈 개념",
          topics: [
            { en: "Rounding to nearest 10 and 100", ko: "10·100 단위로 어림하기 (반올림)" },
            { en: "Multiplication concept: equal groups, arrays", ko: "곱셈 개념: 묶음·배열" },
            { en: "Division concept: sharing equally", ko: "나눗셈 개념: 똑같이 나누기" },
            { en: "Addition and subtraction within 1000", ko: "1000 이내 덧셈·뺄셈" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈 기본 사실과 분수",
          topics: [
            { en: "Multiplication facts: ×2, ×5, ×10", ko: "곱셈 기본 사실: 2단·5단·10단" },
            { en: "Division facts related to ×2, ×5, ×10", ko: "2단·5단·10단 관련 나눗셈" },
            { en: "Fractions: halves, thirds, fourths", ko: "분수: 2분의 1, 3분의 1, 4분의 1" },
            { en: "Fractions on the number line", ko: "수직선 위의 분수" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "넓이·둘레와 측정",
          topics: [
            { en: "Area (counting unit squares)", ko: "넓이 (단위 정사각형 세기)" },
            { en: "Perimeter of polygons", ko: "다각형의 둘레" },
            { en: "Liquid volume (liters) and mass (grams, kilograms)", ko: "액체의 양 (리터)·질량 (그램·킬로그램)" },
            { en: "Elapsed time", ko: "걸린 시간 계산" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "곱셈 완성과 도형",
          topics: [
            { en: "Multiplication facts: ×3, ×4, ×6, ×7, ×8, ×9", ko: "곱셈 기본 사실: 3~9단" },
            { en: "Quadrilaterals (square, rectangle, rhombus, parallelogram)", ko: "사각형 종류 (정사각형·직사각형·마름모·평행사변형)" },
            { en: "Picture graphs and bar graphs: scale", ko: "그래프 눈금 이해" },
            { en: "Word problems: multiplication and division", ko: "곱셈·나눗셈 문장형 문제" },
          ],
        },
      ],
    },
  },

  // ── Grade 3 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-3",
    grade: "Grade 3",
    gradeKo: "3학년 (Grade 3)",
    gradeNum: 3,
    fcpsUrlStandard: "https://www.fcps.edu/academics/elementary/third-grade/year-at-a-glance/math",
    fcpsUrlAdvanced: "https://www.fcps.edu/academics/elementary/third-grade/year-at-a-glance/advanced-math",
    standard: {
      gradeEquivalentKo: "3학년 수준 (Virginia SOL 3)",
      highlights: [
        "곱셈·나눗셈 기본 사실 (0~10) 완전 습득",
        "분수 기초 (단위분수, 동치분수)",
        "넓이·둘레 개념과 계산",
        "3학년 말 버지니아 수학 SOL 시험 대비",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 여러 자리 수 연산",
          topics: [
            { en: "Rounding to nearest 10 and 100", ko: "10·100 단위 어림하기 (반올림)" },
            { en: "Addition and subtraction (4-digit numbers)", ko: "네 자리 수 덧셈·뺄셈" },
            { en: "Multiplication concept: equal groups, arrays, area model", ko: "곱셈 개념: 묶음·배열·면적 모형" },
            { en: "Multiplication facts ×2, ×5, ×10", ko: "2단·5단·10단 곱셈" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈·나눗셈 완전 습득",
          topics: [
            { en: "Multiplication facts 0–10 (fluency)", ko: "0~10단 곱셈 기본 사실 유창하게" },
            { en: "Division as sharing and grouping", ko: "나눗셈: 똑같이 나누기·묶기" },
            { en: "Fact families (multiplication ↔ division)", ko: "곱셈·나눗셈 관계 (역연산)" },
            { en: "Word problems: multiply and divide", ko: "곱셈·나눗셈 문장형 문제" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수와 측정",
          topics: [
            { en: "Unit fractions (1/2, 1/3, 1/4, 1/6, 1/8)", ko: "단위 분수 (½, ⅓, ¼, ⅙, ⅛)" },
            { en: "Equivalent fractions with same-size wholes", ko: "같은 크기 전체에서의 동치분수" },
            { en: "Fractions on a number line", ko: "수직선 위의 분수" },
            { en: "Elapsed time (to the minute)", ko: "걸린 시간 계산 (분 단위)" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "넓이·둘레와 도형",
          topics: [
            { en: "Area: counting unit squares, A = l × w", ko: "넓이: 단위 정사각형·A = 가로 × 세로" },
            { en: "Perimeter of polygons", ko: "다각형의 둘레" },
            { en: "Quadrilaterals (classifying)", ko: "사각형 분류" },
            { en: "Bar graphs, pictographs, probability intro", ko: "막대그래프·그림그래프·확률 입문" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "4학년 수준 (Virginia SOL 4)",
      highlights: [
        "여러 자리 수 곱셈 (두 자리 × 두 자리)",
        "나머지 있는 긴 나눗셈",
        "분수 심화 (동치분수, 동분모 덧셈·뺄셈)",
        "소수 (0.1 자리, 0.01 자리) 개념과 화폐",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "여러 자리 수 곱셈·수 이론",
          topics: [
            { en: "Rounding (large numbers)", ko: "큰 수 어림하기" },
            { en: "Multiplication: 2-digit × 1-digit", ko: "두 자리 × 한 자리 곱셈" },
            { en: "Factors and multiples", ko: "인수와 배수" },
            { en: "Prime and composite numbers (intro)", ko: "소수·합성수 입문" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "여러 자리 수 연산과 분수",
          topics: [
            { en: "Multiplication: 2-digit × 2-digit", ko: "두 자리 × 두 자리 곱셈" },
            { en: "Long division with remainders", ko: "나머지 있는 긴 나눗셈" },
            { en: "Equivalent fractions", ko: "동치분수" },
            { en: "Comparing fractions (same numerator or denominator)", ko: "분수 비교 (분자·분모가 같은 경우)" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수 심화와 소수",
          topics: [
            { en: "Adding & subtracting fractions (like denominators)", ko: "동분모 분수 덧셈·뺄셈" },
            { en: "Mixed numbers and improper fractions", ko: "대분수와 가분수" },
            { en: "Decimals: tenths and hundredths", ko: "소수: 0.1 자리·0.01 자리" },
            { en: "Money as decimals ($)", ko: "화폐와 소수 ($)" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 측정",
          topics: [
            { en: "Angles: measuring with a protractor", ko: "각도: 각도기로 재기" },
            { en: "Lines: parallel, perpendicular, rays, segments", ko: "평행·수직·반직선·선분" },
            { en: "Area and perimeter", ko: "넓이·둘레 심화" },
            { en: "Measurement conversions (inches/feet/yards)", ko: "측정 단위 변환 (인치·피트·야드)" },
          ],
        },
      ],
    },
  },

  // ── Grade 4 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-4",
    grade: "Grade 4",
    gradeKo: "4학년 (Grade 4)",
    gradeNum: 4,
    fcpsUrlStandard: "https://www.fcps.edu/academics/elementary/fourth-grade/year-at-a-glance/math",
    fcpsUrlAdvanced: "https://www.fcps.edu/academics/elementary/fourth-grade/year-at-a-glance/advanced-math",
    standard: {
      gradeEquivalentKo: "4학년 수준 (Virginia SOL 4)",
      highlights: [
        "여러 자리 수 곱셈·나눗셈 (나머지 포함)",
        "분수 심화 (동치분수, 동분모 덧셈·뺄셈)",
        "소수 개념 (0.1, 0.01 자리)",
        "각도 측정·도형 분류 (사각형·삼각형)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "여러 자리 수 곱셈·나눗셈",
          topics: [
            { en: "Multi-digit multiplication (2×2 digit)", ko: "두 자리 × 두 자리 곱셈" },
            { en: "Long division with remainders", ko: "나머지 있는 긴 나눗셈" },
            { en: "Estimation and rounding (larger numbers)", ko: "큰 수의 어림과 반올림" },
            { en: "Order of operations (introduction)", ko: "연산 순서 입문" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수",
          topics: [
            { en: "Equivalent fractions (models and number lines)", ko: "동치분수 (모델·수직선 활용)" },
            { en: "Comparing and ordering fractions", ko: "분수 비교와 순서" },
            { en: "Adding and subtracting fractions (like denominators)", ko: "동분모 분수 덧셈·뺄셈" },
            { en: "Mixed numbers and improper fractions", ko: "대분수와 가분수" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수와 측정",
          topics: [
            { en: "Decimals: tenths and hundredths (compare, order)", ko: "소수 0.1·0.01 자리 비교·순서" },
            { en: "Relating fractions and decimals", ko: "분수와 소수의 관계" },
            { en: "Measurement conversions (customary & metric)", ko: "도량형 단위 변환 (야드법·미터법)" },
            { en: "Elapsed time problems", ko: "걸린 시간 문제" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 자료",
          topics: [
            { en: "Angles: acute, right, obtuse; measuring with protractor", ko: "각의 종류 (예각·직각·둔각)와 각도기 측정" },
            { en: "Points, lines, rays, line segments", ko: "점·선·반직선·선분" },
            { en: "Classifying quadrilaterals and triangles", ko: "사각형·삼각형 분류" },
            { en: "Line plots, bar graphs, basic probability", ko: "꺾은선그래프·막대그래프·기초 확률" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "5학년 수준 (Virginia SOL 5)",
      highlights: [
        "소수 사칙연산 (덧셈·뺄셈·곱셈·나눗셈)",
        "분수 곱셈·나눗셈 (대분수 포함)",
        "연산 순서 (PEMDAS) 완전 이해",
        "부피 계산, 좌표 평면, 대수 패턴 입문",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "정수 연산과 연산 순서",
          topics: [
            { en: "Multi-digit multiplication and division (advanced)", ko: "여러 자리 수 곱셈·나눗셈 심화" },
            { en: "Order of operations (PEMDAS)", ko: "연산 순서 (PEMDAS: 괄호·지수·곱나눗·덧뺄)" },
            { en: "Divisibility rules", ko: "나누어떨어짐 규칙" },
            { en: "Prime factorization (intro)", ko: "소인수분해 입문" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수 사칙연산",
          topics: [
            { en: "Multiplying fractions by whole numbers", ko: "분수 × 자연수" },
            { en: "Multiplying fractions by fractions", ko: "분수 × 분수" },
            { en: "Dividing unit fractions by whole numbers", ko: "단위분수 ÷ 자연수" },
            { en: "Mixed number operations", ko: "대분수 사칙연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수 사칙연산",
          topics: [
            { en: "Adding and subtracting decimals", ko: "소수 덧셈·뺄셈" },
            { en: "Multiplying decimals (by whole number and decimal)", ko: "소수 곱셈 (소수 × 자연수, 소수 × 소수)" },
            { en: "Dividing decimals", ko: "소수 나눗셈" },
            { en: "Percent concept (fraction/decimal/percent equivalence)", ko: "백분율 개념 (분수·소수·백분율 관계)" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형·대수·통계",
          topics: [
            { en: "Volume of rectangular prisms (V = l × w × h)", ko: "직육면체 부피 (V = 가로 × 세로 × 높이)" },
            { en: "Coordinate plane (all four quadrants)", ko: "좌표 평면 (4사분면)" },
            { en: "Algebraic patterns (input/output tables)", ko: "대수 패턴 (입력·출력 표)" },
            { en: "Data: mean, median, mode, range; line plots", ko: "통계: 평균·중앙값·최빈값·범위" },
          ],
        },
      ],
    },
  },

  // ── Grade 5 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-5",
    grade: "Grade 5",
    gradeKo: "5학년 (Grade 5)",
    gradeNum: 5,
    fcpsUrlStandard: "https://www.fcps.edu/academics/elementary/fifth-grade/year-at-a-glance/math",
    fcpsUrlAdvanced: "https://www.fcps.edu/academics/elementary/fifth-grade/year-at-a-glance/advanced-math",
    standard: {
      gradeEquivalentKo: "5학년 수준 (Virginia SOL 5)",
      highlights: [
        "소수 사칙연산 완전 습득",
        "분수 곱셈·나눗셈 (대분수 포함)",
        "부피 계산, 좌표 평면",
        "평균·중앙값·최빈값·범위 (통계 기초)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "소수 사칙연산",
          topics: [
            { en: "Decimal place value (thousandths)", ko: "소수 자릿값 (0.001 자리까지)" },
            { en: "Comparing and rounding decimals", ko: "소수 비교·반올림" },
            { en: "Adding and subtracting decimals", ko: "소수 덧셈·뺄셈" },
            { en: "Multiplying and dividing decimals", ko: "소수 곱셈·나눗셈" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수 사칙연산",
          topics: [
            { en: "Adding and subtracting fractions (unlike denominators)", ko: "이분모 분수 덧셈·뺄셈" },
            { en: "Multiplying fractions (including mixed numbers)", ko: "분수 곱셈 (대분수 포함)" },
            { en: "Dividing fractions (unit fraction ÷ whole number)", ko: "분수 나눗셈 (단위분수 ÷ 자연수)" },
            { en: "Order of operations with fractions and decimals", ko: "분수·소수 포함 연산 순서" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "도형과 좌표 평면",
          topics: [
            { en: "Volume of rectangular prisms (cubes & formula)", ko: "직육면체 부피 (쌓기 나무·공식)" },
            { en: "Coordinate plane: graphing points (Quadrant I)", ko: "좌표 평면: 점 나타내기 (제1사분면)" },
            { en: "Patterns and functions (numerical rules)", ko: "패턴과 함수 (수 규칙)" },
            { en: "Classifying triangles and quadrilaterals", ko: "삼각형·사각형 분류" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "통계와 총정리",
          topics: [
            { en: "Mean, median, mode, and range", ko: "평균·중앙값·최빈값·범위" },
            { en: "Line plots and interpreting data", ko: "꺾은선그래프·자료 해석" },
            { en: "Negative numbers on a number line (intro)", ko: "수직선 위의 음수 입문" },
            { en: "SOL review and problem solving", ko: "SOL 대비 총정리·문제 풀이" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "6학년 수준 (Virginia SOL 6)",
      highlights: [
        "비율·비례와 단위 속도 (Unit Rate)",
        "정수 (양수·음수) 사칙연산",
        "대수적 식과 방정식 (변수 포함)",
        "자료 분포: 상자그림·평균절대편차 (MAD)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "비율과 비례",
          topics: [
            { en: "Ratio concepts (part:part, part:whole)", ko: "비율 개념 (부분:부분, 부분:전체)" },
            { en: "Unit rates", ko: "단위 속도 (단위 비율)" },
            { en: "Percent: tax, discount, tip", ko: "백분율 응용: 세금·할인·팁" },
            { en: "Converting fractions, decimals, and percents", ko: "분수·소수·백분율 변환" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "유리수 (정수)",
          topics: [
            { en: "Integers: positive and negative numbers", ko: "정수: 양수·음수" },
            { en: "Absolute value and number line", ko: "절댓값과 수직선" },
            { en: "Adding and subtracting integers", ko: "정수 덧셈·뺄셈" },
            { en: "Multiplying and dividing integers", ko: "정수 곱셈·나눗셈" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "식과 방정식",
          topics: [
            { en: "Writing and evaluating algebraic expressions", ko: "대수적 식 쓰기·계산하기" },
            { en: "Properties: distributive, associative", ko: "연산의 성질 (분배법칙·결합법칙)" },
            { en: "Solving one-variable equations", ko: "일변수 방정식 풀기" },
            { en: "Dependent and independent variables", ko: "종속 변수·독립 변수" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 통계",
          topics: [
            { en: "Area of triangles and composite figures", ko: "삼각형·복합 도형의 넓이" },
            { en: "Surface area and volume", ko: "겉넓이와 부피" },
            { en: "Box plots (quartiles, median)", ko: "상자그림 (사분위수·중앙값)" },
            { en: "Mean absolute deviation (MAD)", ko: "평균절대편차 (MAD)" },
          ],
        },
      ],
    },
  },

  // ── Grade 6 ───────────────────────────────────────────────────────────────
  {
    slug: "grade-6",
    grade: "Grade 6",
    gradeKo: "6학년 (Grade 6)",
    gradeNum: 6,
    fcpsUrlStandard: "https://www.fcps.edu/academics/elementary/sixth-grade/year-at-a-glance/math",
    fcpsUrlAdvanced: "https://www.fcps.edu/academics/elementary/sixth-grade/year-at-a-glance/advanced-math",
    standard: {
      gradeEquivalentKo: "6학년 수준 (Virginia SOL 6)",
      highlights: [
        "비율·비례와 백분율 응용",
        "유리수 (정수·분수·소수) 사칙연산",
        "대수적 식·일변수 방정식·부등식",
        "통계: 평균절대편차·상자그림·자료 분포",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "비율과 비례관계",
          topics: [
            { en: "Ratios and rates", ko: "비율과 속도" },
            { en: "Unit rates and proportions", ko: "단위 비율과 비례식" },
            { en: "Percent: find percent, percent of a number", ko: "백분율: 구하기·어떤 수의 백분율" },
            { en: "Rational numbers on a number line", ko: "수직선 위의 유리수 (분수·소수·정수)" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "정수·유리수 사칙연산",
          topics: [
            { en: "Integer operations (all four operations)", ko: "정수 사칙연산" },
            { en: "Absolute value", ko: "절댓값" },
            { en: "Fraction and decimal operations review", ko: "분수·소수 연산 심화" },
            { en: "Word problems with rational numbers", ko: "유리수 문장형 문제" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "대수적 식과 방정식",
          topics: [
            { en: "Writing and simplifying algebraic expressions", ko: "대수적 식 쓰기·간단히 하기" },
            { en: "Properties: distributive, commutative, associative", ko: "분배법칙·교환법칙·결합법칙" },
            { en: "Solving one-step equations", ko: "일단계 방정식 풀기" },
            { en: "Solving one-step inequalities", ko: "일단계 부등식 풀기" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 통계",
          topics: [
            { en: "Area of polygons (triangles, parallelograms, trapezoids)", ko: "다각형 넓이 (삼각형·평행사변형·사다리꼴)" },
            { en: "Surface area of prisms and pyramids", ko: "각기둥·각뿔의 겉넓이" },
            { en: "Volume of rectangular prisms", ko: "직육면체 부피" },
            { en: "Statistics: MAD, box plots, histograms", ko: "통계: 평균절대편차·상자그림·히스토그램" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "7학년 / 중학 대수 준비 수준",
      highlights: [
        "비례관계: 표·그래프·방정식으로 표현",
        "백분율 응용 (단순 이자, 할인, 세금, 팁)",
        "이변수 방정식과 다단계 부등식",
        "확률 (실험적·이론적), 자료 표본과 추론",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "비례관계와 백분율 심화",
          topics: [
            { en: "Proportional relationships: tables, graphs, equations", ko: "비례관계: 표·그래프·방정식으로 표현" },
            { en: "Scale drawings and maps", ko: "축척 도면과 지도" },
            { en: "Percent applications: tax, tip, discount, simple interest", ko: "백분율 응용: 세금·팁·할인·단순 이자" },
            { en: "Percent increase and decrease", ko: "백분율 증가·감소" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "유리수 연산과 확률",
          topics: [
            { en: "All rational number operations (fluency)", ko: "유리수 사칙연산 유창하게" },
            { en: "Experimental probability", ko: "실험적 확률" },
            { en: "Theoretical probability", ko: "이론적 확률" },
            { en: "Compound events and sample space", ko: "복합 사건과 표본 공간" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "식·방정식·부등식 심화",
          topics: [
            { en: "Multi-step equations", ko: "다단계 방정식" },
            { en: "Equations with two variables", ko: "이변수 방정식" },
            { en: "Multi-step inequalities", ko: "다단계 부등식" },
            { en: "Real-world problems with equations", ko: "방정식으로 실생활 문제 풀기" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형·통계와 표본 추론",
          topics: [
            { en: "Geometric transformations (reflections, rotations, translations)", ko: "기하 변환 (반사·회전·평행이동)" },
            { en: "Angle relationships (vertical, supplementary, complementary)", ko: "각의 관계 (맞꼭지각·보각·여각)" },
            { en: "Drawing inferences from samples", ko: "표본에서 추론하기" },
            { en: "Double box plots: comparing data distributions", ko: "이중 상자그림으로 자료 분포 비교" },
          ],
        },
      ],
    },
  },
];

export const gradeBySlug = Object.fromEntries(grades.map((g) => [g.slug, g]));

// Virginia SOL per-grade summary
export type SolGrade = {
  grade: string;
  gradeKo: string;
  strands: { name: string; nameKo: string; summary: string }[];
};

export const solGrades: SolGrade[] = [
  {
    grade: "Kindergarten",
    gradeKo: "유치원",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "1~110 세기, 수 비교 (더 많다·더 적다), 도형을 이용한 분수 기초 (반·4분의1)" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "10 이내 덧셈·뺄셈 개념, 수 합성·분해" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "비표준 단위로 길이·무게 비교, 2차원·3차원 도형 인식 및 분류" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "반복 패턴 인식·만들기·연장하기" },
    ],
  },
  {
    grade: "Grade 1",
    gradeKo: "1학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "자릿값 (십·일의 자리), 120까지 세기, 분수 (반·3분의1·4분의1)" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "합·차가 18 이내인 덧셈·뺄셈 유창하게, 한 단계 문장형 문제" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "비표준 단위 길이 측정, 시각 (정각·30분), 동전 인식" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "그림 그래프·막대그래프·집계표로 자료 정리" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "패턴 인식·분류·연장·이전, 패턴의 규칙 설명" },
    ],
  },
  {
    grade: "Grade 2",
    gradeKo: "2학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "999까지 자릿값, 짝수·홀수, 분수 (반·3분의1·4분의1·8분의1)" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "999 이내 덧셈·뺄셈 (받아올림·내림), 곱셈 개념 (반복덧셈·건너뛰기 세기)" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "자로 길이 재기, 5분 단위 시각, 화폐, 2차원·3차원 도형 분류" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "그림 그래프·막대그래프·표로 자료 수집·정리·해석" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "패턴 분류·인식, 대칭 개념, 증가·감소 패턴" },
    ],
  },
  {
    grade: "Grade 3",
    gradeKo: "3학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "어림·반올림, 분수 (수직선 위, 동치분수), 네 자리 수 비교" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "곱셈·나눗셈 기본 사실 0~12 완전 습득, 여러 자리 수 덧셈·뺄셈" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "넓이·둘레, 걸린 시간, 액체 부피·질량, 사각형 분류" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "그림그래프·막대그래프·꺾은선그래프, 확률 기초 (가능성)" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "곱셈·나눗셈 패턴, 함수표 (입력·출력), 대수적 추론" },
    ],
  },
  {
    grade: "Grade 4",
    gradeKo: "4학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "백만 단위 자릿값, 소수 (0.1·0.01), 분수 비교·동치" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "여러 자리 수 곱셈·나눗셈, 동분모 분수 덧셈·뺄셈" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "단위 변환, 각도 측정, 선·각·도형 분류, 둘레·넓이" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "막대그래프·꺾은선그래프·원그래프 해석, 확률 (가능성 비교)" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "수 패턴 규칙, 함수표, 등식·부등식 개념" },
    ],
  },
  {
    grade: "Grade 5",
    gradeKo: "5학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "소수 (0.001 자리), 소수·분수·음수 수직선 표현, 소수·합성수" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "소수 사칙연산, 분수 사칙연산 (이분모 포함), 연산 순서 (PEMDAS)" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "직육면체 부피, 삼각형·합성 도형 넓이, 2차원·3차원 분류" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "평균·중앙값·최빈값·범위, 꺾은선·원그래프, 확률 비교" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "좌표 평면 (제1사분면), 수 패턴, 식과 등호" },
    ],
  },
  {
    grade: "Grade 6",
    gradeKo: "6학년",
    strands: [
      { name: "Number & Number Sense", nameKo: "수와 수 감각", summary: "정수·절댓값, 분수·소수·백분율 상호 변환, 비율 개념" },
      { name: "Computation & Estimation", nameKo: "연산과 어림", summary: "정수·유리수 사칙연산, 비례식·비율·백분율, 단위 변환" },
      { name: "Measurement & Geometry", nameKo: "측정과 도형", summary: "복합 도형 넓이, 겉넓이, 직육면체 부피" },
      { name: "Probability & Statistics", nameKo: "확률과 통계", summary: "평균절대편차·상자그림·히스토그램, 자료 해석" },
      { name: "Patterns, Functions & Algebra", nameKo: "패턴·함수·대수", summary: "대수적 식·방정식·부등식 (일변수), 대수적 성질" },
    ],
  },
];

// Testing calendar data
export type TestEvent = {
  name: string;
  nameKo: string;
  when: string;
  whenKo: string;
  grades: string;
  gradesKo: string;
  description: string;
  color: "navy" | "gold" | "green" | "purple";
};

export const testEvents: TestEvent[] = [
  {
    name: "AAP Screening Referral Window",
    nameKo: "AAP 심화학습 의뢰 기간",
    when: "Oct – Dec (annually)",
    whenKo: "매년 10월 ~ 12월",
    grades: "K–6 (current year students)",
    gradesKo: "유치원~6학년 재학생",
    description:
      "Parents, teachers, or students themselves can submit a referral for AAP evaluation. Forms are available through each school's AAP contact. No cost. The referral window closes in early December each year.",
    color: "navy",
  },
  {
    name: "AAP Ability Testing (CogAT / NNAT)",
    nameKo: "AAP 역량 검사 (CogAT / NNAT)",
    when: "Jan – Feb (annually)",
    whenKo: "매년 1월 ~ 2월",
    grades: "Referred students (K–5)",
    gradesKo: "의뢰된 학생 (유치원~5학년)",
    description:
      "FCPS administers two nationally normed tests: CogAT (Cognitive Abilities Test) measures reasoning in verbal, quantitative, and nonverbal areas. NNAT (Naglieri Nonverbal Ability Test) measures nonverbal reasoning. Scores plus portfolio evidence determine AAP placement.",
    color: "gold",
  },
  {
    name: "AAP Placement Notification",
    nameKo: "AAP 배치 결과 통보",
    when: "Apr (annually)",
    whenKo: "매년 4월",
    grades: "Tested students",
    gradesKo: "검사를 받은 학생",
    description:
      "FCPS sends placement letters home. Full-Time AAP students move to a designated AAP center school the following year. Part-Time AAP (Level III) services begin at the home school. Parents may request reconsideration within the given window.",
    color: "green",
  },
  {
    name: "Virginia SOL Testing",
    nameKo: "버지니아 SOL 시험",
    when: "Late Apr – early Jun (annually)",
    whenKo: "매년 4월 말 ~ 6월 초",
    grades: "Gr 3 (Math, Reading), Gr 4 (Math, Reading), Gr 5 (Math, Reading, Science), Gr 6 (Math, Reading)",
    gradesKo: "3학년 (수학·읽기), 4학년 (수학·읽기), 5학년 (수학·읽기·과학), 6학년 (수학·읽기)",
    description:
      "Virginia Standards of Learning (SOL) tests measure whether students have mastered the grade-level SOL. All public school students in Grades 3–8 are required to take these tests. Results are used for school accreditation and student promotion decisions.",
    color: "navy",
  },
  {
    name: "AMC 8 (Math Competition)",
    nameKo: "AMC 8 수학 경시대회",
    when: "Mid-November (annually)",
    whenKo: "매년 11월 중순",
    grades: "Gr 6 and below (recommended for advanced 4–5)",
    gradesKo: "6학년 이하 (4~5학년 심화반 권장)",
    description:
      "The AMC 8 (American Mathematics Competition) is a 25-question multiple-choice contest covering pre-algebra topics. It is a great first math competition experience and is open to students in Grade 8 or below. Many AAP students in Grades 4–6 participate.",
    color: "purple",
  },
  {
    name: "FCPS Math Olympiad (MOEMS)",
    nameKo: "FCPS 수학 올림피아드 (MOEMS)",
    when: "Nov – Mar (5 monthly contests)",
    whenKo: "11월 ~ 3월 (5회 월별 대회)",
    grades: "Gr 4–6 (school-based teams)",
    gradesKo: "4~6학년 (학교 팀 기반)",
    description:
      "Mathematical Olympiads for Elementary and Middle Schools (MOEMS) is held in monthly rounds. Schools form teams and students compete individually. Strong preparation for AMC 8 and future math competitions.",
    color: "purple",
  },
];
