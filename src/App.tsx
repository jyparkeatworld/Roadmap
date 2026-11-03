import React, { useState } from "react";
import data from "./coursesData.json";

export default function App() {
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
    // 하위 선택 초기화
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

    const uniqueMatched = Array.from(new Set(matched.map((c: any) => c.id))).map(
      (id) => matched.find((c: any) => c.id === id)
    );

    const requiredCount = targetHours / 2;
    const finalCourses = uniqueMatched.slice(0, requiredCount);

    setRecommendations(finalCourses);
  };

  const handleCourseClick = (courseTitle: string, url: string) => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "click_course_link", {
        event_category: "Curation",
        event_label: courseTitle,
        value: 1,
      });
    }
    console.log(`[Analytics Tracking] Clicked course: ${courseTitle}`);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 아카이브 맞춤형 지능형 큐레이션 플랫폼
        </h1>
        <p className="text-gray-600 mb-6">
          임직원 역량 강화를 위한 3Depth 트리 기반 스마트 추천 시스템
        </p>

        {/* 1단계: 관심 대분류 선택 (최대 3개 복수선택) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1단계: 관심 카테고리 선택 (최대 3개 복수선택 가능)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.categories.map((cat) => {
              const isSelected = selected1Depths.some((item) => item.id === cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handle1DepthToggle(cat)}
                  className={`p-3 rounded-xl border text-left transition ${
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

        {/* 2단계: 세부 분야 선택 (최대 3개 복수선택) */}
        {selected1Depths.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              2단계: 세부 분야 선택 (최대 3개 복수선택 가능)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {selected1Depths.flatMap((cat) => cat.subcategories).map((sub: any) => {
                const isSelected = selected2Depths.some((item) => item.id === sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => handle2DepthToggle(sub)}
                    className={`p-3 rounded-xl border text-left transition ${
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

        {/* 3단계: 핵심 키워드 선택 (각 5개 중 최대 3개 선택) */}
        {selected2Depths.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              3단계: 핵심 키워드 선택 (총 5개 중 최대 3개 선택)
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(selected2Depths.flatMap((sub) => sub.keywords))
              ).map((kw: any) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => handleKeywordToggle(kw)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600"
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

        {/* 목표 학습 시간 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            목표 학습 시간 선택 (2시간 모듈 자동 조합)
          </label>
          <div className="flex gap-4">
            {[5, 10, 15].map((hours) => (
              <button
                key={hours}
                onClick={() => setTargetHours(hours)}
                className={`flex-1 py-2 rounded-lg border font-medium ${
                  targetHours === hours
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {hours}시간 과정
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateRecommendation}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
        >
          맞춤형 큐레이션 결과 생성하기
        </button>

        {/* 추천 결과 및 개별 과정 링크 연동 */}
        {recommendations && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🎉 추천 학습 로드맵 결과 (총 목표: {targetHours}시간)
            </h2>
            <div className="space-y-4">
              {recommendations.map((course: any, idx: number) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md mr-2">
                      Module {idx + 1} ({course.hours}시간)
                    </span>
                    <span className="text-sm text-gray-500 font-medium mr-2">
                      [{course.difficulty}]
                    </span>
                    <h3 className="font-bold text-gray-800 mt-1">
                      {course.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCourseClick(course.title, course.url)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow"
                  >
                    수강신청 바로가기 ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}