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
        "분수: 단위분수·동치분수 (분모 2,3,4,5,6,8,10)",
        "넓이·둘레 개념 및 미국·미터 단위 측정",
        "분 단위 시각 읽기·걸린 시간, 5달러 이하 화폐",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료 탐구 + 자릿값·연산",
          topics: [
            { en: "Data collection: polls, observations, tallies (≤ 30 data points, ≤ 8 categories)", ko: "자료 수집: 설문·관찰·집계 (최대 30개 자료, 8가지 항목)" },
            { en: "Pictographs: title, labeled axes, key (symbol = 1, 2, 5, or 10 data points)", ko: "그림그래프: 제목·축 레이블·범례 (기호 하나 = 1, 2, 5, 또는 10개)" },
            { en: "Bar graphs: title, labeled axes, scale in multiples of 1, 2, 5, or 10", ko: "막대그래프: 제목·축 레이블·적절한 눈금 (1, 2, 5, 10의 배수)" },
            { en: "Analyze graphs: describe categories, identify most/least, draw conclusions and predictions", ko: "그래프 분석: 항목 설명, 최다·최소 파악, 결론 도출 및 예측" },
            { en: "One- and two-step addition and subtraction problems using graph data", ko: "그래프 자료를 이용한 1·2단계 덧셈·뺄셈 문제" },
            { en: "Read and write 6-digit numbers (standard, expanded, and word form)", ko: "여섯 자리 수 읽기·쓰기 (표준형·전개형·언어형)" },
            { en: "Place value: identify digit and value in 6-digit numbers; compare and order numbers ≤ 9,999", ko: "자릿값: 여섯 자리 수의 각 자리 숫자와 값; 9,999 이하 수 비교·순서" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈·나눗셈 + 도형",
          topics: [
            { en: "Multiplication and division through 10×10 using models (arrays, equal groups, number lines)", ko: "10×10 범위 곱셈·나눗셈: 배열·묶음·수직선 모형" },
            { en: "Inverse relationships: write related multiplication and division facts for a given model", ko: "역연산 관계: 주어진 모형에서 관련 곱셈·나눗셈 사실 쓰기" },
            { en: "Fluency strategies: doubling, adding/subtracting a group, near squares", ko: "유창성 전략: 두 배하기, 한 묶음 더하기·빼기, 인접 제곱수" },
            { en: "Single-step real-life multiplication and division word problems (0–10×10)", ko: "0~10×10 범위 곱셈·나눗셈 한 단계 실생활 문제" },
            { en: "Quick recall of all multiplication facts 0–10 and corresponding division facts", ko: "0~10단 곱셈 사실 및 관련 나눗셈 사실 즉각 암기" },
            { en: "Polygons: closed plane figures with ≥3 non-crossing line segments; classify polygon vs. non-polygon", ko: "다각형: 교차하지 않는 선분 3개 이상으로 이루어진 닫힌 평면 도형; 다각형 여부 분류" },
            { en: "Identify and compare triangles, quadrilaterals, pentagons, hexagons, and octagons; combine and subdivide polygons", ko: "삼각형·사각형·오각형·육각형·팔각형 인식·비교; 다각형 합치기·쪼개기" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수 + 측정·넓이·둘레",
          topics: [
            { en: "Represent fractions and mixed numbers (denominators 2, 3, 4, 5, 6, 8, 10) using region, length, and set models", ko: "분수·대분수 표현 (분모 2,3,4,5,6,8,10): 넓이·길이·집합 모형" },
            { en: "Identify a fraction as a sum of unit fractions; compose and decompose fractions in multiple ways", ko: "분수 = 단위분수의 합; 분수를 여러 방식으로 묶고 나누기" },
            { en: "Count fractional parts of models greater than 1 to name improper fractions and mixed numbers", ko: "1보다 큰 분수 모형의 부분 세기 → 가분수와 대분수 이름 쓰기" },
            { en: "Estimate and measure length: ½ inch, inch, foot, yard (US Customary); centimeter, meter (metric)", ko: "길이 측정 어림·재기: ½인치·인치·피트·야드 (미국); 센티미터·미터 (미터법)" },
            { en: "Estimate and measure weight (pound; kilogram) and liquid volume (cup, pint, quart, gallon; liter)", ko: "무게 어림·재기 (파운드; 킬로그램)와 액체 부피 (컵·파인트·쿼트·갤런; 리터)" },
            { en: "Area: count unit squares to determine area of a surface", ko: "넓이: 단위 정사각형 세어 넓이 구하기" },
            { en: "Perimeter: measure around a polygon (≤ 6 sides); calculate from given side lengths", ko: "둘레: 다각형 둘레 재기 (최대 6변); 주어진 변의 길이로 계산" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 비교 + 시각·화폐",
          topics: [
            { en: "Compare fractions to benchmarks 0, ½, and 1 using area/region and length models", ko: "분수를 기준점 0, ½, 1과 비교: 넓이·길이 모형 사용" },
            { en: "Compare fractions with like numerators or like denominators using >, <, = and models", ko: "분자 또는 분모가 같은 분수 비교: >, <, = 기호와 모형" },
            { en: "Show equivalent fractions (denominators 2, 3, 4, 5, 6, 8, 10) with region and length models", ko: "동치분수 나타내기 (분모 2,3,4,5,6,8,10): 넓이·길이 모형" },
            { en: "Tell and write time to the nearest minute using analog and digital clocks", ko: "분 단위로 시각 읽기·쓰기 (아날로그·디지털 시계)" },
            { en: "Elapsed time in one-hour increments within a.m. or within p.m. (find elapsed, end, or start time)", ko: "오전 또는 오후 내 1시간 단위 경과 시간 (경과·종료·시작 시각 구하기)" },
            { en: "Money: value of coins/bills ≤ $5.00; construct a set; compare two sets; make change", ko: "화폐: 5달러 이하 동전·지폐 가치; 금액 만들기; 두 묶음 비교; 거스름돈" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "4학년 수준 (Virginia SOL 4)",
      highlights: [
        "자료: 꺾은선그래프 추가, 최대 9자리 수 자릿값",
        "곱셈·나눗셈: 5가지 표현 + 두/세 자리 × 한 자리 곱셈",
        "도형 심화: 직선·각·사각형 분류 (평행·수직·합동)",
        "측정: 분수 눈금·단위 환산 + 직사각형 넓이 공식",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선그래프 포함) + 확장 자릿값",
          topics: [
            { en: "All standard data topics: pictographs, bar graphs, analysis, and word problems", ko: "일반 수업과 동일한 자료 학습 (그림그래프, 막대그래프, 분석, 문제)" },
            { en: "Line graphs: collect ≤ 10 data points, organize with labeled axes, analyze trends", ko: "꺾은선그래프: 최대 10개 자료 수집·축 레이블로 정리·경향 분석" },
            { en: "Single- and multi-step addition/subtraction problems using line graph data", ko: "꺾은선그래프 자료를 이용한 1·여러 단계 덧셈·뺄셈 문제" },
            { en: "Read and write 6-digit AND 9-digit whole numbers (standard form, word form)", ko: "여섯 자리 및 아홉 자리 정수 읽기·쓰기 (표준형, 언어형)" },
            { en: "Place value in 9-digit numbers: identify digit and value (e.g., 8 millions = 8,000,000 in 568,165,724)", ko: "아홉 자리 수 자릿값: 각 자리 숫자와 값 파악 (예: 568,165,724에서 8은 8,000,000)" },
            { en: "Compare two whole numbers up to 7 digits using >, <, =, ≠", ko: "최대 7자리 정수 두 개 비교: >, <, =, ≠" },
            { en: "Order up to four whole numbers each up to 7 digits, least to greatest or greatest to least", ko: "최대 7자리 정수 4개까지 크기순 정렬 (오름·내림차순)" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈·나눗셈(5가지 표현) + 심화 도형 + 분수",
          topics: [
            { en: "Multiplication and division through 10×10: fluency strategies, quick recall of all facts", ko: "10×10 범위 곱셈·나눗셈: 유창성 전략, 전체 기본 사실 즉각 암기" },
            { en: "Describe multiplicative relationships using all 5 representations: visual, symbolic, verbal, contextual, physical", ko: "곱셈 관계를 5가지 표현으로 설명: 시각적·기호적·언어적·맥락적·물리적" },
            { en: "Create equations for equivalent expressions using multiplication/division (e.g., 4×3 = 14–2, 35÷5 = 1×7)", ko: "곱셈·나눗셈으로 동치 식 만들기 (예: 4×3 = 14–2, 35÷5 = 1×7)" },
            { en: "Points, lines, line segments, rays, and angles: endpoints, vertices, symbolic notation; draw with ruler/straightedge", ko: "점·직선·선분·반직선·각: 끝점·꼭짓점·기호 표기; 자와 직선자로 그리기" },
            { en: "Parallel, perpendicular, and intersecting lines and line segments; identify in 2D and 3D shapes", ko: "평행·수직·교차하는 직선과 선분; 평면·입체 도형에서 찾기" },
            { en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel sides, perpendicular sides, congruent sides, and right angles", ko: "사각형 분류 (평행사변형·직사각형·정사각형·마름모·사다리꼴): 평행·수직·합동 변과 직각 기준" },
            { en: "Fractions and mixed numbers (denominators 2–10): compose and decompose; real-life comparison with justification", ko: "분수·대분수 (분모 2~10): 묶기·나누기; 실생활 비교 상황에서 풀이 설명" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "두/세 자리 곱셈 + 확장 연산 + 심화 측정",
          topics: [
            { en: "Multi-digit multiplication: 2-digit × 1-digit and 3-digit × 1-digit (estimation and standard algorithm)", ko: "여러 자리 곱셈: 두 자리 × 한 자리, 세 자리 × 한 자리 (어림 및 표준 알고리즘)" },
            { en: "Single- and multi-step real-life problems involving multiplication; single-step division problems", ko: "곱셈 포함 1·여러 단계 실생활 문제; 나눗셈 한 단계 실생활 문제" },
            { en: "Addition and subtraction with numbers up to 10,000; estimate and solve problems up to 1,000,000", ko: "최대 10,000까지 덧셈·뺄셈; 최대 1,000,000 문제 어림·풀기" },
            { en: "Measure length to ½ inch, ¼ inch, ⅛ inch (US Customary) and millimeter/centimeter/meter (metric)", ko: "길이 재기: ½인치·¼인치·⅛인치 (미국); 밀리미터·센티미터·미터 (미터법)" },
            { en: "Measure weight to nearest ounce and pound (US) and gram and kilogram (metric); liquid volume to milliliter and liter", ko: "무게: 온스·파운드 (미국), 그램·킬로그램 (미터법); 액체 부피: 밀리리터·리터" },
            { en: "Unit conversions: inches↔feet↔yards; ounces↔pounds; cups↔pints↔quarts↔gallons", ko: "단위 환산: 인치↔피트↔야드; 온스↔파운드; 컵↔파인트↔쿼트↔갤런" },
            { en: "Develop formula for area and perimeter of a rectangle; explore same perimeter/different area and same area/different perimeter", ko: "직사각형 넓이·둘레 공식 도출; 같은 둘레·다른 넓이, 같은 넓이·다른 둘레 탐구" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 비교 + 심화 경과 시간 + 다자리 곱셈",
          topics: [
            { en: "Compare fractions to benchmarks 0, ½, 1; compare with like numerators or like denominators; show equivalent fractions with models", ko: "분수를 0·½·1과 비교; 같은 분자·분모 분수 비교; 모형으로 동치분수" },
            { en: "Real-life fraction comparison: justify solution using visual, verbal, and symbolic representations", ko: "실생활 분수 비교: 시각·언어·기호 표현으로 풀이 정당화" },
            { en: "Tell time to nearest minute; elapsed time in hours AND minutes within a 12-hour period", ko: "분 단위 시각 읽기; 12시간 이내 시간과 분 단위 경과 시간 계산" },
            { en: "Elapsed time across a.m. and p.m. (find elapsed time, end time, or start time)", ko: "오전·오후를 넘나드는 경과 시간 (경과·종료·시작 시각 구하기)" },
            { en: "Multi-digit multiplication continued: multi-step real-life problems (2- and 3-digit × 1-digit)", ko: "여러 자리 곱셈 심화: 두/세 자리 × 한 자리 여러 단계 실생활 문제" },
            { en: "Multiplication/division patterns with input/output tables and function machines; identify and extend rules", ko: "입력·출력 표와 함수 기계로 곱셈·나눗셈 패턴; 규칙 찾기와 연장" },
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
        "꺾은선그래프·확률 (분수 0~1 표현), 9자리 수 자릿값·비교·정렬",
        "12×12 곱셈 사실, 인수쌍·최대공약수, 두/세 자리×한 자리, 나머지 있는 나눗셈",
        "소수 0.001 자리, 분수-소수 동치 (2·4·5·10·100분의 단위), 소수 덧셈·뺄셈",
        "동분모 분수·대분수 덧셈·뺄셈, 단위분수×자연수, 사각형·입체 도형 분류, 미국·미터법 단위 환산",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선)·확률 + 9자리 자릿값·덧셈·뺄셈·패턴",
          topics: [
            { en: "Organize and represent data in line graphs (title, labeled axes, whole-number increments); analyze trends — greatest, least, same; make inferences, draw conclusions, and make predictions", ko: "꺾은선그래프 정리·표현 (제목·축 레이블·정수 눈금); 경향 분석 — 최대·최소·동일; 추론·결론 도출·예측" },
            { en: "Solve single-step and multi-step addition/subtraction problems using data from line graphs", ko: "꺾은선그래프 자료를 이용한 1·여러 단계 덧셈·뺄셈 문제" },
            { en: "Probability: describe likelihood (impossible, unlikely, equally likely, likely, certain); model all possible outcomes of a simple event (≤24); write probability as a fraction between 0 and 1; relate to whole-number or fractional representation", ko: "확률: 가능성 표현 (불가능·낮음·반반·높음·확실); 단순 사건의 모든 결과 모형화 (최대 24가지); 확률을 분수 (0~1)로 나타내기; 정수·분수 표현과 연결" },
            { en: "Read, write, and identify place value of nine-digit whole numbers (standard form and word form); compare up to 7-digit numbers using >, <, =, ≠", ko: "아홉 자리 정수 읽기·쓰기·자릿값 파악 (표준형·언어형); 최대 7자리 수 두 개 비교 (>, <, =, ≠)" },
            { en: "Order up to four whole numbers (up to 7 digits) from least to greatest or greatest to least", ko: "최대 7자리 정수 4개까지 오름·내림차순 정렬" },
            { en: "Estimate (round to nearest 100 or 1,000; compatible numbers) and solve single- and multi-step addition/subtraction real-life problems (addends/minuends ≤ 1,000,000)", ko: "어림 (100·1,000 단위 반올림; 사용 편리한 수) 및 실생활 덧셈·뺄셈 1·여러 단계 문제 (합·차 최대 1,000,000)" },
            { en: "Identify, describe, extend, and create increasing/decreasing patterns (objects, pictures, numbers, number lines, input/output tables, function machines); find single-operation rules; solve real-life pattern problems", ko: "증가·감소 패턴 식별·설명·연장·만들기 (구체물·그림·수·수직선·입력-출력 표·함수 기계); 단일 연산 규칙 찾기; 실생활 패턴 문제" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수 Part 1 + 곱셈·나눗셈 기본 (12×12)",
          topics: [
            { en: "Compare and order up to four fractions/mixed numbers using same denominator, same numerator, or benchmarks (0, ½, 1); denominators ≤12; use >, <, = symbols; explain with models, orally, and in writing", ko: "분수·대분수 4개까지 비교·정렬 (같은 분모·같은 분자·기준점 0·½·1 활용); 분모 12 이하; >, <, = 기호; 모형·말·글로 설명" },
            { en: "Show equivalent fractions (denominators ≤12) with and without models; compose and decompose fractions (proper, improper, and mixed numbers) in multiple ways", ko: "동치분수 표현 (분모 12 이하, 모형 있음·없음); 분수 (진분수·가분수·대분수)를 여러 방식으로 묶고 나누기" },
            { en: "Represent division of two whole numbers as a fraction given a real-life situation and model (e.g., 3 ÷ 5 = 3/5 represents each child's share when 3 muffins are shared equally by 5 children)", ko: "실생활 상황·모형으로 두 자연수의 나눗셈을 분수로 표현 (예: 머핀 3개를 5명이 나누면 한 명의 몫 = 3/5)" },
            { en: "Quick recall of multiplication facts through 12×12 and corresponding division facts; create equations showing equivalent expressions using all four operations (e.g., 4×3 = 2×6; 10+8 = 36÷2); identify equal/not-equal expressions using = and ≠", ko: "12×12 곱셈 사실 및 관련 나눗셈 사실 즉각 암기; 사칙연산으로 동치 식 만들기 (예: 4×3 = 2×6); = 와 ≠ 기호로 같음·다름 판별" },
            { en: "Determine all factor pairs for whole numbers 1–100 (concrete, pictorial, numerical); find common factors and GCF of up to three numbers", ko: "1~100 정수의 인수쌍 모두 찾기 (구체·그림·수 표현); 최대 세 수의 공약수와 최대공약수 (GCF)" },
            { en: "Estimate and find product: 2-digit × 1-digit and 3-digit × 1-digit (strategies: rounding, place value, properties of multiplication; standard algorithm); solve multi-step real-life multiplication problems", ko: "두 자리×한 자리, 세 자리×한 자리 곱셈 어림·계산 (전략: 반올림·자릿값·곱셈 성질; 표준 알고리즘); 여러 단계 곱셈 실생활 문제" },
            { en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend, with and without remainders (strategies and standard algorithm); solve single-step division real-life problems; interpret quotient and remainder", ko: "한 자리 나눗셈: 두/세 자리 피제수, 나머지 있음·없음 (전략·표준 알고리즘); 한 단계 나눗셈 실생활 문제; 몫과 나머지의 의미 해석" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수·분수-소수 관계 + 두 자리 곱셈·나눗셈",
          topics: [
            { en: "Investigate place value of decimals through thousandths using concrete models (place-value charts, decimal squares, base-10 blocks); represent, read, and write decimals (concrete, pictorial, numerical)", ko: "소수 세 자리까지 자릿값 탐구 (자릿값 표·소수 정사각형·십진 블록); 소수 표현·읽기·쓰기 (구체·그림·수)" },
            { en: "Compare (using <, >, =) and order up to four decimals through thousandths using benchmarks, place value, and number lines; justify comparisons with models, orally, and in writing", ko: "소수 세 자리까지 4개 비교 (<, >, =) 및 정렬 (기준점·자릿값·수직선 활용); 모형·말·글로 비교 근거 제시" },
            { en: "Represent fractions/mixed numbers as decimals through hundredths (halves, fourths, fifths, tenths, hundredths); write fraction-decimal equivalents (e.g., 1/4 = 0.25; 1.25 = 5/4 or 1¼; 1.02 = 102/100)", ko: "분수·대분수를 소수 두 자리까지 표현 (2·4·5·10·100분의 단위); 분수-소수 동치 쓰기 (예: 1/4 = 0.25; 1.25 = 5/4 = 1¼)" },
            { en: "Estimate and determine sum or difference of two decimals through thousandths (addends/minuends ≤ 4 digits; standard algorithm and strategies); solve single- and multi-step real-life decimal problems", ko: "소수 세 자리까지 두 소수의 합·차 어림·계산 (최대 4자리; 표준 알고리즘·전략); 소수 실생활 1·여러 단계 문제" },
            { en: "Estimate and find product of 2-digit × 2-digit whole numbers using strategies and standard algorithm; solve multi-step real-life multiplication problems", ko: "두 자리×두 자리 곱셈 어림·계산 (전략·표준 알고리즘); 여러 단계 곱셈 실생활 문제" },
            { en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders; standard algorithm); solve single-step problems; interpret quotient and remainder in real-life contexts", ko: "두/세 자리 ÷ 한 자리 나눗셈 어림·계산 (나머지 있음·없음; 표준 알고리즘); 한 단계 문제 풀기; 몫·나머지 실생활 의미 해석" },
            { en: "Identify, describe, extend, and create increasing/decreasing patterns; analyze rules in input/output tables and function machines; find missing terms; solve real-life pattern problems", ko: "증가·감소 패턴 식별·설명·연장·만들기; 입력-출력 표와 함수 기계에서 규칙 분석; 빠진 항 구하기; 실생활 패턴 문제" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 Part 2·도형·측정",
          topics: [
            { en: "Estimate and determine sum or difference of fractions/mixed numbers with like denominators (2,3,4,5,6,8,10,12); simplify; solve single-step real-life problems; addition/subtraction may include regrouping", ko: "동분모 분수·대분수 합·차 어림·계산 (분모 2,3,4,5,6,8,10,12); 약분; 한 단계 실생활 문제; 받아올림·내림 포함 가능" },
            { en: "Solve single-step real-life problems: whole number (≤12) × unit fraction with models (e.g., 6×1/3, 1/5×8, 2×1/10); apply inverse property of multiplication (e.g., 4×1/4 = 4/4 = 1)", ko: "자연수 (12 이하)×단위분수 한 단계 실생활 문제, 모형 사용 (예: 6×1/3, 1/5×8); 역원 성질 적용 (예: 4×1/4 = 4/4 = 1)" },
            { en: "Determine all possible outcomes of simple events (≤24); write probability as a fraction between 0 and 1; determine likelihood; create real-life probability problems using coins, counters, number cubes, and spinners", ko: "단순 사건의 모든 결과 파악 (최대 24가지, 동전·주사위·스피너 활용); 확률을 분수 (0~1)로 쓰기; 가능성 판단; 실생활 확률 문제 만들기" },
            { en: "Identify, describe, and draw points, lines, line segments, rays, and angles (endpoints, vertices, symbols) using ruler/straightedge; identify parallel, perpendicular, and intersecting lines in plane and solid figures", ko: "점·직선·선분·반직선·각 식별·설명·그리기 (끝점·꼭짓점·기호; 자·직선자 사용); 평면·입체 도형에서 평행·수직·교차 직선 파악" },
            { en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel sides, perpendicular sides, congruent sides, and number of right angles; use geometric markings (tick marks, right-angle symbols)", ko: "사각형 분류 (평행사변형·직사각형·정사각형·마름모·사다리꼴): 평행·수직·합동 변과 직각 수 기준; 기하 기호 사용 (눈금·직각 표시)" },
            { en: "Identify and describe solid shapes (cubes, rectangular prisms, square pyramids, spheres, cones, cylinders) by number of vertices, edges, and faces and the shapes of faces; compare plane and solid figures", ko: "입체 도형 식별·설명 (정육면체·직육면체·정사각 피라미드·구·원뿔·원기둥): 꼭짓점·모서리·면의 수, 면의 모양; 평면·입체 도형 비교" },
            { en: "Determine appropriate units; estimate and measure length (to 1/8 inch, foot, yard; mm, cm, m), weight/mass (oz, lb; g, kg), and liquid volume (cup, pint, quart, gallon; mL, L); solve unit conversion problems within the US customary system", ko: "적합한 단위 선택; 길이 (1/8인치·피트·야드; 밀리미터·센티미터·미터)·무게 (온스·파운드; 그램·킬로그램)·액체 부피 어림·측정; 미국 단위 환산 문제 (인치↔피트↔야드; 온스↔파운드; 컵↔파인트↔쿼트↔갤런)" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "5학년 수준 (Virginia SOL 5) 선행",
      highlights: [
        "꺾은선그래프+줄기-잎 그림, 확률(근거 제시), 연산 순서, 9자리 자릿값",
        "소수·합성수·소인수분해 (100까지), 다단계 곱셈·나눗셈, 인수쌍·GCF",
        "소수 세 자리 심화, 분수-소수 동치 추론 (3분의1·8분의1), 다단계 소수·분수 혼합 비교",
        "각도 측정 (각도기), 삼각형 분류, 이분모 분수 덧셈·뺄셈, 둘레·넓이·부피",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선·줄기-잎)·확률 + 자릿값·연산 순서·패턴",
          topics: [
            { en: "Formulate questions, collect data, organize in line graphs (title, labeled axes); analyze trends — greatest, least, same; make inferences, draw conclusions, and make predictions; solve multi-step addition/subtraction problems from graph data", ko: "질문 설정·자료 수집·꺾은선그래프 정리 (제목·축 레이블); 경향 분석 — 최대·최소·동일; 추론·결론·예측; 그래프 자료로 여러 단계 덧셈·뺄셈 문제" },
            { en: "Apply the full data cycle (formulate → collect → organize → analyze and communicate) with a focus on stem-and-leaf plots; analyze data and justify interpretations; identify incorrect graphic representations", ko: "완전한 자료 순환 (설정→수집→정리→분석·발표) 적용, 줄기-잎 그림 중점; 자료 분석 및 해석 정당화; 잘못된 그래프 표현 식별" },
            { en: "Probability: describe likelihood (impossible, unlikely, equally likely, likely, certain); model all possible outcomes (≤24) using coins, counters, number cubes, spinners; write as fraction 0–1; create real-life probability problems; justify why an interpretation is incorrect", ko: "확률: 가능성 표현 (불가능·낮음·반반·높음·확실); 최대 24가지 결과 모형 (동전·카운터·주사위·스피너); 분수 (0~1); 실생활 확률 문제 만들기; 잘못된 해석에 대한 근거 제시" },
            { en: "Read, write, and identify place value in nine-digit whole numbers (e.g., in 568,165,724 the 8 represents 8 million, value = 8,000,000); compare up to 7-digit numbers (>, <, =, ≠); order up to four 7-digit numbers (least to greatest or greatest to least)", ko: "아홉 자리 정수 읽기·쓰기·자릿값 파악 (예: 568,165,724에서 8은 8,000,000); 최대 7자리 수 두 개 비교 (>, <, =, ≠); 최대 7자리 정수 4개 오름·내림차순 정렬" },
            { en: "Estimate (round to nearest 100 or 1,000; compatible numbers) and solve single- and multi-step addition/subtraction real-life problems (addends/minuends ≤ 1,000,000); refine estimates using 'closer to,' 'between,' 'a little more than'", ko: "어림 (100·1,000 단위 반올림; 사용 편리한 수) 및 실생활 덧셈·뺄셈 다단계 문제 (합·차 최대 1,000,000); '더 가까운·사이·조금 더 많은'으로 어림 다듬기" },
            { en: "Identify, describe, extend, and create increasing/decreasing patterns (objects, pictures, numbers, number lines, input/output tables, function machines); find single-operation rules; analyze patterns for errors and justify thinking", ko: "증가·감소 패턴 식별·설명·연장·만들기 (구체물·그림·수·수직선·입력-출력 표·함수 기계); 단일 연산 규칙 찾기; 패턴의 오류 분석 및 근거 제시" },
            { en: "Simplify numerical expressions with whole numbers using the order of operations; estimate, represent, solve, and justify multi-step contextual problems using all four operations with whole numbers", ko: "연산 순서를 적용해 자연수 수식 간단히 계산하기; 사칙연산으로 여러 단계 맥락 문제 어림·표현·풀기·정당화" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수·GCF + 곱셈·나눗셈 (다단계) + 소인수분해",
          topics: [
            { en: "Compare and order up to four fractions/mixed numbers (same denominator, same numerator, or benchmarks 0, ½, 1); denominators ≤12; use >, <, = and models; explain orally, in writing, and with a model", ko: "분수·대분수 4개까지 비교·정렬 (같은 분모·같은 분자·기준점 0·½·1); 분모 12 이하; >, <, = 기호와 모형; 말·글·모형으로 설명" },
            { en: "Show equivalent fractions (denominators ≤12) with and without models; compose and decompose fractions in multiple ways; represent division as a fraction using real-life situations and models", ko: "동치분수 표현 (분모 12 이하); 분수 여러 방식으로 묶기·나누기; 실생활 상황·모형으로 나눗셈을 분수로 표현" },
            { en: "Create a context involving ≤4 fractions, mixed numbers, and/or decimals; compare and order them; justify reasonableness of solution using visual, verbal, and symbolic representations", ko: "분수·대분수·소수 최대 4개 포함 맥락 만들기; 비교·순서 정하기; 시각·언어·기호 표현으로 풀이의 타당성 정당화" },
            { en: "Quick recall of multiplication facts through 12×12 and division facts; create equations for equivalent expressions using all four operations; identify equal and not-equal expressions using = and ≠ (e.g., 4×12 = 8×6; 64÷8 ≠ 8×8)", ko: "12×12 곱셈·나눗셈 사실 즉각 암기; 사칙연산으로 동치 식 만들기; = 와 ≠ 기호 사용 (예: 4×12 = 8×6; 64÷8 ≠ 8×8)" },
            { en: "Determine all factor pairs for whole numbers 1–100; find GCF of up to three numbers; estimate and find products of 2-digit × 1-digit and 3-digit × 1-digit; solve multi-step real-life multiplication and division problems", ko: "1~100 정수 인수쌍 모두 찾기; 최대 세 수의 최대공약수 (GCF); 두/세 자리×한 자리 곱셈 어림·계산; 다단계 곱셈·나눗셈 실생활 문제" },
            { en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders; standard algorithm); solve and explain single-step division real-life problems; interpret quotient and remainder in context", ko: "한 자리로 두/세 자리 나눗셈 어림·계산 (나머지 있음·없음; 표준 알고리즘); 나눗셈 한 단계 실생활 문제 풀기·설명; 맥락에서 몫과 나머지 해석" },
            { en: "Understand prime and composite numbers; determine the prime factorization of whole numbers up to 100; estimate, represent, solve, and justify multi-step contextual problems using all four operations", ko: "소수·합성수 이해; 100까지 자연수의 소인수분해; 사칙연산으로 여러 단계 맥락 문제 어림·표현·풀기·정당화" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수 심화·분수-소수 관계 + 두 자리 곱셈·나눗셈·패턴",
          topics: [
            { en: "Investigate place value of decimals through thousandths (concrete models); represent, read, write, and explain each digit's place and value (e.g., in 0.385 the 8 is in the hundredths place, value = 0.08)", ko: "소수 세 자리까지 자릿값 탐구 (구체 모형); 각 자리 숫자의 자리와 값 표현·읽기·쓰기·설명 (예: 0.385에서 8은 소수 둘째 자리, 값 = 0.08)" },
            { en: "Compare and order ≤4 decimals through thousandths (benchmarks, place value, number lines); justify in writing; represent fractions/mixed numbers as decimals (halves, fourths, fifths, tenths, hundredths); write fraction-decimal equivalents", ko: "소수 세 자리까지 4개 비교·정렬 (기준점·자릿값·수직선); 글로 근거 제시; 분수·대분수를 소수로 표현 (2·4·5·10·100분의 단위); 분수-소수 동치 쓰기" },
            { en: "Draw on relative size of fractional parts and base ten; reason about and identify equivalency between fractions with denominators that are thirds, eighths, and factors of 100 and their decimal equivalents; compare and order mixed sets of fractions (denominators ≤12) and decimals (through thousandths) together", ko: "분수 부분의 상대적 크기와 십진법 활용; 3분의1·8분의1·100의 약수 분모를 가진 분수와 소수의 동치 관계 추론·파악; 분수 (분모 12 이하)와 소수 (소수 세 자리)를 함께 비교·정렬" },
            { en: "Estimate and determine sum or difference of two decimals through thousandths (addends/minuends ≤ 4 digits; standard algorithm); solve single- and multi-step real-life decimal problems; justify solutions", ko: "소수 세 자리까지 두 소수의 합·차 어림·계산 (최대 4자리; 표준 알고리즘); 소수 실생활 1·여러 단계 문제 풀기; 풀이 정당화" },
            { en: "Estimate and find product of 2-digit × 2-digit whole numbers using strategies and standard algorithm; solve multi-step real-life multiplication problems; judge reasonableness of solutions", ko: "두 자리×두 자리 곱셈 어림·계산 (전략·표준 알고리즘); 다단계 곱셈 실생활 문제; 답의 타당성 판단" },
            { en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders); solve single-step division problems; interpret quotient and remainder; identify and justify errors in patterns and rules", ko: "두/세 자리 ÷ 한 자리 나눗셈 어림·계산 (나머지 있음·없음); 한 단계 나눗셈 문제; 몫·나머지 해석; 패턴·규칙의 오류 파악 및 근거 제시" },
            { en: "Justify solutions to single- and multi-step problems using all four operations with decimal numbers; identify, describe, extend, and create patterns using numbers and input/output tables; analyze rules for errors", ko: "소수 사칙연산 포함 1·여러 단계 문제 풀이 정당화; 수·입력-출력 표의 패턴 식별·설명·연장·만들기; 규칙의 오류 분석" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 Part 2 & 3·도형(각도·삼각형)·측정 심화",
          topics: [
            { en: "Estimate and determine sum/difference of fractions/mixed numbers (like denominators 2,3,4,5,6,8,10,12); simplify; solve single-step real-life problems; addition/subtraction may include regrouping; solve single-step problems: whole number × proper fraction (with models)", ko: "동분모 분수·대분수 합·차 어림·계산 (분모 2,3,4,5,6,8,10,12); 약분; 한 단계 실생활 문제 (받아올림·내림 포함); 자연수×진분수 한 단계 문제 (모형 사용)" },
            { en: "Estimate, represent, solve, and justify single- and multi-step problems using addition and subtraction of fractions with like AND unlike denominators (Fractions Part 3); create, model, and solve contextual fraction problems", ko: "동분모·이분모 분수 덧셈·뺄셈 1·여러 단계 문제 어림·표현·풀기·정당화 (분수 Part 3); 분수 맥락 문제 만들기·모형화·풀기" },
            { en: "Apply inverse property of multiplication with models (e.g., 4×1/4 = 4/4 = 1); identify, describe, extend, and create increasing/decreasing patterns with whole numbers, fractions, and decimals in context", ko: "역원 성질 모형으로 적용 (예: 4×1/4 = 4/4 = 1); 자연수·분수·소수 포함 증가·감소 패턴 식별·설명·연장·만들기 (맥락 포함)" },
            { en: "Identify, describe, and draw points, lines, line segments, rays, and angles (endpoints, vertices, symbols) using ruler/straightedge; identify parallel, perpendicular, and intersecting lines in 2D and 3D figures; use symbols to name geometric figures", ko: "점·직선·선분·반직선·각 식별·설명·그리기 (끝점·꼭짓점·기호; 자·직선자 사용); 평면·입체 도형에서 평행·수직·교차 직선 파악; 기호로 도형 이름 표기" },
            { en: "Classify and measure angles (acute, right, obtuse, straight) using appropriate tools (protractor, angle ruler, technology); classify triangles by angle measure; solve problems involving angles, including those in context", ko: "각도 분류·측정 (예각·직각·둔각·평각; 각도기·각도 자·기술 도구 사용); 각도로 삼각형 분류; 맥락 포함 각도 문제 풀기" },
            { en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel/perpendicular/congruent sides and right angles; use geometric markings; identify solid shapes (cubes, rectangular prisms, square pyramids, spheres, cones, cylinders) by vertices, edges, and faces", ko: "사각형 분류 (평행사변형·직사각형·정사각형·마름모·사다리꼴): 평행·수직·합동 변·직각 기준; 기하 기호 사용; 입체 도형 (정육면체·직육면체·정사각 피라미드·구·원뿔·원기둥)의 꼭짓점·모서리·면 식별" },
            { en: "Determine appropriate units; estimate and measure length, weight/mass, and liquid volume (US customary and metric); solve unit conversion problems; reason mathematically with metric units in multi-step problems; use multiple representations to solve problems involving perimeter, area, and volume", ko: "적합한 단위 선택; 길이·무게·액체 부피 어림·측정 (미국·미터법); 단위 환산 문제; 미터법으로 다단계 수학적 추론; 둘레·넓이·부피 문제를 여러 표현으로 풀기" },
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
        "자료 주기: 꺾은선그래프·줄기잎그림 작성·분석; 평균·중앙값·최빈값·범위",
        "연산 순서 (PEMDAS)·소수·분수 사칙연산 완전 습득 (이분모 포함)",
        "도형·측정: 각도·삼각형 분류, 직각삼각형 넓이, 직육면체 부피, 미터법 단위 변환",
        "확률: 나무 그림·기본 셈 원리 (Fundamental Counting Principle)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료 주기·대수 추론",
          topics: [
            { en: "Line plots (dot plots): organizing and analyzing data with title, axes, and key", ko: "꺾은선그래프 (점 그래프): 제목·축·범례를 갖춰 자료 정리·분석" },
            { en: "Stem-and-leaf plots: organizing and representing data with title and key", ko: "줄기잎그림: 제목·범례를 갖춰 자료 정리·표현" },
            { en: "Mean as fair share; median, mode, and range of a data set", ko: "평균 (공평 분배 개념), 중앙값·최빈값·범위" },
            { en: "Order of operations (PEMDAS) with whole numbers, including parentheses", ko: "자연수 연산 순서 (PEMDAS): 괄호 포함" },
            { en: "Prime and composite numbers (up to 100); prime factorization", ko: "소수와 합성수 (100까지); 소인수분해" },
            { en: "Increasing and decreasing patterns; input/output tables and function machines", ko: "증가·감소 패턴; 입력·출력 표와 함수 기계" },
            { en: "Variables as unknown quantities; writing equations from word problems", ko: "변수 개념 (미지수); 문장 문제에서 방정식 쓰기" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "자연수·소수 연산",
          topics: [
            { en: "Estimation and multi-step problems: +, −, ×, ÷ with whole numbers (including remainders)", ko: "자연수 어림·다단계 문제 (+, −, ×, ÷); 나머지 해석" },
            { en: "Fractions and decimals as equivalents (thirds, eighths, factors of 100)", ko: "분수·소수 동치 관계 (분모: 3분의 1·8분의 1·100의 인수)" },
            { en: "Comparing and ordering up to four fractions or decimals; justifying reasoning", ko: "분수·소수 최대 4개 비교·순서 배열; 근거 설명" },
            { en: "Decimal estimation: +, −, ×, ÷", ko: "소수 어림: 덧셈·뺄셈·곱셈·나눗셈" },
            { en: "Multiplying and dividing decimals (strategies and algorithms)", ko: "소수 곱셈·나눗셈 (전략·알고리즘)" },
            { en: "Multi-step decimal problems: addition, subtraction, multiplication, and division", ko: "소수 다단계 문제: 덧셈·뺄셈·곱셈·나눗셈" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수 연산·미터법 측정",
          topics: [
            { en: "Least common multiple (LCM) as least common denominator (LCD)", ko: "최소공배수(LCM)를 최소공통분모(LCD)로 활용" },
            { en: "Adding and subtracting fractions and mixed numbers with unlike denominators (≤ 12)", ko: "이분모 분수·대분수 덧셈·뺄셈 (분모 12 이하); 기약분수 표현" },
            { en: "Multi-step fraction and mixed number addition and subtraction problems", ko: "이분모 분수·대분수 다단계 덧셈·뺄셈 문제" },
            { en: "Multiplying a whole number by a fraction using models", ko: "자연수 × 분수 (시각 모델로 이해)" },
            { en: "Choosing the most appropriate metric unit for length, mass, and liquid volume", ko: "길이·질량·액체 부피에 맞는 미터법 단위 선택" },
            { en: "Estimating and measuring with metric units", ko: "미터법 단위로 어림·측정" },
            { en: "Converting between metric units of length, mass, and liquid volume", ko: "미터법 길이·질량·액체 부피 단위 변환" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형·측정·확률",
          topics: [
            { en: "Classifying angles: right, acute, obtuse, and straight", ko: "각도 분류: 직각·예각·둔각·평각" },
            { en: "Classifying triangles by angles and sides (right, acute, obtuse; equilateral, scalene, isosceles)", ko: "각도·변으로 삼각형 분류 (직각·예각·둔각삼각형; 정삼각형·부등변·이등변삼각형)" },
            { en: "Measuring and drawing angles; sum of interior angles = 180°; unknown angle measures", ko: "각도 측정·그리기; 삼각형 내각의 합 = 180°; 미지각 구하기" },
            { en: "Area of right triangles; volume of rectangular prisms (develop formula)", ko: "직각삼각형 넓이; 직육면체 부피 (공식 개발)" },
            { en: "Identifying when to use perimeter, area, or volume; solving related problems", ko: "둘레·넓이·부피 적용 상황 구분; 관련 문제 풀기" },
            { en: "Probability using tree diagrams, lists, and charts; Fundamental Counting Principle", ko: "나무 그림·목록·표로 확률 구하기; 기본 셈 원리 (경우의 수)" },
            { en: "Statistical review: mean, median, mode, and range", ko: "통계 복습: 평균·중앙값·최빈값·범위" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "6학년 수준 (Virginia SOL 6)",
      highlights: [
        "원그래프·이상값(outlier) 분석; LCM·GCD; 수직선 위 일차부등식",
        "정수 사칙연산, 지수·완전 제곱수 (20²까지), 절댓값 표현",
        "4사분면 좌표 평면, 비율·비례관계·단위 속도, 일변수 일차방정식",
        "원의 둘레·넓이 (π 개념 정립), 평행사변형·삼각형 넓이 공식, 자료 주기 심화",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "원그래프·통계·부등식",
          topics: [
            { en: "Circle graphs: formulating questions, collecting data, representing with percentages (e.g., 7/20 = 35%)", ko: "원그래프: 질문 만들기, 자료 수집, 백분율로 표현 (예: 7/20 = 35%)" },
            { en: "Mean as balance point in a line plot", ko: "꺾은선그래프 균형점으로 평균 나타내기" },
            { en: "Effect of adding, removing, or changing a value on mean, median, mode, and range", ko: "데이터 값 추가·제거·변경 시 평균·중앙값·최빈값·범위의 변화" },
            { en: "Identifying outliers and analyzing their effect on statistical measures", ko: "이상값(outlier) 식별; 통계량에 미치는 영향 분석" },
            { en: "Prime and composite numbers; LCM and GCD of two numbers", ko: "소수·합성수; 두 수의 최소공배수(LCM)·최대공약수(GCD)" },
            { en: "Linear inequalities from number line graphs; writing with inequality symbols", ko: "수직선 그래프에서 일차부등식 읽기; 부등호 기호로 쓰기" },
            { en: "Solution sets of one-variable inequalities; checking by substitution or graph", ko: "일변수 부등식의 해집합; 대입·수직선으로 해 확인" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "비율·좌표 평면·합동",
          topics: [
            { en: "Comparing and ordering positive rational numbers", ko: "양의 유리수 비교·순서 배열" },
            { en: "Fractions, decimals, and percents as ratios; ratio notation (a/b, a:b, a to b)", ko: "분수·소수·백분율을 비율로; 비율 표기법 (a/b, a:b, a 대 b)" },
            { en: "Tables of equivalent ratios representing proportional relationships (real-life contexts)", ko: "실생활 비례관계를 나타내는 동치 비율 표 만들기" },
            { en: "Coordinate plane: labeling axes, origin, and all four quadrants; distance to each axis", ko: "좌표 평면: 축·원점·4사분면 이름 붙이기; 각 축까지의 거리" },
            { en: "Graphing and reading ordered pairs in all four quadrants", ko: "4사분면에서 순서쌍 그리기·읽기" },
            { en: "Drawing polygons in the coordinate plane; lengths of horizontal and vertical sides", ko: "좌표 평면에서 다각형 그리기; 같은 x·y좌표를 공유하는 점 사이의 거리" },
            { en: "Identifying regular polygons; lines of symmetry dividing into two congruent parts", ko: "정다각형 식별; 합동 부분으로 나누는 대칭선" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "정수·지수·분수·방정식",
          topics: [
            { en: "Whole number exponents: patterns; powers of 10 and place value relationships", ko: "자연수 지수 패턴; 10의 거듭제곱과 자릿값 관계" },
            { en: "Perfect squares up to 20² with visual models; identifying perfect squares from 0 to 400", ko: "시각 모델로 20²까지 완전 제곱수; 0~400 범위 완전 제곱수 판별" },
            { en: "Adding, subtracting, multiplying, and dividing integers with visual models", ko: "시각 모델로 정수 덧셈·뺄셈·곱셈·나눗셈" },
            { en: "Absolute value expressions with integer operations; results shown on a number line", ko: "절댓값을 포함한 정수 연산식 계산; 결과를 수직선에 표시" },
            { en: "Multiplying and dividing fractions and mixed numbers (denominators ≤ 12, simplified form)", ko: "분수·대분수 곱셈·나눗셈 (분모 12 이하); 기약분수로 표현" },
            { en: "Effect of multiplying or dividing a fraction/mixed number by a value between 0 and 1", ko: "0과 1 사이 값으로 분수·대분수를 곱하거나 나눌 때의 변화 효과" },
            { en: "Algebraic vocabulary: equation, variable, expression, term, coefficient", ko: "대수 용어: 방정식·변수·식·항·계수" },
            { en: "Solving one-step linear equations using properties of equality; checking with visual models", ko: "등식의 성질로 일단계 일차방정식 풀기; 시각 모델로 해 확인" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "비례 추론·원 측정·자료 심화",
          topics: [
            { en: "Unit rate from tables, context, and graphs; finding missing values in ratio tables", ko: "표·맥락·그래프에서 단위 속도 구하기; 비율 표에서 빠진 값 찾기" },
            { en: "Determining proportional relationships from tables, graphs, and real-life contexts", ko: "표·그래프·맥락에서 비례관계 판별" },
            { en: "Circle parts: chord, diameter, radius, circumference, area; diameter–radius relationship", ko: "원의 구성 요소: 현·지름·반지름·원주·넓이; 지름과 반지름의 관계" },
            { en: "Approximating pi (≈ 3.14) from circumference ÷ diameter; developing the circumference formula", ko: "원주 ÷ 지름으로 파이(π ≈ 3.14) 근사; 원주 공식 개발 (C = πd)" },
            { en: "Solving circumference and area problems given diameter or radius", ko: "지름·반지름이 주어졌을 때 원주·넓이 문제 풀기" },
            { en: "Area of parallelograms and triangles (formula development with visual models)", ko: "평행사변형·삼각형 넓이 공식 개발 (시각 모델 사용)" },
            { en: "Circle graph data cycle: collecting, representing, comparing with other graph types; statistical measures revisited", ko: "원그래프 자료 주기 심화: 수집·표현·다른 그래프와 비교; 통계량 복습" },
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
        "원그래프·이상값·통계 지표 (평균·중앙값·최빈값·범위)",
        "정수·분수·소수 사칙연산; 절댓값; 지수와 완전제곱수",
        "비율·단위율·비례관계; 좌표평면 (사분면 전체)",
        "일단계 방정식과 부등식; 원·평행사변형·삼각형 넓이",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료·통계와 정수·부등식",
          topics: [
            { en: "Circle graphs: creating, interpreting, drawing conclusions", ko: "원그래프: 작성·해석·결론 도출" },
            { en: "Mean as balance point in a line plot", ko: "꺾은선그래프의 균형점으로서의 평균" },
            { en: "Effect on mean/median/mode/range when value is added, removed, or changed", ko: "값 추가·제거·변경 시 평균·중앙값·최빈값·범위 변화" },
            { en: "Outliers: identifying and their effect on statistical measures", ko: "이상값: 식별과 통계 지표에 미치는 영향" },
            { en: "Prime and composite numbers; LCM and GCD", ko: "소수와 합성수; 최소공배수와 최대공약수" },
            { en: "Linear inequalities from a number line; writing and checking solution sets", ko: "수직선 그래프에서 부등식 쓰기; 해 집합 확인" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "유리수·비율과 좌표평면",
          topics: [
            { en: "Comparing and ordering positive rational numbers", ko: "양의 유리수 비교·순서 배열" },
            { en: "Ratios and ratio notation (a:b, a/b, a to b); unit rate", ko: "비율과 비 표기법 (a:b, a/b, a to b); 단위 비율" },
            { en: "Tables of equivalent ratios; proportional relationships", ko: "동치 비율 표; 비례관계" },
            { en: "Four-quadrant coordinate plane: axes, origin, quadrants", ko: "사분면 전체 좌표평면: 축·원점·사분면" },
            { en: "Graphing and identifying ordered pairs in all four quadrants", ko: "모든 사분면에서 순서쌍 그래프 작성·식별" },
            { en: "Drawing polygons in the coordinate plane; calculating side lengths", ko: "좌표평면에서 다각형 그리기; 변의 길이 계산" },
            { en: "Lines of symmetry; congruence of segments, angles, and polygons", ko: "대칭축; 선분·각·다각형의 합동" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "정수·분수 연산과 일단계 방정식",
          topics: [
            { en: "Whole number exponents; powers of 10 with whole number exponents", ko: "자연수 지수; 자연수 지수의 10의 거듭제곱" },
            { en: "Perfect squares up to 20² = 400 using visual models", ko: "시각적 모델로 20² = 400까지 완전제곱수" },
            { en: "Integer operations: add, subtract, multiply, divide; absolute value", ko: "정수 사칙연산; 절댓값" },
            { en: "Multiply and divide fractions and mixed numbers (denominators ≤ 12)", ko: "분수와 대분수 곱셈·나눗셈 (분모 ≤ 12)" },
            { en: "Multi-step word problems with integers, fractions, and decimals", ko: "정수·분수·소수를 이용한 다단계 문장형 문제" },
            { en: "Algebraic terms: variable, expression, equation, coefficient", ko: "대수 용어: 변수·식·방정식·계수" },
            { en: "Writing and solving one-step linear equations; checking solutions", ko: "일단계 방정식 쓰기·풀기; 검증" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "비례추론과 도형",
          topics: [
            { en: "Unit rate from table, graph, or context", ko: "표·그래프·맥락에서 단위 비율 찾기" },
            { en: "Identifying and connecting multiple representations of proportional relationships", ko: "비례관계의 다양한 표현 연결하기" },
            { en: "Parts of a circle: chord, diameter, radius, circumference", ko: "원의 부분: 현·지름·반지름·둘레" },
            { en: "Approximating pi (3.14); circumference and area formulas for circles", ko: "원주율(3.14) 근사; 원의 둘레·넓이 공식" },
            { en: "Area of parallelograms and triangles", ko: "평행사변형과 삼각형의 넓이" },
            { en: "Completing the data cycle: circle graphs and statistical analysis", ko: "자료 순환 완성: 원그래프와 통계 분석" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "7학년 / 중학 대수 준비 수준",
      highlights: [
        "히스토그램·음의 지수·과학적 표기법·유리수 비교",
        "이단계 방정식·부등식; 유리수 계수 대수적 식 간소화",
        "기울기와 직접변환(y = mx); 비례관계 다중 표현 연결",
        "닮음도형·확대·축소(닮음비); 원기둥 부피·겉넓이",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "히스토그램·지수·수 체계",
          topics: [
            { en: "Histograms: creating with different intervals, comparing to line plots and circle graphs", ko: "히스토그램: 다양한 구간으로 작성, 꺾은선·원그래프와 비교" },
            { en: "Analyzing patterns and drawing conclusions from histograms", ko: "히스토그램에서 패턴 분석·결론 도출" },
            { en: "Negative exponents as fractions and decimals; patterns with powers of 10", ko: "음의 지수를 분수·소수로 표현; 10의 거듭제곱 패턴 탐구" },
            { en: "Scientific notation ↔ standard form; comparing numbers in scientific notation", ko: "과학적 표기법 ↔ 표준형 변환; 과학적 표기법으로 수 비교" },
            { en: "Comparing and ordering rational numbers (integers, fractions, decimals, percents; positive and negative)", ko: "유리수 비교·순서 배열 (정수·분수·소수·백분율, 양수·음수)" },
            { en: "Positive square roots of perfect squares 0–400", ko: "0–400 완전제곱수의 양의 제곱근" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "대수적 식과 이단계 방정식·부등식",
          topics: [
            { en: "Order of operations with brackets [ ] and absolute value | |; exponents 1–4", ko: "괄호와 절댓값 포함 연산 순서; 1~4제곱" },
            { en: "Simplifying algebraic expressions; combining like terms (rational coefficients)", ko: "대수적 식 간소화·동류항 합산 (유리수 계수)" },
            { en: "Evaluating expressions by substituting positive/negative rational values for variables", ko: "유리수 값(양수·음수)을 변수에 대입하여 식 계산" },
            { en: "Solving two-step linear equations with rational numbers; verifying solutions", ko: "유리수 계수 이단계 방정식 풀기; 검증" },
            { en: "Writing two-step equations for real-life situations", ko: "실생활 상황에서 이단계 방정식 쓰기" },
            { en: "Solving one- and two-step inequalities; effect of multiplying/dividing by a negative number", ko: "일단계·이단계 부등식 풀기; 음수로 곱·나눌 때 부등호 방향 변화" },
            { en: "Graphing inequality solution sets on a number line", ko: "수직선에서 부등식의 해 집합 그래프" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "비례관계·기울기와 닮음도형·확대·축소",
          topics: [
            { en: "Ratio tables for proportional relationships; solving proportions for missing values", ko: "비 표를 이용한 비례관계; 비례식으로 미지값 구하기" },
            { en: "Proportional reasoning for unit conversion", ko: "비례추론으로 단위 변환" },
            { en: "Slope (m) as rate of change from tables, graphs, and real-life situations", ko: "표·그래프·실생활에서 기울기(m) = 변화율" },
            { en: "Direct variation equation y = mx; positive and negative slopes", ko: "직접변환 방정식 y = mx; 양·음의 기울기" },
            { en: "Identifying positive, negative, and zero slope from a graph", ko: "그래프에서 양·음·영(0)의 기울기 식별" },
            { en: "Similar quadrilaterals and triangles: corresponding sides/angles, similarity statements, proportions", ko: "닮은 사각형·삼각형: 대응변·각, 닮음 서술, 비례식" },
            { en: "Solving proportions for missing side lengths and unknown angles in similar figures", ko: "닮음 비례식으로 미지 변의 길이·각도 구하기" },
            { en: "Dilations on the coordinate plane with scale factors 1/4, 1/2, 2, 3, 4 (center at origin)", ko: "원점 기준 닮음비 1/4·1/2·2·3·4의 좌표평면 확대·축소" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "확률·유리수 연산과 사각형·3차원 도형",
          topics: [
            { en: "Theoretical vs. experimental probability; effect of increasing number of trials", ko: "이론적 확률 vs. 실험적 확률; 시행 횟수 증가의 영향" },
            { en: "Estimating and solving real-life problems with rational number operations", ko: "유리수 사칙연산으로 실생활 문제 추정·해결" },
            { en: "Properties of quadrilaterals: parallel/perpendicular sides, equal angles, diagonals, lines of symmetry", ko: "사각형의 성질: 평행·수직 변, 동일 각도, 대각선, 대칭축" },
            { en: "Classifying parallelograms, rectangles, squares, rhombi, and trapezoids", ko: "평행사변형·직사각형·정사각형·마름모·사다리꼴 분류" },
            { en: "Finding unknown angles and side lengths in quadrilaterals from diagrams", ko: "사각형 다이어그램에서 미지 각도와 변의 길이" },
            { en: "Volume of right cylinders; surface area of rectangular prisms and right cylinders", ko: "직원기둥의 부피; 직육면체·직원기둥의 겉넓이" },
            { en: "Effect of scaling one measurement (×1/4, ×1/3, ×1/2, ×2, ×3, ×4) on volume and surface area", ko: "한 변의 배율 변화가 부피·겉넓이에 미치는 영향" },
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
    name: "FCPS Math Olympiad (MOEMS)",
    nameKo: "FCPS 수학 올림피아드 (MOEMS)",
    when: "Nov – Mar (5 monthly contests)",
    whenKo: "11월 ~ 3월 (5회 월별 대회)",
    grades: "Gr 4–6 (school-based teams)",
    gradesKo: "4~6학년 (학교 팀 기반)",
    description:
      "Mathematical Olympiads for Elementary and Middle Schools (MOEMS) is held in monthly rounds. Schools form teams and students compete individually. Strong preparation for future math competitions.",
    color: "purple",
  },
];
