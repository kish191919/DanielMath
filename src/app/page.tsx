import { ArrowRight, Brain, FileText, LineChart, Sparkles, Clock, Users, DollarSign } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramsPreview />
      <WhyUs />
      <CurriculumChips />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

function HeroSection() {
  return (
    <section className="bg-hero-grid">
      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/60 px-3 py-1 text-xs font-medium text-navy-700 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            AI-powered math studio · K–6
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Personalized Math for{" "}
            <span className="text-navy-700">Gifted Minds</span>, K–6
          </h1>
          <p
            className="mt-4 text-2xl font-semibold tracking-tight text-navy-700 sm:text-3xl font-ko"
            lang="ko"
          >
            AAP를 향한 가장 확실한 길
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-navy-700 sm:text-lg">
            AI-generated worksheets, daily progress reports, and a curriculum
            built around AAP, CogAT/NNAT, and AMC 8 — designed for every
            student&apos;s strengths and gaps.
          </p>
          <p
            className="mx-auto mt-3 max-w-2xl text-base leading-7 text-navy-700 sm:text-lg font-ko"
            lang="ko"
          >
            AI가 만드는 맞춤형 학습지와 매일 자동 리포트, AAP·CogAT·AMC 8를
            아우르는 커리큘럼으로 영재 수학의 길을 엽니다.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/inquire" size="lg">
              상담 신청 / Inquire <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/programs" size="lg" variant="secondary">
              View Programs / 프로그램 보기
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProgramsPreview() {
  const facts = [
    {
      icon: Users,
      label: "정원 / Class Size",
      value: "회당 최대 4명",
      valueEn: "Up to 4 students",
    },
    {
      icon: Clock,
      label: "시간 / Time",
      value: "주 1회 · 60분",
      valueEn: "1 session/wk · 60 min",
    },
    {
      icon: DollarSign,
      label: "수업료 / Tuition",
      value: "월 $50",
      valueEn: "$50 / month",
    },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Program"
          title="One program. Every student personalized."
          titleKo="하나의 프로그램, 모두 다른 학습지"
          description="K-6 모든 학생이 같은 공간에서 모이지만, 학년과 실력에 맞춰 매 수업 새로운 학습지와 숙제가 제공됩니다."
        />

        <div className="mt-12 rounded-2xl border border-navy-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div>
              <h3 className="text-xl font-bold text-navy-900">
                Same room, different paths.
              </h3>
              <p className="mt-1 text-lg font-semibold text-navy-700 font-ko" lang="ko">
                같은 교실, 학생마다 다른 진도
              </p>
              <p className="mt-4 text-sm leading-7 text-navy-700 font-ko" lang="ko">
                학년 그룹으로 학생을 나누지 않습니다. K-6 모두 한 시간대에 모이되,
                AI가 그 학생의 학년·실력·최근 오답 유형을 반영해 매 수업 새로운
                학습지와 숙제를 만들어냅니다. 학교 진도(Common Core)부터
                AAP·CogAT·AMC 8까지 학생별로 비율을 다르게 가져갑니다.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-navy-100 bg-navy-50/60 p-4"
                  >
                    <div className="flex items-center gap-2 text-navy-700">
                      <f.icon className="h-4 w-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-500">
                        {f.label}
                      </span>
                    </div>
                    <p className="mt-2 text-base font-semibold text-navy-900 font-ko" lang="ko">
                      {f.value}
                    </p>
                    <p className="text-xs text-navy-600">{f.valueEn}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-navy-700 font-ko" lang="ko">
                <strong className="text-navy-900">운영일</strong> · 매주 월·화·목·금
                오후 5시 ~ 8시 (학생별 시간은 등록 시 배정)
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end lg:justify-end">
              <Button href="/programs" variant="primary" size="lg">
                프로그램 자세히 보기 <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/inquire" variant="secondary" size="lg">
                무료 상담 신청
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function WhyUs() {
  const features = [
    {
      icon: FileText,
      title: "AI-Generated Worksheets",
      titleKo: "AI 맞춤 학습지",
      desc: "학년·유형·난이도·개수만 지정하면 그 학생만을 위한 학습지가 즉시 생성됩니다. 최근 오답 유형이 자동으로 가중됩니다.",
    },
    {
      icon: LineChart,
      title: "Daily Auto Reports",
      titleKo: "매일 자동 리포트",
      desc: "그날 푼 문제, 정답률, 잘한 영역, 약한 영역을 매일 저녁 학부모에게 한국어로 자동 발송합니다.",
    },
    {
      icon: Brain,
      title: "AAP-Native Curriculum",
      titleKo: "AAP 전용 커리큘럼",
      desc: "CogAT/NNAT, Common Core, Above-grade, AMC 8을 4단 트랙으로 통합 운영합니다.",
    },
    {
      icon: Sparkles,
      title: "1:1 Weakness Analysis",
      titleKo: "1:1 약점 분석",
      desc: "오답을 단순 표시하지 않고 계산실수·개념·단어해석 등 유형별로 분류해 다음 학습지에 반영합니다.",
    },
  ];

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow="Why Daniel Math"
          title="A studio built for one job: getting your child ahead."
          titleKo="아이의 한 걸음을 위해 설계된 공부방"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">
                {f.title}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-navy-700 font-ko" lang="ko">
                {f.titleKo}
              </p>
              <p className="mt-3 text-sm leading-6 text-navy-700 font-ko" lang="ko">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CurriculumChips() {
  const chips = [
    { label: "Common Core", labelKo: "공통핵심 표준" },
    { label: "CogAT / NNAT", labelKo: "AAP 진입 시험" },
    { label: "Above-grade", labelKo: "한 학년 위 심화" },
    { label: "AMC 8 Prep", labelKo: "수학 경시" },
    { label: "Word Problems", labelKo: "서술형 문제" },
    { label: "Pattern Logic", labelKo: "패턴 논리" },
  ];

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Curriculum"
          title="Four pillars, one progression."
          titleKo="네 개의 기둥, 하나의 진도표"
          description="단순 학교 진도가 아니라, AAP 합격과 유지를 위해 설계된 통합 커리큘럼."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {chips.map((c) => (
            <div
              key={c.label}
              className="flex items-baseline gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <span className="font-semibold text-navy-900">{c.label}</span>
              <span className="text-xs text-navy-600 font-ko" lang="ko">
                {c.labelKo}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Testimonials() {
  // PLACEHOLDER: 실제 학부모 후기로 교체하세요.
  const reviews = [
    {
      quote:
        "매일 저녁 받는 리포트가 정말 큰 차이를 만듭니다. 아이가 어떤 부분이 부족한지 명확히 알 수 있어요.",
      author: "K-2 학부모, Annandale",
    },
    {
      quote:
        "다른 학원과 다르게 아이별로 다른 학습지가 나옵니다. AAP 합격은 물론 자신감도 같이 자랐어요.",
      author: "3-6 학부모, Vienna",
    },
    {
      quote:
        "선생님이 AAP 시스템을 정확히 이해하고 계셔서 무엇을 언제 준비해야 할지 명확합니다.",
      author: "2학년 학부모, McLean",
    },
  ];

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow="From Parents"
          title="Words from our families"
          titleKo="학부모님들의 이야기"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm"
            >
              <blockquote className="text-base leading-7 text-navy-800 font-ko" lang="ko">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-medium text-navy-600 font-ko" lang="ko">
                — {r.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section>
      <Container>
        <div className="rounded-3xl bg-navy-900 px-8 py-14 text-center text-white sm:px-12 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start? <br className="hidden sm:inline" />
            <span className="font-ko" lang="ko">
              지금 바로 상담 신청하세요.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-navy-100 sm:text-lg font-ko" lang="ko">
            등록 가능 인원이 제한적입니다. 자녀의 학년과 현재 수준을 알려주시면
            가장 적합한 트랙을 안내해드립니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/inquire" size="lg" variant="secondary">
              상담 신청 / Inquire <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/tuition" size="lg" variant="ghost" className="text-white hover:bg-white/10">
              수업료 보기 / View Tuition
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
