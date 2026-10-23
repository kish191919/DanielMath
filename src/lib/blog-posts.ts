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

export type BlogImage = { src: string; altKo: string; altEn: string };

/** Rendered at the end of the post and emitted as FAQPage JSON-LD. */
export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  slug: string;
  publishedAt: string;
  /** Last substantive revision; feeds dateModified and the sitemap. */
  updatedAt?: string;
  readingMins: number;
  category: string;
  categoryEn: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  heroImage?: BlogImage;
  bodyKo: BlogSection[];
  bodyEn: BlogSection[];
  faqKo?: BlogFaq[];
  faqEn?: BlogFaq[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "fcps-report-card-guide",
    publishedAt: "2026-08-01",
    updatedAt: "2026-10-23",
    readingMins: 7,
    category: "성적표",
    categoryEn: "Report Cards",
    titleKo: "FCPS 초등학교 성적표 보는 법: 1~4점의 뜻과 SOL 점수 차이",
    titleEn: "How to Read Your Child's FCPS Elementary Report Card",
    descKo: "미국 초등학교 성적표에는 A·B·C 대신 1~4 숫자가 적혀 있습니다. 버지니아 페어팩스 카운티(FCPS) 성적표에서 3점이 무슨 뜻인지, 학습 태도 항목과 SOL 시험 점수는 어떻게 다른지 미국 학교가 처음인 학부모님 눈높이로 정리했습니다.",
    descEn: "Virginia elementary report cards don't use A-B-C grades — FCPS scores students on a 1-4 standards-based scale. Here's how the scoring works, how it differs from the state SOL test, and what parents should actually look for.",
    heroImage: {
      src: "/blog/fcps-report-card-guide-hero.jpg",
      altKo: "성적표를 함께 들여다보며 미소 짓는 부모와 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a parent and child smiling together while looking over a report card",
    },
    bodyKo: [
      {
        heading: "결론부터: 3점이면 잘하고 있는 것입니다",
        paragraphs: [
          "한국에서 오신 학부모님이 FCPS 성적표를 처음 받으면 가장 먼저 당황하는 부분이 있습니다. 과목마다 A·B·C나 100점 만점 점수 대신 1, 2, 3, 4라는 숫자가 적혀 있기 때문입니다.",
          "이 숫자는 등수도, 시험 점수도 아닙니다. 아이가 그 학년에 배워야 할 내용을 얼마나 해낼 수 있는지를 네 단계로 표시한 것입니다. 이런 방식을 기준중심평가(Standards-Based Grading)라고 부릅니다.",
          "딱 한 가지만 기억하세요. 3점은 '학년 수준을 잘 따라가고 있다'는 뜻이고, 대부분의 학생이 받는 점수입니다. 3점을 B로, 4점을 A로 바꿔 읽으면 안 됩니다.",
        ],
        visual: {
          type: "checklist",
          title: "이 글의 핵심 요약",
          items: [
            { text: "FCPS 초등학교(K~6학년)는 A·B·C 대신 1~4점으로 평가합니다" },
            { text: "3점은 학년 수준을 잘 따라간다는 뜻입니다", note: "대부분의 학생이 받는 점수" },
            { text: "수학 한 과목도 여러 세부 항목으로 나뉘어 따로 점수가 나옵니다" },
            { text: "학습 태도는 학업 점수와 따로 평가합니다" },
            { text: "SOL은 성적표와 별개인 버지니아주 시험입니다", note: "읽기·수학은 3학년부터" },
          ],
        },
      },
      {
        heading: "1·2·3·4점은 각각 무슨 뜻인가요?",
        paragraphs: [
          "점수는 아이가 배운 내용을 혼자서 얼마나 정확하게 해내는지를 기준으로 매깁니다. 4점은 거의 항상 정확하게, 스스로 해낸다는 뜻입니다. 3점은 대부분 이해하고 있고 약간의 도움만 필요하다는 뜻입니다.",
          "2점은 부분적으로 이해하고 있어 어느 정도 도움이 필요하다는 뜻이고, 1점은 이해가 부족해 많은 도움이 필요하다는 뜻입니다. 그 분기에 아직 배우지 않은 내용은 숫자 대신 NT(Not Taught, 아직 배우지 않음)로 표시됩니다.",
          "'4점이 아니면 부족한 것'이라고 생각하실 필요는 없습니다. 4점은 매우 안정적으로 혼자 해내는 수준이라 모든 항목에서 받기는 어렵습니다. 성적표 대부분이 3점이라면 아이는 학년 수준을 잘 따라가고 있는 것입니다.",
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
            text: "가장 흔한 오해: '4점=A, 3점=B'로 바꿔 읽는 것. 3점은 나쁜 성적이 아니라 대다수 학생이 받는, 학년 수준을 잘 따라가는 점수입니다.",
          },
        },
      },
      {
        heading: "수학 점수가 왜 여러 개인가요?",
        paragraphs: [
          "한국 성적표는 과목마다 점수가 하나씩 나오지만, FCPS 성적표는 한 과목을 여러 세부 학습기준으로 나눠 따로 점수를 매깁니다. 수학이라면 수 개념, 계산, 문장제 문제 해결, 수학적 설명과 추론이 각각 다른 줄에 표시됩니다. 언어(English Language Arts)도 읽기 이해, 어휘, 쓰기로 나뉩니다.",
          "그래서 평균을 내기보다 한 줄씩 읽는 것이 맞습니다. 예를 들어 계산은 3점인데 문장제 문제가 2점이라면, 수학 실력보다 영어로 된 문제를 읽고 이해하는 데서 어려움을 겪고 있을 수 있습니다. 미국에 온 지 얼마 안 된 아이에게 흔히 보이는 모습입니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "미국에 온 지 얼마 안 됐다면",
          text: "계산 점수에 비해 문장제(Word Problem) 점수가 낮은 것은 자연스러운 일입니다. 문장제에 자주 나오는 영어 표현을 익히면 빠르게 좋아지는 경우가 많습니다.",
          linkHref: "/blog/math-practice-at-home",
          linkLabel: "수학 문장제 영어 표현 보기",
        },
      },
      {
        heading: "시험 점수를 평균 내서 성적을 매기나요?",
        paragraphs: [
          "아닙니다. 한국처럼 시험 점수를 합산하거나 평균 내는 방식이 아닙니다. 선생님은 수업 중 관찰, 과제와 프로젝트, 퀴즈와 단원평가, 아이가 말로 풀이를 설명하는 모습까지 여러 자료를 함께 보고 판단합니다.",
          "특히 최근에 보여 준 실력을 더 비중 있게 보는 경우가 많습니다. 분기 초에 어려워했던 내용도 분기 말에 잘 해내면 그 향상이 점수에 반영될 수 있습니다. 학년 말 성적도 네 분기의 평균이 아니라, 학년이 끝날 때의 이해 수준을 중심으로 정해집니다.",
        ],
      },
      {
        heading: "학습 태도 점수는 따로 봐야 하나요?",
        paragraphs: [
          "네. FCPS 성적표에는 학업 점수와 별도로 학습 태도 항목이 있습니다. 지시를 잘 따르는지, 과제를 제때 끝내는지, 시간을 잘 쓰는지, 수업에 적극적으로 참여하는지를 평가합니다.",
          "두 영역은 따로 채점됩니다. 학업은 3점인데 학습 태도는 개선이 필요하다고 나올 수 있고, 그 반대도 가능합니다. 같은 학습 태도 항목이 두 분기 이상 낮게 나오면 학업 점수와 별개로 담임 선생님과 이야기해 보세요. 미국 학교에서는 학부모가 먼저 이메일로 상담을 요청하는 것이 자연스러운 일입니다.",
        ],
      },
      {
        heading: "SOL 시험 점수는 성적표와 어떻게 다른가요?",
        paragraphs: [
          "SOL(Standards of Learning)은 버지니아주가 학년별로 정한 학습 기준이자, 그 기준을 얼마나 이해했는지 확인하는 주 정부 시험의 이름입니다. 성적표의 1~4점은 담임 선생님이 분기마다 매기지만, SOL 시험은 버지니아주가 매년 봄에 한 번 치릅니다.",
          "FCPS에서는 읽기와 수학은 3학년부터, 과학은 5학년부터 SOL 시험을 봅니다. 점수는 600점 만점으로, 400점 이상이면 합격(Pass), 500점 이상이면 우수(Pass/Advanced)입니다.",
          "AAP(심화반) 학생도 같은 1~4점 체계로 평가받습니다. 다만 배우는 내용과 기대 수준이 일반반과 다르므로, 같은 3점이라도 의미가 조금 다르다는 점을 기억해 두세요.",
        ],
        visual: {
          type: "table",
          headers: ["", "성적표 (Report Card)", "SOL 시험"],
          rows: [
            { label: "채점 방식", values: ["1~4점 기준중심평가", "600점 만점, 400점 이상 Pass, 500점 이상 Pass/Advanced"] },
            { label: "누가, 언제", values: ["담임교사, 분기마다", "버지니아주, 매년 봄 1회"] },
            { label: "대상 학년", values: ["K~6학년 전체", "읽기·수학 3학년부터, 과학 5학년부터"] },
          ],
        },
      },
      {
        heading: "성적표를 받으면 이것만 확인하세요",
        paragraphs: [
          "3점이 몇 개인지 세는 것보다 2점이나 1점이 나온 세부 항목이 무엇인지, 그리고 지난 분기보다 나아지고 있는지가 더 중요합니다.",
          "같은 항목에서 2점이 두 분기 이상 이어지거나 1점이 나오면 담임 선생님께 '어떤 기술이 부족한지', '집에서 무엇을 도와주면 좋은지' 구체적으로 물어보세요. 영어로 상담하기가 부담스럽다면 학교에 한국어 통역을 요청할 수 있습니다.",
        ],
        visual: {
          type: "checklist",
          title: "성적표 확인 체크리스트",
          items: [
            { text: "ParentVUE에서 성적표 열기", note: "분기마다 올라옵니다" },
            { text: "2점·1점이 나온 세부 항목 표시하기" },
            { text: "지난 분기와 비교하기", note: "나아지고 있는지가 핵심" },
            { text: "학습 태도 항목 따로 확인하기" },
            { text: "궁금한 점은 담임 선생님께 이메일로 묻기", note: "한국어 통역 요청 가능" },
          ],
        },
      },
    ],
    faqKo: [
      {
        q: "FCPS 성적표의 3점은 B와 같은 뜻인가요?",
        a: "아닙니다. 1~4점은 A·B·C로 바꿔 읽는 점수가 아닙니다. 3점은 그 학년에 배워야 할 내용을 대부분 이해하고 있다는 뜻이며, 대부분의 학생이 받는 점수입니다.",
      },
      {
        q: "성적표에 적힌 NT는 무슨 뜻인가요?",
        a: "Not Taught의 줄임말로, 그 분기에 아직 배우지 않은 내용이라는 뜻입니다. 낮은 점수가 아닙니다.",
      },
      {
        q: "FCPS 성적표는 어디서 볼 수 있나요?",
        a: "FCPS 학부모용 웹사이트인 ParentVUE에서 분기마다 확인할 수 있습니다. 계정이 없다면 학교 사무실에 활성화 코드(Activation Key)를 요청하세요.",
      },
      {
        q: "SOL 시험은 몇 학년부터 보나요?",
        a: "FCPS에서는 읽기와 수학은 3학년부터, 과학은 5학년부터 매년 봄에 봅니다. 400점 이상이면 합격(Pass), 500점 이상이면 Pass/Advanced입니다.",
      },
      {
        q: "담임 선생님과 한국어로 상담할 수 있나요?",
        a: "FCPS는 학부모 상담에 통역을 지원합니다. 상담을 요청할 때 한국어 통역이 필요하다고 미리 알려 주세요.",
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
          "What matters more than the total number of scores is which specific standards show a 2 or a 1, and whether those areas are improving quarter over quarter. If the same area shows a 2 for two or more quarters in a row, or a 1 appears, ask the teacher specifically which skills need work and how you can help at home. Report cards are posted to ParentVUE each quarter. AAP students use the same 1-4 standards-based system, but the actual content taught and expectations differ by track — worth keeping in mind when interpreting the report card.",
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
    updatedAt: "2026-10-23",
    readingMins: 7,
    category: "AAP",
    categoryEn: "AAP",
    titleKo: "FCPS AAP 총정리: Level III·IV 차이, 선발 과정, 심화 수학",
    titleEn: "Understanding FCPS AAP Math",
    descKo: "FCPS AAP는 한국의 영재반·심화반과 비슷한 페어팩스 카운티의 심화 프로그램입니다. Level I~IV의 차이, 파트타임과 풀타임(AAP 센터)의 구분, 2학년 때 이뤄지는 선발 과정, 초등 심화 수학이 중학교 Algebra 1까지 어떻게 이어지는지 정리했습니다.",
    descEn: "A clear breakdown of Standard vs. Advanced (AAP) math in FCPS, covering placement criteria and the long-term pathway through middle and high school.",
    heroImage: {
      src: "/blog/fcps-aap-math-guide-hero.jpg",
      altKo: "손을 들고 발표하며 생각에 잠긴 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child raising their hand and deep in thought",
    },
    bodyKo: [
      {
        heading: "결론부터: AAP는 'FCPS의 심화반'입니다",
        paragraphs: [
          "FCPS 학부모 모임에서 가장 자주 들리는 단어 중 하나가 AAP입니다. AAP(Advanced Academic Programs)는 페어팩스 카운티 공립학교(FCPS)가 운영하는 심화 학습 프로그램입니다. 한국으로 치면 학교 안의 영재반이나 심화반에 가깝고, 공립학교 프로그램이라 따로 내는 학비가 없습니다.",
          "AAP는 수학만이 아니라 언어, 과학, 사회까지 더 깊고 빠르게 배우는 프로그램입니다. 특히 수학은 학년보다 앞선 내용을 배우기 때문에, 초등학교 때의 배치가 중학교에서 듣는 수학 과목까지 영향을 줍니다.",
        ],
        visual: {
          type: "checklist",
          title: "이 글의 핵심 요약",
          items: [
            { text: "AAP는 Level I~IV 네 단계로 나뉩니다" },
            { text: "Level III는 다니던 학교에서 받는 파트타임 심화 수업입니다", note: "3~6학년" },
            { text: "Level IV는 모든 핵심 과목을 심화반에서 배우는 풀타임 과정입니다", note: "3학년부터, 신청은 2학년 때" },
            { text: "선발은 시험 점수 하나가 아니라 여러 자료를 함께 봅니다" },
            { text: "선발되지 않아도 다음 해에 다시 지원할 수 있습니다" },
          ],
        },
      },
      {
        heading: "AAP Level I~IV는 어떻게 다른가요?",
        paragraphs: [
          "AAP는 네 단계로 나뉩니다. Level I은 모든 학생이 받는 사고력 수업이고, Level II는 특정 과목에 강점이 있는 학생에게 학교가 수업 안에서 제공하는 심화 활동입니다. 두 단계는 학교 안에서 이뤄지므로 학부모가 따로 신청할 일은 많지 않습니다.",
          "학부모들이 보통 'AAP'라고 할 때는 Level III와 Level IV를 가리킵니다. Level III(파트타임)는 다니던 학교에 그대로 다니면서 일부 과목만 심화 수업을 받는 방식으로, 3~6학년이 대상입니다. Level IV(풀타임)는 모든 핵심 과목을 심화반에서 배우는 방식으로, 3학년부터 시작합니다.",
          "Level IV는 지정된 AAP 센터 학교로 옮겨 다니는 경우가 많지만, 다니던 학교 안에 Level IV 반이 있는 곳(Local Level IV)도 있습니다. 우리 학교가 어느 쪽인지는 학교의 AART(Advanced Academic Resource Teacher, AAP 담당 교사)에게 물어보면 됩니다.",
        ],
        visual: {
          type: "table",
          headers: ["단계", "대상", "방식"],
          rows: [
            { label: "Level I", values: ["K~6학년 전체", "모든 학생이 받는 사고력 수업"] },
            { label: "Level II", values: ["K~6학년", "강점 과목에서 학교가 제공하는 심화 활동"] },
            { label: "Level III", values: ["3~6학년", "다니던 학교에서 일부 과목만 심화 (파트타임)"] },
            { label: "Level IV", values: ["3~8학년", "모든 핵심 과목을 심화반에서 (풀타임)"] },
          ],
        },
      },
      {
        heading: "일반 수학과 심화 수학은 무엇이 다른가요?",
        paragraphs: [
          "FCPS 초등학교 수학은 크게 일반 과정(Standard)과 심화 과정(Advanced)으로 나뉩니다. 일반 과정은 그 학년의 버지니아 학습 기준(SOL)을 배우고, 심화 과정은 한 학년 앞선 내용을 배웁니다.",
          "예를 들어 4학년 일반반이 4학년 내용을 배울 때, 4학년 심화반은 5학년 내용을 배웁니다. 이 한 학년의 차이가 해마다 쌓여, 중학교에서 Algebra 1(대수 1)을 듣는 학년이 달라집니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "일반(Standard)", tone: "standard", points: ["학년 수준의 Virginia SOL을 따라감", "예: 4학년 → 4학년 내용"] },
            { label: "심화(Advanced)", tone: "advanced", points: ["한 학년 앞선 내용을 학습", "예: 4학년 → 5학년 내용"] },
          ],
        },
      },
      {
        heading: "AAP 선발은 어떻게 이뤄지나요?",
        paragraphs: [
          "Level IV(풀타임) 선발은 FCPS 교육청의 중앙 선발위원회가 결정합니다. 2학년 학생은 학교에서 단체로 보는 능력검사 결과에 따라 자동으로 심사 대상이 되기도 하고, 학부모나 교사가 추천서(Referral)를 내서 심사를 신청할 수도 있습니다.",
          "심사 때는 여러 자료를 함께 봅니다. NGAT 같은 능력검사 점수, 성적표와 학력평가 결과, 교사 의견, 학생 작품(Work Samples), 학부모 의견이 모두 반영됩니다. FCPS는 시험 점수 하나로 결정하지 않고 종합적으로 판단한다고 안내합니다.",
          "Level IV 추천서는 보통 학년 초부터 12월 중순까지 받습니다. 선발되지 않았더라도 다음 해에 다시 지원할 수 있습니다. Level III(파트타임)는 각 학교의 심사위원회가 결정합니다.",
        ],
        visual: {
          type: "checklist",
          title: "Level IV 심사에서 보는 자료",
          items: [
            { text: "능력검사 점수", note: "NGAT (2025-26학년도부터 CogAT·NNAT 대체)" },
            { text: "성적표와 학력평가 결과" },
            { text: "교사 의견" },
            { text: "학생 작품(Work Samples)" },
            { text: "학부모 의견", note: "추천서 마감: 보통 12월 중순" },
          ],
        },
      },
      {
        heading: "초등 심화 수학은 중학교에서 어떻게 이어지나요?",
        paragraphs: [
          "초등 심화 수학의 가장 큰 의미는 Algebra 1을 듣는 학년이 앞당겨진다는 점입니다. FCPS는 모든 학생이 8학년까지 Algebra 1을 마치는 것을 목표로 합니다. 6학년에 Advanced Math 6를 마친 학생은 한 해 빠른 7학년에 Algebra 1 Honors를 들을 수 있습니다.",
          "Algebra 1을 한 해 일찍 들으면 고등학교 수학 과목도 한 해씩 앞당겨져, 11학년에 AP Calculus(대학 수준 미적분)를 들을 수 있습니다. 8학년에 Algebra 1을 듣는 기본 경로로도 12학년에 AP Calculus까지 갈 수 있으니, 심화반에 들어가지 못했다고 너무 걱정하지 않으셔도 됩니다.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "3~5학년", sublabel: "Advanced Math" },
            { label: "6학년", sublabel: "Advanced Math 6" },
            { label: "7학년", sublabel: "Algebra 1 Honors" },
          ],
          finalLabel: "11학년 AP Calculus",
        },
      },
      {
        heading: "학부모가 지금 할 수 있는 것",
        paragraphs: [
          "먼저 자녀가 지금 어느 과정에 있는지 확인하세요. ParentVUE의 수강 과목에서 과목 이름에 'Advanced'가 붙어 있거나, 학년보다 높은 숫자(예: 3학년인데 Math 4)가 보이면 심화 과정입니다. 잘 모르겠다면 담임 선생님께 이메일로 물어보셔도 됩니다.",
          "AAP 지원을 생각한다면 시험 대비보다 평소의 사고력을 키우는 것이 중요합니다. 능력검사는 배운 지식보다 추론력을 보기 때문입니다. 미국에 온 지 얼마 안 된 아이라면 영어 때문에 실력이 덜 드러날 수 있으니, 아이가 한국에서 어디까지 배웠는지 선생님께 미리 알려 두는 것도 도움이 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "함께 읽으면 좋은 글",
          text: "6학년부터 갈라지는 FCPS 수학 과목과, Algebra 1을 몇 학년에 듣게 되는지 자세히 정리했습니다.",
          linkHref: "/blog/fcps-math-pathways",
          linkLabel: "FCPS 수학 패스웨이 총정리 보기",
        },
      },
    ],
    faqKo: [
      {
        q: "AAP는 한국의 영재반과 같은 건가요?",
        a: "비슷하지만 같지는 않습니다. AAP는 FCPS 공립학교 안에서 운영되는 심화 프로그램이라 따로 내는 학비가 없고, 수학뿐 아니라 언어·과학·사회도 더 깊게 배웁니다.",
      },
      {
        q: "AAP 센터(Level IV)는 몇 학년부터 다니나요?",
        a: "풀타임 Level IV는 3학년부터 시작합니다. 그래서 신청과 심사는 보통 2학년 때 이뤄집니다.",
      },
      {
        q: "AAP 신청 마감은 언제인가요?",
        a: "Level IV 추천서는 보통 학년 초부터 12월 중순까지 받습니다. 정확한 날짜는 학년도마다 다르므로 학교 AART 선생님이나 FCPS 웹사이트에서 확인하세요.",
      },
      {
        q: "AAP에 선발되지 않으면 다시 지원할 수 있나요?",
        a: "네. 다음 해에 다시 추천서를 낼 수 있습니다. FCPS는 일반 과정 학생도 3~6학년 동안 해마다 Advanced Math로 옮겨 갈 수 있게 하겠다고 밝혔습니다.",
      },
      {
        q: "영어가 서툴러도 AAP에 지원할 수 있나요?",
        a: "지원할 수 있습니다. FCPS가 쓰는 NGAT는 Verbal 영역도 글 대신 그림으로 문제를 내서 영어 실력의 영향을 줄이도록 만든 시험입니다. 다만 다른 심사 자료에는 영어가 영향을 줄 수 있으니 담임 선생님과 미리 상의해 보세요.",
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
          "AAP services run on four levels. Levels I and II happen inside every elementary classroom, so families rarely need to apply for them. When parents say \"AAP,\" they usually mean Level III or Level IV. Part-time (Level III, grades 3-6) means the student stays at their home school and receives advanced instruction in some subjects. Full-time (Level IV) covers all core subjects in an advanced class starting in 3rd grade, either at a designated AAP center school or at a home school that offers Local Level IV.",
        ],
      },
      {
        heading: "How Is Placement Determined?",
        paragraphs: [
          "For full-time (Level IV) placement, a central FCPS selection committee looks at several sources together: ability test scores such as the NGAT (Naglieri General Ability Test), report cards and achievement data, teacher input, student work samples, and parent input. No single score determines placement. The NGAT replaced the former CogAT and NNAT tests starting in the 2025-2026 school year.",
          "Full-time referrals typically close in mid-December for the following school year. Students who aren't selected can be referred again the next year. Level III placement is decided by a committee at each local school.",
        ],
        visual: {
          type: "checklist",
          title: "What Level IV Screening Considers",
          items: [
            { text: "Ability test score", note: "NGAT, replacing CogAT and NNAT from 2025-26" },
            { text: "Report cards and achievement data" },
            { text: "Teacher input" },
            { text: "Student work samples" },
            { text: "Parent input", note: "Referral deadline: usually mid-December" },
          ],
        },
      },
      {
        heading: "Why AAP Math Matters for the Long-Term Pathway",
        paragraphs: [
          "The biggest effect of elementary advanced math is on when a student takes Algebra 1. FCPS expects every student to complete Algebra 1 by the end of 8th grade, and a student who completes Advanced Math 6 can take Algebra 1 Honors a year earlier, in 7th grade.",
          "Taking Algebra 1 a year early moves every high school math course up a year, so the student reaches AP Calculus in 11th grade. The standard 8th-grade Algebra 1 path still reaches AP Calculus by 12th grade, so missing the advanced track is not the end of the road.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "Grades 3-5", sublabel: "Advanced Math" },
            { label: "6th Grade", sublabel: "Advanced Math 6" },
            { label: "7th Grade", sublabel: "Algebra 1 Honors" },
          ],
          finalLabel: "AP Calculus in 11th",
        },
      },
      {
        heading: "What Parents Can Do",
        paragraphs: [
          "Start by confirming which track your child is currently in. Check their course list in ParentVUE or ask their teacher directly. If the course name says 'Advanced Math' or shows a grade level higher than your child's current grade, they are in the advanced track.",
          "If you're targeting AAP placement, focus on familiarizing your child with NGAT question formats, and building solid math concept foundations. If your child is already in AAP, the priority is sustaining performance and keeping pace with accelerated content.",
        ],
      },
    ],
  },
  {
    slug: "cogat-nnat-guide",
    publishedAt: "2026-07-27",
    updatedAt: "2026-10-23",
    readingMins: 7,
    category: "시험",
    categoryEn: "Testing",
    titleKo: "NGAT 시험 총정리: FCPS AAP 선발 시험 (구 CogAT·NNAT)",
    titleEn: "A Complete Guide to the NGAT (formerly CogAT & NNAT)",
    descKo: "FCPS는 2025-26학년도부터 CogAT·NNAT 대신 NGAT로 AAP 선발 검사를 합니다. 2학년 단체 시험, Verbal·Nonverbal·Quantitative 세 영역, NAI 점수와 백분위 읽는 법, 집에서 준비하는 방법을 한국 학부모님 눈높이로 정리했습니다.",
    descEn: "Everything parents need to know about the NGAT, the ability test now used for FCPS AAP placement, including structure, scoring, timing, and preparation strategies. It replaced CogAT and NNAT starting in the 2025-2026 school year.",
    heroImage: {
      src: "/blog/cogat-nnat-guide-hero.jpg",
      altKo: "도형 패턴 퍼즐을 풀며 골똘히 생각하는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child thoughtfully solving a shape pattern puzzle",
    },
    bodyKo: [
      {
        heading: "결론부터: 2학년 때 학교에서 보는 AAP 선발 시험입니다",
        paragraphs: [
          "NGAT(Naglieri General Ability Test)는 FCPS가 AAP(심화반) 선발에 쓰는 능력검사입니다. 국어·수학처럼 배운 내용을 묻는 시험이 아니라, 처음 보는 문제를 논리적으로 푸는 추론 능력을 봅니다. 한국으로 치면 학교 시험보다 사고력·적성 검사에 가깝습니다.",
          "예전에는 1학년이 NNAT, 2학년이 CogAT를 봤지만, 2025-26학년도부터 두 시험이 NGAT 하나로 바뀌었습니다. 학부모 커뮤니티에 아직 CogAT·NNAT라는 이름이 많이 보이는 것은 이 변화 전에 쓴 글이 많기 때문입니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "이전 (CogAT·NNAT)", tone: "standard", points: ["2학년 전체 CogAT 실시", "1학년 전체 NNAT 실시", "학년별로 다른 시험"] },
            { label: "현재 (NGAT)", tone: "advanced", points: ["2~7학년 심사에 시험 하나로 통일", "Verbal·Nonverbal·Quantitative 통합"] },
          ],
        },
      },
      {
        heading: "NGAT에는 어떤 문제가 나오나요?",
        paragraphs: [
          "NGAT는 Verbal(언어), Nonverbal(비언어), Quantitative(수량) 세 영역으로 이뤄져 있습니다. NNAT를 만든 심리학자 Jack Naglieri가 개발한 시험으로, 기존 CogAT의 세 영역을 시험 하나에 담은 형태라고 보면 됩니다.",
          "Verbal 영역도 글이 아니라 그림으로 문제를 냅니다. 여섯 개의 그림 가운데 다섯 개에 공통으로 해당하는 개념을 찾는 방식이라, 영어가 서툰 아이도 문제 형식 때문에 불리하지 않도록 만들어졌습니다.",
          "Nonverbal 영역은 도형·색·순서·방향 사이의 규칙을 찾는 문제이고, Quantitative 영역은 숫자와 기호 사이의 관계를 추론하는 문제입니다. 세 영역 모두 계산 속도보다 생각하는 방식을 봅니다.",
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
        heading: "NGAT 점수는 어떻게 읽나요?",
        paragraphs: [
          "NGAT 결과는 NAI(Naglieri Ability Index)라는 점수와 백분위(Percentile Rank)로 나옵니다. NAI는 같은 나이 학생들과 비교한 점수로, 평균이 100이고 대부분의 학생이 85~115 사이에 있습니다.",
          "백분위는 같은 나이 학생 100명 중 몇 명보다 높은지를 뜻합니다. 백분위 99라면 100명 중 99명보다 높다는 뜻으로, 상위 1%에 해당합니다. 한국의 석차 백분율과는 방향이 반대라서 숫자가 클수록 좋은 점수입니다.",
          "풀타임 AAP(Level IV)는 학부모들 사이에서 상위 3~5% 정도가 기준이라고 흔히 이야기됩니다. 하지만 FCPS는 공식 커트라인을 발표하지 않으며, 시험 점수만으로 결정하지 않고 교사 의견과 학업 자료를 함께 봅니다.",
        ],
        visual: {
          type: "stat",
          value: "상위 3~5%",
          label: "풀타임 AAP(Level IV)에서 흔히 거론되는 점수대 (공식 커트라인 아님)",
          source: "NAI 평균 100, 대부분 85~115 분포 (백분위 99 = 상위 1%)",
        },
        visualPosition: "before",
      },
      {
        heading: "NGAT는 언제, 어떻게 보나요?",
        paragraphs: [
          "FCPS는 2학년 학생 전원에게 학교에서 단체로 NGAT를 실시합니다. 따로 신청하지 않아도 되며, 3학년부터 시작하는 풀타임 AAP 선발의 첫 단계가 됩니다.",
          "다른 학년(2~7학년) 학생이 심사를 받으려면 학부모가 학교에 추천서(Referral)를 내야 합니다. 풀타임 AAP 추천서는 보통 8월 중순부터 12월 중순까지 받으며, 정확한 마감일은 해마다 조금씩 다르므로 학교의 AART(AAP 담당 교사)나 학교 홈페이지 공지를 확인하세요.",
          "결과가 나오면 학교가 학부모에게 알려 주고, 이후 포트폴리오 심사를 거쳐 최종 배치가 정해집니다. FCPS는 조지메이슨대학교 CEWS 프로그램처럼 외부에서 개별로 본 CogAT·NNAT-3 점수나 WISC-V 점수도 인정합니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "NGAT 한 페이지 정리",
          text: "NGAT 시험 구성과 AAP 선발 단계를 한 페이지에 정리해 두었습니다.",
          linkHref: "/resources/testing/ngat",
          linkLabel: "NGAT 안내 페이지 보기",
        },
      },
      {
        heading: "집에서는 어떻게 준비하나요?",
        paragraphs: [
          "NGAT는 외워서 푸는 시험이 아니므로, 짧은 기간에 문제집을 많이 푸는 방식은 효과가 크지 않습니다. 가장 현실적인 준비는 세 영역의 문제 형식을 미리 경험해 보는 것입니다. 처음 보는 형식에 당황하지 않는 것만으로도 실력을 제대로 보여 줄 수 있습니다.",
          "평소에는 퍼즐이나 패턴 놀이처럼 규칙을 찾는 활동이 도움이 됩니다. Quantitative 영역은 수학적 사고력과 이어지므로, Singapore Math나 Beast Academy처럼 개념을 깊이 다루는 교재로 꾸준히 생각하는 연습을 하면 실질적인 준비가 됩니다.",
          "시험을 앞두고 아이에게 부담을 주는 것은 피하세요. 긴장하면 실력보다 낮은 결과가 나오기 쉽습니다. '재미있는 퍼즐을 푸는 날' 정도로 이야기해 주는 편이 좋습니다.",
        ],
        visual: {
          type: "checklist",
          title: "집에서 해 볼 수 있는 활동",
          items: [
            { text: "도형 패턴·규칙 찾기 퍼즐" },
            { text: "'공통점 찾기' 대화", note: "예: 사과·바나나·포도의 공통점은?" },
            { text: "블록·탱그램 같은 공간 놀이" },
            { text: "개념 중심 사고력 수학", note: "Singapore Math, Beast Academy" },
            { text: "시험 형식 미리 경험하기", note: "벼락치기보다 익숙해지기" },
          ],
        },
      },
    ],
    faqKo: [
      {
        q: "NGAT와 CogAT는 무엇이 다른가요?",
        a: "둘 다 추론 능력을 보는 능력검사입니다. FCPS는 2025-26학년도부터 1학년 NNAT와 2학년 CogAT 대신 NGAT 하나를 쓰며, NGAT는 Verbal·Nonverbal·Quantitative 세 영역을 한 시험에 담았습니다.",
      },
      {
        q: "NGAT는 따로 신청해야 하나요?",
        a: "2학년은 학교에서 전원이 단체로 보므로 신청할 필요가 없습니다. 다른 학년이 심사를 받으려면 학부모가 학교에 추천서(Referral)를 내야 합니다.",
      },
      {
        q: "NGAT 점수가 몇 점이면 AAP에 선발되나요?",
        a: "FCPS는 공식 커트라인을 발표하지 않습니다. 흔히 상위 3~5% 수준이 이야기되지만, 교사 의견과 학업 자료를 함께 보는 종합 심사라서 점수만으로 결정되지 않습니다.",
      },
      {
        q: "영어를 잘 못해도 NGAT를 볼 수 있나요?",
        a: "네. NGAT는 Verbal 영역도 글이 아닌 그림으로 문제를 내서, 영어 실력이 결과에 미치는 영향을 줄이도록 만들어졌습니다.",
      },
      {
        q: "NGAT 대비 학원을 꼭 다녀야 하나요?",
        a: "꼭 그럴 필요는 없습니다. 추론 능력을 보는 시험이라 문제 형식에 익숙해지는 정도면 충분하고, 평소의 사고력 수학과 퍼즐 활동이 더 효과적인 준비입니다.",
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
          "Parents often cite roughly the top 3–5% as the typical range for full-time AAP (Level IV), but FCPS does not publish an official cutoff, and scores are never the sole deciding factor. Teacher input and academic performance are also weighed.",
        ],
        visual: {
          type: "stat",
          value: "Top 3-5%",
          label: "Range often cited for full-time AAP (Level IV), not an official cutoff",
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
    updatedAt: "2026-10-23",
    readingMins: 6,
    category: "교재",
    categoryEn: "Curriculum",
    titleKo: "싱가포르 수학(Singapore Math)이란? 특징과 한국 수학과의 차이",
    titleEn: "Why Singapore Math Works",
    descKo: "싱가폴 수학이라고도 부르는 Singapore Math는 미국 영재교육에서 많이 쓰는 수학 교육법입니다. CPA 접근법과 바 모델(Bar Model)이 무엇인지, 한국·미국 수학 수업과 어떻게 다른지, 대표 교재와 Beast Academy와의 관계까지 쉽게 설명합니다.",
    descEn: "An accessible explanation of what Singapore Math is, why it's widely adopted in gifted education programs, and how it differs from traditional US math instruction.",
    heroImage: {
      src: "/blog/singapore-math-explained-hero.jpg",
      altKo: "책상에서 색색의 수학 교구 블록을 가지고 학습하는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child learning with colorful math manipulative blocks at a desk",
    },
    bodyKo: [
      {
        heading: "Singapore Math는 어떤 수학인가요?",
        paragraphs: [
          "Singapore Math(싱가포르 수학, 흔히 '싱가폴 수학')는 1980년대 싱가포르 교육부가 만든 수학 교육과정에서 출발했습니다. 싱가포르는 이 방식을 도입한 뒤 국제 수학·과학 성취도 평가(TIMSS)에서 꾸준히 최상위권을 기록했고, 이를 본 미국의 여러 학군과 영재 교육 프로그램이 Singapore Math를 도입했습니다.",
          "핵심 철학은 '적게 가르치고 더 깊이 배운다(Teach Less, Learn More)'입니다. 한 학년에 많은 단원을 빠르게 훑기보다, 핵심 개념을 충분히 이해한 뒤 다음 개념으로 넘어갑니다.",
        ],
        visual: {
          type: "checklist",
          title: "이 글의 핵심 요약",
          items: [
            { text: "개념을 '왜'부터 깊이 이해하게 하는 수학입니다" },
            { text: "실물 → 그림 → 숫자 순서로 배웁니다", note: "CPA 접근법" },
            { text: "막대 그림(Bar Model)으로 문장제를 풉니다" },
            { text: "교재는 아이의 실제 수준에 맞춰 고릅니다", note: "무료 배치고사 활용" },
            { text: "Beast Academy와 함께 쓰면 효과가 큽니다" },
          ],
        },
      },
      {
        heading: "CPA 접근법이란 무엇인가요?",
        paragraphs: [
          "Singapore Math의 대표적인 교수법은 CPA 접근법입니다. Concrete(구체물), Pictorial(그림), Abstract(추상)의 앞 글자를 딴 이름으로, 새 개념을 이 세 단계 순서로 배웁니다.",
          "분수를 예로 들면, 먼저 블록이나 피자 모형을 직접 반으로 나눠 봅니다. 다음에는 원이나 막대를 나눈 그림으로 표현하고, 마지막에야 '1/2'이라는 기호를 씁니다. 이렇게 배우면 숫자 뒤에 있는 의미를 직관적으로 이해하게 됩니다.",
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
        heading: "바 모델(Bar Model)은 무엇인가요?",
        paragraphs: [
          "바 모델은 문장제 문제의 내용을 막대 그림으로 그려, 문제의 구조를 눈으로 보이게 하는 방법입니다. Singapore Math의 가장 큰 특징으로 꼽힙니다.",
          "예를 들어 '민수는 영희보다 사탕이 12개 더 많고, 둘이 가진 사탕은 모두 48개입니다. 민수의 사탕은 몇 개일까요?'라는 문제가 있다고 해 봅시다. 영희의 막대 하나와, 그보다 12만큼 긴 민수의 막대를 그리면 48에서 12를 뺀 36을 똑같이 둘로 나누면 된다는 것이 보입니다. 영희는 18개, 민수는 30개입니다.",
          "방정식을 배우기 전인 초등학생도 이 방법으로 논리적으로 풀 수 있고, 나중에 대수(Algebra)를 배울 때 그대로 기초가 됩니다. 영어로 된 문장제가 어려운 아이에게도 문제를 그림으로 정리하는 습관이 큰 도움이 됩니다.",
        ],
      },
      {
        heading: "한국·미국 수학 수업과 무엇이 다른가요?",
        paragraphs: [
          "전통적인 미국 수학 수업은 공식과 계산 절차를 먼저 가르치고 비슷한 문제를 반복해서 풀게 하는 경우가 많습니다. 계산은 빨라지지만 '왜 그렇게 되는지'는 이해하지 못한 채 넘어가기 쉽습니다.",
          "Singapore Math는 반대로 '왜'를 먼저 이해시키고, 그 개념을 그림과 말로 설명하게 합니다. 나눗셈이 무엇인지 제대로 이해한 아이는 공식을 잊어도 스스로 다시 떠올릴 수 있습니다.",
          "요즘 FCPS 수업도 답보다 풀이 과정을 설명하는 것을 중요하게 봅니다. 한국에서 계산을 잘하던 아이가 미국 학교에서 '생각을 설명하라(Explain your thinking)'는 문제에 당황하는 것도 이 때문입니다. NGAT(구 CogAT·NNAT) 같은 추론 시험이나 AMC 8 같은 경시대회에서 Singapore Math로 공부한 학생이 강한 이유이기도 합니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "전통적 미국 수학", tone: "standard", points: ["공식·절차를 먼저 학습", "반복 연산으로 계산 속도 향상", "'왜'는 이해 못하는 경우가 많음"] },
            { label: "Singapore Math", tone: "advanced", points: ["'왜'를 먼저 완전히 이해", "개념을 잊어도 스스로 다시 떠올림", "추론 시험·경시대회에 강함"] },
          ],
        },
      },
      {
        heading: "Singapore Math 교재는 무엇이 있나요?",
        paragraphs: [
          "Singapore Math 교재는 여러 출판사에서 나옵니다. 가정에서 많이 쓰는 것은 Singapore Math Inc.의 Dimensions Math와 Primary Mathematics 시리즈이고, 미국 학교에서는 Math in Focus라는 교과서를 쓰기도 합니다.",
          "교재는 학년보다 아이의 실제 수준에 맞춰 고르세요. 출판사 웹사이트에서 무료 배치고사(Placement Test)를 제공하므로, 먼저 풀어 보고 시작 단계를 정하는 것이 좋습니다. 한국에서 진도를 많이 나간 아이도 영어 문장제와 설명 문제에 익숙해질 때까지는 한 단계 아래에서 시작하는 편이 수월할 수 있습니다.",
        ],
        visual: {
          type: "table",
          headers: ["교재", "특징"],
          rows: [
            { label: "Dimensions Math", values: ["Singapore Math Inc. 출판. 그림과 설명이 풍부한 가정·학교용 시리즈"] },
            { label: "Primary Mathematics", values: ["싱가포르 원조 교과서를 바탕으로 한 시리즈"] },
            { label: "Math in Focus", values: ["미국 학교용으로 만든 Singapore Math 교과서"] },
            { label: "Beast Academy", values: ["AoPS 출판. 만화 형식의 초등 심화 사고력 교재"] },
          ],
        },
      },
      {
        heading: "Beast Academy와는 어떤 관계인가요?",
        paragraphs: [
          "Beast Academy는 수학 올림피아드 교육으로 유명한 AoPS(Art of Problem Solving)가 Singapore Math의 철학을 바탕으로 만든 초등 심화 수학 교재입니다. 만화책 형식의 Guide와 문제집인 Practice로 구성되어 있고, 초등 1~5학년 수준을 다룹니다.",
          "Singapore Math가 개념의 뿌리를 단단히 한다면, Beast Academy는 그 위에서 처음 보는 문제를 끈기 있게 푸는 힘을 키워 줍니다. 그래서 두 교재를 함께 쓰는 가정이 많습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "다음 단계가 궁금하다면",
          text: "MOEMS, AMC 8, Math Kangaroo 등 초등학생이 참가할 수 있는 미국 수학 경시대회를 비교했습니다.",
          linkHref: "/blog/math-competitions-fcps",
          linkLabel: "미국 초등 수학 경시대회 정리 보기",
        },
      },
    ],
    faqKo: [
      {
        q: "싱가폴 수학과 싱가포르 수학은 같은 건가요?",
        a: "네, 같은 Singapore Math를 가리킵니다. 싱가포르 교육부의 교육과정에서 출발한 개념 중심 수학 교육법과 그 교재를 통틀어 부르는 말입니다.",
      },
      {
        q: "Singapore Math는 어느 단계부터 시작하면 되나요?",
        a: "학년보다 아이의 실제 수준에 맞추는 것이 중요합니다. 출판사 웹사이트의 무료 배치고사(Placement Test)를 먼저 풀어 보고 시작 단계를 정하세요.",
      },
      {
        q: "Beast Academy와 Singapore Math 중 무엇을 먼저 해야 하나요?",
        a: "개념이 아직 탄탄하지 않다면 Singapore Math로 기초를 다지고, 사고력 문제에 흥미를 보이면 Beast Academy를 더하는 순서를 권합니다. 두 교재를 함께 써도 좋습니다.",
      },
      {
        q: "바 모델은 집에서 어떻게 연습하나요?",
        a: "문장제를 풀 때 바로 식을 세우지 말고, 문제에 나온 양을 먼저 막대로 그리게 해 보세요. 어느 부분이 같고 어느 부분이 더 긴지 보이면 식이 자연스럽게 나옵니다.",
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
          "Singapore Math inverts this. Students who deeply understand division can reconstruct the concept even if they forget a formula. This is why Singapore Math students tend to perform well on reasoning-based tests like the NGAT (formerly CogAT and NNAT), and in competitions like AMC 8.",
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
          "Beast Academy is a gifted math series for grades 1–5 created by Art of Problem Solving (AoPS), built on Singapore Math's foundational philosophy. It consists of comic-book-style Guide books and companion Practice workbooks that develop creative problem solving and mathematical discussion.",
          "If Singapore Math builds deep conceptual roots, Beast Academy grows creative reasoning on top of them. The two programs complement each other, which is why using them together produces the strongest results.",
        ],
      },
    ],
  },
  {
    slug: "math-competitions-fcps",
    publishedAt: "2025-05-15",
    updatedAt: "2026-10-23",
    readingMins: 6,
    category: "경시대회",
    categoryEn: "Competitions",
    titleKo: "미국 초등학생 수학 경시대회 정리: MOEMS·AMC 8·Math Kangaroo",
    titleEn: "Math Competitions Open to FCPS Students",
    descKo: "페어팩스(FCPS) 초등학생이 참가할 수 있는 대표적인 미국 수학 경시대회 3가지를 비교했습니다. 대상 학년, 시험 시기, 난이도, 신청 방법과 함께 몇 학년부터 준비를 시작하면 좋은지 정리했습니다.",
    descEn: "An overview of major math competitions available to FCPS elementary students, including MOEMS, AMC 8, Math League, and Math Kangaroo, with details on difficulty, timing, and how to participate.",
    heroImage: {
      src: "/blog/math-competitions-fcps-hero.jpg",
      altKo: "책상에서 트로피를 자랑스럽게 들어 올리는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child proudly holding up a trophy at their desk",
    },
    bodyKo: [
      {
        heading: "결론부터: 처음이라면 MOEMS나 Math Kangaroo로 시작하세요",
        paragraphs: [
          "미국에는 초등학생이 참가할 수 있는 수학 경시대회가 여러 개 있습니다. 학교 성적에 들어가는 시험은 아니지만, 학교 수업보다 깊은 사고력 문제를 경험할 좋은 기회입니다.",
          "페어팩스 지역 초등학생이 많이 참가하는 대회는 MOEMS, AMC 8, Math Kangaroo입니다. 처음이라면 문제 수가 적고 난이도가 적당한 MOEMS나 Math Kangaroo로 시작하고, 실력이 쌓이면 AMC 8에 도전하는 순서를 권합니다.",
        ],
        visual: {
          type: "table",
          headers: ["", "MOEMS", "AMC 8", "Math Kangaroo"],
          rows: [
            { label: "대상 학년", values: ["4~6학년(E) / 6~8학년(M)", "8학년 이하", "K~12학년 전체"] },
            { label: "형식", values: ["5회 × 30분 × 5문제", "25문항, 40분 객관식", "학년별 문항 수, 75분"] },
            { label: "시행 시기", values: ["11월~3월(5회)", "매년 1월", "매년 3월"] },
            { label: "신청 방법", values: ["학교·학원 팀 단위", "시행 학교·시험장 통해", "개인 신청 가능"] },
            { label: "난이도", values: ["창의적이나 접근 쉬움", "후반부 상당히 어려움", "학년별로 조정"] },
          ],
        },
      },
      {
        heading: "수학 경시대회는 왜 참가하나요?",
        paragraphs: [
          "경시대회 문제는 공식을 대입해서 바로 풀리지 않는 경우가 많습니다. 처음 보는 문제를 여러 방법으로 시도해 보는 경험이 수학적 자신감을 키웁니다. 틀려도 학교 성적에 남지 않으므로 부담 없이 도전할 수 있습니다.",
          "결과보다 준비 과정이 더 중요합니다. 경시대회를 준비하며 생긴 문제 해결력과 풀이를 설명하는 습관은 학교 수학과 이후의 더 어려운 대회까지 그대로 이어집니다.",
        ],
      },
      {
        heading: "MOEMS: 초등학생이 시작하기 가장 좋은 대회",
        paragraphs: [
          "MOEMS(Math Olympiad for Elementary and Middle Schools)는 1977년에 세워진 비영리 단체가 운영하는 대회로, 전 세계에서 매년 17만 명 이상이 참가합니다. 초등부(Division E, 4~6학년)와 중등부(Division M, 6~8학년)가 있습니다.",
          "11월부터 3월까지 한 달에 한 번씩 모두 5회 시험을 보고, 한 번에 30분 동안 5문제를 풉니다. 개인이 아니라 학교나 학원 같은 팀 단위로 등록하며, 한 팀은 최대 35명입니다. 문제는 창의적인 생각을 요구하지만 초등학생도 충분히 도전할 수 있는 수준입니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "MOEMS 자세히 보기",
          text: "MOEMS 점수 계산 방법과 Division E·M 샘플 문제를 안내 페이지에 모아 두었습니다.",
          linkHref: "/resources/testing/moems",
          linkLabel: "MOEMS 안내 페이지 보기",
        },
      },
      {
        heading: "AMC 8: 미국수학협회가 여는 대표 대회",
        paragraphs: [
          "AMC 8(American Mathematics Competition 8)은 미국수학협회(MAA)가 매년 1월에 여는 대회로, 8학년 이하라면 학년과 상관없이 응시할 수 있습니다. 25문항을 40분 동안 푸는 5지선다 객관식 시험입니다.",
          "난이도는 MOEMS보다 높고, 특히 뒤쪽 10문제는 여러 개념을 엮어야 풀립니다. AMC 8은 미국 수학 올림피아드로 이어지는 AMC 시리즈의 첫 단계입니다. 다만 AMC 8 자체에는 다음 라운드가 없고, AMC 10·12에서 좋은 성적을 받아야 AIME와 USAMO로 올라갈 수 있습니다.",
        ],
        visual: {
          type: "pathway",
          steps: [{ label: "AMC 8" }, { label: "AMC 10/12" }, { label: "AIME" }],
          finalLabel: "USAMO",
        },
      },
      {
        heading: "Math Kangaroo: 전 세계 학생과 겨루는 국제 대회",
        paragraphs: [
          "Math Kangaroo(수학 캥거루)는 1991년 프랑스에서 시작된 국제 수학 대회로, 지금은 90개가 넘는 나라에서 열립니다. 유치원부터 12학년까지 학년별로 난이도가 나뉘어 있어 저학년도 참가하기 좋습니다.",
          "매년 3월(보통 셋째 목요일)에 시험을 보며, 시험 시간은 75분이고 문항 수는 학년에 따라 다릅니다. 참가 신청은 kangaroo.org에서 개인으로 할 수 있고, 소정의 참가비가 있습니다. 전 세계 같은 학년 학생들과 비교해 볼 수 있다는 점이 특징입니다.",
        ],
      },
      {
        heading: "몇 학년부터 준비하면 좋을까요?",
        paragraphs: [
          "MOEMS는 4학년부터 참가할 수 있으므로, 3학년 겨울쯤 지난 문제를 가볍게 풀어 보며 시작하면 자연스럽습니다. Math Kangaroo는 1~2학년도 참가할 수 있어 경시대회를 처음 경험하기에 좋습니다. AMC 8은 보통 5~6학년부터 본격적으로 준비하는 경우가 많습니다.",
          "어떤 대회든 벼락치기보다 평소의 사고력 수학이 바탕이 됩니다. 영어로 된 문제를 빠르게 읽는 것도 실력의 일부이므로, 미국에 온 지 얼마 안 된 아이라면 시간 제한 없이 문제를 읽고 이해하는 연습부터 시작하세요.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "AMC 8을 준비한다면",
          text: "2027년 AMC 8 시험 일정, 등록 방법, 커트라인, 15주 준비 계획을 따로 정리했습니다.",
          linkHref: "/blog/amc-8-2027-guide",
          linkLabel: "2027 AMC 8 가이드 보기",
        },
      },
    ],
    faqKo: [
      {
        q: "초등학생이 참가할 수 있는 미국 수학 경시대회는 무엇이 있나요?",
        a: "대표적으로 MOEMS(4~8학년), AMC 8(8학년 이하), Math Kangaroo(유치원~12학년)가 있습니다. 처음이라면 MOEMS나 Math Kangaroo로 시작하는 것을 권합니다.",
      },
      {
        q: "MOEMS는 개인으로 신청할 수 있나요?",
        a: "MOEMS는 학교나 학원 같은 팀 단위로 등록합니다. 자녀 학교가 참가하는지 먼저 물어보고, 참가하지 않는다면 MOEMS 팀을 운영하는 지역 학원이나 모임을 찾아보세요.",
      },
      {
        q: "AMC 8에서 상을 받으면 다음 대회에 나갈 수 있나요?",
        a: "아닙니다. AMC 8에는 다음 라운드가 없습니다. AIME 진출 자격은 AMC 10이나 AMC 12 성적으로 정해집니다.",
      },
      {
        q: "경시대회 결과가 학교 성적에 들어가나요?",
        a: "들어가지 않습니다. 경시대회는 학교 성적표와 별개이므로, 결과에 대한 부담 없이 사고력을 키우는 경험으로 활용하면 좋습니다.",
      },
    ],
    bodyEn: [
      {
        heading: "Why Participate in Math Competitions?",
        paragraphs: [
          "Math competitions challenge students in ways that classroom assessments don't. Encountering unfamiliar problem types, exploring multiple solution paths, and taking risks in a low-stakes environment all build genuine mathematical confidence.",
          "The preparation process matters more than the results. The problem-solving skills and the habit of explaining a solution carry straight into schoolwork and harder contests later on.",
        ],
      },
      {
        heading: "MOEMS, the Most Accessible Competition for Elementary Students",
        paragraphs: [
          "MOEMS (Math Olympiad for Elementary and Middle Schools) is run by a nonprofit founded in 1977, with over 170,000 participants worldwide. It has two divisions: Division E (grades 4–6) and Division M (grades 6–8).",
          "Students take five contests from November through March, each 30 minutes with 5 questions. Teams of up to 35 students register together through a school or outside group. Problems require creative thinking but are accessible to prepared elementary students. Past contests are available free at moems.org.",
        ],
      },
      {
        heading: "AMC 8, the Official National Math Competition",
        paragraphs: [
          "The AMC 8 (American Mathematics Competition 8), run by the Mathematical Association of America (MAA), is open to all students in 8th grade or below. Held each January, it consists of 25 multiple-choice questions in 40 minutes.",
          "Difficulty is higher than MOEMS, especially in the last 10 questions, which demand substantial mathematical creativity. The AMC 8 is the first step in the AMC series. It has no next round of its own; students qualify for the AIME and USAMO through the AMC 10 and AMC 12.",
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
          "Students have 75 minutes, and the number of questions varies by grade level. Individual registration is available at kangaroo.org with a small participation fee. It's a unique opportunity to compare performance against students internationally.",
        ],
        visual: {
          type: "table",
          headers: ["", "MOEMS", "AMC 8", "Math Kangaroo"],
          rows: [
            { label: "Grades", values: ["4-6 (Div E) / 6-8 (Div M)", "8th grade or below", "K-12, all grades"] },
            { label: "Format", values: ["5 contests × 30 min × 5 questions", "25 questions, 40 min, multiple-choice", "Varies by grade, 75 min"] },
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
    updatedAt: "2026-10-23",
    readingMins: 6,
    category: "학습전략",
    categoryEn: "Study Tips",
    titleKo: "집에서 하는 초등 수학 공부법 5가지: 하루 15분 엄마표·아빠표 수학",
    titleEn: "5 Evidence-Based Strategies for Building Math Skills at Home",
    descKo: "학원 없이도 집에서 할 수 있는 초등 수학 공부법 5가지를 연구 근거와 함께 소개합니다. 미국 학교의 영어 문장제(Word Problem)에 자주 나오는 표현까지, 한국에서 온 학부모님이 오늘 바로 해 볼 수 있는 방법만 골랐습니다.",
    descEn: "Five research-backed strategies parents can use at home to help their children build stronger math skills. No tutoring required to get started.",
    heroImage: {
      src: "/blog/math-practice-at-home-hero.jpg",
      altKo: "따뜻한 조명 아래 부모와 아이가 함께 숙제하는 모습을 그린 일러스트",
      altEn: "Warm illustration of a parent and child doing homework together under a cozy lamp",
    },
    bodyKo: [
      {
        heading: "결론부터: 길게 한 번보다 짧게 매일입니다",
        paragraphs: [
          "집에서 아이 수학을 봐 주려고 하면 무엇부터 해야 할지 막막합니다. 미국 학교 수학은 한국과 교과서도, 용어도 달라서 더 그렇습니다.",
          "하지만 집에서 할 일은 생각보다 단순합니다. 아래 다섯 가지는 모두 연구로 효과가 확인된 방법이고, 영어를 잘하지 못하는 부모님도 한국어로 함께 할 수 있습니다.",
        ],
        visual: {
          type: "checklist",
          title: "이 글의 핵심 요약",
          items: [
            { text: "매일 15분, 같은 시간에 연습하기" },
            { text: "이동 중에 암산 문제 내기" },
            { text: "영어 문장제는 소리 내어 읽기", note: "자주 나오는 표현 익히기" },
            { text: "틀린 문제는 원인을 찾고 다시 풀기" },
            { text: "'못 한다' 대신 '아직'이라고 말해 주기" },
          ],
        },
      },
      {
        heading: "1. 매일 15분, 짧게 자주 하세요",
        paragraphs: [
          "인지과학 연구에서 반복해서 확인된 '분산 학습(Spaced Practice)' 효과가 있습니다. 주말에 2시간 몰아서 공부하는 것보다 매일 15~20분씩 꾸준히 하는 것이 오래 기억하고 실력을 늘리는 데 훨씬 효과적입니다.",
          "한국에서 쓰던 연산 학습지나 문제집을 계속 써도 괜찮습니다. 다만 미국 학교와 단원 순서가 다를 수 있으니, 지금 학교에서 배우는 단원과 비슷한 내용을 골라 주세요.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "저녁 식사 후 15분처럼 시간을 정해 두세요. 학년·단원별 무료 수학 학습지는 영어로 되어 있어 미국 학교 수학 용어에 익숙해지는 데도 도움이 됩니다.",
          linkHref: "/worksheets",
          linkLabel: "무료 수학 학습지 보기",
        },
      },
      {
        heading: "2. 이동하면서 암산 문제를 내 보세요",
        paragraphs: [
          "암산(Mental Math)은 단순히 빨리 계산하는 능력이 아닙니다. 수를 쪼개고 합치며 유연하게 다루는 감각(Number Sense)을 길러 주고, 이것이 나중에 대수와 문제 해결의 기초가 됩니다. 여러 연구에서 암산을 잘하는 학생이 복잡한 문제에서도 더 좋은 결과를 보였습니다.",
          "미국 학교는 '답이 몇이냐'만큼 '어떻게 계산했느냐'를 자주 묻습니다. 집에서도 방법을 말로 설명해 보게 하면 학교 수업 방식에 자연스럽게 익숙해집니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "차로 이동할 때 '235 더하기 78은?'처럼 가볍게 물어보세요. 답을 맞혔는지보다 '어떻게 계산했어?'라고 방법을 묻는 것이 더 중요합니다.",
        },
      },
      {
        heading: "3. 영어 문장제는 소리 내어 읽게 하세요",
        paragraphs: [
          "계산은 잘하는데 문장제(Word Problem)에서 자주 틀린다면, 수학보다 읽기의 문제인 경우가 많습니다. 미국에 온 지 얼마 안 된 아이라면 더욱 그렇습니다. 문제를 소리 내어 읽으면 이해도가 높아지고, 필요한 정보와 필요 없는 정보를 가려내는 힘이 생깁니다.",
          "수학 문장제에는 자주 나오는 영어 표현이 정해져 있습니다. 아래 표현만 익혀도 문제를 이해하는 속도가 눈에 띄게 빨라집니다. 아이가 문제를 읽은 뒤 '무엇을 구하라는 문제인지' 한국어로 말해 보게 하세요.",
        ],
        visual: {
          type: "table",
          headers: ["영어 표현", "뜻", "주로 쓰는 계산"],
          rows: [
            { label: "in all / altogether / total", values: ["모두 합쳐서", "덧셈"] },
            { label: "sum", values: ["합", "덧셈"] },
            { label: "how many more / fewer", values: ["몇 개 더 많은지 / 적은지", "뺄셈"] },
            { label: "difference", values: ["차", "뺄셈"] },
            { label: "left / remain", values: ["남은 것", "뺄셈"] },
            { label: "each / per", values: ["각각 / ~마다", "곱셈 또는 나눗셈"] },
            { label: "product", values: ["곱", "곱셈"] },
            { label: "quotient / remainder", values: ["몫 / 나머지", "나눗셈"] },
            { label: "share equally", values: ["똑같이 나누다", "나눗셈"] },
            { label: "numerator / denominator", values: ["분자 / 분모", "분수"] },
          ],
        },
      },
      {
        heading: "4. 틀린 문제는 원인을 찾고 다시 풀게 하세요",
        paragraphs: [
          "틀린 문제는 실력을 늘리는 가장 좋은 재료입니다. 그냥 넘어가지 말고 왜 틀렸는지 함께 살펴보세요. 계산 실수인지, 개념을 몰랐는지, 문제를 잘못 읽었는지 원인을 알면 같은 실수가 줄어듭니다.",
          "미국에 온 지 얼마 안 된 아이는 영어를 잘못 읽어서 틀리는 경우가 많습니다. 이것은 수학 실력과는 다른 문제이므로, 원인을 나눠서 보면 아이도 덜 위축됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "시험지를 돌려받으면 틀린 문제만 하루 뒤에 다시 풀게 하세요. 어디서 실수했는지 아이가 스스로 말로 설명하게 하면 자기 생각을 점검하는 힘(메타인지)도 함께 자랍니다.",
        },
      },
      {
        heading: "5. '못 한다'가 아니라 '아직'이라고 말해 주세요",
        paragraphs: [
          "스탠퍼드 대학교 심리학자 Carol Dweck의 연구에 따르면, 능력은 노력으로 자란다고 믿는 학생(성장 마인드셋, Growth Mindset)이 '나는 원래 수학을 못해'라고 믿는 학생보다 장기적으로 더 높은 수학 성취를 보입니다.",
          "새로운 나라, 새로운 언어로 수학을 배우는 아이는 한동안 자신감이 떨어질 수 있습니다. 이럴 때 '못하는 게 아니라 아직 익숙하지 않은 것뿐'이라는 말이 큰 힘이 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "tip",
          title: "실천 방법",
          text: "아이가 어려워할 때 '괜찮아, 원래 어려운 거야'보다 '지금은 어렵지. 어떤 부분이 제일 어려웠어?'라고 구체적으로 물어보세요. 어려움은 인정하되 포기하지 않는 태도를 함께 만들어 가는 것이 중요합니다.",
        },
      },
    ],
    faqKo: [
      {
        q: "초등학생은 집에서 수학을 하루에 얼마나 공부하면 되나요?",
        a: "매일 15~20분이면 충분합니다. 주말에 몰아서 오래 하는 것보다 매일 짧게 꾸준히 하는 편이 기억에 오래 남습니다.",
      },
      {
        q: "한국 수학 문제집을 미국에서 계속 써도 되나요?",
        a: "써도 됩니다. 연산과 개념 연습에는 도움이 됩니다. 다만 학교와 단원 순서가 다르고 문장제가 영어로 나오므로, 학교에서 배우는 단원에 맞춰 고르고 영어 문장제 연습을 함께 해 주세요.",
      },
      {
        q: "영어 문장제를 어려워하는 아이는 어떻게 도와주나요?",
        a: "문제를 소리 내어 읽게 하고, 무엇을 구하는 문제인지 한국어로 말해 보게 하세요. in all, how many more, each처럼 자주 나오는 표현을 먼저 익히면 빠르게 좋아집니다.",
      },
      {
        q: "부모가 영어를 잘 못해도 수학 공부를 봐 줄 수 있나요?",
        a: "네. 수학 개념과 풀이 과정은 한국어로 이야기해도 충분합니다. 매일 공부하는 습관을 잡아 주고 '어떻게 풀었어?'라고 물어 주는 것만으로도 큰 도움이 됩니다.",
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
    updatedAt: "2026-10-23",
    readingMins: 6,
    category: "방학학습",
    categoryEn: "Summer Break",
    titleKo: "여름방학 수학 공부: 썸머 슬라이드(Summer Slide) 막는 법",
    titleEn: "Preventing the Summer Math Slide Before School Starts",
    descKo: "미국 초등학교 여름방학은 약 10주로 깁니다. 방학 동안 수학 실력이 떨어지는 '썸머 슬라이드(서머 슬라이드)'가 왜 생기는지, 개학 전 2~4주 동안 하루 15분으로 막는 방법을 정리했습니다.",
    descEn: "Why math skills fade faster than reading over summer break, what the research says, and practical steps parents can take in the final weeks before school starts.",
    heroImage: {
      src: "/blog/summer-math-slide-hero.jpg",
      altKo: "해변가 담요 위에서 책을 읽는 아이를 그린 따뜻한 여름 일러스트",
      altEn: "Warm summer illustration of a child reading a book on a beach blanket",
    },
    bodyKo: [
      {
        heading: "썸머 슬라이드(Summer Slide)란 무엇인가요?",
        paragraphs: [
          "썸머 슬라이드(Summer Slide)는 여름방학 동안 배운 내용을 잊어버려 실력이 뒤로 미끄러지는 현상을 말합니다. 서머 슬라이드, 여름 학습 손실(Summer Learning Loss)이라고도 부릅니다.",
          "미국 초등학교는 6월에 학년이 끝나고 8월 중순~말에 새 학년이 시작되므로, 여름방학이 약 10주로 한국보다 훨씬 깁니다. 의무 방학 숙제도 거의 없어서 집에서 챙기지 않으면 두 달 넘게 수학을 거의 하지 않게 됩니다.",
          "듀크대학교 심리학자 Harris Cooper가 1996년 발표한 연구에 따르면 학생들은 여름방학 동안 평균 약 한 달 분량의 학습 내용을 잊어버리며, 특히 수학 계산 능력이 읽기보다 더 많이 떨어졌습니다. 한 해의 손실은 작아 보여도 매년 쌓이면 학년이 올라갈수록 차이가 벌어집니다.",
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
        heading: "왜 수학이 특히 많이 떨어질까요?",
        paragraphs: [
          "읽기는 방학 중에도 자연스럽게 이어지는 경우가 많습니다. 도서관에 가거나, 재미로 책을 읽거나, 여행 중에 표지판과 메뉴판을 읽게 됩니다. 반면 아이가 스스로 나눗셈이나 분수 문제를 찾아서 푸는 일은 거의 없습니다.",
          "특히 계산 절차처럼 손에 익혀야 하는 기술은 쓰지 않으면 빨리 무뎌집니다. 개념을 이해하는 것과 그 개념을 빠르고 정확하게 적용하는 것은 다른 문제이고, 뒤쪽은 꾸준히 연습하지 않으면 쉽게 떨어집니다.",
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
        heading: "개학하면 교실에서는 무슨 일이 생기나요?",
        paragraphs: [
          "새 학년이 시작되면 선생님들은 보통 처음 몇 주 동안 지난 학년의 핵심 내용을 복습합니다. 반 전체가 같은 복습 기간을 거치기 때문에, 여름 동안 감을 유지한 아이와 그렇지 못한 아이의 차이가 이때 가장 크게 드러납니다.",
          "AAP나 심화반처럼 진도가 빠른 반일수록 복습 기간이 짧고 곧바로 새 단원으로 넘어가는 경향이 있습니다. 감이 떨어진 상태로 첫 단원을 맞이하면, 개념이 정리되지 않은 채로 더 어려운 내용을 쌓아 올리게 됩니다.",
        ],
      },
      {
        heading: "남은 여름 동안 집에서 할 수 있는 것",
        paragraphs: [
          "거창한 계획은 필요 없습니다. 하루 15분 정도의 짧은 복습을 매일 반복하는 것이 가장 효과적입니다. 지난 학년 워크북의 마지막 한두 단원을 다시 펼쳐 보거나, 틀렸던 문제만 골라 다시 풀어 보는 것만으로도 충분합니다.",
          "장을 보며 총액을 어림해 보거나, 요리하며 계량 단위를 바꿔 보는 것처럼 일상에서 수를 다룰 기회를 만들어 주는 것도 좋습니다. 여유가 있다면 새 학년 첫 단원을 가볍게 훑어보는 것도 도움이 되지만, 선행 학습이 아니라 '낯설지 않게 만드는' 정도로 접근하세요.",
        ],
        visual: {
          type: "checklist",
          title: "개학까지 2~4주 남았다면",
          items: [
            { text: "지난 학년 워크북 마지막 1~2단원 복습" },
            { text: "틀렸던 문제만 골라 다시 풀기" },
            { text: "장보기하며 총액 어림셈" },
            { text: "요리하며 계량 단위 바꿔 보기" },
            { text: "(여유가 있다면) 새 학년 첫 단원 가볍게 훑어보기" },
          ],
        },
      },
      {
        heading: "언제부터, 얼마나 하면 될까요?",
        paragraphs: [
          "개학까지 2~4주 남았을 때가 공부 리듬을 되찾기에 가장 좋은 시기입니다. 개학 직전 며칠 동안 몰아서 복습하는 것보다, 지금부터 매일 조금씩 규칙적으로 하는 것이 실제 효과가 큽니다.",
          "중요한 것은 분량이 아니라 꾸준함입니다. 두꺼운 복습 문제집을 새로 사기보다, 이미 풀었던 문제집을 다시 펼쳐 짧고 일정한 리듬을 만드는 편이 개학 후 첫 몇 주를 훨씬 수월하게 만들어 줍니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "복습 자료가 필요하다면",
          text: "지난 학년 복습에 쓸 수 있는 수학 학습지를 학년·단원별로 무료로 인쇄할 수 있습니다.",
          linkHref: "/worksheets",
          linkLabel: "학년별 무료 수학 학습지 보기",
        },
      },
    ],
    faqKo: [
      {
        q: "썸머 슬라이드는 얼마나 심한가요?",
        a: "연구에 따르면 여름방학 동안 평균 약 한 달 분량의 학습 내용이 줄어들며, 특히 수학 계산 능력이 읽기보다 더 많이 떨어집니다.",
      },
      {
        q: "여름방학에 수학은 하루에 얼마나 하면 되나요?",
        a: "하루 15분 정도면 충분합니다. 지난 학년 워크북의 마지막 단원을 다시 풀거나 틀렸던 문제만 다시 풀어 보는 것만으로도 효과가 있습니다.",
      },
      {
        q: "여름방학에 다음 학년 선행을 해야 하나요?",
        a: "선행보다 복습이 먼저입니다. 여유가 있다면 새 학년 첫 단원을 '낯설지 않을 정도'로만 가볍게 훑어보세요.",
      },
      {
        q: "미국 초등학교 여름방학은 언제인가요?",
        a: "FCPS 기준으로 보통 6월에 학년이 끝나고 8월 중순~말에 새 학년이 시작됩니다. 정확한 날짜는 학교 캘린더에서 확인하세요.",
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
    updatedAt: "2026-10-23",
    readingMins: 8,
    category: "새학기 준비",
    categoryEn: "Back to School",
    titleKo: "미국 초등학교 개학 준비 체크리스트: FCPS 서류·예방접종·준비물",
    titleEn: "The Back-to-School Checklist Every Parent Should Run Through",
    descKo: "FCPS 개학 전 학부모가 챙길 것을 순서대로 정리했습니다. ParentVUE로 담임 확인하기, 한국 영문 예방접종증명서와 버지니아 건강검진 서류, 영어 지원(EL), 학용품, 생활 리듬과 아이 마음 준비까지 미국 학교가 처음인 가정도 따라 할 수 있게 썼습니다.",
    descEn: "With just a few weeks left before school starts, here's a practical checklist covering everything from confirming your child's teacher to resetting sleep schedules and brushing up on math.",
    heroImage: {
      src: "/blog/back-to-school-checklist-hero.jpg",
      altKo: "책가방을 메고 새 학기를 준비하는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child with a backpack getting ready for the new school year",
    },
    bodyKo: [
      {
        heading: "개학 2~4주 전, 무엇부터 챙겨야 할까요?",
        paragraphs: [
          "여름방학이 끝나 갈수록 챙길 것이 한꺼번에 떠오릅니다. 담임 선생님은 누구인지, 학용품은 무엇을 사야 하는지, 서류는 다 냈는지. 미국 학교가 처음이라면 무엇을 모르는지조차 모르는 경우가 많습니다.",
          "FCPS의 개학일과 학사 일정은 학교 캘린더와 학교 홈페이지에서 확인할 수 있습니다. 개학 2~4주 전은 서두르지 않고 하나씩 준비할 수 있는 시기입니다. 아래 다섯 가지를 순서대로 점검해 보세요.",
        ],
        visual: {
          type: "checklist",
          title: "다섯 가지 준비 영역",
          items: [
            { text: "ParentVUE에서 담임·학교 안내 확인" },
            { text: "건강검진·예방접종 서류 제출", note: "버지니아 첫 입학이라면 필수" },
            { text: "영어 지원(EL)과 수학 감 되찾기" },
            { text: "생활 리듬·등하교·점심 준비" },
            { text: "아이 마음 챙기기" },
          ],
        },
      },
      {
        heading: "ParentVUE는 무엇이고, 무엇을 확인하나요?",
        paragraphs: [
          "ParentVUE(페어런트뷰)는 FCPS의 학부모용 웹사이트이자 앱입니다. 담임 선생님, 시간표, 성적표, 출결, 학교 공지를 한곳에서 볼 수 있습니다. 처음에는 학교에서 받은 활성화 코드(Activation Key)로 계정을 만듭니다. 코드를 받지 못했다면 학교 사무실(Main Office)에 요청하세요.",
          "FCPS는 보통 개학 1~2주 전쯤 ParentVUE에 담임 선생님 배정을 공개합니다. 학교마다 시점이 다를 수 있으니 개학이 가까워지면 며칠에 한 번씩 확인해 보세요. 담임 선생님 이름을 미리 알면 아이와 함께 이야기하며 마음의 준비를 할 수 있습니다.",
          "학용품 목록(School Supply List)과 방과후 프로그램 안내도 학교 홈페이지나 ParentVUE에 올라옵니다. 학용품 목록은 학교와 학년마다, 해마다 다르므로 꼭 올해 목록을 확인하세요.",
        ],
      },
      {
        heading: "한국에서 왔다면: 건강검진·예방접종 서류",
        paragraphs: [
          "버지니아주는 공립 초등학교에 처음 입학하는 학생에게 건강검진 결과와 예방접종 기록을 요구합니다. 건강검진은 입학 전 12개월 안에 받은 것이어야 하며, 보통 버지니아주 학교 입학 건강 양식(MCH 213G)을 소아과에 가져가 작성을 부탁합니다. 서류가 빠지면 등교가 늦어질 수 있습니다.",
          "한국에서 맞은 예방접종은 질병관리청 예방접종도우미 누리집(nip.kdca.go.kr)에서 영문 예방접종증명서를 발급받아 준비할 수 있습니다. 본인 인증이 필요하므로 출국 전에 미리 발급받아 오는 것이 가장 좋습니다.",
          "버지니아 기준에 비해 빠진 접종이 있으면 미국 소아과에서 추가 접종을 받아야 할 수 있습니다. 개학 직전에는 소아과 예약이 밀리므로 일찍 예약하세요. 서류에 관한 질문은 학교 보건실(Health Room)이나 학교 사무실에 하면 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "warning",
          title: "등교 전 꼭 확인하세요",
          text: "버지니아주 공립 초등학교에 처음 입학한다면 입학 전 12개월 안에 받은 건강검진 결과와 예방접종 기록이 필요합니다. 한국 접종 기록은 영문 예방접종증명서로 준비하세요.",
        },
      },
      {
        heading: "영어가 서툰 아이는 어떤 도움을 받나요?",
        paragraphs: [
          "등록할 때 집에서 영어 외의 언어를 쓴다고 적으면, 학교가 아이의 영어 실력을 진단합니다. 결과에 따라 영어 학습자(English Learner, EL)로 지정되어 일반 수업과 함께 영어 지원 수업을 받습니다.",
          "수학 수업도 영어로 진행되므로 처음에는 아이가 실력보다 낮게 보일 수 있습니다. 담임 선생님께 아이가 한국에서 어디까지 배웠는지 간단히 적어 보내면 수업 배치와 지도에 도움이 됩니다. 상담이 필요하면 학교에 한국어 통역을 요청할 수 있습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "첫 성적표를 받기 전에",
          text: "FCPS 초등학교 성적표는 A·B·C 대신 1~4점으로 표시됩니다. 미리 읽는 법을 알아 두면 당황하지 않습니다.",
          linkHref: "/blog/fcps-report-card-guide",
          linkLabel: "FCPS 성적표 보는 법",
        },
      },
      {
        heading: "수학 감 되찾기: 하루 15분이면 됩니다",
        paragraphs: [
          "여름 동안 수학과 멀어졌다면 개학 전 남은 몇 주를 활용해 감을 되찾아 두세요. 거창한 계획보다 지난 학년 워크북의 마지막 한두 단원을 다시 펼쳐 보거나, 틀렸던 문제만 골라 다시 풀어 보는 정도로 충분합니다. 하루 15분씩이라도 매일 하면 개학 첫 주의 부담이 눈에 띄게 줄어듭니다.",
          "여유가 있다면 새 학년 첫 단원을 가볍게 훑어보는 것도 좋습니다. 이때도 선행 학습이 아니라 '낯설지 않게 만드는' 정도면 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          text: "여름방학 동안 수학 실력이 왜, 얼마나 떨어지는지 더 자세히 알고 싶다면 아래 글을 참고하세요.",
          linkHref: "/blog/summer-math-slide",
          linkLabel: "썸머 슬라이드 막는 법 보기",
        },
      },
      {
        heading: "생활 리듬과 등하교·점심 준비",
        paragraphs: [
          "방학 동안 늦게 자고 늦게 일어나는 습관이 생겼다면 개학 1~2주 전부터 조금씩 되돌려 놓으세요. 하루 만에 학기 중 시간으로 바꾸려 하면 아이도 부모도 지치기 쉽습니다. 며칠 간격으로 15~30분씩 앞당기는 방법이 훨씬 수월합니다.",
          "스쿨버스를 탄다면 정류장 위치와 시간을 학교 안내로 미리 확인하고, 개학 전에 아이와 정류장까지 한 번 걸어가 보세요. 점심은 도시락을 싸 가거나 학교 급식을 사 먹을 수 있습니다. 급식비는 보통 온라인 계정에 미리 충전하는 방식이니 학교 안내를 확인하세요.",
        ],
        visual: {
          type: "checklist",
          title: "첫 주 전에 확인할 것",
          items: [
            { text: "취침·기상 시간을 며칠에 걸쳐 15~30분씩 앞당기기" },
            { text: "아침 준비와 식사에 걸리는 시간 재 보기" },
            { text: "버스 정류장과 시간 확인", note: "개학 전 한 번 걸어가 보기" },
            { text: "점심 방식 정하기", note: "도시락 또는 학교 급식" },
            { text: "방과후 돌봄 프로그램 신청 마감 확인", note: "인기 프로그램은 일찍 마감" },
          ],
        },
      },
      {
        heading: "첫 주에는 아이 마음이 먼저입니다",
        paragraphs: [
          "준비물과 서류를 아무리 꼼꼼히 챙겨도, 아이 마음속에는 새 선생님과 새 친구에 대한 긴장이 남아 있을 수 있습니다. 영어가 서툰 아이에게 첫 주는 더욱 그렇습니다. '화장실 가도 될까요?(May I go to the restroom?)', '도와주실 수 있나요?(Can you help me?)'처럼 꼭 필요한 영어 몇 문장을 미리 연습해 두면 큰 힘이 됩니다.",
          "첫 주에는 공부보다 적응이 먼저입니다. 학교에서 돌아온 아이에게 '오늘 뭐 배웠어?'보다 '오늘 제일 재미있었던 일이 뭐였어?'처럼 구체적으로 물어보면 훨씬 편하게 이야기를 시작합니다. 며칠 동안 아이의 표정과 말수를 살피는 것이 그 어떤 준비물보다 중요한 개학 준비입니다.",
        ],
      },
    ],
    faqKo: [
      {
        q: "미국 학교에 한국 예방접종 기록을 낼 수 있나요?",
        a: "네. 질병관리청 예방접종도우미(nip.kdca.go.kr)에서 영문 예방접종증명서를 발급받아 준비할 수 있습니다. 본인 인증이 필요하므로 출국 전에 발급받아 오는 것이 좋고, 빠진 접종이 있으면 미국 소아과에서 추가 접종이 필요할 수 있습니다.",
      },
      {
        q: "버지니아 학교 건강검진은 언제 받아야 하나요?",
        a: "버지니아주 공립 초등학교에 처음 입학하는 학생은 입학 전 12개월 안에 받은 건강검진 결과가 필요합니다. 학교 입학 건강 양식(MCH 213G)을 소아과에 가져가 작성을 부탁하면 됩니다.",
      },
      {
        q: "FCPS 담임 선생님은 언제 알 수 있나요?",
        a: "보통 개학 1~2주 전쯤 ParentVUE에 공개됩니다. 학교마다 시점이 다르니 개학이 가까워지면 자주 확인하세요.",
      },
      {
        q: "영어를 못하는 아이도 일반 수업을 듣나요?",
        a: "네. 일반 수업을 들으면서 영어 실력에 따라 영어 학습자(EL) 지원 수업을 함께 받습니다. 등록 후 영어 실력 진단을 거쳐 지원 여부가 정해집니다.",
      },
      {
        q: "ParentVUE 계정은 어떻게 만드나요?",
        a: "학교에서 받은 활성화 코드(Activation Key)로 만듭니다. 코드를 받지 못했다면 학교 사무실에 요청하세요.",
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
    updatedAt: "2026-10-23",
    readingMins: 8,
    category: "진학 로드맵",
    categoryEn: "High School Pathway",
    titleKo: "TJ 과학고(TJHSST) 입학 로드맵: 지원 자격과 초등 때 준비할 것",
    titleEn: "The TJHSST Roadmap: What Elementary Parents Should Know",
    descKo: "미국 최상위권 공립고로 꼽히는 TJ(토머스 제퍼슨 과학고, TJHSST)는 한국 과학고와 무엇이 다를까요? 8학년 Algebra 1 Honors와 GPA 3.5 같은 지원 자격, 시험 없는 홀리스틱 리뷰 전형, 초등학교 때부터 준비할 것을 정리했습니다.",
    descEn: "A parent-friendly introduction to TJHSST — what it actually is, how it differs from Korea's science and gifted high schools, and what elementary-age preparation actually looks like.",
    heroImage: {
      src: "/blog/tjhsst-roadmap-hero.jpg",
      altKo: "언덕 위 학교를 향해 구불구불한 길을 걷는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child walking a winding path toward a school on a hill",
    },
    bodyKo: [
      {
        heading: "TJ는 어떤 학교인가요?",
        paragraphs: [
          "페어팩스 카운티 학부모 사이에서 'TJ'라는 이름을 한 번쯤 들어 보셨을 겁니다. 정식 이름은 Thomas Jefferson High School for Science and Technology(토머스 제퍼슨 과학기술고등학교)이고, 줄여서 TJHSST 또는 TJ라고 부릅니다. FCPS가 운영하는 공립 고등학교로, 미국 고교 순위에서 자주 최상위권에 오르며 수학·과학·컴퓨터공학 교육으로 유명합니다.",
          "TJ는 미국에서 매그넷 스쿨(Magnet School)이라고 부르는 학교입니다. 매그넷 스쿨은 특정 분야를 집중해서 가르치기 위해, 사는 지역과 상관없이 지원을 받아 학생을 뽑는 공립학교입니다. 즉 집 주소로 배정되는 동네 고등학교가 아니라 따로 지원해서 들어가는 '선택형 공립학교'입니다.",
        ],
        visual: {
          type: "checklist",
          title: "이 글의 핵심 요약",
          items: [
            { text: "TJ는 학비가 없는 공립 과학고입니다" },
            { text: "8학년 가을에 지원해서 9학년으로 입학합니다" },
            { text: "입학시험 없이 성적·에세이 등을 종합 평가합니다" },
            { text: "8학년에 Algebra 1 Honors 이상을 들어야 지원할 수 있습니다" },
            { text: "초등학교 때는 수학 개념과 읽기·쓰기 습관이 기초가 됩니다" },
          ],
        },
      },
      {
        heading: "한국 과학고·영재고와 무엇이 다른가요?",
        paragraphs: [
          "STEM(과학·기술·공학·수학)에 강한 학생을 위한 학교라는 점은 한국의 과학고·영재고와 비슷합니다. 하지만 TJ는 등록금이 없는 공립학교로, 다른 공립 고등학교처럼 세금으로 운영됩니다. 기숙사 학교가 아니어서 학생들은 집에서 통학합니다.",
          "입학 방식도 다릅니다. TJ는 예전에는 입학시험을 봤지만, 2021년부터 시험 없이 여러 자료를 함께 보는 홀리스틱 리뷰(Holistic Review)로 바뀌었습니다. 성적(GPA), 자신의 역량을 보여 주는 Student Portrait Sheet, 문제 해결 에세이(Problem-Solving Essay)를 평가합니다.",
          "여기에 학생의 배경 요소(Experience Factors)도 함께 고려합니다. 영어 학습자(EL)인지, 경제적 지원이 필요한 가정인지 등이 여기에 해당합니다. 한국에서 와서 영어를 배우는 중인 학생이라면 알아 둘 만한 부분입니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "2021년 이전", tone: "standard", points: ["별도 입학시험 실시", "시험 점수 비중이 큼"] },
            { label: "현재 (Holistic Review)", tone: "advanced", points: ["입학시험 없음", "GPA·Student Portrait Sheet·문제 해결 에세이 종합 평가"] },
          ],
        },
      },
      {
        heading: "TJ 지원 자격과 시기는 어떻게 되나요?",
        paragraphs: [
          "TJ는 8학년(한국 중학교 2학년 나이) 학생이 9학년 입학을 목표로 지원합니다. 페어팩스 카운티뿐 아니라 Arlington, Loudoun, Prince William 카운티와 Falls Church 시에 사는 학생도 지원할 수 있습니다. 2026년 가을 지원서 접수 기간은 10월 5일부터 30일까지입니다.",
          "지원하려면 기본 조건을 갖춰야 합니다. 2026년 가을 기준으로 8학년에 Algebra 1 Honors 이상의 수학을 듣고, Honors 과학과 Honors 과목 하나를 더 듣고 있어야 하며, 핵심 과목 성적(GPA)이 3.5 이상이어야 합니다.",
          "세부 조건과 일정은 해마다 바뀔 수 있습니다. 지원을 생각한다면 매년 가을 FCPS의 TJ 입학 안내 페이지와 중학교 카운슬러를 통해 최신 내용을 확인하세요.",
        ],
        visual: {
          type: "checklist",
          title: "지원 기본 조건 (2026년 가을 기준)",
          items: [
            { text: "8학년 재학, 참여 지역 거주", note: "Fairfax·Arlington·Loudoun·Prince William 카운티, Falls Church 시" },
            { text: "8학년에 Algebra 1 Honors 이상 수강" },
            { text: "Honors 과학 + Honors 과목 1개 더 수강" },
            { text: "핵심 과목 GPA 3.5 이상", note: "가중치를 붙이지 않은 성적 기준" },
          ],
        },
      },
      {
        heading: "초등학교 때부터 무엇을 쌓아야 하나요?",
        paragraphs: [
          "지원 조건에서 보듯 TJ는 수학 과목과 바로 연결됩니다. 8학년에 Algebra 1 Honors를 들으려면 7학년까지 Prealgebra 과정을 마쳐야 합니다. 다행히 7학년 Prealgebra Honors와 8학년 Algebra 1 Honors는 FCPS에서 원하는 학생 누구나 신청할 수 있는 과목입니다.",
          "초등 심화 수학(Advanced Math)을 들으면 이 경로가 한두 해 앞당겨져, 8학년에 Geometry Honors처럼 더 높은 과목을 듣게 됩니다. 수학 경로에 대한 자세한 내용은 'FCPS 수학 패스웨이 총정리' 글을 참고하세요.",
          "홀리스틱 리뷰는 에세이와 문제 해결 과정을 함께 보므로 읽기·쓰기 습관도 수학만큼 중요합니다. 책을 꾸준히 읽고, 정답보다 풀이 과정을 말과 글로 설명하는 습관이 장기적으로 큰 자산이 됩니다. MOEMS 같은 경시대회 경험도 문제 해결 과정을 정리해 보는 좋은 연습입니다.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "초등 3~6학년", sublabel: "수학 개념·읽기·쓰기 습관" },
            { label: "7학년", sublabel: "Prealgebra 또는 Algebra 1" },
            { label: "8학년", sublabel: "Algebra 1 Honors 이상 + TJ 지원" },
          ],
          finalLabel: "TJ 9학년 입학",
        },
      },
      {
        heading: "학부모들이 흔히 하는 오해",
        paragraphs: [
          "가장 흔한 오해는 '선행 학원을 많이 다니면 TJ에 갈 수 있다'는 생각입니다. 홀리스틱 리뷰에서는 진도를 얼마나 나갔는지보다 개념을 얼마나 깊이 이해하고, 스스로 문제를 풀고, 그 과정을 명확하게 설명할 수 있는지가 더 중요합니다. 진도만 빠르고 이해가 얕으면 오히려 에세이에서 어려움을 겪을 수 있습니다.",
          "또 다른 오해는 '초등학교 때 AAP에 들어가지 못하면 TJ는 불가능하다'는 생각입니다. AAP는 유리한 경로이지만 필수 조건이 아닙니다. 8학년 Algebra 1 Honors는 원하는 학생 누구나 신청할 수 있고, 초등 심화 수학으로 옮겨 갈 기회도 해마다 있습니다.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "선행 학원을 많이 다니면 TJ에 갈 수 있다",
              fact: "홀리스틱 리뷰는 진도보다 개념 이해의 깊이, 스스로 문제를 푸는 힘, 설명하는 능력을 더 중요하게 봅니다.",
            },
            {
              myth: "초등학교 때 AAP에 들어가지 못하면 TJ는 불가능하다",
              fact: "AAP는 필수 조건이 아닙니다. 8학년 Algebra 1 Honors는 원하는 학생 누구나 신청할 수 있습니다.",
            },
            {
              myth: "한국에서 온 지 얼마 안 돼 영어가 부족하면 지원할 수 없다",
              fact: "TJ 전형은 영어 학습자(EL) 여부 같은 배경 요소도 함께 고려합니다. 다만 에세이는 영어로 쓰므로 꾸준한 읽기·쓰기 연습이 필요합니다.",
            },
          ],
        },
      },
      {
        heading: "지금 초등 학부모가 할 수 있는 것",
        paragraphs: [
          "자녀가 지금 초등학생이라면 8학년 지원까지 아직 몇 년이 남아 있습니다. 먼저 지금 어느 수학 과정에 있는지 확인하고, 진도보다 개념을 탄탄히 다지도록 도와주세요. 꾸준한 독서와 글쓰기, 그리고 풀이 과정을 설명하는 연습을 함께 쌓아 가면 좋습니다.",
          "담임 선생님이나 학교의 AART(AAP 담당 교사)와 정기적으로 소통하며 아이의 학업 상태를 파악해 두는 것도 중요합니다. 조급하게 서두르기보다 지금 할 수 있는 것부터 차근차근 쌓아 가는 것이 가장 확실한 로드맵입니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "함께 읽으면 좋은 글",
          text: "6학년부터 갈라지는 FCPS 수학 과목과, Algebra 1을 몇 학년에 듣게 되는지 정리했습니다.",
          linkHref: "/blog/fcps-math-pathways",
          linkLabel: "FCPS 수학 패스웨이 총정리 보기",
        },
      },
    ],
    faqKo: [
      {
        q: "TJ는 학비가 있나요?",
        a: "없습니다. TJ는 FCPS가 운영하는 공립학교라 등록금이 없습니다. 기숙사 학교가 아니므로 집에서 통학합니다.",
      },
      {
        q: "TJ는 몇 학년에 지원하나요?",
        a: "8학년 가을에 지원해서 9학년으로 입학합니다. 2026년 가을 지원서 접수 기간은 10월 5일부터 30일까지입니다.",
      },
      {
        q: "TJ 입학시험이 있나요?",
        a: "2021년부터 입학시험이 없습니다. 성적(GPA), Student Portrait Sheet, 문제 해결 에세이를 종합하는 홀리스틱 리뷰로 선발합니다.",
      },
      {
        q: "TJ에 지원하려면 수학은 어디까지 들어야 하나요?",
        a: "2026년 가을 기준으로 8학년에 Algebra 1 Honors 이상을 듣고 있어야 합니다. 이 과목은 FCPS에서 원하는 학생 누구나 신청할 수 있어, AAP 학생이 아니어도 도달할 수 있습니다.",
      },
      {
        q: "AAP에 들어가지 못하면 TJ는 어렵나요?",
        a: "그렇지 않습니다. AAP는 유리한 경로이지만 필수 조건은 아닙니다. 지원 조건을 갖추고 개념 이해와 글쓰기 능력을 꾸준히 키우는 것이 더 중요합니다.",
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
          "The admissions process is also different. TJ used to require a separate entrance exam, but since 2021 it has used a \"Holistic Review\" process instead — no test score, but a combined look at GPA, a Student Portrait Sheet, and a problem-solving essay, along with experience factors such as whether a student is an English learner. In other words, no single test score determines the outcome; several aspects of the student are considered together. The exact components and how they're weighted can shift from year to year, so families considering applying should check the school's official admissions page (tjhsst.fcps.edu) each fall for the current cycle's details.",
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
          "Students apply to TJ in 8th grade for admission the following year, as 9th graders. Eligibility extends beyond Fairfax County to Arlington, Loudoun, and Prince William counties and the City of Falls Church. For the fall 2026 cycle, applications were open October 5-30, and applicants needed to be taking Algebra 1 Honors or higher, an honors science course, and one more honors course in 8th grade, with at least a 3.5 unweighted GPA in core classes.",
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
          "Another misconception is that missing AAP placement in elementary school closes the door on TJ entirely. AAP is certainly an advantageous path, but it isn't required: Algebra 1 Honors in 8th grade is open to any student who wants it, and students can move into Advanced Math in any year from 3rd through 6th grade. Even if a family feels they started a bit later, consistently building conceptual understanding and reasoning skills is still meaningful preparation.",
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
              fact: "AAP isn't required. Algebra 1 Honors in 8th grade is open to any student who wants it",
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
  {
    slug: "math-anxiety-guide",
    publishedAt: "2026-08-27",
    updatedAt: "2026-10-23",
    readingMins: 7,
    category: "학습심리",
    categoryEn: "Learning & Mindset",
    titleKo: "수학 불안 체크리스트: 아이가 수학만 보면 긴장한다면 (수포자 예방)",
    titleEn: "Does Your Child Have Math Anxiety?",
    descKo: "“난 수학머리가 없어”라고 말하는 아이, 단순히 싫어하는 게 아닐 수 있습니다. 수학 불안의 신호 5가지와 원인, 부모가 무심코 하는 말, 집에서 해 볼 방법, 영어로 수업을 듣기 시작한 아이에게 필요한 도움까지 정리했습니다.",
    descEn: "Kids who freeze at word problems or say \"I'm just not a math person\" may be dealing with something more than dislike. Here's how to recognize math anxiety, what causes it, and what parents can actually do at home.",
    heroImage: {
      src: "/blog/math-anxiety-guide-hero.jpg",
      altKo: "문제지를 보며 걱정스러운 표정을 짓는 아이를 부모가 다정하게 다독이는 따뜻한 일러스트",
      altEn: "Warm illustration of a parent gently reassuring a child who looks worried while looking at a worksheet",
    },
    bodyKo: [
      {
        heading: "수학 불안이란 무엇인가요?",
        paragraphs: [
          "수학 불안(Math Anxiety)은 단순히 수학을 싫어하는 것과 다릅니다. 숫자나 수학 문제를 마주했을 때 긴장, 걱정, 심하면 두려움을 느끼는 정서적 반응으로, 실제 수학 실력과 상관없이 나타날 수 있습니다. 개념을 충분히 이해한 아이도 시험지를 받는 순간 머릿속이 하얘질 수 있습니다.",
          "연구에 따르면 수학 불안은 1학년 무렵부터 나타날 수 있습니다. 문제는 불안이 실제 수학 실력 발휘를 방해한다는 점입니다. 불안한 상태에서는 작업기억(Working Memory)이 걱정하는 데 쓰여, 정작 문제를 푸는 데 쓸 머리가 줄어듭니다. 한국에서 말하는 '수포자(수학을 포기한 학생)'도 처음에는 이런 불안에서 시작되는 경우가 많습니다.",
        ],
      },
      {
        heading: "우리 아이도 그럴까요? 흔한 신호 5가지",
        paragraphs: [
          "수학 불안은 '수학이 싫어'라는 말로만 드러나지 않습니다. 배가 아프다고 하거나, 숙제를 자꾸 미루거나, 쉬운 문제도 지우개로 여러 번 지우는 것처럼 간접적으로 나타나는 경우가 많아 부모가 알아차리기 어렵습니다.",
          "특히 다른 과목에서는 자신감 있는 아이가 유독 수학 시간에만 움츠러든다면, 실력이 아니라 불안의 문제일 가능성이 큽니다.",
        ],
        visual: {
          type: "checklist",
          title: "이런 모습이 반복된다면 확인해 보세요",
          items: [
            { text: "수학 숙제 시작을 유난히 미루거나 피한다" },
            { text: "수학 시험 전날 배가 아프다, 잠을 설친다고 한다" },
            { text: "쉬운 문제도 여러 번 지우고 다시 쓴다", note: "완벽해야 한다는 부담" },
            { text: "'난 원래 수학머리가 없어'라는 말을 자주 한다" },
            { text: "다른 과목은 자신 있어 하면서 수학 시간에만 위축된다" },
          ],
        },
      },
      {
        heading: "수학 불안은 어디서 시작될까요?",
        paragraphs: [
          "가장 흔한 원인 중 하나는 시간 제한이 있는 연산 테스트(Timed Test)입니다. 정해진 시간 안에 정확히 풀어야 한다는 압박은 실력과 상관없이 불안을 만듭니다. 실수를 허용하지 않는 분위기, 틀린 문제를 여러 사람 앞에서 지적받은 경험도 쌓이면 불안으로 이어집니다.",
          "어른의 태도도 영향을 줍니다. 아이는 어른의 표정과 말투에서 수학이 '무서운 것', '타고난 사람만 잘하는 것'이라는 메시지를 받아들입니다. 부모가 자신의 학창 시절 수학 경험을 부정적으로 이야기하는 것만으로도 아이에게 영향을 줄 수 있습니다.",
        ],
      },
      {
        heading: "미국에 막 온 아이라면 특히 살펴보세요",
        paragraphs: [
          "한국에서 수학을 잘하던 아이가 미국 학교에 와서 갑자기 수학을 싫어하게 되는 경우가 있습니다. 대부분 실력이 아니라 영어 때문입니다. 문장제 문제를 다 읽지 못하거나, 선생님의 설명을 놓치거나, 풀이를 영어로 설명하라는 요구에 위축되는 것입니다.",
          "이럴 때는 '수학'과 '영어'를 나눠서 봐 주세요. 집에서 같은 문제를 한국어로 설명해 보게 하면, 개념은 이미 알고 있는 경우가 많습니다. 그 사실을 아이에게 말해 주는 것만으로도 자신감이 돌아옵니다. 문장제에 자주 나오는 영어 표현을 익히는 것도 도움이 됩니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "영어 문장제가 어렵다면",
          text: "in all, how many more처럼 수학 문장제에 자주 나오는 영어 표현을 정리해 두었습니다.",
          linkHref: "/blog/math-practice-at-home",
          linkLabel: "수학 문장제 영어 표현 보기",
        },
      },
      {
        heading: "부모가 무심코 하는 말",
        paragraphs: [
          "좋은 뜻으로 한 말이 오히려 불안을 키우기도 합니다. 흔히 쓰지만 다시 생각해 볼 만한 표현들입니다.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "“엄마(아빠)도 수학 진짜 못했어, 너도 그럴 수 있어”",
              fact: "부모가 수학에 자신 없다는 말을 반복하면, 아이는 수학 실력이 물려받는 것이라고 믿기 쉽습니다. 대신 '나도 처음엔 어려웠는데 연습하니까 늘더라'처럼 노력과 성장에 초점을 맞춰 말해 보세요.",
            },
            {
              myth: "“이렇게 쉬운 걸 왜 틀려?”",
              fact: "실수를 지적하는 말은 다음 문제를 풀 때 아이를 더 긴장하게 만듭니다. 틀린 답보다 어떤 과정으로 풀었는지 먼저 물어보면 아이의 생각을 이해하는 데 도움이 됩니다.",
            },
            {
              myth: "“빨리 풀어야 잘하는 거야”",
              fact: "속도와 이해는 다른 문제입니다. 천천히 정확하게 개념을 이해하는 아이가 결국 더 단단한 실력을 쌓습니다. 시간 압박을 강조할수록 불안은 커집니다.",
            },
          ],
        },
      },
      {
        heading: "집에서 해 볼 수 있는 5가지",
        paragraphs: [
          "거창한 프로그램보다 매일의 작은 습관이 수학 불안을 낮추는 데 더 효과적입니다. 아래 다섯 가지부터 시작해 보세요.",
        ],
        visual: {
          type: "checklist",
          title: "집에서 시도해 볼 수 있는 5가지",
          items: [
            { text: "타이머를 치우고 정확성 먼저", note: "시간 압박 없이 풀 기회를 준다" },
            { text: "틀린 답이 아니라 풀이 과정을 물어본다", note: "'어떻게 그렇게 생각했어?'" },
            { text: "실수를 배우는 과정의 일부로 이야기한다", note: "실수는 새로 배울 것을 알려 주는 신호" },
            { text: "구체물이나 그림으로 다시 설명해 본다", note: "Singapore Math의 CPA 접근법과도 통한다" },
            { text: "매일 짧게, 꾸준히 반복한다", note: "몰아서 하기보다 매일 10~15분" },
          ],
        },
      },
      {
        heading: "언제 학교에 도움을 요청해야 할까요?",
        paragraphs: [
          "집에서 노력해도 나아지지 않고, 수학 때문에 학교에 가기 싫어하거나 몸이 아프다고 하는 일이 이어진다면 담임 선생님이나 학교 상담 교사(School Counselor)와 상담해 보세요. 담임 선생님은 교실에서 아이가 어떤 상황에서 움츠러드는지 구체적으로 관찰한 정보를 갖고 있는 경우가 많습니다. 상담할 때 한국어 통역을 요청할 수 있습니다.",
          "수학 실력 자체도 걱정이라면 불안과 개념 이해를 함께 다루는 것이 중요합니다. 무작정 문제를 더 많이 풀리기보다, 아이가 이미 아는 것부터 시작해 작은 성공 경험을 쌓아 가는 방식이 장기적으로 더 효과적입니다.",
        ],
      },
    ],
    faqKo: [
      {
        q: "수학 불안은 몇 살부터 생기나요?",
        a: "연구에 따르면 1학년 무렵부터 나타날 수 있습니다. 초등 저학년부터 아이가 수학을 대하는 태도를 살펴보는 것이 좋습니다.",
      },
      {
        q: "수학 불안과 수학을 싫어하는 것은 어떻게 다른가요?",
        a: "싫어하는 것은 흥미의 문제이고, 수학 불안은 긴장과 두려움이라는 정서적 반응입니다. 수학 불안이 있으면 아는 문제도 시험에서 머리가 하얘져 실력보다 낮은 결과가 나올 수 있습니다.",
      },
      {
        q: "미국에 와서 아이가 갑자기 수학을 싫어해요. 왜 그럴까요?",
        a: "실력보다 영어 때문인 경우가 많습니다. 같은 문제를 한국어로 설명하게 해 보고, 개념을 알고 있다면 수학 영어 표현을 익히는 데 집중해 주세요.",
      },
      {
        q: "시간 제한이 있는 연산 테스트가 수학 불안을 만드나요?",
        a: "시간 제한이 있는 테스트는 수학 불안의 흔한 원인 중 하나입니다. 집에서는 타이머 없이 정확하게 푸는 연습부터 하는 것이 좋습니다.",
      },
    ],
    bodyEn: [
      {
        heading: "What Is Math Anxiety?",
        paragraphs: [
          "Math anxiety isn't the same as disliking math. It's an emotional response — tension, worry, sometimes real fear — triggered by numbers or math problems, and it can show up regardless of a child's actual math ability. A student who understands the material can still go blank the moment a worksheet or test lands in front of them.",
          "Research shows math anxiety can appear surprisingly early, sometimes as young as first grade. The core problem is that anxiety itself hurts performance: worrying consumes working memory, leaving fewer cognitive resources available for actually solving the problem.",
        ],
      },
      {
        heading: "Is This Happening to Your Child? Common Signs",
        paragraphs: [
          "Math anxiety rarely announces itself with a simple \"I hate math.\" It often shows up indirectly — a stomachache before a test, chronic procrastination on math homework, erasing and rewriting an easy answer over and over — which makes it easy for parents to miss.",
          "If a child is confident in other subjects but consistently shrinks during math, that's often a sign of anxiety rather than a lack of ability.",
        ],
        visual: {
          type: "checklist",
          title: "Watch for these recurring patterns",
          items: [
            { text: "Unusually avoids or delays starting math homework" },
            { text: "Complains of a stomachache or trouble sleeping before a math test" },
            { text: "Erases and rewrites even easy answers repeatedly", note: "pressure to be perfect" },
            { text: "Says \"I'm just not a math person\" often" },
            { text: "Confident in other subjects but shrinks specifically during math" },
          ],
        },
      },
      {
        heading: "Where Does Math Anxiety Come From?",
        paragraphs: [
          "One of the most common triggers is timed computation drills. The pressure to answer correctly within a fixed time creates anxiety regardless of actual ability. An environment that doesn't tolerate mistakes, or repeated experiences of being corrected in front of others, also builds anxiety over time.",
          "Adults' attitudes matter too, often without anyone realizing it. Children pick up on tone and facial expressions and absorb the message that math is something to fear, or something only certain people are naturally good at. Even a parent casually saying they were bad at math as a kid can shape how a child feels about the subject.",
        ],
      },
      {
        heading: "Things Parents Say Without Realizing the Impact",
        paragraphs: [
          "Well-intentioned comments can sometimes deepen the anxiety rather than ease it. Here are a few common phrases worth reconsidering.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "\"I was terrible at math too, so it's okay if you are.\"",
              fact: "Repeating that you struggled with math can lead a child to believe math ability is fixed and inherited. Try framing it around effort instead: \"I found it hard at first too, but I got better with practice.\"",
            },
            {
              myth: "\"How did you get this wrong? It's so easy.\"",
              fact: "Pointing out mistakes makes a child more tense going into the next problem. Asking about the process — \"how did you approach this?\" — before the answer helps you understand their thinking and lowers the stakes.",
            },
            {
              myth: "\"Being fast means you're good at math.\"",
              fact: "Speed and understanding are different things. A child who works slowly but accurately toward real understanding builds a sturdier foundation. The more speed is emphasized, the more anxiety tends to grow.",
            },
          ],
        },
      },
      {
        heading: "What You Can Try at Home",
        paragraphs: [
          "Small daily habits do more to lower math anxiety than any elaborate program. Start with these five.",
        ],
        visual: {
          type: "checklist",
          title: "Five things to try at home",
          items: [
            { text: "Drop the timer, prioritize accuracy", note: "let them work problems without a time pressure" },
            { text: "Ask about the process, not just the answer", note: "\"how did you think about this one?\"" },
            { text: "Talk about mistakes as a normal part of learning", note: "the brain is thought to grow most in the moment of making a mistake" },
            { text: "Re-explain with objects or pictures", note: "connects to Singapore Math's CPA approach" },
            { text: "Short and consistent beats long and occasional", note: "10-15 minutes daily is more effective than cramming" },
          ],
        },
      },
      {
        heading: "Partnering with the School — When to Ask for Help",
        paragraphs: [
          "If effort at home isn't enough and math-related anxiety starts leading to school avoidance or physical symptoms, it's worth talking to the classroom teacher or school counselor. FCPS teachers often have specific classroom observations about exactly when and how a child shuts down.",
          "If the underlying math skills are also a genuine concern, it's important to address the anxiety and the conceptual gaps together. Rather than simply assigning more problems, starting from what a child already knows and building small, real wins tends to work far better over time.",
        ],
      },
    ],
  },
  {
    slug: "fcps-math-pathways",
    publishedAt: "2026-10-08",
    updatedAt: "2026-10-23",
    readingMins: 9,
    category: "수학 패스웨이",
    categoryEn: "Math Pathways",
    titleKo: "FCPS 수학 패스웨이 총정리: Algebra 1(알지브라 1)은 몇 학년에 들을까?",
    titleEn: "FCPS Math Pathways Explained: When Will Your Child Take Algebra 1?",
    descKo: "한국에서 막 오신 학부모님을 위해 FCPS 수학 과정을 쉽게 정리했습니다. 미국 학제와 과목 이름, 6학년 수학 과목 3가지, Algebra 1을 6·7·8학년 중 언제 듣는지, 최근 바뀐 배치 기준(IAAT 폐지, 6학년 Algebra 1 확대)까지 차례로 설명합니다.",
    descEn: "In FCPS, math splits into three course options in 6th grade, and that choice decides whether a student takes Algebra 1 in 6th, 7th, or 8th grade. Here is the current pathway for elementary parents, including the expansion of 6th-grade Algebra 1 and the end of the IAAT requirement.",
    heroImage: {
      src: "/blog/fcps-math-pathways-hero.jpg",
      altKo: "언덕 위 학교로 이어지는 세 갈래 길 앞에 서서 이정표를 바라보는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child standing by a signpost where a path splits into three routes that all lead to a school on a hill",
    },
    bodyKo: [
      {
        heading: "결론부터: 기준은 8학년, 빠르면 6·7학년입니다",
        paragraphs: [
          "Algebra 1은 방정식과 함수를 본격적으로 배우는 수학 과목입니다. Fairfax County 공립학교(FCPS)에서는 이 과목을 6학년, 7학년, 8학년 중 한 해에 듣습니다.",
          "기준이 되는 시기는 8학년입니다. FCPS는 모든 학생이 8학년까지 Algebra 1을 마치는 것을 목표로 삼고 있습니다. 준비가 된 학생은 7학년이나 6학년에 먼저 들을 수 있습니다.",
        ],
        visual: {
          type: "scale",
          items: [
            { level: "8학년", label: "기본 경로", desc: "FCPS가 모든 학생에게 목표로 삼는 시기. 12학년에 AP Calculus 도달", tone: "mid" },
            { level: "7학년", label: "1년 빠른 경로", desc: "11학년에 AP Calculus 도달", tone: "mid" },
            { level: "6학년", label: "2년 빠른 경로", desc: "10학년에 AP Calculus 도달", tone: "mid" },
          ],
          note: {
            tone: "info",
            text: "AP Calculus는 고등학교에서 듣는 대학 수준의 미적분 과목입니다. 한 해에 한 과목씩 들으면 세 경로 모두 졸업 전에 이 과목까지 갑니다.",
          },
        },
      },
      {
        heading: "한국과 다른 점 ①: 6학년은 아직 초등학생입니다",
        paragraphs: [
          "FCPS는 학교를 나누는 방식이 한국과 다릅니다. 대부분의 학교에서 초등학교는 킨더가든(K)부터 6학년까지, 중학교는 7~8학년, 고등학교는 9~12학년입니다. 그래서 '6학년에 Algebra 1을 듣는다'는 말은 초등학교에서 듣는다는 뜻입니다.",
          "학년도는 8월에 시작해 이듬해 6월에 끝납니다. '2026-27학년도'는 2026년 8월부터 2027년 6월까지입니다. 학년이 시작하는 달이 한국과 달라서, 전학 오면 한국에서 다니던 학년과 다른 학년에 배정될 수 있습니다.",
        ],
        visual: {
          type: "table",
          headers: ["FCPS 학년", "학교", "한국 학년으로는 (대략)"],
          rows: [
            { label: "K~6학년", values: ["초등학교 (Elementary School)", "유치원 마지막 해~초등 6학년"] },
            { label: "7~8학년", values: ["중학교 (Middle School)", "중학교 1~2학년"] },
            { label: "9~12학년", values: ["고등학교 (High School)", "중학교 3학년~고등학교 3학년"] },
          ],
        },
      },
      {
        heading: "한국과 다른 점 ②: 수학을 학년이 아니라 과목으로 배웁니다",
        paragraphs: [
          "한국에서는 같은 학년이면 모두 같은 수학을 배웁니다. 미국은 다릅니다. 중학교부터는 Algebra 1, Geometry처럼 이름이 붙은 과목을 한 해에 하나씩 듣습니다. 같은 7학년이어도 학생마다 듣는 과목이 다를 수 있습니다.",
          "과목은 정해진 순서대로 이어집니다. 앞 과목을 마쳐야 다음 과목으로 넘어갑니다. 어느 학년에 어떤 과목을 듣는지 이어 놓은 이 순서를 수학 패스웨이(Math Pathway)라고 부릅니다. 이 글에서는 '경로'라고 쓰겠습니다.",
          "Algebra 1은 이 순서의 첫 과목이자 고등학교 수학의 출발점입니다. 일차방정식, 연립방정식, 일차함수, 이차방정식을 배우며, 한국 중학교 수학의 방정식·함수 단원과 내용이 비슷합니다. 그래서 Algebra 1을 시작하는 학년이 그 뒤 모든 과목의 시기를 정합니다.",
          "한 해에 한 과목씩 들으면 8학년에 시작한 학생은 12학년에, 7학년에 시작한 학생은 11학년에, 6학년에 시작한 학생은 10학년에 AP Calculus에 도달합니다. 일찍 도달한 학생은 남은 학년에 AP Statistics(통계)나 다변수 미적분 같은 과목을 더 들을 수 있습니다. 실제로 들을 수 있는 과목은 고등학교와 학생의 선택에 따라 달라집니다.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "Algebra 1", sublabel: "대수 1" },
            { label: "Geometry", sublabel: "기하" },
            { label: "Algebra 2", sublabel: "대수 2" },
            { label: "Precalculus", sublabel: "미적분 준비" },
          ],
          finalLabel: "AP Calculus",
        },
      },
      {
        heading: "6학년 수학 과목은 세 가지입니다",
        paragraphs: [
          "경로가 처음 갈리는 때는 6학년입니다. 2026-27학년도 FCPS 과목 안내에는 6학년 수학이 Math 6, Advanced Math 6, Algebra 1 Honors 세 가지로 나와 있습니다.",
          "과목 이름 뒤에 붙는 Honors는 같은 과목을 더 깊고 빠르게 배우는 심화반이라는 뜻입니다. Advanced Math 6는 Math 6 Advanced라고 쓰기도 하는데, 같은 과목입니다.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "Math 6", tone: "standard", points: ["6학년 수준의 수학을 배우는 과정"] },
            { label: "Advanced Math 6", tone: "standard", points: ["7학년 내용과 8학년 내용 일부를 미리 배우는 과정"] },
            { label: "Algebra 1 Honors", tone: "advanced", points: ["고등학교 과목을 6학년에 듣는 과정", "가장 빠른 경로"] },
          ],
        },
      },
      {
        heading: "6학년 과목에 따라 7·8학년이 이렇게 이어집니다",
        paragraphs: [
          "아래 표는 6학년 과목별로 7학년과 8학년에 들을 수 있는 과목을 정리한 것입니다. 표에 나오는 Prealgebra는 Algebra 1 바로 앞 단계 과목으로, 7학년과 8학년 수학을 1년에 압축해서 배웁니다.",
          "눈여겨볼 점은 Math 6로 시작해도 8학년에는 Algebra 1 Honors까지 갈 수 있다는 것입니다. 7학년 Prealgebra Honors와 8학년 Algebra 1 Honors가 원하는 학생은 누구나 신청할 수 있는 과목(open enrollment)이기 때문입니다.",
          "과목 구성은 학교마다 조금씩 다를 수 있습니다. 자녀가 진학할 중학교의 안내도 함께 확인하세요.",
        ],
        visual: {
          type: "table",
          headers: ["6학년 과목", "7학년", "8학년"],
          rows: [
            { label: "Math 6", values: ["Prealgebra 또는 Prealgebra Honors", "Algebra 1 또는 Algebra 1 Honors"] },
            { label: "Advanced Math 6", values: ["Prealgebra Honors 또는 Algebra 1 Honors", "Algebra 1 Honors 또는 Geometry Honors"] },
            { label: "Algebra 1 Honors", values: ["Geometry Honors", "Algebra 2 Honors (고등학교에 가서 수강)"] },
          ],
        },
      },
      {
        heading: "최근 변화 ①: 6학년 Algebra 1이 모든 초등학교로 넓어졌습니다",
        paragraphs: [
          "몇 해 전에 자녀를 중학교에 보낸 선배 학부모의 경험담은 지금과 다를 수 있습니다. 최근 두 학년도 사이에 큰 변화가 두 가지 있었고, Math 6부터 Algebra 2까지는 교재도 새로 바뀌었습니다. 이 글은 2026년 10월 기준 FCPS 공개 자료를 바탕으로 썼습니다.",
          "첫 번째 변화는 6학년에 Algebra 1을 들을 기회가 넓어진 것입니다. 예전에는 FCPS 전체에서 한 해 30명 정도만 들었습니다. 2025년 가을에 초등학교 142곳 중 3분의 1 이상이 참여한 시범 운영(파일럿)이 시작됐고, 그해 700명이 넘는 6학년 학생이 수강했습니다. 2026-27학년도부터는 모든 초등학교가 대상입니다. 수강생이 15명 미만이거나 선생님을 배정하기 어려운 학교는 매일 온라인 수업으로 운영할 수 있습니다.",
          "누구나 들을 수 있는 것은 아닙니다. 시범 운영 첫해에는 두 조건을 모두 채워야 했습니다. 하나는 5학년 때 6학년 수학 SOL을 치러 500점 이상(Pass Advanced)을 받는 것이고, 다른 하나는 다른 수학 평가에서도 기준 점수를 넘는 것입니다. SOL은 버지니아주가 매년 봄에 치르는 학력 평가입니다.",
          "올해 기준은 달라졌을 수 있습니다. 5학년 자녀가 있다면 학교 수학 선생님께 직접 확인하세요.",
        ],
        visual: {
          type: "stat",
          value: "30명 → 700명+",
          label: "6학년에 Algebra 1을 듣는 FCPS 학생 수 (파일럿 이전 → 2025-26 파일럿 첫해)",
          source: "FCPS, 2025년 10월",
        },
      },
      {
        heading: "최근 변화 ②: 7학년 Algebra 1에 IAAT 점수가 필요 없어졌습니다",
        paragraphs: [
          "두 번째 변화는 7학년에 Algebra 1 Honors를 듣는 조건이 간단해진 것입니다. IAAT(Iowa Algebra Aptitude Test)는 Algebra를 배울 준비가 됐는지 알아보는 시험입니다. 예전에는 이 시험에서 백분위 91 이상(상위 9% 정도)을 받아야 했고, 다른 두 조건도 함께 채워야 했습니다.",
          "FCPS는 2025-26학년도부터 Algebra 1 Honors 배치에 IAAT 결과를 쓰지 않는다고 안내합니다. 지금 FCPS 안내에 적힌 조건은 Advanced Math 6를 마치는 것 하나입니다.",
          "IAAT 시험이 없어진 것은 아닙니다. Advanced Math 6 학생은 지금도 1~3월에 이 시험을 봅니다. 다만 점수는 가정에서 7학년 과목을 고를 때 참고하는 자료로 쓰입니다. 점수로 걸러 내던 방식에서 부모의 판단이 더 중요한 방식으로 바뀐 것입니다.",
          "여러 학교 웹페이지와 학부모 커뮤니티 글에는 아직 예전 기준이 남아 있습니다. 검색으로 찾은 글은 언제 쓴 글인지 꼭 확인하세요.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "예전 기준", tone: "standard", points: ["Advanced Math 6 이수", "IAAT 백분위 91 이상", "7학년 수학 SOL 500점 이상"] },
            { label: "2025-26학년도부터", tone: "advanced", points: ["Advanced Math 6 이수", "IAAT 점수는 과목을 고를 때 참고 자료로만 사용"] },
          ],
        },
      },
      {
        heading: "초등학교 3~5학년에는 무엇을 봐야 하나요?",
        paragraphs: [
          "FCPS는 3학년부터 6학년까지 Advanced Math라는 심화 수학 과정을 운영합니다. 빠른 경로는 이 과정과 이어져 있습니다. 7학년에 Algebra 1을 들으려면 6학년에 Advanced Math 6를 마쳐야 합니다. 6학년에 들으려면 5학년에 이미 6학년 수학 SOL을 치를 만큼 앞서 있어야 합니다.",
          "그렇다고 한 번의 배치로 경로가 굳어지지는 않습니다. FCPS는 3~6학년 동안 해마다 Advanced Math로 옮겨 갈 수 있게 하겠다고 밝혔습니다. 일반 과정에서도 윗학년 내용을 넓혀서 가르칩니다. 지금의 초등 저학년부터는 모든 학생이 6학년을 마칠 때까지 7학년 내용의 절반 이상을 배우게 한다는 계획도 있습니다.",
          "자녀가 지금 어느 과정에 있는지 확인하는 방법은 아래 글에 정리해 두었습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "함께 읽으면 좋은 글",
          text: "Standard 수학과 Advanced(AAP) 수학의 차이, 그리고 자녀의 현재 트랙을 확인하는 방법을 설명합니다.",
          linkHref: "/blog/fcps-aap-math-guide",
          linkLabel: "FCPS AAP 수학, 제대로 이해하기",
        },
      },
      {
        heading: "빨리 듣는 것이 항상 좋을까요?",
        paragraphs: [
          "한국에서 선행 학습을 해 온 가정이라면 가장 빠른 경로가 당연해 보일 수 있습니다. 하지만 FCPS는 Advanced Math 6와 Algebra 1 Honors 사이에서 신중하게 고르라고 권합니다. 이유는 세 가지입니다.",
          "첫째, 성적이 오래 남습니다. Algebra 1 Honors는 고등학교 학점을 받는 과목입니다. 6학년이나 7학년에 받은 성적도 대학에 지원할 때 내는 고등학교 성적증명서(transcript)에 올라가고, 0.5의 가중치가 붙습니다.",
          "둘째, 7·8학년 수학 내용을 수업으로 배우지 않고 건너뜁니다. 셋째, 진도가 매우 빠릅니다. 한국에서 수학을 앞서 배운 아이도 처음에는 영어로 된 수학 용어와 문장제 문제가 낯설 수 있습니다.",
          "FCPS는 네 가지를 함께 보라고 안내합니다. MAP 평가 결과(RIT 점수, 백분위, 성장도), 지금까지의 수학 SOL 점수, 교실 평가 결과, 그리고 아이가 그 속도를 따라가는 데 드는 시간과 노력입니다. MAP은 학교에서 컴퓨터로 치르는 학력 진단 평가입니다.",
          "점수가 기준을 넘는지 보기 전에 먼저 확인할 것이 있습니다. 아이가 비율이나 퍼센트 응용 같은 중간 단계 개념을 자기 말로 설명할 수 있는지 물어보세요.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "Algebra 1은 빨리 들을수록 무조건 유리하다",
              fact: "Algebra 1 Honors 성적은 고등학교 성적증명서에 남고, 7·8학년 내용을 건너뜁니다. 준비가 덜 된 학생은 한 해 뒤에 듣는 편이 더 좋은 결과로 이어질 수 있습니다.",
            },
            {
              myth: "6학년에 Algebra 1을 못 들으면 이미 늦은 것이다",
              fact: "FCPS의 목표는 8학년까지 Algebra 1을 마치는 것입니다. 그 경로로도 12학년에 AP Calculus를 들을 수 있습니다.",
            },
          ],
        },
      },
      {
        heading: "학교에서 자주 듣게 될 용어",
        paragraphs: [
          "이 글에 나온 용어는 학교 안내문과 상담에서도 계속 나옵니다. 한 번에 찾아볼 수 있게 모았습니다.",
        ],
        visual: {
          type: "table",
          headers: ["용어", "뜻"],
          rows: [
            { label: "FCPS", values: ["Fairfax County Public Schools. 페어팩스 카운티의 공립학교를 운영하는 교육청"] },
            { label: "Advanced Math", values: ["FCPS가 3~6학년에 운영하는 심화 수학 과정"] },
            { label: "Honors", values: ["같은 과목을 더 깊고 빠르게 배우는 심화반"] },
            { label: "AP", values: ["Advanced Placement. 고등학교에서 듣는 대학 수준 과목"] },
            { label: "SOL", values: ["Standards of Learning. 버지니아주가 매년 봄에 치르는 학력 평가. 400점 이상이면 합격, 500점 이상이면 Pass Advanced"] },
            { label: "MAP", values: ["학교에서 컴퓨터로 치르는 학력 진단 평가. 결과가 RIT 점수와 백분위로 나옴"] },
            { label: "IAAT", values: ["Iowa Algebra Aptitude Test. Algebra를 배울 준비가 됐는지 알아보는 시험"] },
            { label: "Transcript", values: ["고등학교 성적증명서. 대학에 지원할 때 제출"] },
            { label: "ParentVUE", values: ["자녀의 수강 과목과 성적을 볼 수 있는 FCPS 학부모용 웹사이트"] },
          ],
        },
      },
      {
        heading: "지금 학부모가 확인할 것",
        paragraphs: [
          "한국에서 막 오셨다면 자녀가 어떤 수학 과목에 배정됐는지부터 확인하세요. 과목 이름은 ParentVUE에서 볼 수 있고, 담임 선생님께 물어봐도 됩니다. 한국에서 어디까지 배웠는지 알려 드리면 배치를 상의할 때 도움이 됩니다.",
          "배치 기준과 과목 이름은 학년도마다 바뀌고, 학교 웹페이지가 최신 내용을 반영하지 못한 경우도 있습니다. 내년 과목 선택이 다가오기 전에 아래 항목을 확인해 두면 설명회나 상담에서 필요한 질문을 정확히 할 수 있습니다.",
        ],
        visual: {
          type: "checklist",
          title: "과목 선택 전 체크리스트",
          items: [
            { text: "ParentVUE에서 자녀의 현재 수학 과목명 확인", note: "Advanced Math 과정인지 확인" },
            { text: "수학 선생님께 내년 과목 배치 기준 문의", note: "6학년 Algebra 1 기준은 5학년 때 미리 확인" },
            { text: "MAP 결과지와 수학 SOL 점수 모아 두기", note: "RIT 점수, 백분위, 성장도" },
            { text: "FCPS Math Course Explorer로 고등학교까지의 경로 살펴보기", note: "FCPS 웹사이트에서 6학년 과목부터 차례로 골라 보는 도구" },
            { text: "진학할 중학교의 과목 설명회(Curriculum Night) 참석" },
          ],
        },
      },
    ],
    faqKo: [
      {
        q: "FCPS에서 Algebra 1은 몇 학년에 듣나요?",
        a: "기본은 8학년입니다. FCPS는 모든 학생이 8학년까지 Algebra 1을 마치는 것을 목표로 하며, 준비된 학생은 7학년이나 6학년에 먼저 들을 수 있습니다.",
      },
      {
        q: "7학년 Algebra 1 Honors를 들으려면 IAAT 점수가 필요한가요?",
        a: "2025-26학년도부터는 필요하지 않습니다. 지금 FCPS 안내에 적힌 조건은 Advanced Math 6를 마치는 것입니다. IAAT는 계속 보지만 과목을 고를 때 참고 자료로만 쓰입니다.",
      },
      {
        q: "6학년에 Algebra 1을 들으려면 어떻게 해야 하나요?",
        a: "시범 운영 첫해에는 5학년 때 6학년 수학 SOL에서 500점 이상을 받고, 다른 수학 평가에서도 기준 점수를 넘어야 했습니다. 올해 기준은 바뀌었을 수 있으니 5학년 때 학교 수학 선생님께 확인하세요.",
      },
      {
        q: "6학년에 Math 6를 들으면 Algebra 1이 늦어지나요?",
        a: "그렇지 않습니다. 7학년 Prealgebra Honors와 8학년 Algebra 1 Honors는 원하는 학생 누구나 신청할 수 있어서, Math 6로 시작해도 8학년에 Algebra 1 Honors를 들을 수 있습니다.",
      },
      {
        q: "미국 6학년은 한국의 몇 학년인가요?",
        a: "대략 한국의 초등학교 6학년에 해당합니다. FCPS는 대부분 6학년까지 초등학교이고, 7~8학년이 중학교, 9~12학년이 고등학교입니다.",
      },
    ],
    bodyEn: [
      {
        heading: "What Is a Math Pathway?",
        paragraphs: [
          "A math pathway is the sequence of math courses a student takes from one grade to the next. In FCPS, one question separates the pathways: the grade in which a student takes Algebra 1. Algebra 1 is the first high school math course, so the year a student takes it sets how far they can go in math before graduation.",
          "Under its Strategic Plan, FCPS expects every student to complete Algebra 1 by the end of 8th grade. In the last two school years the district has also expanded Algebra 1 in 6th grade, changed the placement rules for 7th grade, and adopted new instructional materials. Advice from parents whose children went through middle school a few years ago may no longer apply. This post reflects FCPS's public information as of October 2026.",
        ],
      },
      {
        heading: "Three Options in 6th Grade",
        paragraphs: [
          "For the 2026-27 school year, FCPS lists three 6th-grade math courses: Math 6, Advanced Math 6 (also written Math 6 Advanced), and Algebra 1 Honors. Math 6 is the grade-level course. Advanced Math 6 covers 7th-grade content and some 8th-grade content. Algebra 1 Honors is a high school course taken in 6th grade, and it is the fastest route.",
          "Prealgebra, the 7th-grade course, condenses 7th- and 8th-grade math into one year. Prealgebra Honors is open enrollment, meaning any student can sign up, and so is Algebra 1 Honors in 8th grade. A student who takes Math 6 can still reach Algebra 1 Honors by 8th grade. Course offerings vary somewhat by school, so check with the middle school your child will attend.",
        ],
        visual: {
          type: "table",
          headers: ["6th-grade course", "7th grade", "8th grade"],
          rows: [
            { label: "Math 6", values: ["Prealgebra or Prealgebra Honors", "Algebra 1 or Algebra 1 Honors"] },
            { label: "Advanced Math 6", values: ["Prealgebra Honors or Algebra 1 Honors", "Algebra 1 Honors or Geometry Honors"] },
            { label: "Algebra 1 Honors", values: ["Geometry Honors", "Algebra 2 Honors (taken at the high school)"] },
          ],
        },
      },
      {
        heading: "Algebra 1 in 6th Grade Now Reaches Every Elementary School",
        paragraphs: [
          "Until recently, only about 30 sixth graders across all FCPS elementary schools took Algebra 1 in a given year. In fall 2025 FCPS started a pilot in more than one-third of its 142 elementary schools, and more than 700 sixth graders enrolled. For 2026-27 the district extended access to every elementary school. Schools with fewer than 15 students in the course, or with staffing constraints, may teach it through daily virtual instruction.",
          "In the pilot year, eligibility rested on two measures. Students had to take the 6th-grade math SOL as 5th graders and score Pass Advanced (500 or higher), and they had to reach a threshold score on other math assessments. The criteria may have changed for this year, so families with a 5th grader should ask the school's math staff directly. Courses from Math 6 through Algebra 2 also received new instructional materials this year.",
        ],
        visual: {
          type: "stat",
          value: "30 → 700+",
          label: "FCPS sixth graders taking Algebra 1 (before the pilot → first pilot year, 2025-26)",
          source: "FCPS, October 2025",
        },
      },
      {
        heading: "Algebra 1 in 7th Grade No Longer Depends on the IAAT",
        paragraphs: [
          "For years, a student needed all three of the following to take Algebra 1 Honors in 7th grade: completion of Advanced Math 6, a score at or above the 91st percentile on the Iowa Algebra Aptitude Test (IAAT), and 500 or higher on the 7th-grade math SOL. Many school web pages and parent forum posts still list these requirements.",
          "FCPS states that starting with the 2025-26 school year, Algebra 1 Honors placement no longer includes IAAT results. The requirement FCPS lists now is completion of Math 6 Advanced. Advanced Math 6 students still take the IAAT in a January-to-March window, and families can use the score as one piece of information when choosing a 7th-grade course. The decision now rests more on a family's judgment than on a cutoff score.",
        ],
        visual: {
          type: "comparison",
          columns: [
            { label: "Previous criteria", tone: "standard", points: ["Completed Advanced Math 6", "IAAT at or above the 91st percentile", "500+ on the 7th-grade math SOL"] },
            { label: "Since 2025-26", tone: "advanced", points: ["Completed Math 6 Advanced", "IAAT results not used for placement, only as a reference for families"] },
          ],
        },
      },
      {
        heading: "What Gets Decided in Grades 3-5?",
        paragraphs: [
          "FCPS offers Advanced Math courses in grades 3 through 6. To take Algebra 1 in 6th grade, a student has to be far enough ahead to take the 6th-grade math SOL in 5th grade. To take it in 7th grade, a student has to complete Advanced Math 6. The faster the pathway, the more it depends on placement in grades 3-5.",
          "A single placement decision does not lock in the pathway, though. FCPS says grade-level classes will include extensions into higher-grade content, and that students will be able to move into Advanced Math each year in grades 3-6. For students now in the early elementary grades, the district also plans for every student to have covered at least half of the 7th-grade standards by the end of 6th grade. The post linked below explains how to check which course your child is in now.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "Related reading",
          text: "Explains the difference between Standard and Advanced (AAP) math and how to confirm your child's current track.",
          linkHref: "/en/blog/fcps-aap-math-guide",
          linkLabel: "Understanding FCPS AAP Math",
        },
      },
      {
        heading: "How Does This Continue in High School?",
        paragraphs: [
          "After Algebra 1, the usual order is Geometry, Algebra 2, Precalculus, and then AP Calculus. At one course per year, a student who takes Algebra 1 in 8th grade reaches AP Calculus in 12th grade. Taking it in 7th grade leads to AP Calculus in 11th, and taking it in 6th grade leads to AP Calculus in 10th.",
          "The district's target of Algebra 1 in 8th grade is enough to reach AP Calculus before graduation. Students who start earlier have room afterward for courses such as AP Statistics or multivariable calculus. Actual course options depend on the high school and the student's choices. The Math Course Explorer on the FCPS website lets you pick courses year by year, starting in 6th grade, to see the possible pathways.",
        ],
        visual: {
          type: "pathway",
          steps: [
            { label: "Algebra 1" },
            { label: "Geometry" },
            { label: "Algebra 2" },
            { label: "Precalculus" },
          ],
          finalLabel: "AP Calculus",
        },
      },
      {
        heading: "Is Faster Always Better?",
        paragraphs: [
          "FCPS encourages families to consider their options carefully when choosing between Math 6 Advanced and Algebra 1 Honors. Algebra 1 Honors is a high school credit course. The grade appears on the student's high school transcript and carries an additional 0.5 weight. Choosing it means skipping classroom instruction in the 7th- and 8th-grade math standards, and the course moves at a rapid pace.",
          "FCPS suggests weighing MAP assessment reports (RIT score, percentile, and growth), past math SOL scores, classroom assessments, and the time and effort your child would need to keep up. Before looking at whether the scores clear a bar, check whether your child can explain the in-between concepts, such as ratios and percent applications, in their own words.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "The earlier a student takes Algebra 1, the better",
              fact: "The Algebra 1 Honors grade stays on the high school transcript, and the course skips 7th- and 8th-grade content. A student who isn't ready may do better taking it a year later.",
            },
            {
              myth: "A child who doesn't take Algebra 1 in 6th grade is already behind",
              fact: "FCPS's goal is Algebra 1 by the end of 8th grade, and that pathway still reaches AP Calculus in 12th grade.",
            },
          ],
        },
      },
      {
        heading: "What Parents Should Check Now",
        paragraphs: [
          "Placement criteria and course names change from year to year, and school web pages don't always reflect the latest version. Checking the items below before course selection begins will help you ask the right questions at curriculum nights and conferences.",
        ],
        visual: {
          type: "checklist",
          title: "Before course selection",
          items: [
            { text: "Check your child's current math course name in ParentVUE", note: "Confirm whether it is an Advanced Math course" },
            { text: "Ask the math teacher about next year's placement criteria", note: "For Algebra 1 in 6th grade, ask during 5th grade" },
            { text: "Gather MAP reports and math SOL scores", note: "RIT score, percentile, and growth" },
            { text: "Explore pathways through high school with the FCPS Math Course Explorer" },
            { text: "Attend the curriculum night at the middle school your child will attend" },
          ],
        },
      },
    ],
  },
  {
    slug: "amc-8-2027-guide",
    publishedAt: "2026-10-08",
    updatedAt: "2026-10-23",
    readingMins: 9,
    category: "경시대회",
    categoryEn: "Competitions",
    titleKo: "2027 AMC 8 총정리: 시험 일정, 등록 방법, 커트라인, 준비 계획",
    titleEn: "AMC 8 2027: Dates, Registration, Prep Plan, and Awards",
    descKo: "2027년 AMC 8은 1월 21일부터 27일 사이에 치러집니다. 학부모가 MAA에 직접 등록할 수 없어 학교나 시험장을 미리 찾아야 합니다. 시험 일정과 등록 방법, 점수별 시상과 최근 커트라인, 15주 준비 계획, 무료 기출문제 사이트를 정리했습니다.",
    descEn: "The 2027 AMC 8 runs January 21-27, and families can't register with the MAA directly, so the timeline matters. Here are the dates, how registration works, a 15-week prep plan, free practice sites, and what each award actually means.",
    heroImage: {
      src: "/blog/amc-8-2027-guide-hero.jpg",
      altKo: "달력과 스톱워치, 상장 리본 사이에서 책상에 앉아 객관식 답안지를 채우는 아이를 그린 따뜻한 일러스트",
      altEn: "Warm illustration of a child at a desk filling in a multiple-choice answer sheet, with a calendar, a stopwatch, and an award ribbon nearby",
    },
    bodyKo: [
      {
        heading: "AMC 8은 어떤 시험인가요?",
        paragraphs: [
          "AMC 8(American Mathematics Competition 8)은 미국수학협회(MAA)가 매년 1월에 주관하는 수학 경시대회입니다. 25문항을 40분 동안 푸는 5지선다 객관식 시험이며, 정답 하나에 1점이고 오답 감점은 없습니다. 계산기는 쓸 수 없습니다.",
          "8학년 이하이면서 시험 당일 만 15.5세 미만이면 응시할 수 있고, 최소 학년 제한은 없습니다. 그래서 수학을 좋아하는 4~6학년 학생도 많이 도전합니다. 다만 출제 범위가 중학교 수학이어서 초등학생에게는 쉽지 않습니다. 2026년 시험의 전체 평균은 25점 만점에 약 12점이었습니다.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "시험 형식과 규정 자세히 보기",
          text: "응시 규정과 2024·2025년 기출문제 PDF 링크는 AMC 8 안내 페이지에 모아 두었습니다.",
          linkHref: "/resources/testing/amc-8",
          linkLabel: "AMC 8 안내 페이지 보기",
        },
      },
      {
        heading: "2027년 시험은 언제인가요?",
        paragraphs: [
          "2026-27 시즌 AMC 8의 응시 기간은 2027년 1월 21일(목)부터 1월 27일(수)까지입니다. 이 일주일 가운데 실제 시험 날짜와 시간은 시험을 여는 학교나 기관이 정합니다. 같은 지역이라도 학교마다 시험일이 다를 수 있습니다.",
          "아래 등록 마감일은 학생이 아니라 시험을 여는 학교·기관의 담당자(Competition Manager)가 MAA에 등록하는 기한입니다. 등록비도 학교·기관이 내는 금액이며, 학생 한 명당 응시료는 시험장이 따로 정합니다. 일정은 바뀔 수 있으니 최신 내용은 MAA 공식 페이지에서 확인하세요.",
        ],
        visual: {
          type: "table",
          headers: ["", "날짜", "비고"],
          rows: [
            { label: "얼리버드 등록 마감", values: ["2026년 10월 28일", "등록비 $55"] },
            { label: "정규 등록 마감", values: ["2027년 1월 5일", "등록비 $75, 처음 시행하는 학교의 최종 기한"] },
            { label: "지연 등록 마감", values: ["2027년 1월 14일", "등록비 $115, 시행 경험이 있는 학교만 가능"] },
            { label: "시험 응시 기간", values: ["2027년 1월 21일(목)~27일(수)", "실제 시험일은 학교·기관이 지정"] },
          ],
        },
      },
      {
        heading: "등록은 어떻게 하나요?",
        paragraphs: [
          "AMC 8은 학부모나 학생이 MAA에 직접 등록할 수 없습니다. 학생은 Competition Manager가 있는 학교나 기관을 통해 응시합니다. 그래서 가장 먼저 할 일은 자녀의 학교가 올해 AMC 8을 시행하는지 확인하는 것입니다. FCPS에서는 중학교를 중심으로 시행하는 학교가 있고, 초등학교는 학교마다 다릅니다. 수학 담당 교사나 AART에게 시행 여부와 교내 신청 방법을 물어보세요.",
          "학교에서 시행하지 않는다면 외부 학생을 받는 공개 시험장을 찾아야 합니다. 대학, 수학 서클, 학습 기관이 시험장을 열며, 등록 기간에는 MAA 등록 안내 페이지(maa.org/amcreg)에서 우편번호로 가까운 시험장을 찾을 수 있습니다. 공개 시험장은 좌석이 적고, MAA 마감일보다 훨씬 이른 12월 중순에 접수를 닫는 곳도 있습니다. 지금 시기에는 공부보다 등록 확인이 더 급합니다.",
        ],
        visual: {
          type: "checklist",
          title: "등록 순서",
          items: [
            { text: "학교에 AMC 8 시행 여부 문의", note: "수학 담당 교사 또는 AART에게, 10~11월 중" },
            { text: "교내 신청 마감일과 응시료 확인", note: "교내 마감은 MAA 마감보다 이를 수 있음" },
            { text: "학교에서 시행하지 않으면 공개 시험장 검색", note: "maa.org/amcreg, 12월 초까지 신청 권장" },
            { text: "시험 날짜, 시간, 방식 확인", note: "지필 또는 온라인, 시험장마다 다름" },
          ],
        },
      },
      {
        heading: "점수에 따라 어떤 상을 받나요?",
        paragraphs: [
          "AMC 8의 개인 상은 전체 응시자 가운데 상위 몇 퍼센트에 드는지로 정해집니다. 상위 5%는 Honor Roll, 상위 1%는 Distinguished Honor Roll에 오르고, 25점 만점자는 Certificate of Distinction을 받습니다. Distinguished Honor Roll은 인증서에 Honor Roll of Distinction으로 적히기도 합니다.",
          "초등 학부모가 눈여겨볼 상은 Achievement Roll입니다. 6학년 이하 학생이 15점 이상을 받으면 주어지며, 기준 점수가 해마다 바뀌지 않습니다. 이 밖에 시험장별 최고 득점자에게 주는 School Winner 핀과 상위 3명에게 주는 금·은·동 인증서가 있습니다. 교내 시상을 실제로 하는지는 시험장에 따라 다릅니다.",
        ],
        visual: {
          type: "table",
          headers: ["상", "기준", "2026년 커트라인"],
          rows: [
            { label: "Certificate of Distinction", values: ["만점", "25점"] },
            { label: "Distinguished Honor Roll", values: ["전체 상위 1%", "24점"] },
            { label: "Honor Roll", values: ["전체 상위 5%", "21점"] },
            { label: "Achievement Roll", values: ["6학년 이하, 15점 이상", "15점 (매년 동일)"] },
          ],
        },
      },
      {
        heading: "커트라인은 매년 달라집니다",
        paragraphs: [
          "Honor Roll과 Distinguished Honor Roll은 백분위로 정해지기 때문에 그해 시험의 난이도에 따라 커트라인이 움직입니다. 최근 4년 동안 Honor Roll 커트라인은 17점에서 21점으로, Distinguished Honor Roll은 21점에서 24점으로 올랐습니다. 2027년 커트라인은 시험이 끝난 뒤 보통 2월 중에 발표됩니다.",
          "그래서 몇 점이면 상을 받는다고 미리 단정하기는 어렵습니다. 목표를 세울 때는 변하지 않는 기준인 15점(Achievement Roll)을 첫 번째 목표로 삼고, 그 다음에 최근 커트라인을 참고해 20점대를 바라보는 순서가 현실적입니다.",
        ],
        visual: {
          type: "table",
          headers: ["연도", "Honor Roll (상위 5%)", "Distinguished Honor Roll (상위 1%)"],
          rows: [
            { label: "2026", values: ["21점", "24점"] },
            { label: "2025", values: ["19점", "23점"] },
            { label: "2024", values: ["18점", "22점"] },
            { label: "2023", values: ["17점", "21점"] },
          ],
        },
      },
      {
        heading: "상을 받으면 어떤 혜택이 있나요?",
        paragraphs: [
          "먼저 오해부터 짚겠습니다. AMC 8 점수로 다음 단계 대회의 출전 자격이 생기지는 않습니다. AIME 진출권은 AMC 10과 AMC 12 성적으로만 주어집니다. FCPS의 AAP 선발이나 TJ 입학 전형도 AMC 8 점수를 요구하지 않습니다.",
          "실제 혜택은 다른 데 있습니다. MAA 명의의 인증서가 남고, 전국의 같은 또래와 견준 객관적인 위치를 알 수 있습니다. 경시대회 성적을 묻는 수학 캠프나 심화 프로그램에 지원할 때 적을 수 있는 기록도 됩니다. 무엇보다 AMC 8을 준비하며 익힌 내용은 중학교의 MATHCOUNTS와 AMC 10으로 그대로 이어집니다. AMC 10은 최소 학년 제한이 없어, AMC 8에서 좋은 성적을 낸 학생은 중학교 때부터 응시하기도 합니다.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "AMC 8에서 상을 받으면 상위 대회 출전권이 생긴다",
              fact: "AMC 8에는 다음 라운드가 없습니다. AIME 진출은 AMC 10·12 성적으로 결정됩니다.",
            },
            {
              myth: "초등학생이 응시하기에는 너무 이르다",
              fact: "최소 학년 제한이 없고, 6학년 이하는 15점 이상이면 Achievement Roll에 오릅니다.",
            },
          ],
        },
      },
      {
        heading: "남은 15주, 이렇게 준비하세요",
        paragraphs: [
          "AMC 8은 수와 연산, 비율과 퍼센트, 초급 대수, 기하, 경우의 수와 확률, 정수론에서 고르게 출제됩니다. 문제는 뒤로 갈수록 어려워집니다. 대체로 앞의 15문제는 개념을 알면 풀 수 있고, 후반부 10문제는 여러 개념을 엮어야 풀립니다. 처음 응시하는 초등학생이라면 앞의 15문제를 실수 없이 맞히는 것을 목표로 삼으세요. 그 점수가 Achievement Roll 기준입니다.",
          "이 글을 쓰는 10월 초 기준으로 응시 기간 첫날까지 15주가 남았습니다. 가장 좋은 교재는 기출문제입니다. 처음에는 시간을 재지 않고 풀면서 모르는 개념을 채우고, 11월 중순부터는 40분을 재고 실전처럼 풉니다. 틀린 문제는 답만 확인하지 말고 다음 날 해설 없이 다시 풀어 보게 하세요. Singapore Math나 Beast Academy로 개념을 다져 온 학생이라면 비율, 넓이, 경우의 수 단원이 기출문제와 자연스럽게 연결됩니다.",
        ],
        visual: {
          type: "table",
          headers: ["기간", "목표", "할 일"],
          rows: [
            { label: "10월~11월 중순", values: ["개념 채우기", "영역별 개념 정리, 기출 1~15번을 시간 제한 없이 풀기"] },
            { label: "11월 중순~12월", values: ["실전 적응", "주 1회 40분 실전 풀이, 틀린 문제는 다음 날 다시 풀기"] },
            { label: "1월 (시험 전 3주)", values: ["마무리", "주 2회 실전 풀이, 오답 복습, 시간 배분 연습"] },
          ],
        },
      },
      {
        heading: "시험 당일 전략",
        paragraphs: [
          "오답 감점이 없으므로 답안을 비워 두면 손해입니다. 모르는 문제도 보기를 하나라도 지운 뒤 반드시 답을 고르게 하세요. 40분에 25문제이므로 문제당 평균 1분 36초가 주어집니다. 한 문제에 3분 넘게 매달리면 뒤에 있는 풀 수 있는 문제를 놓치게 됩니다.",
          "문제를 두 번에 나눠 푸는 방법을 권합니다. 첫 번째에는 바로 풀리는 문제만 풀고, 막히는 문제는 표시해 둔 채 넘어갑니다. 끝까지 간 뒤 남은 시간에 표시한 문제로 돌아옵니다. 객관식이므로 보기를 식에 대입해 보거나 어림해서 보기를 줄이는 방법도 통합니다.",
        ],
        visual: {
          type: "checklist",
          title: "시험 당일 체크리스트",
          items: [
            { text: "모든 문항에 답 표시하기", note: "오답 감점 없음" },
            { text: "막히면 표시하고 넘어가기", note: "문제당 평균 1분 36초" },
            { text: "보기 활용하기", note: "대입, 어림, 소거" },
            { text: "문제의 마지막 문장 다시 읽기", note: "무엇을 구하는 문제인지 확인" },
            { text: "준비물 확인하기", note: "계산기 사용 불가, 온라인 시험이면 기기 지참 여부 확인" },
          ],
        },
      },
      {
        heading: "유용한 무료 사이트",
        paragraphs: [
          "AMC 8 준비에 필요한 자료는 대부분 무료로 구할 수 있습니다. 기출문제와 풀이는 AoPS 위키와 Po-Shen Loh 교수의 LIVE 사이트에 연도별로 정리되어 있습니다. LIVE 사이트는 MAA의 허가를 받아 기출문제 PDF와 동영상 해설을 함께 제공합니다.",
          "개념별 연습에는 AoPS의 Alcumus가 좋습니다. 학생의 정답률에 맞춰 난이도가 조절되는 무료 문제 은행입니다. 유료 강의나 교재는 기출문제를 몇 회 풀어 본 뒤, 부족한 영역이 드러났을 때 고려해도 늦지 않습니다.",
        ],
        visual: {
          type: "table",
          headers: ["사이트", "주소", "용도"],
          rows: [
            { label: "MAA AMC 공식", values: ["maa.org/student-programs/amc", "공식 일정과 규정, 등록 안내"] },
            { label: "AoPS Wiki", values: ["artofproblemsolving.com/wiki", "1985년부터의 기출문제와 풀이"] },
            { label: "Po-Shen Loh LIVE", values: ["live.poshenloh.com/past-contests", "기출 PDF와 동영상 해설"] },
            { label: "AoPS Alcumus", values: ["artofproblemsolving.com/alcumus", "개념별 적응형 문제 연습"] },
            { label: "AMC Trivial", values: ["amctrivial.com", "기출문제로 모의고사 구성"] },
            { label: "MATHCOUNTS", values: ["mathcounts.org", "지난 시즌 대회 문제와 풀이"] },
          ],
        },
      },
    ],
    faqKo: [
      {
        q: "2027 AMC 8 시험은 언제인가요?",
        a: "2027년 1월 21일(목)부터 27일(수) 사이입니다. 이 기간 중 실제 시험 날짜와 시간은 시험을 여는 학교나 기관이 정합니다.",
      },
      {
        q: "AMC 8은 개인이 직접 신청할 수 있나요?",
        a: "아닙니다. 학부모나 학생은 MAA에 직접 등록할 수 없고, AMC 8을 시행하는 학교나 외부 학생을 받는 공개 시험장을 통해 응시해야 합니다.",
      },
      {
        q: "AMC 8 커트라인은 몇 점인가요?",
        a: "2026년 기준 Honor Roll(상위 5%)은 21점, Distinguished Honor Roll(상위 1%)은 24점이었습니다. 6학년 이하 학생은 15점 이상이면 Achievement Roll에 오르며, 이 기준은 매년 같습니다.",
      },
      {
        q: "초등학생도 AMC 8을 볼 수 있나요?",
        a: "네. 최소 학년 제한이 없어서 8학년 이하이고 시험 당일 만 15.5세 미만이면 응시할 수 있습니다. 많은 4~6학년 학생이 도전합니다.",
      },
      {
        q: "AMC 8에서 계산기를 쓸 수 있나요?",
        a: "쓸 수 없습니다. 25문항을 40분 동안 푸는 객관식 시험이며, 오답 감점은 없습니다.",
      },
    ],
    bodyEn: [
      {
        heading: "What Is the AMC 8?",
        paragraphs: [
          "The AMC 8 (American Mathematics Competition 8) is a math contest run every January by the Mathematical Association of America (MAA). Students answer 25 multiple-choice questions in 40 minutes. Each correct answer is worth one point, wrong answers carry no penalty, and calculators are not allowed.",
          "Any student in grade 8 or below who is under 15.5 years old on test day can take it, and there is no minimum grade. Many 4th through 6th graders who enjoy math take it for that reason. The content is middle school math, though, so it is a real stretch for elementary students. The overall average on the 2026 contest was about 12 out of 25.",
        ],
        visual: {
          type: "callout",
          variant: "note",
          tone: "info",
          title: "Format and rules in detail",
          text: "Our AMC 8 page covers the test-day rules and links to the 2024 and 2025 exams as free PDFs.",
          linkHref: "/en/resources/testing/amc-8",
          linkLabel: "See the AMC 8 guide page",
        },
      },
      {
        heading: "When Is the 2027 AMC 8?",
        paragraphs: [
          "For the 2026-27 season, the AMC 8 window runs from Thursday, January 21 through Wednesday, January 27, 2027. The school or organization hosting the contest picks the actual day and time within that week. Two schools in the same area can test on different days.",
          "The registration deadlines below apply to the school or organization's Competition Manager, who registers with the MAA. They are not deadlines for students. The fees are also what the host pays, and each site sets its own per-student cost. Dates can change, so check the MAA's official page for the latest.",
        ],
        visual: {
          type: "table",
          headers: ["", "Date", "Notes"],
          rows: [
            { label: "Early-bird deadline", values: ["October 28, 2026", "$55 registration fee"] },
            { label: "Regular deadline", values: ["January 5, 2027", "$75 fee; last date for first-time hosts"] },
            { label: "Late deadline", values: ["January 14, 2027", "$115 fee; returning hosts only"] },
            { label: "Competition window", values: ["January 21-27, 2027 (Thu-Wed)", "The host picks the test day"] },
          ],
        },
      },
      {
        heading: "How Does Registration Work?",
        paragraphs: [
          "Parents and students cannot register for the AMC 8 with the MAA directly. Students take it through a school or organization that has a Competition Manager. The first step is to find out whether your child's school is offering the AMC 8 this year. In FCPS, the schools that offer it are mostly middle schools, and elementary schools vary. Ask the math teacher or the AART whether the school participates and how students sign up.",
          "If the school doesn't offer it, look for a public testing site that accepts outside students. Universities, math circles, and learning centers host the contest, and during the registration season the MAA's registration page (maa.org/amcreg) lets you search for sites by ZIP code. Public sites have few seats, and some close sign-ups in mid-December, well before the MAA deadlines. Right now, confirming a seat matters more than studying.",
        ],
        visual: {
          type: "checklist",
          title: "Registration steps",
          items: [
            { text: "Ask the school whether it offers the AMC 8", note: "Math teacher or AART, in October or November" },
            { text: "Confirm the school's sign-up deadline and cost", note: "School deadlines can fall earlier than the MAA's" },
            { text: "If the school doesn't offer it, search for a public testing site", note: "maa.org/amcreg; aim to sign up by early December" },
            { text: "Confirm the test date, time, and format", note: "Paper or online, depending on the site" },
          ],
        },
      },
      {
        heading: "Which Awards Go With Which Scores?",
        paragraphs: [
          "Individual AMC 8 awards depend on where a student's score falls among all participants. The top 5% make the Honor Roll, the top 1% make the Distinguished Honor Roll, and a perfect 25 earns a Certificate of Distinction. The Distinguished Honor Roll sometimes appears on certificates as the Honor Roll of Distinction.",
          "The award elementary parents should know is the Achievement Roll. It goes to any student in grade 6 or below who scores 15 or higher, and that threshold does not change from year to year. There is also a School Winner pin for the top scorer at each site, and gold, silver, and bronze certificates for the top three. Whether these are actually handed out depends on the site.",
        ],
        visual: {
          type: "table",
          headers: ["Award", "Criteria", "2026 cutoff"],
          rows: [
            { label: "Certificate of Distinction", values: ["Perfect score", "25"] },
            { label: "Distinguished Honor Roll", values: ["Top 1% overall", "24"] },
            { label: "Honor Roll", values: ["Top 5% overall", "21"] },
            { label: "Achievement Roll", values: ["Grade 6 or below, 15 or higher", "15 (same every year)"] },
          ],
        },
      },
      {
        heading: "Cutoffs Change Every Year",
        paragraphs: [
          "The Honor Roll and Distinguished Honor Roll are set by percentile, so the cutoffs move with the difficulty of each year's contest. Over the last four years the Honor Roll cutoff rose from 17 to 21, and the Distinguished Honor Roll cutoff rose from 21 to 24. The 2027 cutoffs will be announced after the contest, usually in February.",
          "That makes it hard to say in advance what score will earn an award. A realistic approach is to make 15, the fixed Achievement Roll threshold, the first goal, and then use recent cutoffs as a guide when aiming for the low 20s.",
        ],
        visual: {
          type: "table",
          headers: ["Year", "Honor Roll (top 5%)", "Distinguished Honor Roll (top 1%)"],
          rows: [
            { label: "2026", values: ["21", "24"] },
            { label: "2025", values: ["19", "23"] },
            { label: "2024", values: ["18", "22"] },
            { label: "2023", values: ["17", "21"] },
          ],
        },
      },
      {
        heading: "What Does an Award Actually Get You?",
        paragraphs: [
          "Start with what it doesn't do. An AMC 8 score does not qualify a student for a next-round contest. Only AMC 10 and AMC 12 scores lead to the AIME. FCPS's AAP screening and TJ admissions don't ask for AMC 8 scores either.",
          "The real benefits are elsewhere. Students receive a certificate from the MAA and an objective read on where they stand among peers nationwide. The result is also something to list when a math camp or enrichment program asks about contest experience. Above all, what a student learns while preparing carries straight into MATHCOUNTS and the AMC 10 in middle school. The AMC 10 has no minimum grade, so students who do well on the AMC 8 sometimes start taking it in middle school.",
        ],
        visual: {
          type: "callout",
          variant: "mythFact",
          pairs: [
            {
              myth: "An AMC 8 award qualifies a student for a higher-level contest",
              fact: "The AMC 8 has no next round. AIME qualification comes from AMC 10 and AMC 12 scores.",
            },
            {
              myth: "Elementary students are too young to take it",
              fact: "There is no minimum grade, and a student in grade 6 or below who scores 15 or higher makes the Achievement Roll.",
            },
          ],
        },
      },
      {
        heading: "A 15-Week Prep Plan",
        paragraphs: [
          "The AMC 8 draws evenly from arithmetic, ratios and percents, beginning algebra, geometry, counting and probability, and number theory. Questions get harder as the test goes on. In general, the first 15 can be solved by a student who knows the concepts, and the last 10 require combining several ideas. For an elementary student taking it for the first time, a good goal is to get the first 15 right without careless errors. That score is the Achievement Roll threshold.",
          "As of early October, when this post was written, 15 weeks remain before the first day of the window. Past exams are the best study material. Begin untimed, filling in concepts your child hasn't seen yet, and from mid-November switch to full 40-minute timed runs. For each missed problem, have your child re-solve it the next day without the solution instead of only checking the answer. Students who have built their foundations with Singapore Math or Beast Academy will find that ratios, area, and counting connect naturally to past AMC 8 problems.",
        ],
        visual: {
          type: "table",
          headers: ["Period", "Goal", "What to do"],
          rows: [
            { label: "October to mid-November", values: ["Fill in concepts", "Review each topic; solve problems 1-15 from past exams untimed"] },
            { label: "Mid-November to December", values: ["Adjust to test conditions", "One timed 40-minute exam a week; re-solve missed problems the next day"] },
            { label: "January (last 3 weeks)", values: ["Final review", "Two timed exams a week; review past mistakes; practice pacing"] },
          ],
        },
      },
      {
        heading: "Test-Day Strategy",
        paragraphs: [
          "Because wrong answers carry no penalty, a blank answer only costs points. Even on a problem your child can't solve, have them rule out at least one choice and then pick an answer. Twenty-five questions in 40 minutes works out to an average of 1 minute 36 seconds each. Spending more than three minutes on one problem means missing solvable ones later in the test.",
          "We recommend working through the test in two passes. On the first pass, solve only the problems that come quickly, and mark the rest and move on. After reaching the end, return to the marked problems with the time that's left. Since the test is multiple-choice, plugging the choices into the problem or estimating to narrow them down also works.",
        ],
        visual: {
          type: "checklist",
          title: "Test-day checklist",
          items: [
            { text: "Answer every question", note: "No penalty for wrong answers" },
            { text: "Mark it and move on when stuck", note: "About 1 minute 36 seconds per question" },
            { text: "Use the answer choices", note: "Plug in, estimate, eliminate" },
            { text: "Re-read the last sentence of the problem", note: "Confirm what it is asking for" },
            { text: "Check what to bring", note: "No calculators; for an online test, ask whether to bring a device" },
          ],
        },
      },
      {
        heading: "Free Sites Worth Bookmarking",
        paragraphs: [
          "Most of what a student needs to prepare for the AMC 8 is available free. Past exams and solutions are organized by year on the AoPS Wiki and on Professor Po-Shen Loh's LIVE site. The LIVE site hosts past exam PDFs along with video solutions, with the MAA's permission.",
          "For practice by topic, AoPS's Alcumus is a good choice. It is a free problem bank that adjusts difficulty to how the student is doing. Paid courses and books can wait until your child has worked through a few past exams and the weak areas are clear.",
        ],
        visual: {
          type: "table",
          headers: ["Site", "Address", "Use it for"],
          rows: [
            { label: "MAA AMC (official)", values: ["maa.org/student-programs/amc", "Official dates, rules, and registration info"] },
            { label: "AoPS Wiki", values: ["artofproblemsolving.com/wiki", "Past exams and solutions back to 1985"] },
            { label: "Po-Shen Loh LIVE", values: ["live.poshenloh.com/past-contests", "Past exam PDFs and video solutions"] },
            { label: "AoPS Alcumus", values: ["artofproblemsolving.com/alcumus", "Adaptive practice by topic"] },
            { label: "AMC Trivial", values: ["amctrivial.com", "Mock tests built from past problems"] },
            { label: "MATHCOUNTS", values: ["mathcounts.org", "Last season's competition problems and solutions"] },
          ],
        },
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
