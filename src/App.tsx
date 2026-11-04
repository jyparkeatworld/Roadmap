import React, { useState } from "react";
import data from "./coursesData.json";

const categoryIcons: { [key: string]: string } = {
  ai_dt: "🤖",
  marketing_brand: "🚀",
  communication: "💬",
  language_global: "🌐",
  mgmt_finance_mba_leadership: "📊",
  tax_law_admin: "⚖️",
  job_license: "📜",
  logistics_procurement: "📦",
  customer_service_sales: "🤝",
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [selected1Depths, setSelected1Depths] = useState<any[]>([]);
  const [selected2Depths, setSelected2Depths] = useState<any[]>([]);
  // 각 세부 영역별(sub.id)로 선택된 키워드를 관리하는 객체 상태 (예: { ai_basic: "챗GPT", big_data: "파이썬" })
  const [selectedKeywordsMap, setSelectedKeywordsMap] = useState<{ [subId: string]: string }>({});
  const [targetHours, setTargetHours] = useState<number>(10);
  const [recommendations, setRecommendations] = useState<any[] | null>(null);

  const handle1DepthToggle = (cat: any) => {
    if (selected1Depths.some((item) => item.id === cat.id)) {
      setSelected1Depths(selected1Depths.filter((item) => item.id !== cat.id));
    } else {
      if (selected1Depths.length >= 3) {
        alert("관심 카테고리는 최대 3개까지 복수 선택 가능합니다.");
        return;
      }
      setSelected1Depths([...selected1Depths, cat]);
    }
    setSelected2Depths([]);
    setSelectedKeywordsMap({});
  };

  const handle2DepthToggle = (sub: any) => {
    if (selected2Depths.some((item) => item.id === sub.id)) {
      setSelected2Depths(selected2Depths.filter((item) => item.id !== sub.id));
      const updatedMap = { ...selectedKeywordsMap };
      delete updatedMap[sub.id];
      setSelectedKeywordsMap(updatedMap);
    } else {
      if (selected2Depths.length >= 3) {
        alert("세부 분야는 최대 3개까지 복수 선택 가능합니다.");
        return;
      }
      setSelected2Depths([...selected2Depths, sub]);
    }
  };

  // 각 꼭지(세부 영역)별로 1개씩만 선택되도록 처리하는 핸들러
  const handleKeywordSelect = (subId: string, keyword: string) => {
    setSelectedKeywordsMap((prev) => ({
      ...prev,
      [subId]: prev[subId] === keyword ? "" : keyword, // 이미 선택된 것을 누르면 해제, 아니면 교체
    }));
  };

  const handleGenerateRecommendation = () => {
    const activeKeywords = Object.values(selectedKeywordsMap).filter(Boolean);
    if (activeKeywords.length === 0) {
      alert("각 세부 영역별로 최소 1개 이상의 키워드를 선택해주세요.");
      return;
    }

    let matched = data.courses.filter(
      (course: any) =>
        activeKeywords.includes(course.keyword) ||
        selected2Depths.some((sub) => sub.id === course.subcategory)
    );

    if (matched.length === 0) {
      matched = data.courses;
    }

    const uniqueMatched = Array.from(new Set(matched.map((c: any) => c.id))).map(
      (id) => matched.find((c: any) => c.id === id)
    );

    const requiredCount = Math.max(1, Math.floor(targetHours / 2));
    let finalCourses = uniqueMatched.slice(0, requiredCount);

    while (finalCourses.length < requiredCount && data.courses.length > 0) {
      const nextCourse = data.courses[finalCourses.length % data.courses.length];
      finalCourses.push(nextCourse);
    }

    setRecommendations(finalCourses);
    setStep(5);
  };

  const handleArchiveLanding = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "click_archive_landing", {
        event_category: "Engagement",
        event_label: "HRD Archive Link Click",
        value: 1,
      });
    }
    window.open("https://archive.hackershrd.com", "_blank");
  };

  const activeKeywordsList = Object.values(selectedKeywordsMap).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F5FB] via-[#F0F2F9] to-[#E9ECF8] p-8 font-sans flex items-center justify-center text-[#2D3142]">
      <div className="w-full max-w-4xl min-h-[660px] mx-auto bg-white rounded-[32px] shadow-[0_20px_50px_rgba(79,70,229,0.08)] p-12 flex flex-col justify-between text-center border border-[#E8ECEF]">
        <div>
          {/* 상단 타이틀 및 스텝 인디케이터 영역 */}
          <div className="flex justify-between items-center mb-8 border-b border-[#E8ECEF] pb-6">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1E2238]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
                  HRD 아카이브
                </span>{" "}
                마이 큐레이션
              </h1>
              <p className="text-sm font-medium text-[#7C849B] mt-1">
                여러분의 관심사를 분석해 꼭 필요한 과정을 먼저 수강해보세요.
              </p>
            </div>

            {/* 동그란 스텝 인디케이터 버튼 바 */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => {
                const isCurrent = step === s;
                const isCompleted = step > s || step === 5;
                return (
                  <div
                    key={s}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] scale-110"
                        : isCompleted
                        ? "bg-[#10B981] text-white"
                        : "bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]"
                    }`}
                  >
                    {isCompleted && step !== 5 ? "✓" : s}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ----------------- STEP 1 ----------------- */}
          {step === 1 && (
            <div className="text-left">
              <div className="mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 1. 관심 카테고리 선택 (최대 3개)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3.5 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {data.categories.map((cat: any) => {
                  const isSelected = selected1Depths.some((item) => item.id === cat.id);
                  const icon = categoryIcons[cat.id] || "💡";
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handle1DepthToggle(cat)}
                      className={`p-4 rounded-2xl border text-left font-bold transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-transparent shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-[1.02]"
                          : "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]"
                      }`}
                    >
                      <span className="text-xl p-2 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center">
                        {icon}
                      </span>
                      <span className="text-sm tracking-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 2 ----------------- */}
          {step === 2 && (
            <div className="text-left">
              <div className="mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 2. 세부 분야 선택 (최대 3개)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3.5 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {selected1Depths
                  .flatMap((cat) => cat.subcategories || [])
                  .map((sub: any) => {
                    const isSelected = selected2Depths.some((item) => item.id === sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handle2DepthToggle(sub)}
                        className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all duration-200 flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-transparent shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-[1.02]"
                            : "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#10B981]" : "bg-[#CBD5E1]"}`} />
                        <span>{sub.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 3 ----------------- */}
          {step === 3 && (
            <div className="text-left">
              <div className="mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 3. 핵심 키워드 선택 (각 세부 영역별 1개씩)
                </span>
              </div>
              <div className="space-y-5 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {selected2Depths.map((sub: any) => {
                  const subKeywords = (sub.keywords || []).slice(0, 8);
                  const currentSelectedKw = selectedKeywordsMap[sub.id];
                  return (
                    <div key={sub.id} className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <div className="text-xs font-bold text-[#4F46E5] mb-2.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                        {sub.name} 추천 키워드
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {subKeywords.map((kw: string) => {
                          const isSelected = currentSelectedKw === kw;
                          return (
                            <button
                              key={kw}
                              onClick={() => handleKeywordSelect(sub.id, kw)}
                              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-transparent shadow-[0_4px_12px_rgba(79,70,229,0.25)]"
                                  : "bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                              }`}
                            >
                              #{kw}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 4 ----------------- */}
          {step === 4 && (
            <div className="text-left">
              <div className="mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#4F46E5]">
                  Step 4. 목표 학습 시간 선택
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3.5 mb-6">
                {[2, 3, 4, 5, 6, 8, 10, 12, 15].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setTargetHours(hours)}
                    className={`py-4 rounded-2xl border text-lg font-extrabold transition-all duration-200 ${
                      targetHours === hours
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-transparent shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-[1.02]"
                        : "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {hours}시간
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- STEP 5: 결과 페이지 ----------------- */}
          {step === 5 && recommendations && (
            <div className="text-left">
              <h2 className="text-xl font-bold text-[#1E2238] mb-5 text-center flex items-center justify-center gap-2">
                <span>✨</span> 큐레이션 과정 추천 결과 <span className="text-sm text-[#4F46E5] font-semibold bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#E0E7FF]">총 목표: {targetHours}시간</span>
              </h2>

              <div className="space-y-3.5 mb-6 max-h-[340px] overflow-y-auto pr-1">
                {recommendations.map((course: any, idx: number) => (
                  <div
                    key={course.id || idx}
                    className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-lg">
                          Module {idx + 1} ({course.hours || 2}시간)
                        </span>
                        <span className="text-xs text-[#64748B] font-bold">
                          [{course.difficulty || "초급"}]
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1E2238] text-base select-all">
                        {course.title}
                      </h3>
                    </div>
                    <span className="text-xl text-[#4F46E5] bg-white p-2.5 rounded-xl shadow-sm border border-[#E2E8F0]">
                      📘
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-center border-t border-[#E2E8F0] pt-5">
                <p className="text-sm text-[#64748B] mb-3 font-semibold">
                  검색창으로 내 과정을 확인해보세요. 😊
                </p>
                <button
                  onClick={handleArchiveLanding}
                  className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white py-4 rounded-2xl text-base font-extrabold hover:opacity-95 transition-all shadow-[0_10px_25px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                >
                  HRD 아카이브에서 내 과정 신청하기 ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="pt-4 border-t border-[#E2E8F0]">
          {step === 1 && (
            <button
              disabled={selected1Depths.length === 0}
              onClick={() => setStep(2)}
              className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all ${
                selected1Depths.length > 0
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:opacity-95 active:scale-[0.98]"
                  : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none"
              }`}
            >
              다음 단계로 ➡
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-[#F1F5F9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#E2E8F0] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-4 rounded-2xl font-extrabold text-base transition-all ${
                  selected2Depths.length > 0
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:opacity-95 active:scale-[0.98]"
                    : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-[#F1F5F9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#E2E8F0] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                disabled={activeKeywordsList.length === 0}
                onClick={() => setStep(4)}
                className={`w-2/3 py-4 rounded-2xl font-extrabold text-base transition-all ${
                  activeKeywordsList.length > 0
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:opacity-95 active:scale-[0.98]"
                    : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-[#F1F5F9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#E2E8F0] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleGenerateRecommendation}
                className="w-2/3 py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:opacity-95 transition-all active:scale-[0.98]"
              >
                맞춤형 큐레이션 결과 생성하기 ✨
              </button>
            </div>
          )}

          {step === 5 && (
            <button
              onClick={() => {
                setStep(1);
                setSelected1Depths([]);
                setSelected2Depths([]);
                setSelectedKeywordsMap({});
              }}
              className="w-full bg-[#F1F5F9] text-[#334155] py-4 rounded-2xl font-bold text-base hover:bg-[#E2E8F0] transition-all active:scale-[0.98]"
            >
              처음부터 다시 시작하기 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}