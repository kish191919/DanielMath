export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  publishedAt: string;
  readingMins: number;
  category: string;
  categoryEn: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  bodyKo: BlogSection[];
  bodyEn: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "fcps-aap-math-guide",
    publishedAt: "2026-07-27",
    readingMins: 6,
    category: "AAP",
    categoryEn: "AAP",
    titleKo: "FCPS AAP 수학, 제대로 이해하기",
    titleEn: "Understanding FCPS AAP Math",
    descKo: "Fairfax County 초등학교의 Standard 수학과 AAP(심화) 수학의 차이, 배치 기준, 그리고 중학교·고등학교까지 이어지는 수학 경로를 정리했습니다.",
    descEn: "A clear breakdown of Standard vs. Advanced (AAP) math in FCPS, covering placement criteria and the long-term pathway through middle and high school.",
    bodyKo: [
      {
        heading: "FCPS 수학에는 두 가지 트랙이 있습니다",
        paragraphs: [
          "Fairfax County 공립학교(FCPS)는 초등학교 전 학년(K–6)에 두 가지 수학 트랙을 운영합니다. 하나는 해당 학년의 Virginia Standards of Learning(SOL)을 따르는 일반 수학(Standard), 다른 하나는 한 학년 높은 내용을 배우는 심화 수학(Advanced/AAP)입니다.",
          "예를 들어 4학년 일반반 학생이 4학년 SOL을 공부할 때, 4학년 AAP반 학생은 5학년 SOL 내용을 배웁니다. 이 한 학년의 차이는 시간이 지날수록 누적되어 중학교 이후 학습 경로에 큰 영향을 줍니다.",
        ],
      },
      {
        heading: "AAP(Advanced Academic Programs)란?",
        paragraphs: [
          "AAP는 FCPS가 운영하는 심화 학습 프로그램으로, 학문적으로 뛰어난 학생들이 더 높은 수준의 교육을 받을 수 있도록 설계되어 있습니다. 수학 외에도 언어, 과학, 사회 등 전 과목에 걸쳐 심화 내용을 다룹니다.",
          "AAP에는 두 가지 형태가 있습니다. 파트타임(Level III)은 학생이 현재 다니는 학교에서 수학·언어 시간만 심화 수업을 받는 방식이고, 풀타임(Level IV)은 지정된 AAP 센터 학교로 전학을 가서 모든 과목을 심화로 배우는 방식입니다. 풀타임은 3학년부터 지원이 가능합니다.",
        ],
      },
      {
        heading: "배치는 어떻게 이루어지나요?",
        paragraphs: [
          "FCPS AAP 배치는 여러 요소를 종합적으로 평가합니다. NGAT(Naglieri General Ability Test) 점수, 학업 성적(GPA), 교사 평가서, 학부모 추천서가 모두 반영됩니다. NGAT는 2025-2026학년도부터 기존 CogAT·NNAT를 대체한 단일 능력검사입니다.",
          "중요한 점은 AAP 배치가 한 번에 영구적으로 결정되지 않는다는 것입니다. FCPS는 매년 학업 수행 능력을 다시 평가하며, 심화반을 유지하려면 꾸준한 학습이 필요합니다. 지원 신청은 일반적으로 전년도 12월 중순에 마감됩니다.",
        ],
      },
      {
        heading: "초등 AAP 수학이 중학교 이후 경로에 미치는 영향",
        paragraphs: [
          "초등 AAP 수학을 꾸준히 이수한 학생은 중학교에서 더 빠른 수학 경로를 밟을 수 있습니다. FCPS 기준으로, 6학년에 7학년 수준의 수학을 이수한 학생은 7학년에 Pre-Algebra, 8학년에 Algebra I를 수강하게 됩니다.",
          "이 경로를 따라가면 고등학교에서 AP Calculus AB 또는 BC를 수강할 수 있는 기반이 마련됩니다. 많은 대학에서 AP Calculus 이수 여부를 이공계 전공 지원 시 중요하게 봅니다. 초등학교의 수학 배치가 결국 대학 입시까지 영향을 미칠 수 있다는 점에서 조기에 준비하는 것이 중요합니다.",
        ],
      },
      {
        heading: "학부모가 할 수 있는 것",
        paragraphs: [
          "먼저 자녀가 현재 어느 트랙에 있는지 확인하세요. ParentVUE(학교 포털)의 수강 과목을 보거나 담임선생님에게 직접 물어볼 수 있습니다. 과목명에 'Advanced Math' 또는 학년보다 높은 숫자(예: 3학년인데 'Math 4')가 있으면 심화반입니다.",
          "AAP 진입을 목표로 한다면, CogAT·NNAT 시험 유형을 미리 익히고 수학 개념을 탄탄히 다지는 것이 핵심입니다. 이미 AAP에 있다면, 심화 내용을 소화하면서 학업을 유지하는 것이 중요합니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "Two Math Tracks in FCPS",
        paragraphs: [
          "Fairfax County Public Schools (FCPS) runs two separate math tracks at every elementary grade level (K–6). The Standard track follows the grade-level Virginia Standards of Learning (SOL). The Advanced/AAP track covers content one full grade level ahead.",
          "For example, while a 4th-grade Standard student works through 4th-grade SOL, a 4th-grade AAP student is already covering 5th-grade content. This one-year gap compounds over time and significantly shapes a student's math trajectory into middle and high school.",
        ],
      },
      {
        heading: "What Is AAP?",
        paragraphs: [
          "AAP (Advanced Academic Programs) is FCPS's enrichment program designed for academically advanced students. It covers all core subjects at an accelerated level, not just math.",
          "There are two forms of AAP placement. Part-time (Level III) means the student stays at their home school but receives advanced instruction during math and language arts. Full-time (Level IV) means the student transfers to a designated AAP center school for all subjects. Full-time AAP is available starting in 3rd grade.",
        ],
      },
      {
        heading: "How Is Placement Determined?",
        paragraphs: [
          "FCPS evaluates several factors together: NGAT (Naglieri General Ability Test) scores, academic grades, teacher evaluations, and a parent recommendation. No single score determines placement. The NGAT replaced the former CogAT and NNAT tests starting in the 2025-2026 school year.",
          "Critically, AAP placement is not permanent. FCPS re-evaluates students annually, and maintaining the advanced track requires consistent academic performance. Application windows typically close in mid-December for the following school year.",
        ],
      },
      {
        heading: "Why AAP Math Matters for the Long-Term Pathway",
        paragraphs: [
          "Students who complete the elementary AAP math track consistently enter a faster math sequence in middle school. Under the FCPS pathway, a student who completes 7th-grade-level math in 6th grade proceeds to Pre-Algebra in 7th grade and Algebra I in 8th grade.",
          "This trajectory makes AP Calculus AB or BC achievable in high school, a credential that carries weight for STEM college admissions. Elementary math placement has compounding effects that reach well beyond elementary school.",
        ],
      },
      {
        heading: "What Parents Can Do",
        paragraphs: [
          "Start by confirming which track your child is currently in. Check their course list in ParentVUE or ask their teacher directly. If the course name says 'Advanced Math' or shows a grade level higher than your child's current grade, they are in the advanced track.",
          "If you're targeting AAP placement, focus on familiarizing your child with CogAT and NNAT question formats, and building solid math concept foundations. If your child is already in AAP, the priority is sustaining performance and keeping pace with accelerated content.",
        ],
      },
    ],
  },
  {
    slug: "cogat-nnat-guide",
    publishedAt: "2026-07-27",
    readingMins: 7,
    category: "시험",
    categoryEn: "Testing",
    titleKo: "NGAT(구 CogAT·NNAT) 시험 완전 가이드",
    titleEn: "A Complete Guide to the NGAT (formerly CogAT & NNAT)",
    descKo: "FCPS AAP 배치에 사용되는 NGAT 시험의 구조, 점수 방식, 시험 시기, 그리고 준비 방법을 학부모 눈높이에서 정리했습니다. 2025-2026학년도부터 기존 CogAT·NNAT를 대체했습니다.",
    descEn: "Everything parents need to know about the NGAT, the ability test now used for FCPS AAP placement, including structure, scoring, timing, and preparation strategies. It replaced CogAT and NNAT starting in the 2025-2026 school year.",
    bodyKo: [
      {
        heading: "NGAT란 무엇인가요?",
        paragraphs: [
          "FCPS는 2025-2026학년도부터 AAP(심화학급) 선발을 위한 능력검사 체계를 바꿨습니다. 과거에는 2학년 전체 학생에게 CogAT(Cognitive Abilities Test)를, 1학년 전체 학생에게 NNAT(Naglieri Nonverbal Ability Test)를 각각 실시했지만, 현재는 이 두 시험을 대체하는 단일 검사인 NGAT(Naglieri General Ability Test)를 2~7학년 스크리닝에 활용합니다.",
          "NGAT는 NNAT를 개발한 심리학자 Jack Naglieri가 만든 검사로, 학생이 배운 지식이 아니라 추론 능력과 문제 해결 잠재력을 측정한다는 철학은 이전과 동일합니다. 검사는 Verbal(언어 개념), Nonverbal(도형·공간 패턴), Quantitative(수량 추론) 세 영역으로 구성되어 있어, 기존 CogAT의 세 배터리 구조를 하나의 시험 안에 통합한 형태라고 볼 수 있습니다.",
        ],
      },
      {
        heading: "세 가지 영역: Verbal·Nonverbal·Quantitative",
        paragraphs: [
          "Verbal(언어) 영역은 여섯 개의 그림 중 다섯 개가 공유하는 개념을 찾아내는 방식으로 언어적 개념을 측정하며, 문장이 아닌 그림으로 제시되어 언어 배경에 관계없이 공정하게 평가할 수 있도록 설계되었습니다. Nonverbal(비언어) 영역은 도형, 색상, 순서, 방향 등 시각적 패턴 사이의 논리적 관계를 파악하는 능력을 측정합니다.",
          "Quantitative(수량) 영역은 숫자와 기호 사이의 관계를 다루며, 단순 연산 실력이 아니라 수학적으로 사고하는 방식을 평가합니다. 세 영역 모두 학교에서 배운 교과 지식보다는 순수한 추론 능력에 초점을 맞춘다는 점은 이전 CogAT·NNAT 체계와 같습니다.",
        ],
      },
      {
        heading: "점수는 어떻게 계산되나요?",
        paragraphs: [
          "NGAT 결과는 NAI(Naglieri Ability Index)라는 표준화 점수와 백분위(Percentile Rank)로 제공됩니다. NAI는 같은 연령대 학생들과 비교한 점수로, 평균이 100이며 대다수 학생은 85~115 사이에 분포합니다. 백분위 99는 동일 연령대 100명 중 상위 1등이라는 의미입니다.",
          "FCPS에서 풀타임 AAP(Level IV) 배치는 일반적으로 상위 3~5% 이내의 점수가 요구되지만, 점수만으로 결정되지 않고 교사 평가, 학업 성취도 등을 종합적으로 반영합니다.",
        ],
      },
      {
        heading: "시험은 언제, 어떻게 치르나요?",
        paragraphs: [
          "FCPS는 2학년 학생 전원을 대상으로 NGAT 스크리닝을 실시하며, 3학년 풀타임 AAP 배치를 위한 첫 관문이 됩니다. 학교에서 단체로 실시하며 별도 등록 없이 자동으로 포함됩니다. 스크리닝을 원하는 다른 학년(2~7학년) 학생은 학부모가 학교에 추천서(Referral)를 제출해야 합니다.",
          "풀타임 AAP 추천서 접수는 매년 8월 중순부터 12월 중순까지 진행되며, 정확한 마감일은 학년도마다 조금씩 달라질 수 있으므로 재학 중인 학교의 AART(Advanced Academic Resource Teacher)나 학교 홈페이지 공지를 확인하는 것이 가장 정확합니다. 스크리닝 이후 학교에서 학부모에게 결과를 통보하고, 필요 시 추가 평가(Portfolio Review)를 거쳐 최종 배치가 결정됩니다. 참고로 FCPS는 조지메이슨대학교 CEWS 프로그램 등에서 개별적으로 응시한 CogAT·NNAT-3 점수나 WISC-V 점수도 계속 인정하고 있습니다.",
        ],
      },
      {
        heading: "어떻게 준비할 수 있나요?",
        paragraphs: [
          "NGAT는 교과 내용보다 추론 능력을 측정하기 때문에, 단순 암기나 공식 학습만으로는 준비가 어렵습니다. 가장 효과적인 준비는 세 영역(Verbal·Nonverbal·Quantitative)의 문제 유형에 익숙해지는 것입니다. 공식 연습 자료나 유사 문항을 통해 각 영역의 형식과 시간 배분을 미리 경험해보는 것이 도움이 됩니다.",
          "Quantitative 영역은 수학적 사고력이 반영되기 때문에, 평소에 Singapore Math나 Beast Academy처럼 개념 중심의 사고력 수학을 훈련하면 실질적인 준비가 됩니다. 단, 시험 직전에 벼락치기식으로 준비하기보다는 꾸준한 추론력 훈련이 더 효과적입니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "What Is the NGAT?",
        paragraphs: [
          "Starting with the 2025-2026 school year, FCPS changed the ability-testing system used for AAP (Advanced Academic Programs) screening. Previously, all 2nd graders took the CogAT (Cognitive Abilities Test) and all 1st graders took the NNAT (Naglieri Nonverbal Ability Test). Both have now been replaced by a single test, the NGAT (Naglieri General Ability Test), used for screening in grades 2-7.",
          "The NGAT was developed by Jack Naglieri, the same psychologist behind the NNAT, and keeps the same underlying philosophy: it measures reasoning ability and problem-solving potential rather than learned content. The test is organized into three sections — Verbal, Nonverbal, and Quantitative — effectively consolidating what used to be three separate CogAT batteries into a single exam.",
        ],
      },
      {
        heading: "Three Sections: Verbal, Nonverbal, and Quantitative",
        paragraphs: [
          "The Verbal section presents six pictures and asks students to identify the concept shared by five of them, measuring verbal reasoning through images rather than written or spoken language — a design meant to be fair across language backgrounds. The Nonverbal section measures logical reasoning through shapes, colors, sequences, and orientation in matrix-style patterns.",
          "The Quantitative section evaluates relationships between numbers and symbols, focusing on how a student thinks mathematically rather than computational speed. As with the previous CogAT/NNAT system, all three sections prioritize pure reasoning over classroom content.",
        ],
      },
      {
        heading: "How Are Scores Calculated?",
        paragraphs: [
          "NGAT results are reported as a Naglieri Ability Index (NAI) and a Percentile Rank. The NAI compares a student to same-age peers, with an average of 100; most students score between 85 and 115. A 99th percentile means a student scored higher than 99 out of 100 same-age peers.",
          "Full-time AAP (Level IV) placement in FCPS typically requires scores in roughly the top 3–5%, but scores are never the sole deciding factor. Teacher evaluations and academic performance are also weighed.",
        ],
      },
      {
        heading: "When and How Is the Test Administered?",
        paragraphs: [
          "FCPS screens all 2nd graders with the NGAT as the first step toward full-time AAP placement starting in 3rd grade. This screening happens automatically at school with no separate registration. Students in other eligible grades (2-7) can be screened if a parent submits a referral to the school.",
          "Full-time AAP referrals are generally accepted from mid-August through mid-December each year, though exact deadlines shift slightly year to year — check with your school's AART (Advanced Academic Resource Teacher) or school website for the current cycle's dates. After screening, parents receive results, and eligible students may go through a Portfolio Review before final placement. Note that FCPS still accepts privately administered CogAT and NNAT-3 scores (for example, through George Mason University's CEWS program) or WISC-V scores as alternative evidence.",
        ],
      },
      {
        heading: "How Can You Prepare?",
        paragraphs: [
          "Since the NGAT measures reasoning rather than curriculum knowledge, memorization and formula drills are ineffective preparation. The most practical approach is familiarizing your child with all three question formats — Verbal, Nonverbal, and Quantitative — through official or comparable practice materials.",
          "For the Quantitative section specifically, building conceptual math thinking through programs like Singapore Math or Beast Academy provides genuine preparation. Long-term, consistent development of reasoning ability is far more effective than last-minute test prep.",
        ],
      },
    ],
  },
  {
    slug: "singapore-math-explained",
    publishedAt: "2025-05-08",
    readingMins: 5,
    category: "교재",
    categoryEn: "Curriculum",
    titleKo: "Singapore Math가 특별한 이유",
    titleEn: "Why Singapore Math Works",
    descKo: "전 세계 영재 교육에서 주목받는 Singapore Math의 철학과 교육 방식, 그리고 미국의 전통적인 수학 교육과 어떻게 다른지 학부모 눈높이에서 설명합니다.",
    descEn: "An accessible explanation of what Singapore Math is, why it's widely adopted in gifted education programs, and how it differs from traditional US math instruction.",
    bodyKo: [
      {
        heading: "Singapore Math란 무엇인가요?",
        paragraphs: [
          "Singapore Math는 1980년대 싱가포르 교육부가 개발한 수학 교육 과정입니다. 싱가포르는 이 교육과정을 도입한 이후 국제 수학·과학 성취도 평가(TIMSS)에서 지속적으로 최상위권을 기록하고 있습니다. 이 성과에 주목한 미국의 여러 학군과 영재 교육 프로그램이 Singapore Math를 도입하기 시작했습니다.",
          "핵심은 '더 적은 주제를 더 깊게'(Teach Less, Learn More)라는 철학입니다. 미국의 전통 수학 교과서가 많은 주제를 빠르게 훑고 지나가는 반면, Singapore Math는 핵심 개념을 깊이 탐구하고 완전히 이해한 뒤 다음 개념으로 넘어갑니다.",
        ],
      },
      {
        heading: "CPA 접근법: 구체에서 그림을 거쳐 추상으로",
        paragraphs: [
          "Singapore Math의 핵심 교육 방식은 CPA(Concrete-Pictorial-Abstract) 접근법입니다. 학생이 수학 개념을 처음 접할 때는 실물(구체물)로 직접 만지며 이해하고, 그 다음엔 그림이나 도식으로 표현하며, 마지막으로 추상적인 숫자와 기호로 다룹니다.",
          "예를 들어 분수를 배울 때, 먼저 피자나 블록 같은 실물을 반으로 나눠 보고, 이후 원이나 막대를 나눈 그림으로 표현하며, 마지막에 '1/2'이라는 기호를 사용합니다. 이 과정을 통해 학생들은 숫자 뒤에 있는 개념을 직관적으로 이해하게 됩니다.",
        ],
      },
      {
        heading: "Bar Model로 워드 프로블럼 시각화하기",
        paragraphs: [
          "Singapore Math의 또 다른 특징은 Bar Model(막대 모델)입니다. 복잡한 워드 프로블럼을 막대 그림으로 시각화하여 문제의 구조를 파악하는 방법입니다.",
          "예를 들어 '민수는 영희보다 사탕을 12개 더 가지고 있고, 둘 합쳐서 48개다. 민수는 몇 개?'라는 문제를 막대로 그리면, 대수 방정식 없이도 초등학생이 논리적으로 풀 수 있습니다. 이 방법은 훗날 대수(Algebra)의 개념적 기초가 됩니다.",
        ],
      },
      {
        heading: "미국 수학 교육과 무엇이 다른가요?",
        paragraphs: [
          "전통적인 미국 수학 교육은 공식과 절차(Procedure)를 먼저 가르치고, 많은 문제를 반복해서 풀게 하는 방식입니다. 이렇게 하면 계산 속도는 빨라지지만 '왜(Why)' 그렇게 되는지 이해하지 못하는 경우가 많습니다.",
          "Singapore Math는 반대로 '왜'를 먼저 이해시킵니다. 나눗셈이 무엇인지 개념을 완전히 이해한 학생은 공식을 잊어버려도 스스로 다시 유도할 수 있습니다. CogAT·NNAT 같은 추론 능력 시험이나 AMC 같은 수학 경시대회에서 Singapore Math 학생들이 강한 이유가 이 때문입니다.",
        ],
      },
      {
        heading: "Beast Academy와의 관계",
        paragraphs: [
          "Beast Academy는 수학 올림피아드 기관인 Art of Problem Solving(AoPS)이 Singapore Math 철학에 기반하여 개발한 미국용 영재 수학 교재 시리즈입니다. 만화책 형식으로 구성된 Guide와 문제집인 Practice로 이루어져 있으며, 2~5학년을 대상으로 합니다.",
          "Singapore Math가 개념의 깊이를 다진다면, Beast Academy는 그 위에서 창의적 문제 해결과 수학적 토론 능력을 키웁니다. 두 교재가 함께 사용될 때 가장 효과적인 것도 이 때문입니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "What Is Singapore Math?",
        paragraphs: [
          "Singapore Math is a mathematics curriculum developed by Singapore's Ministry of Education in the 1980s. Since its introduction, Singapore has consistently ranked among the top nations in international math and science assessments (TIMSS). Impressed by these results, many U.S. school districts and gifted education programs have adopted it.",
          "The guiding philosophy is 'Teach Less, Learn More.' Rather than rushing through a wide range of topics, Singapore Math focuses deeply on fewer core concepts, ensuring students truly understand each idea before advancing.",
        ],
      },
      {
        heading: "The CPA Approach: Concrete, Pictorial, and Abstract",
        paragraphs: [
          "Singapore Math's signature teaching method is the CPA (Concrete-Pictorial-Abstract) progression. Students first explore concepts using physical objects, then represent them as pictures or diagrams, and finally work with abstract numbers and symbols.",
          "For example, when learning fractions, students first split physical objects (blocks, pizza), then draw diagrams of divided shapes, and only then write '1/2.' This ensures the abstract symbol is always tied to a real, understood concept.",
        ],
      },
      {
        heading: "The Bar Model for Visual Problem Solving",
        paragraphs: [
          "Another hallmark of Singapore Math is the Bar Model: a technique for drawing complex word problems as rectangular bars to make their structure visible.",
          "For example, 'Min has 12 more candies than Young, and together they have 48. How many does Min have?' can be solved visually with bars without any algebra. This method also builds the conceptual foundation for algebraic thinking in later grades.",
        ],
      },
      {
        heading: "How It Differs from Traditional U.S. Math",
        paragraphs: [
          "Traditional U.S. math instruction often prioritizes procedure first, teaching formulas and having students drill many repetitions. Students can become fast calculators without understanding why the methods work.",
          "Singapore Math inverts this. Students who deeply understand division can reconstruct the concept even if they forget a formula. This is why Singapore Math students tend to perform well on reasoning-based tests like CogAT and NNAT, and in competitions like AMC 8.",
        ],
      },
      {
        heading: "The Connection to Beast Academy",
        paragraphs: [
          "Beast Academy is a gifted math series for grades 2–5 created by Art of Problem Solving (AoPS), built on Singapore Math's foundational philosophy. It consists of comic-book-style Guide books and companion Practice workbooks that develop creative problem solving and mathematical discussion.",
          "If Singapore Math builds deep conceptual roots, Beast Academy grows creative reasoning on top of them. The two programs complement each other, which is why using them together produces the strongest results.",
        ],
      },
    ],
  },
  {
    slug: "math-competitions-fcps",
    publishedAt: "2025-05-15",
    readingMins: 6,
    category: "경시대회",
    categoryEn: "Competitions",
    titleKo: "FCPS 학생이 참가할 수 있는 수학 경시대회",
    titleEn: "Math Competitions Open to FCPS Students",
    descKo: "MOEMS, AMC 8, Math Kangaroo 등 Fairfax 지역 초등학생이 참가할 수 있는 주요 수학 경시대회를 정리했습니다. 각 대회의 수준, 일정, 참가 방법을 확인하세요.",
    descEn: "An overview of major math competitions available to FCPS elementary students, including MOEMS, AMC 8, Math League, and Math Kangaroo, with details on difficulty, timing, and how to participate.",
    bodyKo: [
      {
        heading: "왜 수학 경시대회에 참가하나요?",
        paragraphs: [
          "수학 경시대회는 학교 성적과는 다른 방식으로 학생의 수학적 사고력을 자극합니다. 정해진 공식이 없는 문제를 만나고, 다양한 풀이 방법을 탐구하며, 틀려도 괜찮은 환경에서 도전하는 경험이 학생의 수학적 자신감을 키웁니다.",
          "대회 결과 자체보다는 준비 과정에서 쌓이는 문제 해결 능력이 중요합니다. 많은 학교에서 MOEMS 성적을 AAP 심화 평가 포트폴리오에 포함하기도 합니다.",
        ],
      },
      {
        heading: "MOEMS, 초등학생에게 가장 접근하기 쉬운 경시대회",
        paragraphs: [
          "MOEMS(Math Olympiad for Elementary and Middle Schools)는 1977년 설립된 비영리 단체가 운영하는 경시대회로, 전 세계 170,000명 이상이 참가하는 대형 대회입니다. 4~6학년(Division E)과 4~8학년(Division M) 두 부문이 있습니다.",
          "매년 11월부터 3월까지 5회에 걸쳐 각각 30분, 5문제씩 출제됩니다. 학교나 외부 팀 단위로 참가하며, 팀당 최대 35명이 등록 가능합니다. 문제 수준은 기발하고 창의적인 사고를 요구하지만 초등학생도 충분히 도전할 수 있는 수준입니다. MOEMS 공식 웹사이트(moems.org)에서 과거 기출문제를 무료로 내려받을 수 있습니다.",
        ],
      },
      {
        heading: "AMC 8, 미국수학협회 공인 수학 경시대회",
        paragraphs: [
          "AMC 8(American Mathematics Competition 8)은 미국수학협회(MAA)가 주관하는 대회로, 8학년 이하 학생 전원이 참가할 수 있습니다. 매년 1월에 시행되며, 25문항, 40분이 주어집니다. 주관식 없이 전부 5지선다 객관식입니다.",
          "난이도는 MOEMS보다 높습니다. 특히 후반부 10문제는 상당한 수학적 창의성이 요구됩니다. 고득점자는 AMC 10/12 → AIME → USAMO로 이어지는 미국 수학 올림피아드 경로에 진입할 수 있어, 수학에 열정 있는 학생에게는 장기적인 목표가 됩니다.",
        ],
      },
      {
        heading: "Math Kangaroo로 경험하는 국제 수학 대회",
        paragraphs: [
          "Math Kangaroo는 1991년 프랑스에서 시작된 국제 수학 경시대회로, 현재 90개국 이상이 참가합니다. 매년 3월 셋째 목요일에 시행되며, K-12 전체 학년을 대상으로 학년별 난이도가 구분됩니다.",
          "각 학년에 맞는 30문항을 75분 안에 풀며, 참가 신청은 kangaroo.org에서 개인 단위로 할 수 있습니다. 참가비는 소정의 금액이 있으며, 전 세계 학생들과 비교할 수 있다는 점에서 흥미로운 경험이 됩니다.",
        ],
      },
      {
        heading: "언제부터 준비를 시작할까요?",
        paragraphs: [
          "MOEMS는 4학년부터 참가할 수 있으므로, 3학년 말부터 기출문제를 가볍게 접해보는 것이 좋습니다. AMC 8은 6학년 이상부터 실전 준비를 시작하는 것이 일반적입니다.",
          "어떤 대회든 벼락치기보다는 꾸준한 사고력 수학 훈련이 바탕이 되어야 합니다. Singapore Math와 Beast Academy로 개념 사고력을 키운 학생은 경시대회 준비에서도 확실한 유리함을 가져갑니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "Why Participate in Math Competitions?",
        paragraphs: [
          "Math competitions challenge students in ways that classroom assessments don't. Encountering unfamiliar problem types, exploring multiple solution paths, and taking risks in a low-stakes environment all build genuine mathematical confidence.",
          "The preparation process matters more than the results. Many schools also accept MOEMS scores as part of AAP portfolio evidence.",
        ],
      },
      {
        heading: "MOEMS, the Most Accessible Competition for Elementary Students",
        paragraphs: [
          "MOEMS (Math Olympiad for Elementary and Middle Schools) is run by a nonprofit founded in 1977, with over 170,000 participants worldwide. It has two divisions: Division E (grades 4–6) and Division M (grades 4–8).",
          "Students take five contests from November through March, each 30 minutes with 5 questions. Teams of up to 35 students register together through a school or outside group. Problems require creative thinking but are accessible to prepared elementary students. Past contests are available free at moems.org.",
        ],
      },
      {
        heading: "AMC 8, the Official National Math Competition",
        paragraphs: [
          "The AMC 8 (American Mathematics Competition 8), run by the Mathematical Association of America (MAA), is open to all students in 8th grade or below. Held each January, it consists of 25 multiple-choice questions in 40 minutes.",
          "Difficulty is higher than MOEMS, especially in the last 10 questions, which demand substantial mathematical creativity. High scorers can advance through the AMC 10/12 → AIME → USAMO pathway, making AMC 8 a meaningful long-term goal for mathematically passionate students.",
        ],
      },
      {
        heading: "Math Kangaroo as an International Competition Experience",
        paragraphs: [
          "Math Kangaroo began in France in 1991 and now runs in over 90 countries. Held annually on the third Thursday of March, it covers all grades K–12 with difficulty scaled by grade level.",
          "Students solve 30 questions in 75 minutes. Individual registration is available at kangaroo.org with a small participation fee. It's a unique opportunity to compare performance against students internationally.",
        ],
      },
      {
        heading: "When Should You Start Preparing?",
        paragraphs: [
          "MOEMS is open from 4th grade, so light exposure to past problems starting in late 3rd grade is a natural introduction. AMC 8 preparation typically begins seriously in 6th grade or later.",
          "For any competition, consistent mathematical reasoning training is the real foundation. Students who have built conceptual thinking through Singapore Math and Beast Academy carry a clear advantage into competition preparation.",
        ],
      },
    ],
  },
  {
    slug: "math-practice-at-home",
    publishedAt: "2025-05-15",
    readingMins: 5,
    category: "학습전략",
    categoryEn: "Study Tips",
    titleKo: "집에서 수학 실력을 쌓는 효과적인 방법 5가지",
    titleEn: "5 Evidence-Based Strategies for Building Math Skills at Home",
    descKo: "학원을 다니지 않아도 집에서 수학 실력을 꾸준히 키울 수 있는 방법 5가지를 연구 근거와 함께 소개합니다. 학부모가 바로 실천할 수 있는 구체적인 팁입니다.",
    descEn: "Five research-backed strategies parents can use at home to help their children build stronger math skills. No tutoring required to get started.",
    bodyKo: [
      {
        heading: "1. 짧게, 자주 반복하는 분산 학습의 힘",
        paragraphs: [
          "인지과학 연구에서 반복적으로 확인된 '분산 학습(Spaced Practice)' 효과가 있습니다. 주말에 2시간 몰아서 공부하는 것보다 매일 15~20분씩 꾸준히 연습하는 것이 장기 기억과 실력 향상에 훨씬 효과적입니다.",
          "실천 방법: 매일 저녁 식사 후 15분을 수학 연습 시간으로 고정하세요. IXL Math처럼 짧게 집중적으로 연습할 수 있는 도구를 활용하면 지속하기 쉽습니다.",
        ],
      },
      {
        heading: "2. 암산 능력 키우기",
        paragraphs: [
          "암산(Mental Math) 능력은 단순히 빠른 계산이 아닙니다. 수의 구조를 유연하게 다루는 능력을 키우며, 이는 대수(Algebra)와 문제 해결 능력의 기초가 됩니다. 여러 연구에서 암산 능력이 높은 학생이 복잡한 수학 문제에서도 더 높은 성취를 보인다는 결과가 있습니다.",
          "실천 방법: 차를 타고 이동할 때 가볍게 '235 + 78은 얼마일까?'처럼 물어보세요. 정답보다 어떻게 계산했는지 방법을 물어보는 것이 더 중요합니다.",
        ],
      },
      {
        heading: "3. 워드 프로블럼은 소리 내어 읽기",
        paragraphs: [
          "많은 학생들이 수학 연산은 잘 하면서도 워드 프로블럼에서 실수합니다. 이유는 대부분 수학 실력 부족이 아니라 독해 능력의 문제입니다. 문제를 소리 내어 읽으면 이해도가 높아지고, 중요한 정보와 불필요한 정보를 구분하는 능력이 자연스럽게 길러집니다.",
          "실천 방법: 숙제를 풀 때 워드 프로블럼은 반드시 소리 내어 읽게 하고, 문제에서 구하는 것이 무엇인지 스스로 말로 설명하게 해보세요.",
        ],
      },
      {
        heading: "4. 틀린 문제를 같이 분석하기",
        paragraphs: [
          "오답이 실력 향상의 가장 좋은 재료입니다. 틀린 문제를 그냥 넘기지 말고, 왜 틀렸는지 함께 분석해보세요. 계산 실수인지, 개념 이해 부족인지, 문제를 잘못 읽은 것인지 원인을 파악하면 같은 실수가 반복되지 않습니다.",
          "실천 방법: 시험지를 돌려받으면 틀린 문제만 다시 풀어보게 하세요. 그리고 어떤 부분에서 실수했는지 학생 스스로 말로 설명하게 하면 메타인지 능력도 함께 키워집니다.",
        ],
      },
      {
        heading: "5. 성장 마인드셋으로 키우는 수학 자신감",
        paragraphs: [
          "Stanford 대학의 심리학자 Carol Dweck 박사의 연구에 따르면, '나는 수학을 못 해'처럼 능력을 고정된 것으로 보는 학생(Fixed Mindset)보다 '아직은 어렵지만 연습하면 할 수 있어'처럼 노력으로 성장한다고 믿는 학생(Growth Mindset)이 장기적으로 더 높은 수학 성취를 보입니다.",
          "실천 방법: 아이가 수학을 어려워할 때 '원래 이런 거야, 괜찮아'보다 '지금은 어렵지, 그런데 어떤 부분이 어려웠어?'라고 구체적으로 물어보세요. 어려움을 인정하되 포기하지 않는 태도를 함께 만들어가는 것이 중요합니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "1. Short and Frequent: The Power of Spaced Practice",
        paragraphs: [
          "Cognitive science research consistently shows that distributed (spaced) practice outperforms massed practice for long-term retention. Practicing 15–20 minutes daily is far more effective than a single 2-hour session on the weekend.",
          "In practice: Set a fixed 15-minute math window each evening after dinner. Tools like IXL Math are designed for exactly this kind of short, focused daily practice.",
        ],
      },
      {
        heading: "2. Build Mental Math Ability",
        paragraphs: [
          "Mental math is not just about speed. It develops flexible number sense, which is the foundation for algebra and complex problem solving. Research shows students with stronger mental math skills tend to achieve higher on multi-step math problems.",
          "In practice: During car rides, ask casual questions like 'What's 235 plus 78?' Focus on the method they used, not just the answer. Discussing different calculation strategies is the real learning.",
        ],
      },
      {
        heading: "3. Read Word Problems Aloud",
        paragraphs: [
          "Many students who handle computation well still stumble on word problems, and the cause is usually comprehension rather than math ability. Reading problems aloud increases understanding and naturally trains students to identify what's being asked versus what's extra information.",
          "In practice: Require word problems to be read aloud during homework, and ask your child to say in their own words what the question is asking before they start solving.",
        ],
      },
      {
        heading: "4. Analyze Mistakes Together",
        paragraphs: [
          "Wrong answers are the best raw material for improvement. Rather than moving past incorrect problems, look at them together and identify the cause: a calculation slip, a concept gap, or misreading the question. Understanding why reduces repetition of the same mistakes.",
          "In practice: When a test comes back, have your child re-solve only the wrong problems and explain out loud where they went wrong. This also builds metacognitive skills alongside math ability.",
        ],
      },
      {
        heading: "5. 'Not Yet' and the Growth Mindset Approach",
        paragraphs: [
          "Stanford psychologist Carol Dweck's research shows that students who believe their ability is fixed ('I'm just not a math person') consistently underperform over time compared to students who believe ability grows with effort. The language used around math mistakes matters significantly.",
          "In practice: When your child struggles, instead of 'It's fine, this is just hard,' try 'This is tough right now. Which part felt hardest?' Acknowledging difficulty while maintaining forward momentum is the core of a growth mindset.",
        ],
      },
    ],
  },
  {
    slug: "summer-math-slide",
    publishedAt: "2026-07-28",
    readingMins: 6,
    category: "방학학습",
    categoryEn: "Summer Break",
    titleKo: "여름방학 수학 학습공백, 개학 전에 막는 방법",
    titleEn: "Preventing the Summer Math Slide Before School Starts",
    descKo: "여름방학 동안 수학 실력이 퇴보하는 'Summer Slide' 현상의 원인과 연구 근거, 그리고 개학 전 남은 몇 주 동안 학부모가 실천할 수 있는 구체적인 대비법을 정리했습니다.",
    descEn: "Why math skills fade faster than reading over summer break, what the research says, and practical steps parents can take in the final weeks before school starts.",
    bodyKo: [
      {
        heading: "여름 학습공백(Summer Slide)이란?",
        paragraphs: [
          "Duke University의 심리학자 Harris Cooper가 1996년 발표한 메타분석 연구는 여름방학 동안 학생들이 평균적으로 약 한 달 분량의 학습 내용을 잊어버린다는 사실을 보여주었습니다. 이후 여러 후속 연구에서도 비슷한 패턴이 반복적으로 확인되었는데, 특히 수학 연산 능력의 퇴보 폭이 읽기 능력보다 크게 나타났습니다.",
          "한 해의 손실은 크지 않아 보일 수 있지만, K-6 동안 매년 여름마다 조금씩 누적되면 학년이 올라갈수록 격차가 벌어집니다. 특히 전년도에 심화 내용을 다뤘던 학생이라면, 그 내용을 유지하지 못한 채 새 학년을 맞이하게 될 위험이 더 큽니다.",
        ],
      },
      {
        heading: "왜 수학이 유독 취약할까요?",
        paragraphs: [
          "읽기는 방학 중에도 비교적 자연스럽게 이어지는 경우가 많습니다. 도서관에 가거나, 재미로 책을 읽거나, 여행 중 표지판과 메뉴판을 읽는 등 일상 속에서 저절로 노출됩니다. 반면 수학은 아이가 스스로 나눗셈이나 분수 문제를 찾아서 풀어보는 경우가 드뭅니다.",
          "특히 연산이나 계산 절차처럼 '몸에 익혀야 하는' 스킬은 사용하지 않으면 상대적으로 빨리 무뎌집니다. 개념을 이해하는 것과 그 개념을 빠르고 정확하게 적용하는 것은 다른 문제이며, 후자는 꾸준한 연습이 없으면 특히 퇴보하기 쉽습니다.",
        ],
      },
      {
        heading: "개학 직후 교실에서는 무슨 일이 벌어질까요?",
        paragraphs: [
          "새 학년이 시작되면 교사들은 보통 몇 주간 전년도 핵심 내용을 복습하는 데 시간을 씁니다. 학급 전체가 이 복습 기간을 거치기 때문에, 여름 동안 감을 유지한 학생과 그렇지 못한 학생 사이의 체감 격차가 이 시기에 가장 크게 드러납니다.",
          "AAP나 심화반처럼 진도가 빠른 반일수록 복습에 할애하는 시간이 상대적으로 짧고, 곧바로 새 단원으로 넘어가는 경향이 있습니다. 학습공백이 있는 상태로 새 학년 첫 단원을 맞이하면, 개념이 아직 정리되지 않은 채로 더 어려운 내용을 쌓아 올리게 되는 셈입니다.",
        ],
      },
      {
        heading: "남은 여름 동안 할 수 있는 구체적인 방법",
        paragraphs: [
          "가장 효과적인 방법은 거창한 계획이 아니라 하루 15분 정도의 짧은 복습을 매일 반복하는 것입니다. 전년도 워크북의 마지막 한두 단원을 다시 펼쳐 보거나, 틀렸던 문제만 골라 다시 풀어보는 것만으로도 충분한 효과가 있습니다.",
          "마트에서 장을 보며 총 금액을 어림해보거나, 요리를 하며 계량 단위를 바꿔보는 등 일상 속에서 자연스럽게 수를 다루는 기회를 만들어 주는 것도 좋습니다. 여유가 있다면 새 학년 첫 단원 내용을 아주 가볍게 미리 살펴보는 것도 도움이 되지만, 이는 선행 학습이 아니라 '낯설지 않게 만드는' 예습 수준으로 접근하는 것이 중요합니다.",
        ],
      },
      {
        heading: "언제부터, 어떻게 시작해야 할까요?",
        paragraphs: [
          "개학까지 2~4주 정도 남은 지금이 학습 리듬을 되찾기에 가장 적절한 시점입니다. 개학 직전 며칠 동안 몰아서 복습하는 것보다, 지금부터 매일 조금씩 규칙적으로 연습하는 것이 실질적인 효과를 냅니다.",
          "중요한 것은 분량이 아니라 꾸준함입니다. 두꺼운 복습 워크북 한 권을 새로 사는 것보다, 이미 풀었던 문제집을 다시 펼쳐 짧고 일정한 리듬을 만드는 것이 개학 후 첫 몇 주를 훨씬 수월하게 만들어 줍니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "What Is the Summer Slide?",
        paragraphs: [
          "A 1996 meta-analysis by Duke University psychologist Harris Cooper found that students lose, on average, about one month's worth of learning over summer break. Follow-up studies since then have consistently confirmed the pattern, with math computation skills fading noticeably more than reading skills.",
          "A single summer's loss may seem small, but it compounds year after year across K-6, widening the gap as students move up in grade level. Students who covered advanced content the previous year are especially at risk of losing ground they haven't had a chance to solidify.",
        ],
      },
      {
        heading: "Why Is Math Especially Vulnerable?",
        paragraphs: [
          "Reading tends to continue somewhat naturally over the summer — through library visits, casual reading for fun, or simply encountering text while traveling. Math rarely gets this kind of incidental exposure; children don't typically seek out a division or fraction problem on their own.",
          "Procedural skills in particular — the kind that need to become second nature, like computation — fade relatively quickly without use. Understanding a concept and being able to apply it quickly and accurately are two different things, and the latter is especially prone to decline without regular practice.",
        ],
      },
      {
        heading: "What Happens in the Classroom Right After School Starts",
        paragraphs: [
          "When a new school year begins, teachers typically spend the first few weeks reviewing key content from the previous year. Because the whole class goes through this review period together, the gap between students who stayed sharp over the summer and those who didn't becomes most visible during this stretch.",
          "Faster-paced classes, such as AAP or advanced sections, tend to spend relatively less time on review before moving into new material. Starting a new grade's first unit with an existing learning gap means building harder content on top of concepts that haven't been fully reinforced yet.",
        ],
      },
      {
        heading: "What You Can Do With the Rest of the Summer",
        paragraphs: [
          "The most effective approach isn't an elaborate plan — it's 15 minutes of review, done consistently, every day. Revisiting the last unit or two of last year's workbook, or simply re-solving problems your child got wrong, is often enough to make a real difference.",
          "Everyday moments also offer natural opportunities: estimating a total while grocery shopping, or converting measurements while cooking. If there's time, a light preview of the new grade's first unit can help too — but this should feel like familiarization, not acceleration.",
        ],
      },
      {
        heading: "When and How to Start",
        paragraphs: [
          "With roughly 2 to 4 weeks left before school starts, now is the right time to rebuild a learning rhythm. Consistent daily practice starting now produces far better results than cramming in the final days before school begins.",
          "What matters is consistency, not volume. Reopening a workbook your child has already used and building a short, steady rhythm will make the first few weeks of the new school year noticeably easier than buying a brand-new, thick review book.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
