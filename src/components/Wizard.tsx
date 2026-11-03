import { HOUR_PLANS, JOBS, LEVELS, PURPOSES } from "../lib/jobs";
import type { HourPlanId, JobId, LevelId, PurposeId, Profile } from "../types";

interface Props {
  step: number;
  profile: Partial<Profile>;
  onChange: (patch: Partial<Profile>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  ready: boolean;
}

function CardButton({
  selected,
  title,
  desc,
  emoji,
  onClick,
}: {
  selected: boolean;
  title: string;
  desc: string;
  emoji?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-brand-500 bg-white shadow-card ring-2 ring-brand-500/30"
          : "border-ink-100 bg-white/70 hover:border-brand-400/60 hover:bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {emoji && <span className="text-xl leading-none">{emoji}</span>}
        <div>
          <div className="font-semibold text-ink-800">{title}</div>
          <div className="mt-1 text-sm text-ink-700/70">{desc}</div>
        </div>
      </div>
    </button>
  );
}

const STEPS = ["직무", "수준", "목적", "시간"];

export default function Wizard({ step, profile, onChange, onNext, onBack, onSubmit, ready }: Props) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card backdrop-blur md:p-8">
      <ol className="mb-8 flex items-center gap-2 text-sm">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active || done ? "bg-ink-800 text-white" : "bg-ink-100 text-ink-700"
                }`}
              >
                {n}
              </span>
              <span className={`hidden sm:inline ${active ? "font-semibold text-ink-800" : "text-ink-700/60"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-2 h-px flex-1 bg-ink-100" />}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold">어떤 직무의 로드맵이 필요하신가요?</h2>
          <p className="mt-1 text-sm text-ink-700/70">나와 가까운 직무를 고르면, 그에 맞는 학습 경로를 제안합니다.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {JOBS.map((job) => (
              <CardButton
                key={job.id}
                selected={profile.job === job.id}
                title={job.label}
                desc={job.blurb}
                onClick={() => onChange({ job: job.id as JobId })}
              />
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold">현재 학습 수준을 선택해 주세요</h2>
          <p className="mt-1 text-sm text-ink-700/70">기초 → 실무 → 심화 비중이 수준에 따라 달라집니다.</p>
          <div className="mt-5 grid gap-3">
            {LEVELS.map((lv) => (
              <CardButton
                key={lv.id}
                selected={profile.level === lv.id}
                title={lv.label}
                desc={lv.desc}
                onClick={() => onChange({ level: lv.id as LevelId })}
              />
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold">이번 학습의 목적은 무엇인가요?</h2>
          <p className="mt-1 text-sm text-ink-700/70">지금 필요한 성장 방향을 선택해 주세요.</p>
          <div className="mt-5 grid gap-3">
            {PURPOSES.map((p) => (
              <CardButton
                key={p.id}
                selected={profile.purpose === p.id}
                title={p.label}
                desc={p.desc}
                onClick={() => onChange({ purpose: p.id as PurposeId })}
              />
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold">얼마나 깊게 배우고 싶으신가요?</h2>
          <p className="mt-1 text-sm text-ink-700/70">학습 시간에 맞춰 과정 구성과 깊이가 달라집니다.</p>
          <div className="mt-5 grid gap-3">
            {HOUR_PLANS.map((plan) => (
              <CardButton
                key={plan.id}
                selected={profile.hours === plan.id}
                emoji={plan.emoji}
                title={`${plan.title} · ${plan.subtitle}`}
                desc={plan.desc}
                onClick={() => onChange({ hours: plan.id as HourPlanId })}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 1}
          className="rounded-full px-4 py-2 text-sm text-ink-700/70 disabled:invisible"
        >
          이전
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!ready}
            className="rounded-full bg-ink-800 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!ready}
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            맞춤 로드맵 보기
          </button>
        )}
      </div>
    </section>
  );
}
