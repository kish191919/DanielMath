import { ArrowRight, Brain, FileText, LineChart, Sparkles, Clock, Users, ClipboardCheck, FileSpreadsheet, ScanSearch, Send, ChevronRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { Section, SectionHeader } from "@/components/site/section";
import { HeroBackground } from "@/components/site/hero-background";
import { WarmthSection } from "@/components/site/warmth-section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Stats />
      <ProgramsPreview />
      <WhyUs />
      <WarmthSection />
      <HowItWorks />
      <CurriculumChips />
      <FinalCTA />
    </>
  );
}

function HeroSection() {
  return (
    <HeroBackground>
      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" />
            AI-powered math studio · Grades 3–6
          </span>
          <h1
            className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-ko"
            lang="ko"
          >
            아이마다 다른,
            <br />
            <span className="text-gold-300">맞춤</span> 수학 공부방.
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl text-lg font-medium text-navy-100 sm:text-xl font-ko"
            lang="ko"
          >
            한 사람씩 꾸준히, 3–6학년 영재 수학.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm tracking-wide text-navy-200/80 sm:text-base">
            Personalized Math for Gifted Minds · Grades 3–6
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-navy-200/70">
            AI-generated worksheets, daily progress reports, and a curriculum
            built around AAP, CogAT/NNAT, and AMC 8.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/inquire" size="lg" variant="secondary">
              상담 신청 <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/programs"
              size="lg"
              variant="ghost"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              프로그램 보기
            </Button>
          </div>
        </div>
      </Container>
    </HeroBackground>
  );
}

function Stats() {
  const stats = [
    { value: "3–6학년", labelKo: "3-6학년 대상", labelEn: "Grades 3–6", accent: false },
    { value: "4명", labelKo: "회당 정원", labelEn: "Per session", accent: false },
    { value: "AAP", labelKo: "전용 커리큘럼", labelEn: "Native curriculum", accent: true },
    { value: "매일", labelKo: "자동 리포트", labelEn: "Daily report", accent: false },
  ];

  return (
    <Section className="border-y border-navy-100">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-navy-100">
          {stats.map((s) => (
            <div key={s.labelEn} className="flex flex-col items-center px-4 text-center">
              <dt className="sr-only">{s.labelEn}</dt>
              <dd
                className={
                  s.accent
                    ? "text-4xl font-bold tracking-tight text-gold-500 sm:text-5xl"
                    : "text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl"
                }
              >
                {s.value}
              </dd>
              <p className="mt-3 text-sm font-semibold text-navy-900 font-ko" lang="ko">
                {s.labelKo}
              </p>
              <p className="text-xs text-navy-500">{s.labelEn}</p>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
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
  ];

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow="Program"
          title="One program. Every student personalized."
          titleKo="하나의 프로그램, 모두 다른 학습지"
          description="3-6학년 학생이 같은 공간에서 모이지만, 학년과 실력에 맞춰 매 수업 새로운 학습지와 숙제가 제공됩니다."
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
                학년 그룹으로 학생을 나누지 않습니다. 3-6학년이 한 시간대에 모이되,
                AI가 그 학생의 학년·실력·최근 오답 유형을 반영해 매 수업 새로운
                학습지와 숙제를 만들어냅니다. 학교 진도(Common Core)부터
                AAP·CogAT·AMC 8까지 학생별로 비율을 다르게 가져갑니다.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
    <Section>
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

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Diagnose",
      titleKo: "진단",
      desc: "학년·실력·약점 영역을 진단해 학생만의 출발점을 잡습니다.",
    },
    {
      icon: FileSpreadsheet,
      title: "Personalized Worksheet",
      titleKo: "맞춤 학습지",
      desc: "AI가 그 학생을 위한 학습지를 매 수업 새로 만들어냅니다.",
    },
    {
      icon: ScanSearch,
      title: "AI Grading",
      titleKo: "AI 채점",
      desc: "오답을 계산실수·개념·해석 등 유형별로 자동 분류합니다.",
    },
    {
      icon: Send,
      title: "Daily Report",
      titleKo: "학부모 리포트",
      desc: "매일 저녁 한국어 리포트가 학부모에게 자동 발송됩니다.",
    },
  ];

  return (
    <Section className="bg-navy-50/60">
      <Container>
        <SectionHeader
          eyebrow="How It Works"
          title="Four steps, every single session."
          titleKo="매 수업, 네 단계로 돌아갑니다"
          description="추상적인 'AI'가 아니라, 학생 한 명에게 매주 적용되는 구체적 흐름입니다."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-3">
          {steps.map((s, i) => (
            <div key={s.title} className="contents">
              <div className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-navy-500" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-900">
                  {s.title}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-navy-700 font-ko" lang="ko">
                  {s.titleKo}
                </p>
                <p className="mt-3 text-sm leading-6 text-navy-700 font-ko" lang="ko">
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden items-center justify-center text-navy-300 lg:flex">
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </div>
              )}
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

function FinalCTA() {
  return (
    <Section>
      <Container>
        <div className="rounded-3xl bg-navy-900 px-8 py-14 text-center text-white sm:px-12 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start? <br className="hidden sm:inline" />
            <span className="font-ko" lang="ko">
              지금 바로{" "}
              <span className="border-b-2 border-gold-500 pb-0.5">상담 신청</span>
              하세요.
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
            <Button href="/programs" size="lg" variant="ghost" className="text-white hover:bg-white/10">
              프로그램 보기 / View Programs
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
