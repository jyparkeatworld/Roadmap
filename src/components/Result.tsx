import type { Profile, Roadmap } from "../types";
import { LEVELS, PURPOSES, hourPlanById } from "../lib/jobs";
import { formatHours, jobLabel } from "../lib/match";

interface Props {
  profile: Profile;
  roadmap: Roadmap;
  onReset: () => void;
}

export default function Result({ profile, roadmap, onReset }: Props) {
  const level = LEVELS.find((l) => l.id === profile.level)?.label;
  const purpose = PURPOSES.find((p) => p.id === profile.purpose)?.label;
  const plan = hourPlanById(profile.hours);

  const printPdf = () => {
    window.print();
  };

  return (
    <div id="roadmap-report" className="space-y-6">
      <section className="rounded-3xl bg-ink-800 p-6 text-white md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-400">
          {plan.emoji} {plan.subtitle}
        </p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">
          추천 학습 플랜 (약 {formatHours(roadmap.totalHours)} 과정)
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          {jobLabel(profile.job)} · {level} · {purpose} 기준으로 기초 → 실무 → 심화 패키지를 구성했습니다.
        </p>
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-xs text-white/60">학습 분량</dt>
            <dd className="mt-1 text-xl font-bold">약 {formatHours(roadmap.totalHours)}</dd>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-xs text-white/60">선택한 플랜</dt>
            <dd className="mt-1 text-xl font-bold">{plan.title}</dd>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <dt className="text-xs text-white/60">추천 과정</dt>
            <dd className="mt-1 text-xl font-bold">{roadmap.courseCount}개</dd>
          </div>
        </dl>
        <div className="no-print mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={printPdf}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
          >
            PDF 저장 / 인쇄
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            다시 진단하기
          </button>
        </div>
      </section>

      <ol className="relative space-y-8 border-l-2 border-brand-500/30 pl-6 md:pl-8">
        {roadmap.stages.map((stage, idx) => (
          <li key={stage.id} className="print-break">
            <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-brand-500" />
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-brand-600">
                  STEP {idx + 1} · {stage.label}
                </p>
                <h3 className="text-lg font-bold text-ink-800">{stage.hint}</h3>
              </div>
              <p className="text-sm font-semibold text-ink-700">약 {formatHours(stage.hours)}</p>
            </div>
            <div className="grid gap-3">
              {stage.courses.map((course) => (
                <article
                  key={course.id}
                  className="print-break rounded-2xl border border-ink-100 bg-white p-4 shadow-card md:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-ink-700/60">
                        {course.cat} · {course.sub_cat}
                      </p>
                      <h4 className="mt-1 font-semibold text-ink-800">{course.title}</h4>
                    </div>
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-ink-800">
                      {formatHours(course.hours)}
                    </span>
                  </div>
                  {course.desc && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-700/80">{course.desc}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-700/55">{course.reason}</p>
                </article>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
