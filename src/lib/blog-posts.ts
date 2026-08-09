export type ScaleItem = {
  level: string;
  label: string;
  desc: string;
  tone?: "high" | "mid" | "low" | "neutral";
};
export type ScaleBlock = {
  type: "scale";
  items: ScaleItem[];
  note?: { tone: "myth" | "info"; text: string };
};

export type TableBlock = {
  type: "table";
  headers: string[];
  rows: { label: string; values: string[] }[];
};

export type ComparisonColumn = {
  label: string;
  tone?: "standard" | "advanced" | "neutral";
  points: string[];
};
export type ComparisonBlock = { type: "comparison"; columns: ComparisonColumn[] };

export type PathwayStep = { label: string; sublabel?: string; tone?: "standard" | "advanced" };
export type PathwayBlock = { type: "pathway"; steps: PathwayStep[]; finalLabel?: string };

export type ChecklistBlock = {
  type: "checklist";
  title?: string;
  items: { text: string; note?: string }[];
};

export type StatBlock = { type: "stat"; value: string; label: string; source?: string };

export type CalloutBlock =
  | {
      type: "callout";
      variant: "note";
      tone: "warning" | "tip" | "info";
      title?: string;
      text: string;
      linkHref?: string;
      linkLabel?: string;
    }
  | { type: "callout"; variant: "mythFact"; pairs: { myth: string; fact: string }[] };

export type BlogVisual =
  | ScaleBlock
  | TableBlock
  | ComparisonBlock
  | PathwayBlock
  | ChecklistBlock
  | StatBlock
  | CalloutBlock;

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  visual?: BlogVisual;
  visualPosition?: "before" | "after";
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
    slug: "fcps-report-card-guide",
    publishedAt: "2026-08-01",
    readingMins: 6,
    category: "성적표",
    categoryEn: "Report Cards",
    titleKo: "FCPS 초등학교 성적표 제대로 읽는 법",
    titleEn: "How to Read Your Child's FCPS Elementary Report Card",
    descKo: "버지니아 초등학교 성적표는 A·B·C가 아니라 1~4점 기준중심평가를 사용합니다. FCPS 성적표의 채점 방식, SOL 시험과의 차이, 그리고 학부모가 눈여겨봐야 할 부분을 정리했습니다.",
    descEn: "Virginia elementary report cards don't use A-B-C grades — FCPS scores students on a 1-4 standards-based scale. Here's how the scoring works, how it differs from the state SOL test, and what parents should actually look for.",
    bodyKo: [
      {
        heading: "성적표는 카운티마다 다릅니다",
        paragraphs: [
          "버지니아주는 학년별로 무엇을 배워야 하는지 정하는 SOL(Standards of Learning)이라는 공통 기준을 두고 있지만, 성적표를 어떻게 채점하고 표시할지는 각 카운티 교육청이 결정합니다. 따라서 다른 주나 다른 카운티에서 전학 온 가정이라면 FCPS 성적표가 낯설게 느껴질 수 있습니다.",
          "FCPS 초등학교(K-6)는 A·B·C 등급이 아니라 기준중심평가(Standards-Based Grading)라는 방식을 사용하며, 각 학습 영역을 1부터 4까지의 숫자로 표시합니다. 이 숫자 체계를 제대로 이해하는 것이 성적표를 읽는 첫걸음입니다.",
        ],
      },
      {
        heading: "1~4점은 A·B·C와 다릅니다",
        paragraphs: [
          "4점은 배운 내용을 거의 항상 정확하고 독립적으로 수행한다는 뜻이고, 3점은 대부분 이해하며 약간의 도움만 필요하다는 뜻입니다. 2점은 부분적으로 이해하며 어느 정도 도움이 필요하다는 의미이고, 1점은 이해가 부족해 상당한 도움이 필요하다는 뜻입니다. 아직 배우지 않은 내용은 NT(Not Taught)로 표시됩니다.",
          "학부모가 가장 많이 착각하는 부분은 이 숫자를 \"4=A, 3=B\" 식으로 바꿔 읽는 것입니다. 3점은 나쁜 성적이 아니라 대부분의 학생이 받는, 학년 수준을 잘 따라가고 있다는 점수입니다. 4점은 매우 안정적이고 독립적인 수행을 의미할 뿐, 모든 항목에서 4점을 받아야 한다는 뜻은 아닙니다.",
        ],
        visual: {
          type: "scale",
          items: [
            { level: "4", label: "정확·독립 수행", desc: "거의 항상 정확하고 독립적으로 수행", tone: "high" },
            { level: "3", label: "대부분 이해", desc: "약간의 도움만 필요 — 대다수 학생의 점수", tone: "mid" },
            { level: "2", label: "부분 이해", desc: "어느 정도 도움이 필요", tone: "mid" },
            { level: "1", label: "이해 부족", desc: "상당한 도움이 필요", tone: "low" },
            { level: "NT", label: "미학습", desc: "아직 배우지 않은 내용", tone: "neutral" },
          ],
          note: {
            tone: "myth",
            text: "가장 흔한 오해: \"4=A, 3=B\"로 바꿔 읽는 것. 3점은 나쁜 성적이 아니라 대다수 학생이 받는, 학년 수준을 잘 따라가는 점수입니다.",
          },
        },
      },
      {
        heading: "과목 하나에 점수 하나가 아닙니다",
        paragraphs: [
          "FCPS 성적표는 수학을 하나의 점수로 요약하지 않고, 수 개념·계산 능력·문장제 문제 해결·수학적 설명과 추론처럼 여러 세부 학습기준으로 나누어 각각 점수를 매깁니다. 언어 과목도 읽기 이해력, 어휘, 쓰기 등으로 나뉘어 표시됩니다.",
          "이 방식 덕분에 학부모는 아이가 어느 영역은 잘하고 어느 영역에서 도움이 필요한지 구체적으로 파악할 수 있습니다. 전체 평균이 아니라 각 줄의 점수를 개별적으로 살펴보는 것이 성적표를 제대로 읽는 방법입니다.",
        ],
      },
      {
        heading: "숙제 점수를 그냥 평균 내지 않습니다",
        paragraphs: [
          "FCPS 성적표는 숙제·퀴즈·단원평가 점수를 모두 더해 평균 내는 방식이 아닙니다. 교사는 교실 활동과 관찰, 과제와 프로젝트, 퀴즈와 단원평가, 구두 설명 능력 등 여러 자료를 종합해 판단하며, 특히 최근에 보여준 학습 수준을 더 비중 있게 반영하는 경우가 많습니다.",
          "즉 학기 초에 어려워했던 개념도 학기 말에 충분히 이해했다면 그 향상이 최종 성적에 반영될 수 있습니다. 학년 말 성적 역시 네 분기 점수의 단순 평균이 아니라, 학년이 끝나는 시점의 이해 수준을 중심으로 결정됩니다.",
        ],
      },
      {
        heading: "학업 점수와 학습 태도는 따로 봅니다",
        paragraphs: [
          "FCPS 성적표는 학업 성취도 옆에 지시를 잘 따르는지, 과제를 제때 완료하는지, 시간을 잘 관리하는지, 수업에 적극적으로 참여하는지 같은 학습 습관도 별도 항목으로 평가합니다. 두 영역은 독립적으로 채점되므로, 학업이 3점이라도 학습 태도는 개선이 필요하다고 표시될 수 있고 그 반대도 가능합니다.",
          "성적표를 볼 때는 학업 점수만 보지 말고 학습 태도 항목도 함께 확인하는 것이 좋습니다. 같은 학습 태도 항목이 여러 분기 연속으로 낮게 나온다면, 학업 점수와는 별개로 담임교사와 상담해볼 필요가 있습니다.",
        ],
      },
      {
        heading: "SOL 시험과는 어떻게 다르고, 무엇을 확인해야 할까요?",
        paragraphs: [
          "성적표의 1~4점과 별개로, FCPS는 대부분 3~8학년 학생을 대상으로 매년 봄 SOL(Standards of Learning) 시험을 치릅니다. 읽기와 수학은 3학년부터, 과학은 5학년부터 응시하며, 그 학년에서 배운 주 전체 공통 기준을 얼마나 이해했는지 확인하는 주정부 공식 평가입니다. 400점 이상이면 Pass, 500점 이상이면 Pass/Advanced로 표시되며, 채점 기준과 시행 주체 모두 분기 성적표와 다릅니다.",
          "전체 점수가 몇 개인지보다 중요한 것은 어떤 세부 학습기준에서 2점이나 1점이 나왔는지, 그리고 지난 분기보다 나아지고 있는지입니다. 같은 영역에서 2점이 두 분기 이상 이어지거나 1점이 나온다면 담임교사에게 구체적으로 어떤 기술을 보완해야 하는지, 집에서 어떻게 도와줄 수 있는지 물어보세요. 성적표와 SOL 점수는 모두 ParentVUE에서 분기마다 확인할 수 있습니다. AAP 학생도 동일한 1~4점 기준중심평가 체계를 사용하지만, 실제로 배우는 학습 내용과 기대 수준은 트랙에 따라 다르다는 점을 함께 기억해 두면 성적표를 더 정확하게 해석할 수 있습니다.",
        ],
        visual: {
          type: "table",
          headers: ["", "성적표 (Report Card)", "SOL 시험"],
          rows: [
            { label: "채점 방식", values: ["1~4점 기준중심평가", "400점 이상 Pass, 500점 이상 Pass/Advanced"] },
            { label: "시행 주체", values: ["담임교사, 분기별 평가", "버지니아주, 연 1회 봄 시행"] },
            { label: "대상 학년", values: ["K-6 전 학년", "읽기·수학 3학년+, 과학 5학년+"] },
          ],
        },
      },
    ],
    bodyEn: [
      {
        heading: "Report Cards Differ by County",
        paragraphs: [
          "Virginia sets a statewide standard for what students should learn at each grade level — the SOL (Standards of Learning) — but leaves it to each county school district to decide how report cards are scored and formatted. Families moving in from another state or county often find FCPS's report card format unfamiliar at first.",
          "FCPS elementary schools (K-6) don't use A-B-C letter grades. They use Standards-Based Grading, scoring each learning area on a 1-to-4 scale. Understanding this numeric system is the first step to reading the report card correctly.",
        ],
      },
      {
        heading: "1-4 Is Not the Same as A-B-C",
        paragraphs: [
          "A 4 means the student performs the skill accurately and independently almost every time. A 3 means the student understands and performs the skill most of the time, needing only minor support. A 2 means partial understanding with some support needed, and a 1 means the student needs substantial support. Content not yet covered that quarter is marked NT (Not Taught).",
          "The most common mistake parents make is mentally converting these numbers into letter grades — treating 4 as an A and 3 as a B. A 3 is not a bad score; it's what most students earn, and it means the child is solidly on pace for the grade level. A 4 signals very consistent, independent performance — it doesn't mean every score should be a 4.",
        ],
        visual: {
          type: "scale",
          items: [
            { level: "4", label: "Accurate & Independent", desc: "Performs the skill accurately and independently almost every time", tone: "high" },
            { level: "3", label: "Understands Most", desc: "Needs only minor support — what most students earn", tone: "mid" },
            { level: "2", label: "Partial Understanding", desc: "Needs some support", tone: "mid" },
            { level: "1", label: "Needs Support", desc: "Needs substantial support", tone: "low" },
            { level: "NT", label: "Not Taught", desc: "Content not yet covered this quarter", tone: "neutral" },
          ],
          note: {
            tone: "myth",
            text: "Common mistake: reading 4 as an A and 3 as a B. A 3 isn't a bad score — it's what most students earn, and it means solid grade-level progress.",
          },
        },
      },
      {
        heading: "One Subject, Several Scores",
        paragraphs: [
          "FCPS doesn't collapse math into a single score. It's broken into specific standards — number sense, computation, word-problem solving, mathematical reasoning and explanation — each scored separately. Language arts is broken down the same way, into reading comprehension, vocabulary, and writing.",
          "This lets parents see exactly where a child is strong and where they need support, rather than reading one average number. The right way to read the report card is line by line, not as a single overall score.",
        ],
      },
      {
        heading: "Scores Aren't a Simple Average of Homework",
        paragraphs: [
          "FCPS report card scores aren't calculated by averaging every homework assignment, quiz, and unit test together. Teachers weigh a combination of classroom work and observation, assignments and projects, quizzes and unit tests, and a student's ability to explain their reasoning aloud — and more recent evidence of learning is often weighted more heavily.",
          "That means a concept a child struggled with early in the quarter can still be reflected as strong if they've clearly mastered it by the end. The year-end grade, similarly, isn't a plain average of all four quarters — it reflects the student's level of understanding as of the end of the year.",
        ],
      },
      {
        heading: "Academic Scores and Work Habits Are Reported Separately",
        paragraphs: [
          "Alongside academic scores, FCPS report cards separately evaluate work habits — following directions, completing assignments on time, managing time well, and participating actively in class. These are scored independently, so a student can earn a 3 academically while work habits show room for improvement, or the reverse.",
          "When reviewing a report card, check the work habits section as well as academic scores. If the same work-habit item stays low across multiple quarters, it's worth raising with the teacher separately from academic performance.",
        ],
      },
      {
        heading: "How Does This Differ From the SOL Test, and What Should Parents Actually Check?",
        paragraphs: [
          "Separate from the 1-4 quarterly scores, FCPS students in most grades 3-8 take the SOL (Standards of Learning) test each spring — reading and math starting in 3rd grade, science starting in 5th. This is the official state assessment of how well a student has mastered that grade's statewide standards. A score of 400 or above is a Pass, and 500 or above is Pass/Advanced; both the scoring method and the administering body differ from the quarterly report card.",
          "What matters more than the total number of scores is which specific standards show a 2 or a 1, and whether those areas are improving quarter over quarter. If the same area shows a 2 for two or more quarters in a row, or a 1 appears, ask the teacher specifically which skills need work and how you can help at home. Both report card scores and SOL results are available each quarter through ParentVUE. AAP students use the same 1-4 standards-based system, but the actual content taught and expectations differ by track — worth keeping in mind when interpreting the report card.",
        ],
        visual: {
          type: "table",
          headers: ["", "Report Card", "SOL Test"],
          rows: [
            { label: "Scoring", values: ["1-4 standards-based scale", "400+ = Pass, 500+ = Pass/Advanced"] },
            { label: "Administered by", values: ["Classroom teacher, each quarter", "State of Virginia, once each spring"] },
            { label: "Grades covered", values: ["All of K-6", "Reading & math from 3rd+, science from 5th+"] },
          ],
        },
      },
    ],
  },
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
        visual: {
          type: "comparison",
          columns: [
            { label: "일반(Standard)", tone: "standard", points: ["학년 수준의 Virginia SOL을 따라감", "예: 4학년 → 4학년 SOL"] },
            { label: "AAP(심화)", tone: "advanced", points: ["한 학년 높은 내용을 학습", "예: 4학년 AAP → 5학년 SOL"] },
          ],
        },
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
        visual: {
          type: "checklist",
          title: "배치 평가 요소",
          items: [
            { text: "NGAT(Naglieri General Ability Test) 점수" },
            { text: "학업 성적(GPA)" },
            { text: "교사 평가서" },
            { text: "학부모 추천서", note: "지원 마감: 전년도 12월 중순" },
          ],
        },
      },
      {
        heading: "초등 AAP 수학이 중학교 이후 경로에 미치는 영향",
        paragraphs: [
          "초등 AAP 수학을 꾸준히 이수한 학생은 중학교에서 더 빠른 수학 경로를 밟을 수 있습니다. FCPS 기준으로, 6학년에 7학년 수준의 수학을 이수한 학생은 7학년에 Pre-Algebra, 8학년에 Algebra I를 수강하게 됩니다.",
          "이 경로를 따라가면 고등학교에서 AP Calculus AB 또는 BC를 수강할 수 있는 기반이 마련됩니다. 많은 대학에서 AP Calculus 이수 여부를 이공계 전공 지원 시 중요하게 봅니다. 초등학교의 수학 배치가 결국 대학 입시까지 영향을 미칠 수 있다는 점에서 조기에 준비하는 것이 중요합니다.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "6학년", sublabel: "7학년 수학 이수" },
            { label: "7학년", sublabel: "Pre-Algebra" },
            { label: "8학년", sublabel: "Algebra I" },
          ],
          finalLabel: "AP Calculus",
        },
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
        visual: {
          type: "comparison",
          columns: [
            { label: "Standard", tone: "standard", points: ["Follows the grade-level Virginia SOL", "e.g. 4th grade → 4th-grade SOL"] },
            { label: "AAP (Advanced)", tone: "advanced", points: ["Covers content one grade ahead", "e.g. 4th-grade AAP → 5th-grade SOL"] },
          ],
        },
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
        visual: {
          type: "checklist",
          title: "What Placement Considers",
          items: [
            { text: "NGAT (Naglieri General Ability Test) score" },
            { text: "Academic grades (GPA)" },
            { text: "Teacher evaluation" },
            { text: "Parent recommendation", note: "Application deadline: mid-December" },
          ],
        },
      },
      {
        heading: "Why AAP Math Matters for the Long-Term Pathway",
        paragraphs: [
          "Students who complete the elementary AAP math track consistently enter a faster math sequence in middle school. Under the FCPS pathway, a student who completes 7th-grade-level math in 6th grade proceeds to Pre-Algebra in 7th grade and Algebra I in 8th grade.",
          "This trajectory makes AP Calculus AB or BC achievable in high school, a credential that carries weight for STEM college admissions. Elementary math placement has compounding effects that reach well beyond elementary school.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "6th Grade", sublabel: "7th-grade math" },
            { label: "7th Grade", sublabel: "Pre-Algebra" },
            { label: "8th Grade", sublabel: "Algebra I" },
          ],
          finalLabel: "AP Calculus",
        },
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
        visual: {
          type: "comparison",
          columns: [
            { label: "이전 (CogAT·NNAT)", tone: "standard", points: ["2학년 전체 CogAT 실시", "1학년 전체 NNAT 실시", "영역별 별개 시험"] },
            { label: "현재 (NGAT)", tone: "advanced", points: ["2~7학년 스크리닝에 단일 시험 활용", "Verbal·Nonverbal·Quantitative 통합"] },
          ],
        },
      },
      {
        heading: "세 가지 영역: Verbal·Nonverbal·Quantitative",
        paragraphs: [
          "Verbal(언어) 영역은 여섯 개의 그림 중 다섯 개가 공유하는 개념을 찾아내는 방식으로 언어적 개념을 측정하며, 문장이 아닌 그림으로 제시되어 언어 배경에 관계없이 공정하게 평가할 수 있도록 설계되었습니다. Nonverbal(비언어) 영역은 도형, 색상, 순서, 방향 등 시각적 패턴 사이의 논리적 관계를 파악하는 능력을 측정합니다.",
          "Quantitative(수량) 영역은 숫자와 기호 사이의 관계를 다루며, 단순 연산 실력이 아니라 수학적으로 사고하는 방식을 평가합니다. 세 영역 모두 학교에서 배운 교과 지식보다는 순수한 추론 능력에 초점을 맞춘다는 점은 이전 CogAT·NNAT 체계와 같습니다.",
        ],
        visual: {
          type: "table",
          headers: ["", "측정 대상", "형식"],
          rows: [
            { label: "Verbal", values: ["언어적 개념 이해", "6개 그림 중 5개의 공통 개념 찾기"] },
            { label: "Nonverbal", values: ["도형·공간 패턴 논리", "매트릭스 패턴 추론"] },
            { label: "Quantitative", values: ["수량·기호 관계, 수학적 사고", "숫자·기호 관계 문제"] },
          ],
        },
      },
      {
        heading: "점수는 어떻게 계산되나요?",
        paragraphs: [
          "NGAT 결과는 NAI(Naglieri Ability Index)라는 표준화 점수와 백분위(Percentile Rank)로 제공됩니다. NAI는 같은 연령대 학생들과 비교한 점수로, 평균이 100이며 대다수 학생은 85~115 사이에 분포합니다. 백분위 99는 동일 연령대 100명 중 상위 1등이라는 의미입니다.",
          "FCPS에서 풀타임 AAP(Level IV) 배치는 일반적으로 상위 3~5% 이내의 점수가 요구되지만, 점수만으로 결정되지 않고 교사 평가, 학업 성취도 등을 종합적으로 반영합니다.",
        ],
        visual: {
          type: "stat",
          value: "상위 3~5%",
          label: "FCPS 풀타임 AAP(Level IV) 배치 기준",
          source: "NAI 평균 100, 대다수 85~115 분포 (백분위 99 = 상위 1%)",
        },
        visualPosition: "before",
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
        visual: {
          type: "comparison",
          columns: [
            { label: "Before (CogAT + NNAT)", tone: "standard", points: ["All 2nd graders took CogAT", "All 1st graders took NNAT", "Separate tests by grade"] },
            { label: "Now (NGAT)", tone: "advanced", points: ["Single test used for grades 2-7 screening", "Verbal, Nonverbal & Quantitative combined"] },
          ],
        },
      },
      {
        heading: "Three Sections: Verbal, Nonverbal, and Quantitative",
        paragraphs: [
          "The Verbal section presents six pictures and asks students to identify the concept shared by five of them, measuring verbal reasoning through images rather than written or spoken language — a design meant to be fair across language backgrounds. The Nonverbal section measures logical reasoning through shapes, colors, sequences, and orientation in matrix-style patterns.",
          "The Quantitative section evaluates relationships between numbers and symbols, focusing on how a student thinks mathematically rather than computational speed. As with the previous CogAT/NNAT system, all three sections prioritize pure reasoning over classroom content.",
        ],
        visual: {
          type: "table",
          headers: ["", "What It Measures", "Format"],
          rows: [
            { label: "Verbal", values: ["Verbal reasoning concepts", "Identify the shared concept among 5 of 6 pictures"] },
            { label: "Nonverbal", values: ["Logical reasoning in visual patterns", "Matrix-style shape/pattern problems"] },
            { label: "Quantitative", values: ["Mathematical thinking, number relationships", "Number & symbol relationship problems"] },
          ],
        },
      },
      {
        heading: "How Are Scores Calculated?",
        paragraphs: [
          "NGAT results are reported as a Naglieri Ability Index (NAI) and a Percentile Rank. The NAI compares a student to same-age peers, with an average of 100; most students score between 85 and 115. A 99th percentile means a student scored higher than 99 out of 100 same-age peers.",
          "Full-time AAP (Level IV) placement in FCPS typically requires scores in roughly the top 3–5%, but scores are never the sole deciding factor. Teacher evaluations and academic performance are also weighed.",
        ],
        visual: {
          type: "stat",
          value: "Top 3-5%",
          label: "Typical threshold for full-time AAP (Level IV) placement",
          source: "NAI average is 100; most students score 85-115 (99th percentile = top 1%)",
        },
        visualPosition: "before",
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
        visual: {
          type: "pathway",
          steps: [
            { label: "구체(Concrete)", sublabel: "실물 조작" },
            { label: "그림(Pictorial)", sublabel: "도식·그림 표현" },
            { label: "추상(Abstract)", sublabel: "숫자·기호" },
          ],
        },
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
        visual: {
          type: "comparison",
          columns: [
            { label: "전통적 미국 수학", tone: "standard", points: ["공식·절차를 먼저 학습", "반복 연산으로 계산 속도 향상", "'왜'는 이해 못하는 경우가 많음"] },
            { label: "Singapore Math", tone: "advanced", points: ["'왜'를 먼저 완전히 이해", "개념을 잊어도 스스로 재유도 가능", "추론 시험·경시대회에 강함"] },
          ],
        },
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
        visual: {
          type: "pathway",
          steps: [
            { label: "Concrete", sublabel: "Physical objects" },
            { label: "Pictorial", sublabel: "Pictures & diagrams" },
            { label: "Abstract", sublabel: "Numbers & symbols" },
          ],
        },
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
        visual: {
          type: "comparison",
          columns: [
            { label: "Traditional U.S. Math", tone: "standard", points: ["Procedure and formulas taught first", "Fast calculation through repetition", "Often lacks understanding of 'why'"] },
            { label: "Singapore Math", tone: "advanced", points: ["'Why' is understood first, deeply", "Concepts can be reconstructed even if forgotten", "Stronger performance on reasoning tests & competitions"] },
          ],
        },
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
        visual: {
          type: "pathway",
          steps: [{ label: "AMC 8" }, { label: "AMC 10/12" }, { label: "AIME" }],
          finalLabel: "USAMO",
        },
      },
      {
        heading: "Math Kangaroo로 경험하는 국제 수학 대회",
        paragraphs: [
          "Math Kangaroo는 1991년 프랑스에서 시작된 국제 수학 경시대회로, 현재 90개국 이상이 참가합니다. 매년 3월 셋째 목요일에 시행되며, K-12 전체 학년을 대상으로 학년별 난이도가 구분됩니다.",
          "각 학년에 맞는 30문항을 75분 안에 풀며, 참가 신청은 kangaroo.org에서 개인 단위로 할 수 있습니다. 참가비는 소정의 금액이 있으며, 전 세계 학생들과 비교할 수 있다는 점에서 흥미로운 경험이 됩니다.",
        ],
        visual: {
          type: "table",
          headers: ["", "MOEMS", "AMC 8", "Math Kangaroo"],
          rows: [
            { label: "대상 학년", values: ["4-6학년(E) / 4-8학년(M)", "8학년 이하", "K-12 전 학년"] },
            { label: "형식", values: ["5회 × 30분 × 5문제", "25문항, 40분 객관식", "30문항, 75분"] },
            { label: "시행 시기", values: ["11월~3월(5회)", "매년 1월", "3월 셋째 목요일"] },
            { label: "난이도", values: ["창의적이나 접근 용이", "후반부 상당한 창의성 요구", "학년별 난이도 조정"] },
          ],
        },
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
        visual: {
          type: "pathway",
          steps: [{ label: "AMC 8" }, { label: "AMC 10/12" }, { label: "AIME" }],
          finalLabel: "USAMO",
        },
      },
      {
        heading: "Math Kangaroo as an International Competition Experience",
        paragraphs: [
          "Math Kangaroo began in France in 1991 and now runs in over 90 countries. Held annually on the third Thursday of March, it covers all grades K–12 with difficulty scaled by grade level.",
          "Students solve 30 questions in 75 minutes. Individual registration is available at kangaroo.org with a small participation fee. It's a unique opportunity to compare performance against students internationally.",
        ],
        visual: {
          type: "table",
          headers: ["", "MOEMS", "AMC 8", "Math Kangaroo"],
          rows: [
            { label: "Grades", values: ["4-6 (Div E) / 4-8 (Div M)", "8th grade or below", "K-12, all grades"] },
            { label: "Format", values: ["5 contests × 30 min × 5 questions", "25 questions, 40 min, multiple-choice", "30 questions, 75 min"] },
            { label: "Timing", values: ["Nov-Mar (5 contests)", "Every January", "3rd Thursday of March"] },
            { label: "Difficulty", values: ["Creative but accessible", "Last 10 questions demand real creativity", "Difficulty scaled by grade"] },
          ],
        },
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
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "매일 저녁 식사 후 15분을 수학 연습 시간으로 고정하세요. IXL Math처럼 짧게 집중적으로 연습할 수 있는 도구를 활용하면 지속하기 쉽습니다.",
        },
      },
      {
        heading: "2. 암산 능력 키우기",
        paragraphs: [
          "암산(Mental Math) 능력은 단순히 빠른 계산이 아닙니다. 수의 구조를 유연하게 다루는 능력을 키우며, 이는 대수(Algebra)와 문제 해결 능력의 기초가 됩니다. 여러 연구에서 암산 능력이 높은 학생이 복잡한 수학 문제에서도 더 높은 성취를 보인다는 결과가 있습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "차를 타고 이동할 때 가볍게 '235 + 78은 얼마일까?'처럼 물어보세요. 정답보다 어떻게 계산했는지 방법을 물어보는 것이 더 중요합니다.",
        },
      },
      {
        heading: "3. 워드 프로블럼은 소리 내어 읽기",
        paragraphs: [
          "많은 학생들이 수학 연산은 잘 하면서도 워드 프로블럼에서 실수합니다. 이유는 대부분 수학 실력 부족이 아니라 독해 능력의 문제입니다. 문제를 소리 내어 읽으면 이해도가 높아지고, 중요한 정보와 불필요한 정보를 구분하는 능력이 자연스럽게 길러집니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "숙제를 풀 때 워드 프로블럼은 반드시 소리 내어 읽게 하고, 문제에서 구하는 것이 무엇인지 스스로 말로 설명하게 해보세요.",
        },
      },
      {
        heading: "4. 틀린 문제를 같이 분석하기",
        paragraphs: [
          "오답이 실력 향상의 가장 좋은 재료입니다. 틀린 문제를 그냥 넘기지 말고, 왜 틀렸는지 함께 분석해보세요. 계산 실수인지, 개념 이해 부족인지, 문제를 잘못 읽은 것인지 원인을 파악하면 같은 실수가 반복되지 않습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "시험지를 돌려받으면 틀린 문제만 다시 풀어보게 하세요. 그리고 어떤 부분에서 실수했는지 학생 스스로 말로 설명하게 하면 메타인지 능력도 함께 키워집니다.",
        },
      },
      {
        heading: "5. 성장 마인드셋으로 키우는 수학 자신감",
        paragraphs: [
          "Stanford 대학의 심리학자 Carol Dweck 박사의 연구에 따르면, '나는 수학을 못 해'처럼 능력을 고정된 것으로 보는 학생(Fixed Mindset)보다 '아직은 어렵지만 연습하면 할 수 있어'처럼 노력으로 성장한다고 믿는 학생(Growth Mindset)이 장기적으로 더 높은 수학 성취를 보입니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "아이가 수학을 어려워할 때 '원래 이런 거야, 괜찮아'보다 '지금은 어렵지, 그런데 어떤 부분이 어려웠어?'라고 구체적으로 물어보세요. 어려움을 인정하되 포기하지 않는 태도를 함께 만들어가는 것이 중요합니다.",
        },
      },
    ],
    bodyEn: [
      {
        heading: "1. Short and Frequent: The Power of Spaced Practice",
        paragraphs: [
          "Cognitive science research consistently shows that distributed (spaced) practice outperforms massed practice for long-term retention. Practicing 15–20 minutes daily is far more effective than a single 2-hour session on the weekend.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "In Practice",
          text: "Set a fixed 15-minute math window each evening after dinner. Tools like IXL Math are designed for exactly this kind of short, focused daily practice.",
        },
      },
      {
        heading: "2. Build Mental Math Ability",
        paragraphs: [
          "Mental math is not just about speed. It develops flexible number sense, which is the foundation for algebra and complex problem solving. Research shows students with stronger mental math skills tend to achieve higher on multi-step math problems.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "In Practice",
          text: "During car rides, ask casual questions like 'What's 235 plus 78?' Focus on the method they used, not just the answer. Discussing different calculation strategies is the real learning.",
        },
      },
      {
        heading: "3. Read Word Problems Aloud",
        paragraphs: [
          "Many students who handle computation well still stumble on word problems, and the cause is usually comprehension rather than math ability. Reading problems aloud increases understanding and naturally trains students to identify what's being asked versus what's extra information.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "In Practice",
          text: "Require word problems to be read aloud during homework, and ask your child to say in their own words what the question is asking before they start solving.",
        },
      },
      {
        heading: "4. Analyze Mistakes Together",
        paragraphs: [
          "Wrong answers are the best raw material for improvement. Rather than moving past incorrect problems, look at them together and identify the cause: a calculation slip, a concept gap, or misreading the question. Understanding why reduces repetition of the same mistakes.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "In Practice",
          text: "When a test comes back, have your child re-solve only the wrong problems and explain out loud where they went wrong. This also builds metacognitive skills alongside math ability.",
        },
      },
      {
        heading: "5. 'Not Yet' and the Growth Mindset Approach",
        paragraphs: [
          "Stanford psychologist Carol Dweck's research shows that students who believe their ability is fixed ('I'm just not a math person') consistently underperform over time compared to students who believe ability grows with effort. The language used around math mistakes matters significantly.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "In Practice",
          text: "When your child struggles, instead of 'It's fine, this is just hard,' try 'This is tough right now. Which part felt hardest?' Acknowledging difficulty while maintaining forward momentum is the core of a growth mindset.",
        },
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
        visual: {
          type: "stat",
          value: "약 한 달",
          label: "여름방학 동안 평균 학습 손실",
          source: "Harris Cooper, Duke University, 1996 메타분석",
        },
        visualPosition: "before",
      },
      {
        heading: "왜 수학이 유독 취약할까요?",
        paragraphs: [
          "읽기는 방학 중에도 비교적 자연스럽게 이어지는 경우가 많습니다. 도서관에 가거나, 재미로 책을 읽거나, 여행 중 표지판과 메뉴판을 읽는 등 일상 속에서 저절로 노출됩니다. 반면 수학은 아이가 스스로 나눗셈이나 분수 문제를 찾아서 풀어보는 경우가 드뭅니다.",
          "특히 연산이나 계산 절차처럼 '몸에 익혀야 하는' 스킬은 사용하지 않으면 상대적으로 빨리 무뎌집니다. 개념을 이해하는 것과 그 개념을 빠르고 정확하게 적용하는 것은 다른 문제이며, 후자는 꾸준한 연습이 없으면 특히 퇴보하기 쉽습니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "읽기", points: ["도서관·여행 등 일상 속에서 자연스럽게 노출", "방학 중에도 비교적 유지되는 편"] },
            { label: "수학", points: ["아이가 스스로 찾아 풀어보는 경우가 드묾", "연산 등 절차 기술은 안 쓰면 빠르게 무뎌짐"] },
          ],
        },
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
        visual: {
          type: "checklist",
          title: "개학까지 2~4주 남았다면",
          items: [
            { text: "전년도 워크북 마지막 1~2단원 복습" },
            { text: "틀렸던 문제만 골라 재풀이" },
            { text: "장보기하며 총액 어림셈" },
            { text: "요리하며 계량 단위 변환" },
            { text: "(여유 있다면) 새 학년 첫 단원 가볍게 예습" },
          ],
        },
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
        visual: {
          type: "stat",
          value: "About One Month",
          label: "Average learning loss over summer break",
          source: "Harris Cooper, Duke University, 1996 meta-analysis",
        },
        visualPosition: "before",
      },
      {
        heading: "Why Is Math Especially Vulnerable?",
        paragraphs: [
          "Reading tends to continue somewhat naturally over the summer — through library visits, casual reading for fun, or simply encountering text while traveling. Math rarely gets this kind of incidental exposure; children don't typically seek out a division or fraction problem on their own.",
          "Procedural skills in particular — the kind that need to become second nature, like computation — fade relatively quickly without use. Understanding a concept and being able to apply it quickly and accurately are two different things, and the latter is especially prone to decline without regular practice.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "Reading", points: ["Natural exposure through libraries, travel, daily life", "Tends to hold up fairly well over the break"] },
            { label: "Math", points: ["Children rarely seek out problems on their own", "Procedural skills fade quickly without use"] },
          ],
        },
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
        visual: {
          type: "checklist",
          title: "With 2-4 Weeks Left Before School",
          items: [
            { text: "Review the last 1-2 units of last year's workbook" },
            { text: "Re-solve problems your child got wrong" },
            { text: "Estimate totals while grocery shopping" },
            { text: "Convert measurements while cooking" },
            { text: "(If time allows) Lightly preview the new grade's first unit" },
          ],
        },
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
  {
    slug: "back-to-school-checklist",
    publishedAt: "2026-08-08",
    readingMins: 6,
    category: "새학기 준비",
    categoryEn: "Back to School",
    titleKo: "새 학년 개학 전, 학부모가 챙겨야 할 체크리스트",
    titleEn: "The Back-to-School Checklist Every Parent Should Run Through",
    descKo: "개학까지 몇 주 남지 않은 지금, 담임교사 확인부터 수학 감 되찾기, 생활 리듬 재조정까지 학부모가 놓치기 쉬운 준비 사항을 체크리스트로 정리했습니다.",
    descEn: "With just a few weeks left before school starts, here's a practical checklist covering everything from confirming your child's teacher to resetting sleep schedules and brushing up on math.",
    bodyKo: [
      {
        heading: "개학까지 남은 시간, 지금부터 무엇을 챙겨야 할까",
        paragraphs: [
          "여름방학이 끝을 향해 갈수록 학부모들의 마음은 바빠집니다. 학용품을 사야 하는지, 담임교사는 누구인지, 생활 리듬은 언제부터 되돌려야 하는지 한꺼번에 떠오르지만 정작 무엇부터 시작해야 할지 막막할 때가 많습니다. 각 학교의 정확한 개학일과 학사일정은 학군 및 학교마다 다르므로, FCPS 학부모라면 재학 중인 학교 홈페이지나 ParentVUE 공지사항에서 먼저 확인하는 것이 순서입니다.",
          "개학을 2~4주 앞둔 이 시기는 서두르지 않고도 하나씩 준비할 수 있는 여유가 남아 있는 골든타임입니다. 이 글에서는 학사 정보 확인부터 수학 감 되찾기, 생활 리듬 조정, 서류 준비, 아이의 마음 챙기기까지 학부모가 순서대로 점검하면 좋은 다섯 가지 항목을 정리했습니다.",
        ],
        visual: {
          type: "checklist",
          title: "다섯 가지 준비 영역",
          items: [
            { text: "학사 정보 확인 (ParentVUE)" },
            { text: "수학 감 되찾기" },
            { text: "생활 리듬 재조정" },
            { text: "학용품·서류 준비" },
            { text: "아이의 마음 챙기기" },
          ],
        },
      },
      {
        heading: "ParentVUE로 확인하는 새 학년 정보",
        paragraphs: [
          "새 학년이 다가오면 FCPS는 보통 개학 1~2주 전 즈음 ParentVUE를 통해 담임교사 배정 정보를 공개합니다. 정확한 공개 시점은 학교마다 다를 수 있으므로, 개학이 가까워지면 며칠에 한 번씩 ParentVUE를 확인해보는 것이 좋습니다. 담임교사를 미리 알면 아이와 함께 이름을 불러보고 마음의 준비를 시키는 데 도움이 됩니다.",
          "ParentVUE에는 담임교사 정보 외에도 새 학년 시간표, 학용품 목록(School Supply List), 방과후 프로그램 안내 등이 함께 올라오는 경우가 많습니다. 학교마다 요구하는 학용품 목록이 다르므로, 작년에 쓰던 목록을 그대로 참고하기보다는 반드시 올해 목록을 새로 확인하는 것이 안전합니다.",
        ],
      },
      {
        heading: "수학 감 되찾기: 짧고 굵게",
        paragraphs: [
          "여름 동안 수학과 멀어졌다면, 개학 전 남은 몇 주를 활용해 감을 되찾아 두는 것이 좋습니다. 거창한 계획보다는 전년도 워크북의 마지막 한두 단원을 다시 펼쳐보거나, 틀렸던 문제만 골라 다시 풀어보는 정도로 충분합니다. 하루 15분씩이라도 매일 반복하면 개학 첫 주에 느끼는 부담이 눈에 띄게 줄어듭니다.",
          "여유가 있다면 새 학년 첫 단원 내용을 아주 가볍게 미리 살펴보는 것도 도움이 됩니다. 이때 중요한 것은 선행 학습이 아니라 '낯설지 않게 만드는' 예습 수준으로 접근하는 것입니다. 여름방학 학습공백에 대해 더 자세히 알고 싶다면 저희 블로그의 '여름방학 수학 학습공백' 글을 함께 참고하세요.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          text: "여름방학 동안 수학 실력이 왜, 얼마나 퇴보하는지 더 자세히 알고 싶다면 아래 글을 참고하세요.",
          linkHref: "/blog/summer-math-slide",
          linkLabel: "여름방학 수학 학습공백 자세히 보기",
        },
      },
      {
        heading: "생활 리듬 재조정하기",
        paragraphs: [
          "방학 동안 늦게 자고 늦게 일어나는 습관이 굳어졌다면, 개학 1~2주 전부터 서서히 되돌려 놓는 것이 좋습니다. 하루 만에 취침·기상 시간을 학기 중 스케줄로 바꾸려 하면 아이도 부모도 스트레스를 받기 쉽습니다. 며칠에 걸쳐 15~30분씩 앞당기는 방식이 훨씬 수월합니다.",
          "아침 루틴도 함께 연습해두면 좋습니다. 등교 준비에 걸리는 시간, 아침 식사 시간을 미리 가늠해보고 알람 시간을 정해두면 개학 첫날 허둥대는 상황을 줄일 수 있습니다. 특히 스쿨버스를 이용하는 가정이라면 정류장까지 걸어가는 시간까지 미리 계산해두는 것이 안전합니다.",
        ],
      },
      {
        heading: "학용품·서류 체크리스트",
        paragraphs: [
          "학용품 외에도 개학 전 챙겨야 할 서류가 은근히 많습니다. 버지니아주는 K학년과 새로 전학 온 학생에게 예방접종 기록(Immunization Records) 제출을 요구하며, 미제출 시 등교가 제한될 수 있으므로 미리 확인해두는 것이 안전합니다. 소아과 예약이 밀릴 수 있는 시기이므로 서둘러 일정을 잡는 것이 좋습니다.",
          "방과전후 돌봄 프로그램(Before/After School Care)을 이용할 계획이라면 신청 마감일을 놓치지 않는 것도 중요합니다. 인기 있는 프로그램은 개학 전에 정원이 마감되는 경우도 있으므로, 필요하다면 여름방학 중에 미리 신청해 두는 것이 좋습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "warning",
          title: "예방접종 기록 필수",
          text: "버지니아주는 K학년과 새로 전학 온 학생에게 예방접종 기록 제출을 요구합니다. 미제출 시 등교가 제한될 수 있으니 미리 확인하세요.",
        },
      },
      {
        heading: "새 학년 첫 주, 아이의 마음 다독이기",
        paragraphs: [
          "준비물과 일정을 아무리 꼼꼼히 챙겨도, 아이 마음속에는 새 선생님과 새 친구에 대한 막연한 긴장감이 남아있을 수 있습니다. \"새 선생님은 어떤 분일까 궁금하다\", \"작년 친구랑 같은 반이 아닐 수도 있어\"처럼 있을 수 있는 상황을 미리 담담하게 이야기해두면, 아이가 실제로 그 상황을 마주했을 때 훨씬 덜 당황합니다.",
          "첫 주에는 학업보다 적응이 우선입니다. 학교에서 돌아온 아이에게 \"오늘 뭐 배웠어?\"보다는 \"오늘 제일 재미있었던 순간이 뭐였어?\"처럼 구체적으로 물어보면 아이가 훨씬 편하게 이야기를 시작합니다. 며칠간 아이의 표정과 말수를 유심히 지켜보면서 적응 상태를 파악하는 것이, 그 어떤 준비물보다 중요한 개학 준비입니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "With a Few Weeks Left, Where Do You Even Start?",
        paragraphs: [
          "As summer break winds down, parents' to-do lists start piling up all at once — school supplies, teacher assignments, sleep schedules — and it's easy to feel unsure where to even start. Exact start dates and calendars vary by school and district, so FCPS parents should begin by checking their school's website or ParentVUE announcements for the specifics.",
          "With roughly 2 to 4 weeks left before the first day, there's still enough time to work through preparations calmly rather than scrambling at the last minute. This checklist walks through five areas worth confirming in order: school-year logistics, math readiness, sleep schedule, paperwork, and your child's emotional readiness.",
        ],
        visual: {
          type: "checklist",
          title: "Five Areas to Cover",
          items: [
            { text: "School-year logistics (ParentVUE)" },
            { text: "Math readiness" },
            { text: "Sleep schedule" },
            { text: "Supplies & paperwork" },
            { text: "Emotional readiness" },
          ],
        },
      },
      {
        heading: "Checking New Year Details Through ParentVUE",
        paragraphs: [
          "As the new school year approaches, FCPS typically releases teacher assignments through ParentVUE about one to two weeks before the first day, though the exact timing can vary by school. Checking ParentVUE every few days as the date gets closer is a good habit. Knowing the teacher's name ahead of time also gives you a chance to talk it through with your child and ease any first-day nerves.",
          "Beyond teacher assignments, ParentVUE often posts the new class schedule, the school supply list, and information about after-school programs. Supply lists can change from year to year, so it's worth checking this year's list directly rather than reusing last year's.",
        ],
      },
      {
        heading: "Rebuilding Math Momentum, the Short Way",
        paragraphs: [
          "If math practice fell off over the summer, the remaining weeks before school starts are a good window to rebuild momentum. Nothing elaborate is needed — revisiting the last unit or two of last year's workbook, or re-solving problems your child got wrong, is enough. Even 15 minutes a day, done consistently, noticeably eases the adjustment during the first week back.",
          "If there's time, a light preview of the new grade's first unit can help too. The goal here isn't to get ahead — it's simply to make the material feel familiar rather than brand new. For more on why math skills fade over summer, see our earlier post on the summer math slide.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          text: "Curious why math skills fade faster than other subjects over the summer? Read our deep dive below.",
          linkHref: "/en/blog/summer-math-slide",
          linkLabel: "Preventing the Summer Math Slide",
        },
      },
      {
        heading: "Resetting the Daily Rhythm",
        paragraphs: [
          "If bedtimes and wake-up times drifted later over the summer, start shifting them back one to two weeks before school begins. Trying to reset the schedule overnight tends to stress out both kids and parents. Moving bedtime earlier by 15 to 30 minutes every few days is a much smoother approach.",
          "It also helps to practice the morning routine ahead of time. Estimating how long getting ready and eating breakfast actually takes, and setting the alarm accordingly, cuts down on first-day chaos. Families relying on the school bus should factor in walking time to the stop as well.",
        ],
      },
      {
        heading: "Supplies and Paperwork Checklist",
        paragraphs: [
          "Beyond school supplies, there's often more paperwork to handle than expected. Virginia requires immunization records for kindergarteners and any newly enrolled students, and missing this can restrict a child's ability to attend school, so it's worth confirming early. Pediatrician appointments can book up quickly this time of year, so scheduling ahead is wise.",
          "If you're planning to use a before- or after-school care program, don't miss the registration deadline. Popular programs can fill up before the school year even starts, so it's worth applying during the summer if you know you'll need a spot.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "warning",
          title: "Immunization Records Required",
          text: "Virginia requires immunization records for kindergarteners and newly enrolled students. Missing this can restrict a child's ability to attend school, so confirm early.",
        },
      },
      {
        heading: "Easing Your Child's Mind for the First Week",
        paragraphs: [
          "No matter how carefully you handle supplies and paperwork, your child may still be quietly nervous about a new teacher and new classmates. Talking through likely scenarios ahead of time — 'I wonder what your new teacher will be like,' 'you might not be in the same class as your friends from last year' — makes those moments far less unsettling when they actually happen.",
          "In the first week, adjustment matters more than academics. Instead of asking 'What did you learn today?', try 'What was the most fun part of your day?' — a question that's much easier for a child to answer. Paying close attention to your child's mood and how much they're sharing over those first few days is, in the end, more important preparation than any item on a checklist.",
        ],
      },
    ],
  },
  {
    slug: "tjhsst-roadmap",
    publishedAt: "2026-08-08",
    readingMins: 7,
    category: "진학 로드맵",
    categoryEn: "High School Pathway",
    titleKo: "TJ(TJHSST) 진학, 초등 학부모가 알아야 할 로드맵",
    titleEn: "The TJHSST Roadmap: What Elementary Parents Should Know",
    descKo: "TJ(Thomas Jefferson High School for Science and Technology)가 정확히 어떤 학교인지, 한국의 과학고·영재고와 무엇이 다른지, 그리고 초등학교 때부터 무엇을 준비하면 좋은지 처음 듣는 학부모도 이해할 수 있도록 쉽게 정리했습니다.",
    descEn: "A parent-friendly introduction to TJHSST — what it actually is, how it differs from Korea's science and gifted high schools, and what elementary-age preparation actually looks like.",
    bodyKo: [
      {
        heading: "TJ가 무엇인가요?",
        paragraphs: [
          "Fairfax County(그리고 인근 몇 개 카운티)에 사는 학부모들 사이에서 \"TJ\"라는 이름을 한 번쯤 들어보셨을 겁니다. 정식 명칭은 Thomas Jefferson High School for Science and Technology로, Fairfax County Public Schools(FCPS)가 운영하는 공립 고등학교입니다. 미국의 여러 고교 평가에서 최상위권에 자주 이름을 올리는 학교이며, 수학·과학·컴퓨터공학 분야에 특화된 커리큘럼으로 잘 알려져 있습니다.",
          "TJ는 미국식 표현으로 \"매그넷 스쿨(Magnet School)\"에 속합니다. 매그넷 스쿨이란 특정 분야(TJ의 경우 STEM: 과학·기술·공학·수학)에 집중된 커리큘럼을 제공하기 위해, 원래 정해진 학군 경계와 상관없이 여러 지역에서 학생을 모집하는 공립학교를 말합니다. 즉 우리 동네 배정 고등학교가 아니라, 관심 있는 학생이 별도로 지원해서 들어가는 '선택형 공립학교'라고 이해하면 쉽습니다.",
        ],
      },
      {
        heading: "한국의 과학고·영재고와 무엇이 다른가요?",
        paragraphs: [
          "한국에서 오신 학부모라면 TJ를 과학고나 영재고와 비슷하게 떠올리실 수 있습니다. STEM에 특화된 상위권 학생을 위한 학교라는 점은 비슷하지만, 운영 방식은 상당히 다릅니다. 가장 큰 차이는 TJ가 등록금 없는 완전 무료 공립학교라는 점입니다. 별도의 학비 체계가 있는 것이 아니라, 다른 공립 고등학교와 동일하게 세금으로 운영됩니다.",
          "입학 전형 방식도 다릅니다. 과거 TJ는 별도의 입학시험을 치렀지만, 2021년부터는 시험 점수 없이 성적, 에세이, 학생이 제출하는 문제 해결 과정(Student Portrait Sheet 등)을 종합적으로 평가하는 '홀리스틱 리뷰(Holistic Review)' 방식으로 바뀌었습니다. 즉 단 하나의 시험 점수로 당락이 갈리는 구조가 아니라, 학생의 여러 면을 함께 살펴보는 방식입니다. 정확한 전형 요소와 비중은 매년 조정될 수 있으므로, 지원을 고려한다면 매년 가을 학교 공식 입학 안내(tjhsst.fcps.edu)를 확인하는 것이 가장 정확합니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "2021년 이전", tone: "standard", points: ["별도 입학시험 실시", "단일 시험 점수로 당락 결정"] },
            { label: "현재 (Holistic Review)", tone: "advanced", points: ["시험 점수 없음", "성적·에세이·문제해결 과정 종합 평가"] },
          ],
        },
      },
      {
        heading: "지원은 언제, 어떻게 하나요?",
        paragraphs: [
          "TJ는 8학년(중학교 2학년에 해당) 학생이 9학년(고등학교 1학년) 입학을 목표로 지원합니다. Fairfax County뿐 아니라 협약을 맺은 몇 개 인근 카운티(Arlington, Fairfax City, Loudoun 등) 거주 학생도 지원할 수 있습니다. 지원은 대개 재학 중인 중학교를 통해 진행되며, 담당 카운슬러가 안내해주는 경우가 많습니다.",
          "지원 절차와 정확한 마감일, 정원, 평가 기준의 세부 내용은 소송과 정책 변화로 인해 최근 몇 년간 계속 조정되어 왔습니다. 따라서 이 글에서 특정 연도의 마감일이나 정원 숫자를 단정적으로 안내하기보다는, 8학년 지원이라는 큰 틀만 기억해두시고 정확한 최신 정보는 반드시 tjhsst.fcps.edu의 공식 입학 안내나 재학 중학교의 카운슬러를 통해 확인하시길 권합니다.",
        ],
      },
      {
        heading: "초등학교 때부터 무엇이 쌓여야 하나요?",
        paragraphs: [
          "TJ 지원은 8학년에 이루어지지만, 그 밑바탕이 되는 학업 습관과 사고력은 초등학교 시기에 쌓입니다. 가장 직접적으로 연결되는 것은 FCPS의 AAP(Advanced Academic Programs) 심화 수학 트랙입니다. 초등학교에서 AAP 수학을 꾸준히 이수하면 중학교에서 더 빠른 수학 진도를 밟게 되고, 이는 8학년 시점의 수학 역량 전반에 영향을 줍니다. AAP와 수학 경로에 대한 자세한 내용은 저희 블로그의 'FCPS AAP 수학, 제대로 이해하기' 글을 참고하세요.",
          "홀리스틱 리뷰는 에세이와 문제 해결 과정을 함께 평가하기 때문에, 수학 실력만큼이나 읽기·쓰기 습관도 중요합니다. 평소 책을 읽고 자기 생각을 글로 표현해보는 연습, 그리고 정답보다 풀이 과정을 설명해보는 습관이 장기적으로 큰 자산이 됩니다. MOEMS 같은 초등 수학 경시대회 경험도 문제 해결 과정을 글로 정리해보는 좋은 연습이 될 수 있습니다.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "초등 AAP", sublabel: "심화 수학 트랙" },
            { label: "중학교", sublabel: "가속 수학 진입" },
            { label: "8학년", sublabel: "TJ 지원 (Holistic Review)" },
          ],
          finalLabel: "TJHSST 9학년 입학",
        },
      },
      {
        heading: "학부모들이 흔히 하는 오해",
        paragraphs: [
          "가장 흔한 오해는 '선행학습 학원을 많이 다니면 TJ에 갈 수 있다'는 생각입니다. 홀리스틱 리뷰 체제에서는 단순히 진도를 많이 나간 것보다, 개념을 얼마나 깊이 이해하고 스스로 문제를 풀어내는지, 그리고 그 과정을 얼마나 명확하게 설명할 수 있는지가 더 중요하게 평가됩니다. 진도만 빠르고 개념 이해가 얕은 경우, 오히려 에세이나 문제 해결 과정에서 어려움을 겪을 수 있습니다.",
          "또 다른 오해는 '초등학교 때 AAP에 들어가지 못하면 TJ는 불가능하다'는 생각입니다. AAP는 분명 유리한 경로이지만, 매년 재평가되는 시스템이며 중학교 시기에도 심화 수학 트랙에 진입할 기회가 있습니다. 초등 시기에 다소 늦었다고 느끼더라도, 꾸준히 개념을 다지고 사고력을 키우는 것이 여전히 의미 있는 준비가 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "선행학습 학원을 많이 다니면 TJ에 갈 수 있다",
              fact: "Holistic Review는 진도보다 개념 이해 깊이·독립적 문제해결·설명력을 더 중요하게 봅니다",
            },
            {
              myth: "초등학교 때 AAP에 들어가지 못하면 TJ는 불가능하다",
              fact: "AAP는 매년 재평가되며, 중학교 시기에도 심화 수학 트랙에 진입할 기회가 있습니다",
            },
          ],
        },
      },
      {
        heading: "지금 초등 학부모가 실천할 수 있는 것",
        paragraphs: [
          "지금 자녀가 초등학생이라면, 8학년 지원까지는 아직 몇 년의 시간이 있습니다. 가장 먼저 할 수 있는 것은 현재 AAP 트랙 여부를 확인하고, 심화 수학의 개념을 탄탄히 다지도록 돕는 것입니다. 여기에 더해 꾸준한 독서와 글쓰기 습관, 그리고 MOEMS 같은 수학 경시대회 경험을 통해 사고 과정을 표현하는 연습을 함께 쌓아가는 것이 좋습니다.",
          "마지막으로, 담임교사나 학교의 AART(Advanced Academic Resource Teacher)와 정기적으로 소통하며 자녀의 학업 상태를 파악해두는 것도 중요합니다. TJ 지원은 8학년이라는 먼 미래의 일처럼 느껴질 수 있지만, 초등학교 시기의 꾸준한 기초 다지기가 결국 그 시점의 선택지를 넓혀줍니다. 조급하게 서두르기보다, 지금 할 수 있는 것부터 차근차근 쌓아가는 것이 가장 확실한 로드맵입니다.",
        ],
      },
    ],
    bodyEn: [
      {
        heading: "What Exactly Is TJ?",
        paragraphs: [
          "If you live in Fairfax County (or one of the nearby participating counties), you've probably heard the name \"TJ\" mentioned by other parents. Its full name is Thomas Jefferson High School for Science and Technology, a public high school run by Fairfax County Public Schools (FCPS). It regularly ranks among the top public high schools in national rankings, and it's especially known for its math, science, and computer science curriculum.",
          "TJ is what's called a \"magnet school\" in the American system. A magnet school offers a specialized curriculum — in TJ's case, STEM (science, technology, engineering, and math) — and draws students from across a wider area rather than just one neighborhood boundary. In other words, it's not the high school your address automatically assigns you to; it's a public school students apply to separately because of a specific interest.",
        ],
      },
      {
        heading: "How Is It Different From Korea's Science and Gifted High Schools?",
        paragraphs: [
          "Parents who grew up in Korea's education system might picture TJ as similar to a Korean science high school (과학고) or gifted academy (영재고). Both serve academically strong students with a STEM focus, but the two systems work quite differently. The biggest difference is that TJ is a fully free public school — there's no separate tuition structure. It's funded like any other public high school.",
          "The admissions process is also different. TJ used to require a separate entrance exam, but since 2021 it has used a \"Holistic Review\" process instead — no test score, but a combined look at grades, a written essay, and a problem-solving submission (often called a Student Portrait Sheet). In other words, no single test score determines the outcome; several aspects of the student are considered together. The exact components and how they're weighted can shift from year to year, so families considering applying should check the school's official admissions page (tjhsst.fcps.edu) each fall for the current cycle's details.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "Before 2021", tone: "standard", points: ["Separate entrance exam", "Single test score determined outcome"] },
            { label: "Now (Holistic Review)", tone: "advanced", points: ["No test score", "Grades, essay & problem-solving submission combined"] },
          ],
        },
      },
      {
        heading: "When and How Do Students Apply?",
        paragraphs: [
          "Students apply to TJ in 8th grade for admission the following year, as 9th graders. Eligibility extends beyond Fairfax County to a handful of neighboring participating jurisdictions, such as Arlington, Fairfax City, and Loudoun. Applications are typically submitted through the student's current middle school, often with guidance from the school counselor.",
          "The exact application process, deadlines, class size, and evaluation criteria have shifted repeatedly over the past several years amid litigation and policy changes. Rather than stating specific numbers here that could be outdated by the time you read this, the key structural fact to remember is that students apply in 8th grade — and for the current cycle's exact details, always check the official admissions page at tjhsst.fcps.edu or ask your middle school counselor.",
        ],
      },
      {
        heading: "What Needs to Be Built Starting in Elementary School?",
        paragraphs: [
          "Although the application happens in 8th grade, the academic habits and reasoning skills behind it are built years earlier, starting in elementary school. The most direct connection is FCPS's AAP (Advanced Academic Programs) advanced math track. Students who stay on the AAP math track through elementary school move into a faster math sequence in middle school, which shapes their overall math readiness by 8th grade. For more on this pathway, see our earlier post, \"Understanding FCPS AAP Math.\"",
          "Because Holistic Review evaluates essays and problem-solving submissions alongside grades, reading and writing habits matter just as much as math skill. Regularly reading books, practicing writing down one's own thoughts, and explaining reasoning rather than just stating an answer are all habits that pay off years later. Experience with elementary math competitions like MOEMS can also double as good practice for articulating a problem-solving process in writing.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "Elementary AAP", sublabel: "Advanced math track" },
            { label: "Middle School", sublabel: "Accelerated math sequence" },
            { label: "8th Grade", sublabel: "TJ application (Holistic Review)" },
          ],
          finalLabel: "TJHSST",
        },
      },
      {
        heading: "Common Misconceptions Parents Have",
        paragraphs: [
          "The most common misconception is that enrolling in enough acceleration-focused tutoring guarantees TJ admission. Under Holistic Review, what matters more than how far ahead a student has covered material is how deeply they understand the concepts, how independently they can solve problems, and how clearly they can explain their reasoning. A student who has moved fast but understands shallowly can actually struggle more with the essay and problem-solving components.",
          "Another misconception is that missing AAP placement in elementary school closes the door on TJ entirely. AAP is certainly an advantageous path, but placement is reassessed every year, and there are still opportunities to move into an advanced math track in middle school. Even if a family feels they started a bit later, consistently building conceptual understanding and reasoning skills is still meaningful preparation.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "Enrolling in enough acceleration-focused tutoring guarantees TJ admission",
              fact: "Holistic Review weighs depth of understanding, independent problem-solving, and clear reasoning more than how far ahead a student has covered material",
            },
            {
              myth: "Missing AAP placement in elementary school closes the door on TJ entirely",
              fact: "AAP is reassessed every year, and there are still opportunities to move into an advanced math track in middle school",
            },
          ],
        },
      },
      {
        heading: "What Elementary Parents Can Do Right Now",
        paragraphs: [
          "If your child is currently in elementary school, there are still several years before an 8th-grade application. The first practical step is confirming their current AAP status and helping them build a genuinely solid understanding of advanced math concepts, not just speed through material. Alongside that, consistent reading and writing habits, plus experience with elementary math competitions like MOEMS, help build the ability to articulate a reasoning process — a skill that carries directly into the Holistic Review process later.",
          "Finally, staying in regular contact with your child's teacher or the school's AART (Advanced Academic Resource Teacher) helps you keep a clear picture of where your child stands. An 8th-grade application can feel like a distant milestone, but the consistent groundwork laid during elementary school is what keeps that option open later. Rather than rushing, building steadily on what you can do now is the most reliable roadmap there is.",
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

export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getAdjacentPosts(slug: string): {
  newer: BlogPost | null;
  older: BlogPost | null;
} {
  const sorted = getSortedPosts();
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? sorted[index - 1] : null,
    older: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
