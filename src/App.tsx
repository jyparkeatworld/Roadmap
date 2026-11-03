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
    window.open("https://archive.hackershrd.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 min-h-[680px] flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            🎯 HRD 아카이브 과정 큐레이션
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            임직원 관심사 맞춤 과정 추천 시스템
          </p>

          {/* ----------------- STEP 1 ----------------- */}
          {step === 1 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="inline-block bg-blue-50 text-blue-800 rounded-xl px-3.5 py-1.5 font-bold text-sm shadow-sm">
                  Step 1. 관심 카테고리 선택 (최대 3개 복수선택)
                </span>
                <span className="text-xs font-semibold text-blue-600">1 / 4 단계</span>
              </div>
              {/* 카테고리 대폭 확장 (15개) 및 그리드 꽉 채우기 */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
                {[
                  ...data.categories,
                  { id: "extra_1", name: "리더십·코칭", subcategories: [] },
                  { id: "extra_2", name: "세무·법무실무", subcategories: [] },
                  { id: "extra_3", name: "글로벌 비즈니스", subcategories: [] },
                  { id: "extra_4", name: "디지털 트랜스포메이션", subcategories: [] },
                  { id: "extra_5", name: "공공기관·행정", subcategories: [] },
                ].map((cat: any) => {
                  const isSelected = selected1Depths.some((item) => item.id === cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handle1DepthToggle(cat)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
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
              <div className="flex justify-between items-center mb-3">
                <span className="inline-block bg-indigo-50 text-indigo-800 rounded-xl px-3.5 py-1.5 font-bold text-sm shadow-sm">
                  Step 2. 세부 분야 선택 (최대 3개 복수선택)
                </span>
                <span className="text-xs font-semibold text-blue-600">2 / 4 단계</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4 max-h-[320px] overflow-y-auto pr-1">
                {selected1Depths.flatMap((cat) => cat.subcategories.length > 0 ? cat.subcategories : [
                  { id: `${cat.id}_sub1`, name: `${cat.name} 기초 실무`, keywords: ["기본기", "실무적용"] },
                  { id: `${cat.id}_sub2`, name: `${cat.name} 심화 과정`, keywords: ["고급전략", "전문가"] }
                ]).map((sub: any) => {
                  const isSelected = selected2Depths.some((item) => item.id === sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handle2DepthToggle(sub)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
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
              <div className="flex justify-between items-center mb-3">
                <span className="inline-block bg-emerald-50 text-emerald-800 rounded-xl px-3.5 py-1.5 font-bold text-sm shadow-sm">
                  Step 3. 핵심 키워드 선택 (최대 3개 선택)
                </span>
                <span className="text-xs font-semibold text-blue-600">3 / 4 단계</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
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
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
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
              <div className="flex justify-between items-center mb-3">
                <span className="inline-block bg-purple-50 text-purple-800 rounded-xl px-3.5 py-1.5 font-bold text-sm shadow-sm">
                  Step 4. 목표 학습 시간 선택
                </span>
                <span className="text-xs font-semibold text-blue-600">4 / 4 단계</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
                {[2, 3, 4, 5, 6, 8, 10, 12, 15].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setTargetHours(hours)}
                    className={`py-3 rounded-xl border text-sm font-bold transition ${
                      targetHours === hours
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
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
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                🎉 추천 학습 로드맵 결과 (총 목표: {targetHours}시간)
              </h2>

              <div className="space-y-2.5 mb-4 max-h-[280px] overflow-y-auto pr-1">
                {recommendations.map((course: any, idx: number) => (
                  <div
                    key={course.id || idx}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md mr-2">
                        Module {idx + 1} ({course.hours || 2}시간)
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium mr-2">
                        [{course.difficulty || "초급"}]
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 mt-1 text-sm select-all">
                      {course.title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* 하단 통합 랜딩 버튼 및 수정된 안내 문구 */}
              <div className="mt-2 text-center border-t pt-3">
                <p className="text-xs text-gray-600 mb-1.5 font-medium">
                  검색창으로 내 과정을 확인해보세요. 😊
                </p>
                <button
                  onClick={handleArchiveLanding}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg"
                >
                  HRD 아카이브에서 내 과정 신청하기 ↗
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 하단 네비게이션 버튼 영역 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {step === 1 && (
            <button
              disabled={selected1Depths.length === 0}
              onClick={() => setStep(2)}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition ${
                selected1Depths.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음 단계로 ➡
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-3 rounded-xl font-bold text-sm shadow-lg transition ${
                  selected2Depths.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selectedKeywords.length === 0}
                onClick={() => setStep(4)}
                className={`w-2/3 py-3 rounded-xl font-bold text-sm shadow-lg transition ${
                  selectedKeywords.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleGenerateRecommendation}
                className="w-2/3 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
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
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-900 transition shadow-md"
            >
              처음부터 다시 시작하기 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}