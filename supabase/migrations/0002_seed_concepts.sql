-- Starter concept taxonomy for grades 3-6, spanning the main strands taught
-- across IXL / Singapore Math. This is a starting point, not a fixed list —
-- the teacher can add, rename, or retire rows directly (concepts is a plain
-- reference table, not a code enum) to match the academy's actual
-- scope-and-sequence over time.

insert into concepts (code, strand, label_ko, label_en, grades, sort_order) values
  ('ops-add-sub-multi-digit', '사칙연산', '여러 자리 수 덧셈/뺄셈', 'Multi-digit addition/subtraction', array['3','4'], 10),
  ('ops-mult-facts', '사칙연산', '곱셈 구구', 'Multiplication facts', array['3'], 20),
  ('ops-mult-multi-digit', '사칙연산', '여러 자리 수 곱셈', 'Multi-digit multiplication', array['4','5'], 30),
  ('ops-division-basic', '사칙연산', '나눗셈 기초', 'Basic division', array['3','4'], 40),
  ('ops-division-long', '사칙연산', '긴 나눗셈', 'Long division', array['4','5'], 50),
  ('ops-order-of-operations', '사칙연산', '연산 순서', 'Order of operations', array['5','6'], 60),
  ('ops-negative-numbers', '사칙연산', '정수와 음수', 'Integers and negative numbers', array['6'], 70),
  ('ops-exponents', '사칙연산', '거듭제곱', 'Exponents', array['6'], 80),

  ('frac-basic-concept', '분수', '분수의 기본 개념', 'Basic fraction concept', array['3'], 100),
  ('frac-equivalence', '분수', '분수의 동치', 'Equivalent fractions', array['3','4'], 110),
  ('frac-compare-order', '분수', '분수 비교와 순서', 'Comparing/ordering fractions', array['4'], 120),
  ('frac-add-sub-like', '분수', '동분모 분수의 덧셈/뺄셈', 'Adding/subtracting like fractions', array['4'], 130),
  ('frac-add-sub-unlike', '분수', '이분모 분수의 덧셈/뺄셈', 'Adding/subtracting unlike fractions', array['5'], 140),
  ('frac-mult', '분수', '분수의 곱셈', 'Multiplying fractions', array['5'], 150),
  ('frac-div', '분수', '분수의 나눗셈', 'Dividing fractions', array['5','6'], 160),
  ('frac-mixed-numbers', '분수', '대분수 변환', 'Mixed numbers <-> improper fractions', array['4','5'], 170),

  ('dec-place-value', '소수', '소수의 자릿값', 'Decimal place value', array['4'], 200),
  ('dec-compare-order', '소수', '소수 비교와 순서', 'Comparing/ordering decimals', array['4'], 210),
  ('dec-add-sub', '소수', '소수의 덧셈/뺄셈', 'Adding/subtracting decimals', array['4','5'], 220),
  ('dec-mult', '소수', '소수의 곱셈', 'Multiplying decimals', array['5'], 230),
  ('dec-div', '소수', '소수의 나눗셈', 'Dividing decimals', array['5','6'], 240),
  ('dec-frac-convert', '소수', '분수와 소수 변환', 'Converting fractions and decimals', array['5'], 250),
  ('percent-basic', '소수', '백분율 기초', 'Basic percent', array['6'], 260),

  ('geo-2d-shapes', '도형', '평면도형 분류', 'Classifying 2D shapes', array['3'], 300),
  ('geo-angles', '도형', '각의 종류와 측정', 'Types and measurement of angles', array['4'], 310),
  ('geo-perimeter', '도형', '둘레 구하기', 'Perimeter', array['3','4'], 320),
  ('geo-area-rectangle', '도형', '직사각형 넓이', 'Area of rectangles', array['4'], 330),
  ('geo-area-triangle-parallelogram', '도형', '삼각형/평행사변형 넓이', 'Area of triangles/parallelograms', array['5','6'], 340),
  ('geo-volume', '도형', '부피와 겉넓이', 'Volume and surface area', array['5'], 350),
  ('geo-coordinate-plane', '도형', '좌표평면', 'Coordinate plane', array['5','6'], 360),
  ('geo-symmetry-transformations', '도형', '대칭과 도형 변환', 'Symmetry and transformations', array['4','5','6'], 370),
  ('geo-circles', '도형', '원의 둘레와 넓이', 'Circumference and area of circles', array['6'], 380),

  ('meas-units-length-weight', '측정', '길이/무게 단위', 'Units of length/weight', array['3'], 400),
  ('meas-unit-conversion', '측정', '단위 변환', 'Unit conversion', array['4','5'], 410),
  ('meas-time-elapsed', '측정', '시간과 경과 시간 계산', 'Time and elapsed time', array['3','4'], 420),
  ('meas-money', '측정', '돈 계산', 'Money calculations', array['3'], 430),
  ('meas-data-graphs', '측정', '그래프와 자료 해석', 'Reading graphs and data', array['4','5','6'], 440),
  ('meas-mean-median', '측정', '평균과 중앙값', 'Mean and median', array['6'], 450),

  ('word-multi-step', '문장제', '다단계 문장제', 'Multi-step word problems', array['4','5','6'], 500),
  ('word-ratio-rate', '문장제', '비와 비율', 'Ratio and rate', array['6'], 510),
  ('word-proportion', '문장제', '비례식', 'Proportions', array['6'], 520),

  ('alg-patterns', '대수적 사고', '규칙 찾기와 패턴', 'Patterns and sequences', array['3','4'], 600),
  ('alg-expressions', '대수적 사고', '식 세우기', 'Writing expressions', array['5','6'], 610),
  ('alg-variables', '대수적 사고', '변수의 개념', 'Understanding variables', array['5','6'], 620),
  ('alg-equations-basic', '대수적 사고', '간단한 방정식', 'Basic equations', array['6'], 630),
  ('alg-coordinate-graphing', '대수적 사고', '좌표와 그래프', 'Coordinate graphing', array['6'], 640)
on conflict (code) do nothing;
