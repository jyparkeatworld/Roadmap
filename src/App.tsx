import React, { useState } from "react";
import data from "./coursesData.json";

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [selected1Depths, setSelected1Depths] = useState<any[]>([]);
  const [selected2Depths, setSelected2Depths] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
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
    setSelectedKeywords([]);
  };

  const handle2DepthToggle = (sub: any) => {
    if (selected2Depths.some((item) => item.id === sub.id)) {
      setSelected2Depths(selected2Depths.filter((item) => item.id !== sub.id));
    } else {
      if (selected2Depths.length >= 3) {
        alert("세부 분야는 최대 3개까지 복수 선택 가능합니다.");
        return;
      }
      setSelected2Depths([...selected2Depths, sub]);
    }
    setSelectedKeywords([]);
  };

  const handleKeywordToggle = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      if (selectedKeywords.length >= 3) {
        alert("키워드는 최대 3개까지 선택 가능합니다.");
        return;
      }
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleGenerateRecommendation = () => {
    if (selectedKeywords.length === 0) {
      alert("최소 1개 이상의 키워드를 선택해주세요.");
      return;
    }

    let matched = data.courses.filter(
      (course: any) =>
        selectedKeywords.includes(course.keyword) ||
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

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] flex items-center justify-center text-[#1D1D1F]">
      {/* 전체 박스 크기 및 내부 여백 넉넉하게 확장 */}
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-white/40 rounded-[36px] shadow-[0_24px_48px_rgba(0,0,0,0.08)] p-12 flex flex-col justify-between transition-all duration-300">
        <div>
          {/* 타이틀 크기 120% 확대 및 진하게 표현 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-3">
              HRD 아카이브 과정 큐레이션
            </h1>
            <p className="text-lg font-medium text-[#86868B]">
              임직원 관심사 맞춤 과정 추천 시스템
            </p>
          </div>

          {/* ----------------- STEP 1 ----------------- */}
          {step === 1 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-[#0066CC]">
                  Step 1. 관심 카테고리 선택 (최대 3개)
                </span>
                <span className="text-sm font-semibold text-[#86868B]">1 / 4 단계</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  ...data.categories,
                  { id: "extra_1", name: "리더십·코칭", subcategories: [] },
                  { id: "extra_2", name: "세무·법무실무", subcategories: [] },
                  { id: "extra_3", name: "글로벌 비즈니스", subcategories: [] },
                  { id: "extra_4", name: "DT", subcategories: [] },
                  { id: "extra_5", name: "공공기관·행정", subcategories: [] },
                ].map((cat: any) => {
                  const isSelected = selected1Depths.some((item) => item.id === cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handle1DepthToggle(cat)}
                      className={`p-4 rounded-2xl border text-center text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md shadow-blue-500/20 scale-[1.02]"
                          : "bg-[#FBFBFD] text-[#1D1D1F] border-[#D2D2D7]/60 hover:bg-[#F2F2F7]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 2 ----------------- */}
          {step === 2 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-[#0066CC]">
                  Step 2. 세부 분야 선택 (최대 3개)
                </span>
                <span className="text-sm font-semibold text-[#86868B]">2 / 4 단계</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8 max-h-[380px] overflow-y-auto pr-1">
                {selected1Depths.flatMap((cat) => cat.subcategories.length > 0 ? cat.subcategories : [
                  { id: `${cat.id}_sub1`, name: `${cat.name} 기초 실무`, keywords: ["기본기", "실무적용"] },
                  { id: `${cat.id}_sub2`, name: `${cat.name} 심화 과정`, keywords: ["고급전략", "전문가"] }
                ]).map((sub: any) => {
                  const isSelected = selected2Depths.some((item) => item.id === sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handle2DepthToggle(sub)}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md shadow-blue-500/20 scale-[1.02]"
                          : "bg-[#FBFBFD] text-[#1D1D1F] border-[#D2D2D7]/60 hover:bg-[#F2F2F7]"
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 3 ----------------- */}
          {step === 3 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-[#0066CC]">
                  Step 3. 핵심 키워드 선택 (최대 3개)
                </span>
                <span className="text-sm font-semibold text-[#86868B]">3 / 4 단계</span>
              </div>
              <div className="flex flex-wrap gap-3.5 mb-8">
                {Array.from(
                  new Set([
                    ...selected2Depths.flatMap((sub) => sub.keywords || []),
                    "실무역량", "핵심노하우", "업무적용", "트렌드분석", "실전가이드"
                  ])
                ).map((kw: any) => {
                  const isSelected = selectedKeywords.includes(kw);
                  return (
                    <button
                      key={kw}
                      onClick={() => handleKeywordToggle(kw)}
                      className={`px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-[#34C759] text-white border-[#34C759] shadow-md shadow-green-500/20"
                          : "bg-[#FBFBFD] text-[#1D1D1F] border-[#D2D2D7]/60 hover:bg-[#F2F2F7]"
                      }`}
                    >
                      #{kw}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- STEP 4 ----------------- */}
          {step === 4 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-[#0066CC]">
                  Step 4. 목표 학습 시간 선택
                </span>
                <span className="text-sm font-semibold text-[#86868B]">4 / 4 단계</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[2, 3, 4, 5, 6, 8, 10, 12, 15].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setTargetHours(hours)}
                    className={`py-4 rounded-2xl border text-lg font-bold transition-all duration-200 ${
                      targetHours === hours
                        ? "bg-[#AF52DE] text-white border-[#AF52DE] shadow-md shadow-purple-500/20 scale-[1.02]"
                        : "bg-[#FBFBFD] text-[#1D1D1F] border-[#D2D2D7]/60 hover:bg-[#F2F2F7]"
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
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-6">
                ✨ 큐레이션 과정 추천 결과 (총 목표: {targetHours}시간)
              </h2>

              <div className="space-y-4 mb-8 max-h-[360px] overflow-y-auto pr-1">
                {recommendations.map((course: any, idx: number) => (
                  <div
                    key={course.id || idx}
                    className="p-5 rounded-2xl border border-[#D2D2D7]/40 bg-[#FBFBFD] shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#0066CC] bg-[#0066CC]/10 px-3 py-1 rounded-md">
                        Module {idx + 1} ({course.hours || 2}시간)
                      </span>
                      <span className="text-xs text-[#86868B] font-semibold">
                        [{course.difficulty || "초급"}]
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1D1D1F] text-base select-all">
                      {course.title}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center border-t border-[#E5E5EA] pt-6">
                <p className="text-sm text-[#86868B] mb-3 font-semibold">
                  검색창으로 내 과정을 확인해보세요. 😊
                </p>
                <button
                  onClick={handleArchiveLanding}
                  className="w-full bg-[#34C759] text-white py-4 rounded-2xl text-base font-bold hover:bg-[#32B553] transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
                >
                  HRD 아카이브에서 내 과정 신청하기 ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 iOS 스타일 액션 버튼 */}
        <div className="mt-8 pt-6 border-t border-[#E5E5EA]/60">
          {step === 1 && (
            <button
              disabled={selected1Depths.length === 0}
              onClick={() => setStep(2)}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-md ${
                selected1Depths.length > 0
                  ? "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-blue-500/20 active:scale-[0.98]"
                  : "bg-[#E5E5EA] text-[#86868B] cursor-not-allowed shadow-none"
              }`}
            >
              다음 단계로 ➡
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-[#E5E5EA] text-[#1D1D1F] py-4 rounded-2xl font-bold text-base hover:bg-[#D1D1D6] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-4 rounded-2xl font-bold text-base transition-all shadow-md ${
                  selected2Depths.length > 0
                    ? "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-blue-500/20 active:scale-[0.98]"
                    : "bg-[#E5E5EA] text-[#86868B] cursor-not-allowed shadow-none"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-[#E5E5EA] text-[#1D1D1F] py-4 rounded-2xl font-bold text-base hover:bg-[#D1D1D6] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selectedKeywords.length === 0}
                onClick={() => setStep(4)}
                className={`w-2/3 py-4 rounded-2xl font-bold text-base transition-all shadow-md ${
                  selectedKeywords.length > 0
                    ? "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-blue-500/20 active:scale-[0.98]"
                    : "bg-[#E5E5EA] text-[#86868B] cursor-not-allowed shadow-none"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-[#E5E5EA] text-[#1D1D1F] py-4 rounded-2xl font-bold text-base hover:bg-[#D1D1D6] transition-all active:scale-[0.98]"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleGenerateRecommendation}
                className="w-2/3 py-4 rounded-2xl font-bold text-base bg-[#0071E3] text-white shadow-md shadow-blue-500/20 hover:bg-[#0077ED] transition-all active:scale-[0.98]"
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
                setSelectedKeywords([]);
              }}
              className="w-full bg-[#1D1D1F] text-white py-4 rounded-2xl font-bold text-base hover:bg-black transition-all shadow-md active:scale-[0.98]"
            >
              처음부터 다시 시작하기 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}