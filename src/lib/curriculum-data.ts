export type TopicCategory =
  | "수·연산"
  | "분수"
  | "소수"
  | "도형"
  | "측정"
  | "확률·자료"
  | "대수·패턴";

export type Topic = { en: string; ko: string; category?: TopicCategory; note?: string };

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
        "1~100까지 수 세기 (1씩·10씩)",
        "덧셈·뺄셈 기초 (합 10 이하)",
        "평면·입체 도형 이름 알기",
        "길이·무게 비교하기 (자 없이)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "수 세기와 도형",
          topics: [
            { en: "Counting to 20", ko: "1~20까지 수 세기", category: "수·연산" },
            { en: "One-to-one correspondence", ko: "물건 하나에 수 하나씩 짝 짓기", category: "수·연산" },
            { en: "2D Shapes (circle, square, triangle, rectangle)", ko: "평면 도형 알기 (원·사각형·삼각형·직사각형)", category: "도형" },
            { en: "Repeating patterns", ko: "반복되는 패턴 찾고 이어 만들기", category: "대수·패턴" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "비교와 측정",
          topics: [
            { en: "Counting to 50", ko: "1~50까지 수 세기", category: "수·연산" },
            { en: "More, fewer, same (comparing quantities)", ko: "많다·적다·같다 비교하기", category: "수·연산" },
            { en: "Measurement: longer/shorter (non-standard)", ko: "더 길다·더 짧다 (자 없이 비교하기)", category: "측정" },
            { en: "Ordinal numbers (1st through 5th)", ko: "순서 이름 알기 (첫 번째~다섯 번째)", category: "수·연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "십대 수와 덧셈·뺄셈",
          topics: [
            { en: "Teen numbers = 10 + ones", ko: "십대 수 = 10 + 낱개", category: "수·연산", note: "예: 13 = 10 + 3" },
            { en: "Addition within 5", ko: "합이 5 이하인 덧셈", category: "수·연산" },
            { en: "Subtraction within 5", ko: "5 이하 뺄셈", category: "수·연산" },
            { en: "3D Shapes (cube, sphere, cone, cylinder)", ko: "입체 도형 알기 (정육면체·구·원뿔·원기둥)", category: "도형" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "100까지 세기와 연산",
          topics: [
            { en: "Counting to 100 by 1s and 10s", ko: "1씩, 10씩 세어 100까지", category: "수·연산" },
            { en: "Addition & Subtraction within 10", ko: "합·차가 10 이하인 덧셈·뺄셈", category: "수·연산" },
            { en: "Sorting & data (graphs)", ko: "물건 분류하고 그래프로 정리하기", category: "확률·자료" },
            { en: "Decomposing numbers (e.g. 8 = 5+3)", ko: "수 쪼개기 (여러 가지 방법으로)", category: "수·연산", note: "예: 8 = 5+3 = 6+2 = 7+1" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "1학년 수준",
      highlights: [
        "자릿값 (십의 자리·일의 자리) 조기 학습",
        "합이 20 이하인 덧셈·뺄셈 유창하게",
        "자로 길이 재기, 시각 읽기",
        "도형 똑같이 나누기 (반·4등분)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 120까지 세기",
          topics: [
            { en: "Place value: tens and ones", ko: "십의 자리·일의 자리 이해하기", category: "수·연산" },
            { en: "Counting to 120", ko: "120까지 세기", category: "수·연산" },
            { en: "Comparing two-digit numbers", ko: "두 자리 수 크기 비교하기", category: "수·연산" },
            { en: "Skip counting by 2s, 5s, 10s", ko: "2씩·5씩·10씩 건너뛰기 세기", category: "수·연산" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "20 이하 덧셈·뺄셈",
          topics: [
            { en: "Addition strategies (making 10, doubles)", ko: "덧셈 전략 (10 만들기, 두 배 이용)", category: "수·연산" },
            { en: "Subtraction within 20", ko: "20 이하 뺄셈", category: "수·연산" },
            { en: "Fact families", ko: "덧셈·뺄셈 관계 이해하기", category: "수·연산", note: "예: 3+4=7, 4+3=7, 7-3=4, 7-4=3" },
            { en: "Word problems (one-step)", ko: "한 단계 문장형 문제 풀기", category: "수·연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정과 시간",
          topics: [
            { en: "Measuring length (non-standard then standard)", ko: "길이 재기 (손뼘·물건으로 → 자로)", category: "측정" },
            { en: "Ordering objects by length/weight", ko: "물건을 길이·무게 순서대로 나열하기", category: "측정" },
            { en: "Telling time to the hour", ko: "시계 읽기 (몇 시 정각)", category: "측정" },
            { en: "Composing shapes", ko: "도형을 합쳐 새 도형 만들기", category: "도형" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 기초와 자료",
          topics: [
            { en: "Equal shares: halves and quarters of shapes", ko: "도형 똑같이 나누기 (반·4등분)", category: "분수" },
            { en: "Organizing data in graphs", ko: "그래프로 자료 정리하기", category: "확률·자료" },
            { en: "3D shapes and their attributes", ko: "입체 도형의 특징 알아보기", category: "도형" },
            { en: "Telling time to the half hour", ko: "시계 읽기 (몇 시 30분)", category: "측정" },
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
        "20 이하 덧셈·뺄셈 유창하게",
        "시각 읽기 (정각·30분), 동전 이름과 가치",
        "평면·입체 도형 분류하기",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자릿값과 건너뛰기 세기",
          topics: [
            { en: "Place value: tens and ones (to 99)", ko: "십의 자리·일의 자리 (99까지)", category: "수·연산" },
            { en: "Skip counting by 2s, 5s, 10s", ko: "2씩·5씩·10씩 건너뛰기 세기", category: "수·연산" },
            { en: "Comparing two-digit numbers (>, <, =)", ko: "두 자리 수 크기 비교 (>, <, =)", category: "수·연산" },
            { en: "Ordinal numbers", ko: "순서 이름 알기 (첫 번째, 두 번째…)", category: "수·연산" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "20 이하 덧셈·뺄셈",
          topics: [
            { en: "Addition & subtraction facts to 20 (fluency)", ko: "20 이하 덧셈·뺄셈 빠르게 익히기", category: "수·연산" },
            { en: "Making 10 strategy", ko: "10 만들기 전략으로 덧셈하기", category: "수·연산" },
            { en: "Adding three numbers", ko: "세 수 더하기", category: "수·연산" },
            { en: "Word problems: add to, take from, put together", ko: "문장형 문제 풀기 (더하기·빼기·합치기)", category: "수·연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정·시간·돈",
          topics: [
            { en: "Measuring length (non-standard then ruler)", ko: "길이 재기 (비표준 방법 → 자)", category: "측정" },
            { en: "Telling time to the hour and half hour", ko: "시계 읽기 (정각·30분)", category: "측정" },
            { en: "Identifying coins (penny, nickel, dime, quarter)", ko: "동전 이름과 가치 알기", category: "측정", note: "1센트(페니), 5센트(니켈), 10센트(다임), 25센트(쿼터)" },
            { en: "Temperature: hot/cold comparison", ko: "온도 비교 (따뜻하다·차갑다)", category: "측정" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 자료",
          topics: [
            { en: "2D shapes: sides and corners", ko: "평면 도형 알기 (변·꼭짓점 세기)", category: "도형" },
            { en: "Partitioning shapes (halves, quarters)", ko: "도형 똑같이 나누기 (반·4등분)", category: "분수" },
            { en: "Picture graphs and tally charts", ko: "그림 그래프·집계표 읽고 만들기", category: "확률·자료" },
            { en: "Add and subtract multiples of 10", ko: "10의 배수 더하고 빼기", category: "수·연산", note: "예: 30+40=70, 80-50=30" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "2학년 수준",
      highlights: [
        "세 자리 수 자릿값 (백·십·일의 자리)",
        "100 이하 덧셈·뺄셈 (받아올림·내림 포함)",
        "자로 길이 재기, 5분 단위 시각, 화폐 계산",
        "배열로 곱셈 개념 이해하기",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "세 자리 수 자릿값",
          topics: [
            { en: "Place value to 999 (hundreds, tens, ones)", ko: "백·십·일의 자리 이해하기 (999까지)", category: "수·연산" },
            { en: "Comparing 3-digit numbers", ko: "세 자리 수 크기 비교하기", category: "수·연산" },
            { en: "Skip counting by 5s, 10s, 100s", ko: "5씩·10씩·100씩 건너뛰기 세기", category: "수·연산" },
            { en: "Expanded form", ko: "자릿값으로 수 풀어쓰기", category: "수·연산", note: "예: 345 = 300+40+5" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "100 이하 덧셈·뺄셈",
          topics: [
            { en: "Adding 2-digit numbers (with regrouping)", ko: "두 자리 수 덧셈 (받아올림 포함)", category: "수·연산" },
            { en: "Subtracting 2-digit numbers (with regrouping)", ko: "두 자리 수 뺄셈 (받아내림 포함)", category: "수·연산" },
            { en: "Even and odd numbers", ko: "짝수와 홀수 구별하기", category: "수·연산" },
            { en: "Two-step word problems", ko: "두 단계 문장형 문제 풀기", category: "수·연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "표준 측정과 화폐",
          topics: [
            { en: "Measuring length with a ruler (inches, cm)", ko: "자로 길이 재기 (인치·센티미터)", category: "측정" },
            { en: "Telling time to the nearest 5 minutes", ko: "5분 단위로 시각 읽기", category: "측정" },
            { en: "Counting coins and bills", ko: "동전과 지폐 세기", category: "측정" },
            { en: "Word problems with money", ko: "화폐 문장형 문제 풀기", category: "측정" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "곱셈 개념 입문과 자료",
          topics: [
            { en: "Equal groups (intro to multiplication)", ko: "같은 묶음으로 곱셈 개념 이해하기", category: "수·연산" },
            { en: "Rectangular arrays", ko: "배열(가로×세로)로 곱셈 개념 이해하기", category: "수·연산" },
            { en: "Picture graphs and bar graphs", ko: "그림 그래프·막대그래프 읽고 만들기", category: "확률·자료" },
            { en: "3D shapes: faces, edges, vertices", ko: "입체 도형의 면·모서리·꼭짓점 세기", category: "도형" },
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
        "세 자리 수 자릿값과 크기 비교",
        "100 이하 덧셈·뺄셈 (받아올림·내림 포함)",
        "자·시계·화폐로 측정하기",
        "배열로 곱셈 개념 이해하기",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "999까지 자릿값",
          topics: [
            { en: "Place value: hundreds, tens, ones (to 999)", ko: "백·십·일의 자리 이해하기 (999까지)", category: "수·연산" },
            { en: "Comparing and ordering 3-digit numbers", ko: "세 자리 수 크기 비교·순서 정하기", category: "수·연산" },
            { en: "Counting patterns (skip counting)", ko: "건너뛰기 세기 패턴 (2씩·5씩·10씩)", category: "수·연산" },
            { en: "Even and odd numbers", ko: "짝수와 홀수 구별하기", category: "수·연산" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "여러 자리 수 덧셈·뺄셈",
          topics: [
            { en: "Addition within 100 with regrouping", ko: "100 이하 받아올림 있는 덧셈", category: "수·연산" },
            { en: "Subtraction within 100 with regrouping", ko: "100 이하 받아내림 있는 뺄셈", category: "수·연산" },
            { en: "Mental math strategies", ko: "암산으로 빠르게 계산하는 방법", category: "수·연산" },
            { en: "Two-step word problems", ko: "두 단계 문장형 문제 풀기", category: "수·연산" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "측정과 화폐",
          topics: [
            { en: "Length: ruler (inches & centimeters)", ko: "자로 길이 재기 (인치·센티미터)", category: "측정" },
            { en: "Telling time to the nearest 5 minutes", ko: "5분 단위로 시각 읽기", category: "측정" },
            { en: "Money: counting coins and bills, making change", ko: "동전·지폐 세기, 거스름돈 계산하기", category: "측정" },
            { en: "Liquid volume (cups, pints, quarts)", ko: "액체 부피 이해하기 (컵·파인트·쿼트)", category: "측정" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형과 곱셈 개념",
          topics: [
            { en: "2D and 3D shapes: properties and categories", ko: "평면·입체 도형 속성과 종류 알기", category: "도형" },
            { en: "Partitioning shapes (fractions: halves, thirds, fourths)", ko: "도형 똑같이 나누기 (반·3분의1·4분의1)", category: "분수" },
            { en: "Equal groups and arrays (multiplication concept)", ko: "같은 묶음·배열로 곱셈 개념 이해하기", category: "수·연산" },
            { en: "Pictographs and bar graphs", ko: "그림 그래프·막대그래프 읽고 만들기", category: "확률·자료" },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "3학년 수준",
      highlights: [
        "곱셈 기본 사실 (×2, ×5, ×10) 학습",
        "분수 기초 (1/2, 1/3, 1/4) 이해하기",
        "넓이·둘레 개념 입문",
        "나눗셈 개념 (똑같이 나누기)",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "어림과 곱셈·나눗셈 개념",
          topics: [
            { en: "Rounding to nearest 10 and 100", ko: "10·100 단위로 어림하기 (반올림)", category: "수·연산", note: "예: 347 → 350 (십의 자리), 300 (백의 자리)" },
            { en: "Multiplication concept: equal groups, arrays", ko: "같은 묶음·배열로 곱셈 개념 이해하기", category: "수·연산" },
            { en: "Division concept: sharing equally", ko: "똑같이 나누기로 나눗셈 개념 이해하기", category: "수·연산" },
            { en: "Addition and subtraction within 1000", ko: "1000 이하 덧셈·뺄셈", category: "수·연산" },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈 기본 사실과 분수",
          topics: [
            { en: "Multiplication facts: ×2, ×5, ×10", ko: "2단·5단·10단 곱셈 익히기", category: "수·연산", note: "2×3=6, 5×4=20, 10×7=70" },
            { en: "Division facts related to ×2, ×5, ×10", ko: "2단·5단·10단 관련 나눗셈 익히기", category: "수·연산" },
            { en: "Fractions: halves, thirds, fourths", ko: "분수 이해하기 (1/2, 1/3, 1/4)", category: "분수" },
            { en: "Fractions on the number line", ko: "수직선 위에 분수 나타내기", category: "분수" },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "넓이·둘레와 측정",
          topics: [
            { en: "Area (counting unit squares)", ko: "단위 정사각형 세어 넓이 구하기", category: "측정" },
            { en: "Perimeter of polygons", ko: "다각형의 둘레 구하기 (변의 길이 더하기)", category: "측정" },
            { en: "Liquid volume (liters) and mass (grams, kilograms)", ko: "액체의 양 (리터), 질량 (그램·킬로그램)", category: "측정" },
            { en: "Elapsed time", ko: "걸린 시간 계산하기", category: "측정" },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "곱셈 완성과 도형",
          topics: [
            { en: "Multiplication facts: ×3, ×4, ×6, ×7, ×8, ×9", ko: "3단·4단·6단·7단·8단·9단 곱셈 익히기", category: "수·연산" },
            { en: "Quadrilaterals (square, rectangle, rhombus, parallelogram)", ko: "사각형 종류 알기 (정사각형·직사각형·마름모·평행사변형)", category: "도형" },
            { en: "Picture graphs and bar graphs: scale", ko: "그래프 눈금 읽고 자료 정리하기", category: "확률·자료" },
            { en: "Word problems: multiplication and division", ko: "곱셈·나눗셈 문장형 문제 풀기", category: "수·연산" },
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
        "0~10단 곱셈·나눗셈 완전 습득",
        "분수 이해하기 (분모 2,3,4,5,6,8,10)",
        "넓이·둘레 개념, 길이·무게·부피 측정",
        "분 단위 시각 읽기, 5달러 이하 화폐",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료 탐구 + 자릿값·연산",
          topics: [
            {
              en: "Data collection: polls, observations, tallies (≤ 30 data points, ≤ 8 categories)",
              ko: "설문·관찰·집계표로 자료 모으기",
              category: "확률·자료",
            },
            {
              en: "Pictographs: title, labeled axes, key (symbol = 1, 2, 5, or 10 data points)",
              ko: "그림그래프 만들고 읽기",
              category: "확률·자료",
              note: "기호 하나 = 1·2·5·10개 중 선택",
            },
            {
              en: "Bar graphs: title, labeled axes, scale in multiples of 1, 2, 5, or 10",
              ko: "막대그래프 만들고 읽기",
              category: "확률·자료",
            },
            {
              en: "Analyze graphs: describe categories, identify most/least, draw conclusions and predictions",
              ko: "그래프 분석하기 (가장 많은·적은 항목 찾기, 결론 내리기)",
              category: "확률·자료",
            },
            {
              en: "One- and two-step addition and subtraction problems using graph data",
              ko: "그래프 자료로 덧셈·뺄셈 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Read and write 6-digit numbers (standard, expanded, and word form)",
              ko: "6자리 수 읽고 쓰기",
              category: "수·연산",
            },
            {
              en: "Place value: identify digit and value in 6-digit numbers; compare and order numbers ≤ 9,999",
              ko: "6자리 수 자릿값 파악하기, 9999 이하 수 비교·순서 정하기",
              category: "수·연산",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈·나눗셈 + 도형",
          topics: [
            {
              en: "Multiplication and division through 10×10 using models (arrays, equal groups, number lines)",
              ko: "10×10 범위 곱셈·나눗셈 (배열·묶음·수직선으로 이해하기)",
              category: "수·연산",
            },
            {
              en: "Inverse relationships: write related multiplication and division facts for a given model",
              ko: "역연산 관계 이해하기 (곱셈 ↔ 나눗셈)",
              category: "수·연산",
            },
            {
              en: "Fluency strategies: doubling, adding/subtracting a group, near squares",
              ko: "곱셈 빠르게 외우는 전략 (두 배, 한 묶음 더하기·빼기)",
              category: "수·연산",
            },
            {
              en: "Single-step real-life multiplication and division word problems (0–10×10)",
              ko: "곱셈·나눗셈 한 단계 실생활 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Quick recall of all multiplication facts 0–10 and corresponding division facts",
              ko: "0~10단 곱셈 즉각 암기",
              category: "수·연산",
            },
            {
              en: "Polygons: closed plane figures with ≥3 non-crossing line segments; classify polygon vs. non-polygon",
              ko: "다각형이란 무엇인지 이해하기",
              category: "도형",
            },
            {
              en: "Identify and compare triangles, quadrilaterals, pentagons, hexagons, and octagons; combine and subdivide polygons",
              ko: "삼각형·사각형·오각형·육각형·팔각형 분류하기",
              category: "도형",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수 + 측정·넓이·둘레",
          topics: [
            {
              en: "Represent fractions and mixed numbers (denominators 2, 3, 4, 5, 6, 8, 10) using region, length, and set models",
              ko: "분수·대분수 나타내기 (분모 2,3,4,5,6,8,10)",
              category: "분수",
            },
            {
              en: "Identify a fraction as a sum of unit fractions; compose and decompose fractions in multiple ways",
              ko: "분수 = 단위분수의 합 이해하기, 여러 방식으로 나누기",
              category: "분수",
              note: "예: 3/4 = 1/4 + 1/4 + 1/4",
            },
            {
              en: "Count fractional parts of models greater than 1 to name improper fractions and mixed numbers",
              ko: "1보다 큰 분수 → 가분수·대분수로 나타내기",
              category: "분수",
            },
            {
              en: "Estimate and measure length: ½ inch, inch, foot, yard (US Customary); centimeter, meter (metric)",
              ko: "길이 재기 (½인치·인치·피트·야드; 센티미터·미터)",
              category: "측정",
            },
            {
              en: "Estimate and measure weight (pound; kilogram) and liquid volume (cup, pint, quart, gallon; liter)",
              ko: "무게·액체 부피 재기 (파운드·킬로그램; 컵·리터 등)",
              category: "측정",
            },
            {
              en: "Area: count unit squares to determine area of a surface",
              ko: "단위 정사각형 세어 넓이 구하기",
              category: "측정",
            },
            {
              en: "Perimeter: measure around a polygon (≤ 6 sides); calculate from given side lengths",
              ko: "다각형 둘레 재기 (변의 길이 모두 더하기)",
              category: "측정",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 비교 + 시각·화폐",
          topics: [
            {
              en: "Compare fractions to benchmarks 0, ½, and 1 using area/region and length models",
              ko: "분수를 0·½·1과 비교하기",
              category: "분수",
            },
            {
              en: "Compare fractions with like numerators or like denominators using >, <, = and models",
              ko: "분자 또는 분모가 같은 분수 크기 비교하기",
              category: "분수",
            },
            {
              en: "Show equivalent fractions (denominators 2, 3, 4, 5, 6, 8, 10) with region and length models",
              ko: "크기가 같은 분수(동치분수) 나타내기",
              category: "분수",
            },
            {
              en: "Tell and write time to the nearest minute using analog and digital clocks",
              ko: "분 단위로 시각 읽기 (아날로그·디지털)",
              category: "측정",
            },
            {
              en: "Elapsed time in one-hour increments within a.m. or within p.m. (find elapsed, end, or start time)",
              ko: "오전 또는 오후 내 경과 시간 계산하기",
              category: "측정",
            },
            {
              en: "Money: value of coins/bills ≤ $5.00; construct a set; compare two sets; make change",
              ko: "5달러 이하 화폐 계산, 거스름돈 구하기",
              category: "측정",
            },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "4학년 수준 (Virginia SOL 4)",
      highlights: [
        "꺾은선그래프 추가, 9자리 수 자릿값",
        "곱셈·나눗셈 5가지 표현 + 두·세 자리×한 자리 곱셈",
        "사각형 분류 (평행·수직·합동 기준)",
        "단위 환산 + 직사각형 넓이·둘레 공식",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선그래프 포함) + 확장 자릿값",
          topics: [
            {
              en: "All standard data topics: pictographs, bar graphs, analysis, and word problems",
              ko: "그림그래프·막대그래프 만들기·분석·문제 풀기",
              category: "확률·자료",
            },
            {
              en: "Line graphs: collect ≤ 10 data points, organize with labeled axes, analyze trends",
              ko: "꺾은선그래프 만들고 경향 분석하기",
              category: "확률·자료",
            },
            {
              en: "Single- and multi-step addition/subtraction problems using line graph data",
              ko: "꺾은선그래프 자료로 여러 단계 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Read and write 6-digit AND 9-digit whole numbers (standard form, word form)",
              ko: "6자리·9자리 수 읽고 쓰기",
              category: "수·연산",
            },
            {
              en: "Place value in 9-digit numbers: identify digit and value (e.g., 8 millions = 8,000,000 in 568,165,724)",
              ko: "9자리 수 자릿값 파악하기",
              category: "수·연산",
              note: "예: 568,165,724에서 8 → 8,000,000",
            },
            {
              en: "Compare two whole numbers up to 7 digits using >, <, =, ≠",
              ko: "7자리 수 두 개 크기 비교하기",
              category: "수·연산",
            },
            {
              en: "Order up to four whole numbers each up to 7 digits, least to greatest or greatest to least",
              ko: "7자리 수 4개까지 크기 순서대로 나열하기",
              category: "수·연산",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "곱셈·나눗셈(5가지 표현) + 심화 도형 + 분수",
          topics: [
            {
              en: "Multiplication and division through 10×10: fluency strategies, quick recall of all facts",
              ko: "10×10 범위 곱셈·나눗셈 즉각 암기, 유창성 전략",
              category: "수·연산",
            },
            {
              en: "Describe multiplicative relationships using all 5 representations: visual, symbolic, verbal, contextual, physical",
              ko: "곱셈 관계를 5가지 방법으로 설명하기 (그림·기호·말·상황·물건)",
              category: "수·연산",
            },
            {
              en: "Create equations for equivalent expressions using multiplication/division (e.g., 4×3 = 14–2, 35÷5 = 1×7)",
              ko: "곱셈·나눗셈으로 같은 값 만들기",
              category: "수·연산",
              note: "예: 4×3 = 14-2, 35÷5 = 1×7",
            },
            {
              en: "Points, lines, line segments, rays, and angles: endpoints, vertices, symbolic notation; draw with ruler/straightedge",
              ko: "점·직선·선분·반직선·각도 그리기",
              category: "도형",
            },
            {
              en: "Parallel, perpendicular, and intersecting lines and line segments; identify in 2D and 3D shapes",
              ko: "평행·수직·교차하는 직선 찾기",
              category: "도형",
            },
            {
              en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel sides, perpendicular sides, congruent sides, and right angles",
              ko: "사각형 5종류 분류하기 (평행·수직·합동 기준)",
              category: "도형",
              note: "평행사변형 · 직사각형 · 정사각형 · 마름모 · 사다리꼴",
            },
            {
              en: "Fractions and mixed numbers (denominators 2–10): compose and decompose; real-life comparison with justification",
              ko: "분수·대분수 묶고 나누기, 실생활 비교 설명하기",
              category: "분수",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "두·세 자리 곱셈 + 심화 측정",
          topics: [
            {
              en: "Multi-digit multiplication: 2-digit × 1-digit and 3-digit × 1-digit (estimation and standard algorithm)",
              ko: "두 자리×한 자리, 세 자리×한 자리 곱셈",
              category: "수·연산",
            },
            {
              en: "Single- and multi-step real-life problems involving multiplication; single-step division problems",
              ko: "곱셈·나눗셈 포함 실생활 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Addition and subtraction with numbers up to 10,000; estimate and solve problems up to 1,000,000",
              ko: "최대 10,000까지 덧셈·뺄셈, 최대 100만 문제 어림",
              category: "수·연산",
            },
            {
              en: "Measure length to ½ inch, ¼ inch, ⅛ inch (US Customary) and millimeter/centimeter/meter (metric)",
              ko: "길이 재기 (½인치·¼인치·⅛인치; 밀리미터·센티미터·미터)",
              category: "측정",
            },
            {
              en: "Measure weight to nearest ounce and pound (US) and gram and kilogram (metric); liquid volume to milliliter and liter",
              ko: "무게·액체 부피 재기 (온스·파운드; 그램·킬로그램; 밀리리터·리터)",
              category: "측정",
            },
            {
              en: "Unit conversions: inches↔feet↔yards; ounces↔pounds; cups↔pints↔quarts↔gallons",
              ko: "단위 환산하기 (인치↔피트↔야드; 컵↔파인트↔쿼트↔갤런)",
              category: "측정",
            },
            {
              en: "Develop formula for area and perimeter of a rectangle; explore same perimeter/different area and same area/different perimeter",
              ko: "직사각형 넓이·둘레 공식 만들기",
              category: "측정",
              note: "넓이 = 가로 × 세로, 둘레 = (가로+세로) × 2",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 비교 + 심화 경과 시간 + 다자리 곱셈",
          topics: [
            {
              en: "Compare fractions to benchmarks 0, ½, 1; compare with like numerators or like denominators; show equivalent fractions with models",
              ko: "분수를 0·½·1과 비교하기, 동치분수 모형으로 나타내기",
              category: "분수",
            },
            {
              en: "Real-life fraction comparison: justify solution using visual, verbal, and symbolic representations",
              ko: "실생활 분수 비교 문제, 풀이 이유 설명하기",
              category: "분수",
            },
            {
              en: "Tell time to nearest minute; elapsed time in hours AND minutes within a 12-hour period",
              ko: "분 단위 시각 읽기, 경과 시간 계산 (시·분 단위)",
              category: "측정",
            },
            {
              en: "Elapsed time across a.m. and p.m. (find elapsed time, end time, or start time)",
              ko: "오전·오후 넘나드는 경과 시간 계산하기",
              category: "측정",
            },
            {
              en: "Multi-digit multiplication continued: multi-step real-life problems (2- and 3-digit × 1-digit)",
              ko: "두·세 자리×한 자리 여러 단계 곱셈 문제",
              category: "수·연산",
            },
            {
              en: "Multiplication/division patterns with input/output tables and function machines; identify and extend rules",
              ko: "입력·출력 표에서 곱셈·나눗셈 패턴 찾기, 규칙 연장하기",
              category: "대수·패턴",
            },
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
        "꺾은선그래프 읽기·분석, 확률을 분수로 나타내기, 9자리 수 읽고 비교하기",
        "12×12 곱셈 완성, 약수와 최대공약수(GCF), 두·세 자리 곱셈·나눗셈",
        "소수 셋째 자리까지 이해하기, 분수↔소수 변환 (1/4 = 0.25), 소수 덧셈·뺄셈",
        "같은 분모 분수 덧셈·뺄셈, 자연수×단위분수, 사각형·입체 도형 분류, 단위 변환",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선)·확률 + 9자리 자릿값·덧셈·뺄셈·패턴",
          topics: [
            {
              en: "Organize and represent data in line graphs (title, labeled axes, whole-number increments); analyze trends — greatest, least, same; make inferences, draw conclusions, and make predictions",
              ko: "꺾은선그래프 읽고 경향 파악하기",
              category: "확률·자료",
            },
            {
              en: "Solve single-step and multi-step addition/subtraction problems using data from line graphs",
              ko: "그래프 자료로 덧셈·뺄셈 문제 풀기",
              category: "확률·자료",
            },
            {
              en: "Probability: describe likelihood (impossible, unlikely, equally likely, likely, certain); model all possible outcomes of a simple event (≤24); write probability as a fraction between 0 and 1; relate to whole-number or fractional representation",
              ko: "확률을 분수(0~1)로 나타내기",
              category: "확률·자료",
              note: "예: 동전 앞면이 나올 확률 = 1/2",
            },
            {
              en: "Read, write, and identify place value of nine-digit whole numbers (standard form and word form); compare up to 7-digit numbers using >, <, =, ≠",
              ko: "9자리 수 읽고 쓰기, 7자리 수 크기 비교하기",
              category: "수·연산",
            },
            {
              en: "Order up to four whole numbers (up to 7 digits) from least to greatest or greatest to least",
              ko: "7자리 수 4개를 크기 순서대로 나열하기",
              category: "수·연산",
            },
            {
              en: "Estimate (round to nearest 100 or 1,000; compatible numbers) and solve single- and multi-step addition/subtraction real-life problems (addends/minuends ≤ 1,000,000)",
              ko: "100만 이하 덧셈·뺄셈 실생활 문제 (여러 단계 포함)",
              category: "수·연산",
            },
            {
              en: "Identify, describe, extend, and create increasing/decreasing patterns (objects, pictures, numbers, number lines, input/output tables, function machines); find single-operation rules; solve real-life pattern problems",
              ko: "늘어나거나 줄어드는 패턴 찾기, 규칙 만들기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수 Part 1 + 곱셈·나눗셈 기본 (12×12)",
          topics: [
            {
              en: "Compare and order up to four fractions/mixed numbers using same denominator, same numerator, or benchmarks (0, ½, 1); denominators ≤12; use >, <, = symbols; explain with models, orally, and in writing",
              ko: "분수와 대분수 4개까지 크기 비교·정렬하기",
              category: "분수",
            },
            {
              en: "Show equivalent fractions (denominators ≤12) with and without models; compose and decompose fractions (proper, improper, and mixed numbers) in multiple ways",
              ko: "크기가 같은 분수(동치분수) 표현하기, 분수 여러 방식으로 묶고 나누기",
              category: "분수",
            },
            {
              en: "Represent division of two whole numbers as a fraction given a real-life situation and model (e.g., 3 ÷ 5 = 3/5 represents each child's share when 3 muffins are shared equally by 5 children)",
              ko: "나눗셈을 분수로 나타내기",
              category: "분수",
              note: "예: 머핀 3개를 5명이 나누면 한 명의 몫 = 3/5",
            },
            {
              en: "Quick recall of multiplication facts through 12×12 and corresponding division facts; create equations showing equivalent expressions using all four operations (e.g., 4×3 = 2×6; 10+8 = 36÷2); identify equal/not-equal expressions using = and ≠",
              ko: "12×12 곱셈 즉각 암기, 사칙연산으로 같은 값 만들기",
              category: "수·연산",
              note: "예: 4×3 = 2×6, 10+8 = 36÷2",
            },
            {
              en: "Determine all factor pairs for whole numbers 1–100 (concrete, pictorial, numerical); find common factors and GCF of up to three numbers",
              ko: "1~100 사이 수의 약수 쌍 모두 찾기, 최대공약수(GCF) 구하기",
              category: "수·연산",
            },
            {
              en: "Estimate and find product: 2-digit × 1-digit and 3-digit × 1-digit (strategies: rounding, place value, properties of multiplication; standard algorithm); solve multi-step real-life multiplication problems",
              ko: "두 자리×한 자리, 세 자리×한 자리 곱셈 (실생활 문제 포함)",
              category: "수·연산",
            },
            {
              en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend, with and without remainders (strategies and standard algorithm); solve single-step division real-life problems; interpret quotient and remainder",
              ko: "두·세 자리 ÷ 한 자리 나눗셈 (나머지 있는 경우 포함), 나머지 의미 해석",
              category: "수·연산",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수·분수-소수 관계 + 두 자리 곱셈·나눗셈",
          topics: [
            {
              en: "Investigate place value of decimals through thousandths using concrete models (place-value charts, decimal squares, base-10 blocks); represent, read, and write decimals (concrete, pictorial, numerical)",
              ko: "소수 셋째 자리까지 자릿값 이해하기",
              category: "소수",
            },
            {
              en: "Compare (using <, >, =) and order up to four decimals through thousandths using benchmarks, place value, and number lines; justify comparisons with models, orally, and in writing",
              ko: "소수 4개 크기 비교·정렬하기",
              category: "소수",
            },
            {
              en: "Represent fractions/mixed numbers as decimals through hundredths (halves, fourths, fifths, tenths, hundredths); write fraction-decimal equivalents (e.g., 1/4 = 0.25; 1.25 = 5/4 or 1¼; 1.02 = 102/100)",
              ko: "분수를 소수로, 소수를 분수로 바꾸기",
              category: "소수",
              note: "예: 1/4 = 0.25, 1.25 = 5/4 = 1¼",
            },
            {
              en: "Estimate and determine sum or difference of two decimals through thousandths (addends/minuends ≤ 4 digits; standard algorithm and strategies); solve single- and multi-step real-life decimal problems",
              ko: "소수 셋째 자리까지 더하고 빼기 (실생활 문제 포함)",
              category: "소수",
            },
            {
              en: "Estimate and find product of 2-digit × 2-digit whole numbers using strategies and standard algorithm; solve multi-step real-life multiplication problems",
              ko: "두 자리×두 자리 곱셈 (실생활 문제 포함)",
              category: "수·연산",
            },
            {
              en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders; standard algorithm); solve single-step problems; interpret quotient and remainder in real-life contexts",
              ko: "두·세 자리 ÷ 한 자리 나눗셈, 나머지의 실생활 의미 해석",
              category: "수·연산",
            },
            {
              en: "Identify, describe, extend, and create increasing/decreasing patterns; analyze rules in input/output tables and function machines; find missing terms; solve real-life pattern problems",
              ko: "수와 입력·출력 표에서 패턴 찾기, 빠진 항 구하기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 Part 2·도형·측정",
          topics: [
            {
              en: "Estimate and determine sum or difference of fractions/mixed numbers with like denominators (2,3,4,5,6,8,10,12); simplify; solve single-step real-life problems; addition/subtraction may include regrouping",
              ko: "같은 분모 분수·대분수 더하고 빼기 (약분 포함)",
              category: "분수",
            },
            {
              en: "Solve single-step real-life problems: whole number (≤12) × unit fraction with models (e.g., 6×1/3, 1/5×8, 2×1/10); apply inverse property of multiplication (e.g., 4×1/4 = 4/4 = 1)",
              ko: "자연수 × 단위분수 계산하기, 역수 관계 이해",
              category: "분수",
              note: "예: 4 × 1/4 = 1, 6 × 1/3 = 2",
            },
            {
              en: "Determine all possible outcomes of simple events (≤24); write probability as a fraction between 0 and 1; determine likelihood; create real-life probability problems using coins, counters, number cubes, and spinners",
              ko: "확률 문제 만들고 분수로 나타내기",
              category: "확률·자료",
            },
            {
              en: "Identify, describe, and draw points, lines, line segments, rays, and angles (endpoints, vertices, symbols) using ruler/straightedge; identify parallel, perpendicular, and intersecting lines in plane and solid figures",
              ko: "점·직선·선분·반직선·각도 그리기, 평행·수직선 찾기",
              category: "도형",
            },
            {
              en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel sides, perpendicular sides, congruent sides, and number of right angles; use geometric markings (tick marks, right-angle symbols)",
              ko: "사각형 5종류 분류하기",
              category: "도형",
              note: "평행사변형 · 직사각형 · 정사각형 · 마름모 · 사다리꼴",
            },
            {
              en: "Identify and describe solid shapes (cubes, rectangular prisms, square pyramids, spheres, cones, cylinders) by number of vertices, edges, and faces and the shapes of faces; compare plane and solid figures",
              ko: "입체 도형 6종류 식별·설명하기 (꼭짓점·모서리·면의 수)",
              category: "도형",
              note: "정육면체 · 직육면체 · 정사각 피라미드 · 구 · 원뿔 · 원기둥",
            },
            {
              en: "Determine appropriate units; estimate and measure length (to 1/8 inch, foot, yard; mm, cm, m), weight/mass (oz, lb; g, kg), and liquid volume (cup, pint, quart, gallon; mL, L); solve unit conversion problems within the US customary system",
              ko: "길이·무게·부피 재기 & 미국·미터법 단위 바꾸기",
              category: "측정",
              note: "1피트=12인치, 1야드=3피트, 1파운드=16온스",
            },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "5학년 수준 (Virginia SOL 5) 선행",
      highlights: [
        "꺾은선·줄기잎 그림으로 자료 분석, 확률 근거 제시, 연산 순서 이해",
        "소인수분해 (100까지), 다단계 곱셈·나눗셈, 약수 쌍·최대공약수(GCF)",
        "소수 셋째 자리 심화, 1/3·1/8 분수↔소수 추론, 분수·소수 혼합 비교·정렬",
        "각도기로 각도 재기·삼각형 분류, 다른 분모 분수 계산, 둘레·넓이·부피",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료(꺾은선·줄기-잎)·확률 + 자릿값·연산 순서·패턴",
          topics: [
            {
              en: "Formulate questions, collect data, organize in line graphs (title, labeled axes); analyze trends — greatest, least, same; make inferences, draw conclusions, and make predictions; solve multi-step addition/subtraction problems from graph data",
              ko: "꺾은선그래프 만들고 경향 분석하기, 여러 단계 문제 풀기",
              category: "확률·자료",
            },
            {
              en: "Apply the full data cycle (formulate → collect → organize → analyze and communicate) with a focus on stem-and-leaf plots; analyze data and justify interpretations; identify incorrect graphic representations",
              ko: "줄기-잎 그림으로 자료 정리·분석하기, 틀린 그래프 찾기",
              category: "확률·자료",
            },
            {
              en: "Probability: describe likelihood (impossible, unlikely, equally likely, likely, certain); model all possible outcomes (≤24) using coins, counters, number cubes, spinners; write as fraction 0–1; create real-life probability problems; justify why an interpretation is incorrect",
              ko: "확률을 분수로 나타내기, 틀린 해석 찾아 이유 설명하기",
              category: "확률·자료",
              note: "예: 주사위 홀수가 나올 확률 = 3/6 = 1/2",
            },
            {
              en: "Read, write, and identify place value in nine-digit whole numbers (e.g., in 568,165,724 the 8 represents 8 million, value = 8,000,000); compare up to 7-digit numbers (>, <, =, ≠); order up to four 7-digit numbers (least to greatest or greatest to least)",
              ko: "9자리 수 읽고 쓰기, 각 자리의 값 설명하기",
              category: "수·연산",
              note: "예: 568,165,724에서 8 → 8,000,000",
            },
            {
              en: "Estimate (round to nearest 100 or 1,000; compatible numbers) and solve single- and multi-step addition/subtraction real-life problems (addends/minuends ≤ 1,000,000); refine estimates using 'closer to,' 'between,' 'a little more than'",
              ko: "100만 이하 덧셈·뺄셈 다단계 문제, 어림값으로 답 확인하기",
              category: "수·연산",
            },
            {
              en: "Identify, describe, extend, and create increasing/decreasing patterns (objects, pictures, numbers, number lines, input/output tables, function machines); find single-operation rules; analyze patterns for errors and justify thinking",
              ko: "늘어나거나 줄어드는 패턴 찾기, 규칙의 오류 분석하기",
              category: "대수·패턴",
            },
            {
              en: "Simplify numerical expressions with whole numbers using the order of operations; estimate, represent, solve, and justify multi-step contextual problems using all four operations with whole numbers",
              ko: "연산 순서 적용해서 복잡한 식 계산하기",
              category: "수·연산",
              note: "순서: 괄호 → 곱셈·나눗셈 → 덧셈·뺄셈",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "분수·GCF + 곱셈·나눗셈 (다단계) + 소인수분해",
          topics: [
            {
              en: "Compare and order up to four fractions/mixed numbers (same denominator, same numerator, or benchmarks 0, ½, 1); denominators ≤12; use >, <, = and models; explain orally, in writing, and with a model",
              ko: "분수·대분수 크기 비교·정렬하기, 이유 설명하기",
              category: "분수",
            },
            {
              en: "Show equivalent fractions (denominators ≤12) with and without models; compose and decompose fractions in multiple ways; represent division as a fraction using real-life situations and models",
              ko: "동치분수 표현하기, 나눗셈을 분수로 나타내기",
              category: "분수",
            },
            {
              en: "Create a context involving ≤4 fractions, mixed numbers, and/or decimals; compare and order them; justify reasonableness of solution using visual, verbal, and symbolic representations",
              ko: "분수·대분수·소수 최대 4개 비교·정렬하기 (맥락 문제 만들기)",
              category: "분수",
            },
            {
              en: "Quick recall of multiplication facts through 12×12 and division facts; create equations for equivalent expressions using all four operations; identify equal and not-equal expressions using = and ≠ (e.g., 4×12 = 8×6; 64÷8 ≠ 8×8)",
              ko: "12×12 곱셈·나눗셈 즉각 암기, 사칙연산으로 같은 값 만들기",
              category: "수·연산",
              note: "예: 4×12 = 8×6, 64÷8 ≠ 8×8",
            },
            {
              en: "Determine all factor pairs for whole numbers 1–100; find GCF of up to three numbers; estimate and find products of 2-digit × 1-digit and 3-digit × 1-digit; solve multi-step real-life multiplication and division problems",
              ko: "약수 쌍 찾기, 최대공약수(GCF) 구하기, 두·세 자리 곱셈·나눗셈",
              category: "수·연산",
            },
            {
              en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders; standard algorithm); solve and explain single-step division real-life problems; interpret quotient and remainder in context",
              ko: "두·세 자리 ÷ 한 자리 나눗셈, 나머지의 맥락 속 의미 해석",
              category: "수·연산",
            },
            {
              en: "Understand prime and composite numbers; determine the prime factorization of whole numbers up to 100; estimate, represent, solve, and justify multi-step contextual problems using all four operations",
              ko: "소수(prime)와 합성수 구별하기, 100까지 소인수분해",
              category: "수·연산",
              note: "예: 12 = 2 × 2 × 3",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "소수 심화·분수-소수 관계 + 두 자리 곱셈·나눗셈·패턴",
          topics: [
            {
              en: "Investigate place value of decimals through thousandths (concrete models); represent, read, write, and explain each digit's place and value (e.g., in 0.385 the 8 is in the hundredths place, value = 0.08)",
              ko: "소수 셋째 자리까지 각 숫자의 자리와 값 설명하기",
              category: "소수",
              note: "예: 0.385에서 8 → 소수 둘째 자리, 값 = 0.08",
            },
            {
              en: "Compare and order ≤4 decimals through thousandths (benchmarks, place value, number lines); justify in writing; represent fractions/mixed numbers as decimals (halves, fourths, fifths, tenths, hundredths); write fraction-decimal equivalents",
              ko: "소수 4개 비교·정렬하기, 분수를 소수로 바꾸기",
              category: "소수",
            },
            {
              en: "Draw on relative size of fractional parts and base ten; reason about and identify equivalency between fractions with denominators that are thirds, eighths, and factors of 100 and their decimal equivalents; compare and order mixed sets of fractions (denominators ≤12) and decimals (through thousandths) together",
              ko: "1/3·1/8 단위 분수와 소수의 동치 관계 추론하기, 분수·소수 함께 비교·정렬",
              category: "소수",
              note: "예: 1/3 ≈ 0.333..., 1/8 = 0.125",
            },
            {
              en: "Estimate and determine sum or difference of two decimals through thousandths (addends/minuends ≤ 4 digits; standard algorithm); solve single- and multi-step real-life decimal problems; justify solutions",
              ko: "소수 셋째 자리까지 더하고 빼기, 여러 단계 실생활 문제",
              category: "소수",
            },
            {
              en: "Estimate and find product of 2-digit × 2-digit whole numbers using strategies and standard algorithm; solve multi-step real-life multiplication problems; judge reasonableness of solutions",
              ko: "두 자리×두 자리 곱셈, 답이 맞는지 어림으로 확인하기",
              category: "수·연산",
            },
            {
              en: "Estimate and find quotient: 1-digit divisor, 2- or 3-digit dividend (with/without remainders); solve single-step division problems; interpret quotient and remainder; identify and justify errors in patterns and rules",
              ko: "두·세 자리 ÷ 한 자리 나눗셈, 패턴 규칙의 오류 찾기",
              category: "수·연산",
            },
            {
              en: "Justify solutions to single- and multi-step problems using all four operations with decimal numbers; identify, describe, extend, and create patterns using numbers and input/output tables; analyze rules for errors",
              ko: "수·입력출력표에서 패턴 찾고 오류 분석하기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "분수 Part 2 & 3·도형(각도·삼각형)·측정 심화",
          topics: [
            {
              en: "Estimate and determine sum/difference of fractions/mixed numbers (like denominators 2,3,4,5,6,8,10,12); simplify; solve single-step real-life problems; addition/subtraction may include regrouping; solve single-step problems: whole number × proper fraction (with models)",
              ko: "같은 분모 분수·대분수 더하고 빼기, 자연수×분수 문제",
              category: "분수",
            },
            {
              en: "Estimate, represent, solve, and justify single- and multi-step problems using addition and subtraction of fractions with like AND unlike denominators (Fractions Part 3); create, model, and solve contextual fraction problems",
              ko: "다른 분모 분수 더하고 빼기 (통분 필요), 여러 단계 문제",
              category: "분수",
              note: "통분 예: 1/2 + 1/3 → 3/6 + 2/6 = 5/6",
            },
            {
              en: "Apply inverse property of multiplication with models (e.g., 4×1/4 = 4/4 = 1); identify, describe, extend, and create increasing/decreasing patterns with whole numbers, fractions, and decimals in context",
              ko: "역수 관계 이해하기, 자연수·분수·소수 포함 패턴 만들기",
              category: "분수",
              note: "예: 4 × 1/4 = 1 (어떤 수 × 역수 = 1)",
            },
            {
              en: "Identify, describe, and draw points, lines, line segments, rays, and angles (endpoints, vertices, symbols) using ruler/straightedge; identify parallel, perpendicular, and intersecting lines in 2D and 3D figures; use symbols to name geometric figures",
              ko: "점·직선·선분·반직선·각도 그리기, 평행·수직선 찾기",
              category: "도형",
            },
            {
              en: "Classify and measure angles (acute, right, obtuse, straight) using appropriate tools (protractor, angle ruler, technology); classify triangles by angle measure; solve problems involving angles, including those in context",
              ko: "각도기로 각도 재기, 삼각형을 각도로 분류하기",
              category: "도형",
              note: "예각삼각형 · 직각삼각형 · 둔각삼각형",
            },
            {
              en: "Classify quadrilaterals (parallelograms, rectangles, squares, rhombi, trapezoids) by parallel/perpendicular/congruent sides and right angles; use geometric markings; identify solid shapes (cubes, rectangular prisms, square pyramids, spheres, cones, cylinders) by vertices, edges, and faces",
              ko: "사각형 5종류 분류하기, 입체 도형의 꼭짓점·모서리·면 세기",
              category: "도형",
              note: "평행사변형 · 직사각형 · 정사각형 · 마름모 · 사다리꼴",
            },
            {
              en: "Determine appropriate units; estimate and measure length, weight/mass, and liquid volume (US customary and metric); solve unit conversion problems; reason mathematically with metric units in multi-step problems; use multiple representations to solve problems involving perimeter, area, and volume",
              ko: "길이·무게·부피 재기, 미국·미터법 단위 바꾸기, 둘레·넓이·부피 문제",
              category: "측정",
            },
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
        "꺾은선그래프·줄기잎그림 작성·분석, 평균·중앙값·최빈값·범위",
        "연산 순서(PEMDAS), 소수·분수 사칙연산 완전 습득 (이분모 포함)",
        "각도·삼각형 분류, 직각삼각형 넓이, 직육면체 부피, 미터법 단위 변환",
        "나무 그림·기본 셈 원리로 확률 구하기",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료 정리·통계 + 연산 순서·패턴",
          topics: [
            {
              en: "Line plots (dot plots): organizing and analyzing data with title, axes, and key",
              ko: "점 그래프(꺾은선) 만들고 분석하기",
              category: "확률·자료",
            },
            {
              en: "Stem-and-leaf plots: organizing and representing data with title and key",
              ko: "줄기잎 그림 만들고 읽기",
              category: "확률·자료",
            },
            {
              en: "Mean as fair share; median, mode, and range of a data set",
              ko: "평균·중앙값·최빈값·범위 구하기",
              category: "확률·자료",
              note: "평균 = 전체 합 ÷ 자료 수",
            },
            {
              en: "Order of operations (PEMDAS) with whole numbers, including parentheses",
              ko: "연산 순서(PEMDAS) 적용하기",
              category: "수·연산",
              note: "순서: 괄호 → 곱·나눗셈 → 덧·뺄셈",
            },
            {
              en: "Prime and composite numbers (up to 100); prime factorization",
              ko: "소수·합성수 구별하기, 소인수분해",
              category: "수·연산",
              note: "예: 12 = 2 × 2 × 3",
            },
            {
              en: "Increasing and decreasing patterns; input/output tables and function machines",
              ko: "늘어나거나 줄어드는 패턴 찾기, 입력·출력 표",
              category: "대수·패턴",
            },
            {
              en: "Variables as unknown quantities; writing equations from word problems",
              ko: "미지수(변수) 개념 이해하기, 문장 문제에서 식 만들기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "자연수·소수 연산",
          topics: [
            {
              en: "Estimation and multi-step problems: +, −, ×, ÷ with whole numbers (including remainders)",
              ko: "자연수 다단계 문제 풀기, 나머지 의미 해석하기",
              category: "수·연산",
            },
            {
              en: "Fractions and decimals as equivalents (thirds, eighths, factors of 100)",
              ko: "분수·소수 동치 관계 이해하기",
              category: "소수",
              note: "예: 1/4 = 0.25, 1/5 = 0.2",
            },
            {
              en: "Comparing and ordering up to four fractions or decimals; justifying reasoning",
              ko: "분수·소수 4개까지 크기 비교·정렬하기",
              category: "소수",
            },
            {
              en: "Decimal estimation: +, −, ×, ÷",
              ko: "소수 사칙연산 어림하기",
              category: "소수",
            },
            {
              en: "Multiplying and dividing decimals (strategies and algorithms)",
              ko: "소수 곱셈·나눗셈 계산하기",
              category: "소수",
            },
            {
              en: "Multi-step decimal problems: addition, subtraction, multiplication, and division",
              ko: "소수 다단계 실생활 문제 풀기",
              category: "소수",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "분수 연산 + 미터법 측정",
          topics: [
            {
              en: "Least common multiple (LCM) as least common denominator (LCD)",
              ko: "최소공배수(LCM)를 공통분모로 쓰기",
              category: "분수",
            },
            {
              en: "Adding and subtracting fractions and mixed numbers with unlike denominators (≤ 12)",
              ko: "다른 분모 분수·대분수 더하고 빼기",
              category: "분수",
              note: "예: 1/2 + 1/3 → 3/6 + 2/6 = 5/6",
            },
            {
              en: "Multi-step fraction and mixed number addition and subtraction problems",
              ko: "분수·대분수 다단계 덧셈·뺄셈 문제 풀기",
              category: "분수",
            },
            {
              en: "Multiplying a whole number by a fraction using models",
              ko: "자연수 × 분수 이해하기",
              category: "분수",
              note: "예: 3 × 2/5 = 6/5 = 1과 1/5",
            },
            {
              en: "Choosing the most appropriate metric unit for length, mass, and liquid volume",
              ko: "길이·질량·부피에 맞는 미터법 단위 고르기",
              category: "측정",
            },
            {
              en: "Estimating and measuring with metric units",
              ko: "미터법 단위로 어림·측정하기",
              category: "측정",
            },
            {
              en: "Converting between metric units of length, mass, and liquid volume",
              ko: "미터법 단위 바꾸기 (km↔m↔cm, kg↔g, L↔mL)",
              category: "측정",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "도형·측정·확률",
          topics: [
            {
              en: "Classifying angles: right, acute, obtuse, and straight",
              ko: "각도 종류 분류하기 (직각·예각·둔각·평각)",
              category: "도형",
            },
            {
              en: "Classifying triangles by angles and sides (right, acute, obtuse; equilateral, scalene, isosceles)",
              ko: "삼각형 분류하기 (각도·변의 길이 기준)",
              category: "도형",
              note: "예각·직각·둔각삼각형 / 정삼각형·이등변·부등변삼각형",
            },
            {
              en: "Measuring and drawing angles; sum of interior angles = 180°; unknown angle measures",
              ko: "각도 재고 그리기, 삼각형 내각의 합 = 180°",
              category: "도형",
            },
            {
              en: "Area of right triangles; volume of rectangular prisms (develop formula)",
              ko: "직각삼각형 넓이·직육면체 부피 공식 만들기",
              category: "측정",
              note: "직각삼각형 넓이 = 밑변 × 높이 ÷ 2, 부피 = 가로 × 세로 × 높이",
            },
            {
              en: "Identifying when to use perimeter, area, or volume; solving related problems",
              ko: "둘레·넓이·부피 언제 쓰는지 구별하기",
              category: "측정",
            },
            {
              en: "Probability using tree diagrams, lists, and charts; Fundamental Counting Principle",
              ko: "나무 그림으로 확률 구하기, 경우의 수 원리",
              category: "확률·자료",
            },
            {
              en: "Statistical review: mean, median, mode, and range",
              ko: "통계 복습 (평균·중앙값·최빈값·범위)",
              category: "확률·자료",
            },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "6학년 수준 (Virginia SOL 6)",
      highlights: [
        "원그래프·이상값(outlier) 분석, LCM·GCD, 수직선 부등식",
        "정수 사칙연산, 지수·완전제곱수(20²까지), 절댓값",
        "4사분면 좌표 평면, 비율·비례관계·단위율, 일변수 일차방정식",
        "원의 둘레·넓이(π), 평행사변형·삼각형 넓이 공식",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "원그래프·통계 + 부등식",
          topics: [
            {
              en: "Circle graphs: formulating questions, collecting data, representing with percentages (e.g., 7/20 = 35%)",
              ko: "원그래프 만들고 백분율로 나타내기",
              category: "확률·자료",
              note: "예: 7/20 = 35%",
            },
            {
              en: "Mean as balance point in a line plot",
              ko: "꺾은선그래프에서 균형점으로 평균 이해하기",
              category: "확률·자료",
            },
            {
              en: "Effect of adding, removing, or changing a value on mean, median, mode, and range",
              ko: "값 추가·제거·변경 시 통계량 변화 분석하기",
              category: "확률·자료",
            },
            {
              en: "Identifying outliers and analyzing their effect on statistical measures",
              ko: "이상값(outlier) 찾고 영향 분석하기",
              category: "확률·자료",
            },
            {
              en: "Prime and composite numbers; LCM and GCD of two numbers",
              ko: "소수·합성수, 최소공배수·최대공약수 구하기",
              category: "수·연산",
            },
            {
              en: "Linear inequalities from number line graphs; writing with inequality symbols",
              ko: "수직선에서 부등식 읽고 기호로 쓰기",
              category: "대수·패턴",
            },
            {
              en: "Solution sets of one-variable inequalities; checking by substitution or graph",
              ko: "부등식 해 집합 구하고 확인하기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "비율·좌표 평면·합동",
          topics: [
            {
              en: "Comparing and ordering positive rational numbers",
              ko: "양의 유리수(분수·소수·백분율) 크기 비교·정렬하기",
              category: "수·연산",
            },
            {
              en: "Fractions, decimals, and percents as ratios; ratio notation (a/b, a:b, a to b)",
              ko: "비율 이해하기, 분수·소수·백분율로 나타내기",
              category: "수·연산",
              note: "표기법: a/b, a:b, 'a 대 b' 모두 같은 뜻",
            },
            {
              en: "Tables of equivalent ratios representing proportional relationships (real-life contexts)",
              ko: "비례관계 표 만들고 실생활 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Coordinate plane: labeling axes, origin, and all four quadrants; distance to each axis",
              ko: "4사분면 좌표 평면 이해하기 (축·원점·사분면)",
              category: "도형",
            },
            {
              en: "Graphing and reading ordered pairs in all four quadrants",
              ko: "4사분면에서 좌표 찍고 읽기",
              category: "도형",
            },
            {
              en: "Drawing polygons in the coordinate plane; lengths of horizontal and vertical sides",
              ko: "좌표 평면에서 다각형 그리고 변의 길이 구하기",
              category: "도형",
            },
            {
              en: "Identifying regular polygons; lines of symmetry dividing into two congruent parts",
              ko: "정다각형 찾기, 대칭축 그리기",
              category: "도형",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "정수·지수·분수 + 일차방정식",
          topics: [
            {
              en: "Whole number exponents: patterns; powers of 10 and place value relationships",
              ko: "거듭제곱 이해하기, 10의 거듭제곱과 자릿값 관계",
              category: "수·연산",
              note: "예: 10³ = 1000, 10⁻¹ = 0.1",
            },
            {
              en: "Perfect squares up to 20² with visual models; identifying perfect squares from 0 to 400",
              ko: "완전제곱수 이해하기 (20²=400까지)",
              category: "수·연산",
            },
            {
              en: "Adding, subtracting, multiplying, and dividing integers with visual models",
              ko: "정수 사칙연산 (양수·음수 포함)",
              category: "수·연산",
              note: "예: -3 + 5 = 2, (-2) × 3 = -6",
            },
            {
              en: "Absolute value expressions with integer operations; results shown on a number line",
              ko: "절댓값 계산하기, 수직선에 결과 나타내기",
              category: "수·연산",
              note: "|-5| = 5, |3| = 3",
            },
            {
              en: "Multiplying and dividing fractions and mixed numbers (denominators ≤ 12, simplified form)",
              ko: "분수·대분수 곱하고 나누기",
              category: "분수",
              note: "예: 2/3 × 3/4 = 6/12 = 1/2",
            },
            {
              en: "Effect of multiplying or dividing a fraction/mixed number by a value between 0 and 1",
              ko: "0~1 사이 수로 곱하거나 나눌 때 크기 변화 이해하기",
              category: "분수",
            },
            {
              en: "Algebraic vocabulary: equation, variable, expression, term, coefficient",
              ko: "대수 용어 배우기 (방정식·변수·식·항·계수)",
              category: "대수·패턴",
            },
            {
              en: "Solving one-step linear equations using properties of equality; checking with visual models",
              ko: "일단계 방정식 풀기, 답 확인하기",
              category: "대수·패턴",
              note: "예: x + 5 = 12 → x = 7",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "비례 추론·원 측정·자료 심화",
          topics: [
            {
              en: "Unit rate from tables, context, and graphs; finding missing values in ratio tables",
              ko: "단위율 구하기, 비율 표에서 빠진 값 찾기",
              category: "수·연산",
            },
            {
              en: "Determining proportional relationships from tables, graphs, and real-life contexts",
              ko: "표·그래프·문제에서 비례관계 판별하기",
              category: "대수·패턴",
            },
            {
              en: "Circle parts: chord, diameter, radius, circumference, area; diameter–radius relationship",
              ko: "원의 구성 요소 이해하기 (현·지름·반지름·원주·넓이)",
              category: "도형",
              note: "지름 = 반지름 × 2",
            },
            {
              en: "Approximating pi (≈ 3.14) from circumference ÷ diameter; developing the circumference formula",
              ko: "파이(π≈3.14) 이해하기, 원주 공식 만들기",
              category: "측정",
              note: "원주 C = π × 지름 = 2πr",
            },
            {
              en: "Solving circumference and area problems given diameter or radius",
              ko: "지름·반지름으로 원주·넓이 계산하기",
              category: "측정",
              note: "넓이 A = π × r²",
            },
            {
              en: "Area of parallelograms and triangles (formula development with visual models)",
              ko: "평행사변형·삼각형 넓이 공식 만들기",
              category: "측정",
              note: "평행사변형 = 밑변 × 높이, 삼각형 = 밑변 × 높이 ÷ 2",
            },
            {
              en: "Circle graph data cycle: collecting, representing, comparing with other graph types; statistical measures revisited",
              ko: "원그래프 자료 주기 심화, 통계량 복습",
              category: "확률·자료",
            },
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
        "정수·분수·소수 사칙연산, 절댓값, 지수와 완전제곱수",
        "비율·단위율·비례관계, 4사분면 좌표평면",
        "일단계 방정식과 부등식, 원·평행사변형·삼각형 넓이",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "자료·통계 + 정수·부등식",
          topics: [
            {
              en: "Circle graphs: creating, interpreting, drawing conclusions",
              ko: "원그래프 만들고 해석하기",
              category: "확률·자료",
            },
            {
              en: "Mean as balance point in a line plot",
              ko: "꺾은선그래프에서 균형점으로 평균 이해하기",
              category: "확률·자료",
            },
            {
              en: "Effect on mean/median/mode/range when value is added, removed, or changed",
              ko: "값 추가·제거·변경 시 통계량 변화 분석하기",
              category: "확률·자료",
            },
            {
              en: "Outliers: identifying and their effect on statistical measures",
              ko: "이상값(outlier) 찾고 통계량에 미치는 영향 분석",
              category: "확률·자료",
            },
            {
              en: "Prime and composite numbers; LCM and GCD",
              ko: "소수·합성수, 최소공배수·최대공약수 구하기",
              category: "수·연산",
            },
            {
              en: "Linear inequalities from a number line; writing and checking solution sets",
              ko: "수직선에서 부등식 쓰고 해 집합 확인하기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "유리수·비율 + 좌표평면",
          topics: [
            {
              en: "Comparing and ordering positive rational numbers",
              ko: "양의 유리수 크기 비교·정렬하기",
              category: "수·연산",
            },
            {
              en: "Ratios and ratio notation (a:b, a/b, a to b); unit rate",
              ko: "비율 이해하기, 단위율 구하기",
              category: "수·연산",
              note: "표기법: a/b, a:b, 'a 대 b' 모두 동일",
            },
            {
              en: "Tables of equivalent ratios; proportional relationships",
              ko: "비례관계 표 만들기",
              category: "수·연산",
            },
            {
              en: "Four-quadrant coordinate plane: axes, origin, quadrants",
              ko: "4사분면 좌표평면 이해하기 (축·원점·사분면)",
              category: "도형",
            },
            {
              en: "Graphing and identifying ordered pairs in all four quadrants",
              ko: "4사분면에서 좌표 찍고 읽기",
              category: "도형",
            },
            {
              en: "Drawing polygons in the coordinate plane; calculating side lengths",
              ko: "좌표평면에서 다각형 그리고 변의 길이 계산하기",
              category: "도형",
            },
            {
              en: "Lines of symmetry; congruence of segments, angles, and polygons",
              ko: "대칭축 찾기, 합동인 도형 이해하기",
              category: "도형",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "정수·분수 연산 + 일단계 방정식",
          topics: [
            {
              en: "Whole number exponents; powers of 10 with whole number exponents",
              ko: "거듭제곱 이해하기, 10의 거듭제곱",
              category: "수·연산",
              note: "예: 2³ = 8, 10² = 100",
            },
            {
              en: "Perfect squares up to 20² = 400 using visual models",
              ko: "완전제곱수 이해하기 (1²~20²)",
              category: "수·연산",
            },
            {
              en: "Integer operations: add, subtract, multiply, divide; absolute value",
              ko: "정수 사칙연산·절댓값 계산하기",
              category: "수·연산",
              note: "예: -3 × 4 = -12, |-7| = 7",
            },
            {
              en: "Multiply and divide fractions and mixed numbers (denominators ≤ 12)",
              ko: "분수·대분수 곱하고 나누기",
              category: "분수",
            },
            {
              en: "Multi-step word problems with integers, fractions, and decimals",
              ko: "정수·분수·소수 포함 다단계 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Algebraic terms: variable, expression, equation, coefficient",
              ko: "대수 용어 배우기 (변수·식·방정식·계수)",
              category: "대수·패턴",
            },
            {
              en: "Writing and solving one-step linear equations; checking solutions",
              ko: "일단계 방정식 쓰고 풀기, 답 확인하기",
              category: "대수·패턴",
              note: "예: 3x = 15 → x = 5",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "비례추론 + 도형 넓이",
          topics: [
            {
              en: "Unit rate from table, graph, or context",
              ko: "표·그래프·문제에서 단위율 찾기",
              category: "수·연산",
            },
            {
              en: "Identifying and connecting multiple representations of proportional relationships",
              ko: "비례관계를 다양한 방법으로 나타내기",
              category: "대수·패턴",
            },
            {
              en: "Parts of a circle: chord, diameter, radius, circumference",
              ko: "원의 구성 요소 이해하기 (현·지름·반지름·원주)",
              category: "도형",
            },
            {
              en: "Approximating pi (3.14); circumference and area formulas for circles",
              ko: "파이(π≈3.14)로 원주·넓이 계산하기",
              category: "측정",
              note: "원주 = πd, 넓이 = πr²",
            },
            {
              en: "Area of parallelograms and triangles",
              ko: "평행사변형·삼각형 넓이 구하기",
              category: "측정",
              note: "평행사변형 = 밑변 × 높이, 삼각형 = 밑변 × 높이 ÷ 2",
            },
            {
              en: "Completing the data cycle: circle graphs and statistical analysis",
              ko: "원그래프 자료 주기 완성, 통계 분석하기",
              category: "확률·자료",
            },
          ],
        },
      ],
    },
    advanced: {
      gradeEquivalentKo: "7학년 / 중학 대수 준비 수준",
      highlights: [
        "히스토그램·음의 지수·과학적 표기법·유리수 비교",
        "이단계 방정식·부등식, 대수식 간소화",
        "기울기와 y = mx 직접변환, 비례관계 다중 표현",
        "닮음도형·확대·축소(닮음비), 원기둥 부피·겉넓이",
      ],
      quarters: [
        {
          quarter: "Q1",
          focusKo: "히스토그램·지수·수 체계",
          topics: [
            {
              en: "Histograms: creating with different intervals, comparing to line plots and circle graphs",
              ko: "히스토그램 만들기, 꺾은선·원그래프와 비교하기",
              category: "확률·자료",
            },
            {
              en: "Analyzing patterns and drawing conclusions from histograms",
              ko: "히스토그램에서 패턴 분석하고 결론 내리기",
              category: "확률·자료",
            },
            {
              en: "Negative exponents as fractions and decimals; patterns with powers of 10",
              ko: "음의 지수를 분수·소수로 나타내기",
              category: "수·연산",
              note: "예: 10⁻² = 1/100 = 0.01",
            },
            {
              en: "Scientific notation ↔ standard form; comparing numbers in scientific notation",
              ko: "과학적 표기법 ↔ 일반 수 변환하기",
              category: "수·연산",
              note: "예: 3.5 × 10⁴ = 35,000",
            },
            {
              en: "Comparing and ordering rational numbers (integers, fractions, decimals, percents; positive and negative)",
              ko: "유리수(정수·분수·소수·백분율, 양수·음수) 크기 비교·정렬하기",
              category: "수·연산",
            },
            {
              en: "Positive square roots of perfect squares 0–400",
              ko: "완전제곱수의 양의 제곱근 구하기 (0~400)",
              category: "수·연산",
              note: "예: √144 = 12, √400 = 20",
            },
          ],
        },
        {
          quarter: "Q2",
          focusKo: "대수식 + 이단계 방정식·부등식",
          topics: [
            {
              en: "Order of operations with brackets [ ] and absolute value | |; exponents 1–4",
              ko: "괄호·절댓값 포함 연산 순서 적용하기",
              category: "수·연산",
            },
            {
              en: "Simplifying algebraic expressions; combining like terms (rational coefficients)",
              ko: "대수식 간소화하기, 동류항 묶기",
              category: "대수·패턴",
              note: "예: 3x + 2x - 1 = 5x - 1",
            },
            {
              en: "Evaluating expressions by substituting positive/negative rational values for variables",
              ko: "변수에 유리수 값 대입해서 식 계산하기",
              category: "대수·패턴",
            },
            {
              en: "Solving two-step linear equations with rational numbers; verifying solutions",
              ko: "이단계 방정식 풀기, 답 확인하기",
              category: "대수·패턴",
              note: "예: 2x + 3 = 11 → x = 4",
            },
            {
              en: "Writing two-step equations for real-life situations",
              ko: "실생활 상황을 이단계 방정식으로 나타내기",
              category: "대수·패턴",
            },
            {
              en: "Solving one- and two-step inequalities; effect of multiplying/dividing by a negative number",
              ko: "일·이단계 부등식 풀기, 음수로 곱·나눌 때 부등호 방향 바뀜",
              category: "대수·패턴",
              note: "예: -2x < 6 → x > -3 (부등호 방향 바뀜)",
            },
            {
              en: "Graphing inequality solution sets on a number line",
              ko: "부등식 해 집합을 수직선에 나타내기",
              category: "대수·패턴",
            },
          ],
        },
        {
          quarter: "Q3",
          focusKo: "비례관계·기울기 + 닮음도형",
          topics: [
            {
              en: "Ratio tables for proportional relationships; solving proportions for missing values",
              ko: "비 표로 비례관계 나타내기, 빠진 값 구하기",
              category: "수·연산",
            },
            {
              en: "Proportional reasoning for unit conversion",
              ko: "비례추론으로 단위 변환하기",
              category: "수·연산",
            },
            {
              en: "Slope (m) as rate of change from tables, graphs, and real-life situations",
              ko: "기울기(m) = 변화율 이해하기",
              category: "대수·패턴",
              note: "기울기 = 세로 변화 ÷ 가로 변화",
            },
            {
              en: "Direct variation equation y = mx; positive and negative slopes",
              ko: "정비례 방정식 y = mx 이해하기, 양·음의 기울기",
              category: "대수·패턴",
            },
            {
              en: "Identifying positive, negative, and zero slope from a graph",
              ko: "그래프에서 양·음·영(0)의 기울기 구별하기",
              category: "대수·패턴",
            },
            {
              en: "Similar quadrilaterals and triangles: corresponding sides/angles, similarity statements, proportions",
              ko: "닮은 도형 이해하기 (대응변·각, 비례식)",
              category: "도형",
            },
            {
              en: "Solving proportions for missing side lengths and unknown angles in similar figures",
              ko: "닮음 비례식으로 미지 변의 길이·각도 구하기",
              category: "도형",
            },
            {
              en: "Dilations on the coordinate plane with scale factors 1/4, 1/2, 2, 3, 4 (center at origin)",
              ko: "좌표평면에서 닮음비로 도형 확대·축소하기",
              category: "도형",
              note: "닮음비 예: 2배 확대 → 모든 좌표 ×2",
            },
          ],
        },
        {
          quarter: "Q4",
          focusKo: "확률 + 사각형·3차원 도형",
          topics: [
            {
              en: "Theoretical vs. experimental probability; effect of increasing number of trials",
              ko: "이론적 확률 vs. 실험적 확률, 시행 횟수 늘릴수록 이론에 가까워짐",
              category: "확률·자료",
            },
            {
              en: "Estimating and solving real-life problems with rational number operations",
              ko: "유리수 사칙연산으로 실생활 문제 풀기",
              category: "수·연산",
            },
            {
              en: "Properties of quadrilaterals: parallel/perpendicular sides, equal angles, diagonals, lines of symmetry",
              ko: "사각형의 성질 이해하기 (평행·수직 변, 각도, 대각선, 대칭축)",
              category: "도형",
            },
            {
              en: "Classifying parallelograms, rectangles, squares, rhombi, and trapezoids",
              ko: "사각형 5종류 분류하기",
              category: "도형",
              note: "평행사변형 · 직사각형 · 정사각형 · 마름모 · 사다리꼴",
            },
            {
              en: "Finding unknown angles and side lengths in quadrilaterals from diagrams",
              ko: "사각형에서 미지 각도·변의 길이 구하기",
              category: "도형",
            },
            {
              en: "Volume of right cylinders; surface area of rectangular prisms and right cylinders",
              ko: "원기둥 부피, 직육면체·원기둥 겉넓이 구하기",
              category: "측정",
              note: "원기둥 부피 = πr² × 높이",
            },
            {
              en: "Effect of scaling one measurement (×1/4, ×1/3, ×1/2, ×2, ×3, ×4) on volume and surface area",
              ko: "한 변의 배율이 부피·겉넓이에 미치는 영향",
              category: "측정",
            },
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
  descriptionKo: string;
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
    descriptionKo:
      "학부모님, 담임 선생님, 또는 학생 본인이 AAP 심화 과정 평가를 신청할 수 있습니다. 신청서는 학교 AAP 담당자를 통해 받으시면 되고, 별도의 비용은 없습니다. 접수 창구는 매년 12월 초에 마감되니 미리 준비하세요.",
    color: "navy",
  },
  {
    name: "AAP Ability Testing (NGAT)",
    nameKo: "AAP 역량 검사 (NGAT)",
    when: "Jan – Feb (annually)",
    whenKo: "매년 1월 ~ 2월",
    grades: "Referred students (K–5)",
    gradesKo: "의뢰된 학생 (유치원~5학년)",
    description:
      "FCPS administers the NGAT (Naglieri General Ability Test), a single nationally normed reasoning test that replaced the previously separate CogAT and NNAT tests. Scores plus portfolio evidence determine AAP placement.",
    descriptionKo:
      "FCPS에서 NGAT(Naglieri General Ability Test) 검사를 실시합니다. 이전에 따로 시행하던 CogAT와 NNAT 검사를 하나로 통합한 표준화 능력 검사입니다. 검사 점수와 포트폴리오 자료를 종합하여 AAP 배치가 결정됩니다.",
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
    descriptionKo:
      "FCPS에서 가정으로 배치 결과 서한을 발송합니다. Full-Time AAP로 선발된 학생은 다음 학년도부터 지정 AAP 센터 학교로 이동하며, Part-Time AAP(레벨 III) 학생은 현재 학교에서 수업을 받습니다. 결과에 이의가 있으면 정해진 기간 내에 재심을 요청하실 수 있습니다.",
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
    descriptionKo:
      "버지니아 학습 기준(SOL) 시험은 학생들이 해당 학년 교육과정을 얼마나 충실히 익혔는지 평가합니다. 버지니아 공립학교 3~8학년은 모두 필수 응시 대상입니다. 결과는 학교 인증 평가와 학생 진급 결정에 활용됩니다.",
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
    descriptionKo:
      "초·중학교 수학 올림피아드(MOEMS)는 11월부터 3월까지 월 1회, 총 5회 진행됩니다. 학교별로 팀을 구성해 참가하며, 각 학생은 개인전 형식으로 문제를 풀게 됩니다. 수학 경시대회를 처음 접하는 아이들에게 훌륭한 경험이 됩니다.",
    color: "purple",
  },
  {
    name: "AMC 8",
    nameKo: "AMC 8 수학 경시대회",
    when: "Jan (annually)",
    whenKo: "매년 1월",
    grades: "Gr 8 and below",
    gradesKo: "8학년 이하 (K–6 모두 참가 가능)",
    description:
      "The AMC 8 is a 25-question, 40-minute multiple-choice math exam for students in grade 8 and below, administered by the Mathematical Association of America (MAA). No penalty for wrong answers. An excellent first step toward AMC 10/12 and MATHCOUNTS.",
    descriptionKo:
      "미국수학협회(MAA)가 주관하는 25문항 40분 객관식 수학 경시대회로, 8학년 이하 학생이라면 누구나 참가할 수 있습니다. 오답 감점이 없어 부담 없이 도전할 수 있으며, 향후 AMC 10/12, MATHCOUNTS 같은 상위 대회를 준비하는 첫걸음으로 매우 좋습니다.",
    color: "purple",
  },
];
