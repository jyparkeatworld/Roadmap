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
      <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-white/40 rounded-[36px] shadow-[0_24px_48px_rgba(0,0,0,0.08)] p-12 flex flex-col justify-between text-center transition-all duration-300">
        <div>
          {/* 타이틀 영역 */}
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#86868B] block mb-1">
              해커스 HRD 아카이브
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1D1D1F] mb-3">
              마이 큐레이션
            </h1>
            <p className="text-lg font-medium text-[#86868B]">
              여러분의 관심사를 분석해 꼭 필요한 과정을 먼저 수강해보세요.
            </p>
          </div>

          {/* ----------------- STEP 1 ----------------- */}
          {step === 1 && (
            <div className="text-left">
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
                          ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-md scale-[1.02]"
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
            <div className="text-left">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-[#0066CC]">
                  Step 2. 세부 분야 선택 (최대 3개)
                </span>
                <span className="text-sm font-semibold text-[#86868B]">2 / 4 단계</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8 max-h-[380px] overflow-y-auto pr-1">
                {selected1Depths
                  .flatMap((cat) =>
                    cat.sub