import { useEffect, useMemo, useState } from "react";
import Wizard from "./components/Wizard";
import Result from "./components/Result";
import { buildRoadmap } from "./lib/match";
import type { Course, Profile, Roadmap } from "./types";

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    fetch("/courses_roadmap.json")
      .then((res) => {
        if (!res.ok) throw new Error("load failed");
        return res.json();
      })
      .then((data: Course[]) => setCourses(data))
      .catch(() => setLoadError("과정 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."))
      .finally(() => setLoading(false));
  }, []);

  const ready = useMemo(() => {
    if (step === 1) return Boolean(profile.job);
    if (step === 2) return Boolean(profile.level);
    if (step === 3) return Boolean(profile.purpose);
    return Boolean(profile.hours);
  }, [step, profile]);

  const submit = () => {
    if (!profile.job || !profile.level || !profile.purpose || !profile.hours) return;
    const full = profile as Profile;
    setRoadmap(buildRoadmap(courses, full));
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 md:py-12">
      <header className="no-print mb-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-brand-600">ARCHIVE LEARNING PATH</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-800 md:text-4xl">
          맞춤형 학습 로드맵
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700/75">
          직무 · 수준 · 목적 · 학습 시간을 선택하면, 기초부터 심화까지 나만의 학습 플랜을 바로 확인할 수
          있습니다.
        </p>
      </header>

      {loading && (
        <p className="mb-4 text-sm text-ink-700/60">맞춤 과정을 준비하고 있습니다…</p>
      )}
      {loadError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {!roadmap ? (
        <Wizard
          step={step}
          profile={profile}
          onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
          onNext={() => ready && setStep((s) => Math.min(4, s + 1))}
          onBack={() => setStep((s) => Math.max(1, s - 1))}
          onSubmit={submit}
          ready={ready && courses.length > 0 && !loading}
        />
      ) : (
        <Result
          profile={profile as Profile}
          roadmap={roadmap}
          onReset={() => {
            setRoadmap(null);
            setStep(1);
          }}
        />
      )}

      <footer className="no-print mt-12 text-center text-xs text-ink-700/40">
        아카이브 교육 콘텐츠 기반 맞춤 학습 플랜
      </footer>
    </div>
  );
}
