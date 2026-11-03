import React, { useState } from "react";
import data from "./coursesData.json";

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [selected1Depths, setSelected1Depths] = useState<any[]>([]);
  const [selected2Depths, setSelected2Depths] = useState<any[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [targetHours, setTargetHours] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
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

    const uniqueMatched = Array.from(new Set(matched.map((c: any) => c.id))).map(
      (id) => matched.find((c: any) => c.id === id)
    );

    const requiredCount = targetHours / 2;
    const finalCourses = uniqueMatched.slice(0, requiredCount);

    setRecommendations(finalCourses);
    setStep(5); // 결과 페이지로 이동
  };

  // 엑셀 K열 과정명 검색 필터링 (검색어 입력 시 일치하는 과정 검색)
  const filteredCourses = data.courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 아카이브 맞춤형 지능형 큐레이션 플랫폼
        </h1>
        <p className="text-gray-600 mb-6">
          임직원 역량 강화를 위한 스텝별 맞춤 추천 시스템
        </p>

        {/* ----------------- STEP 1: 1단계 대분류 선택 ----------------- */}
        {step === 1 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                [Step 1] 1단계: 관심 카테고리 선택 (최대 3개 복수선택)
              </h2>
              <span className="text-sm font-semibold text-blue-600">1 / 4 단계</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {data.categories.map((cat) => {
                const isSelected = selected1Depths.some((item) => item.id === cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handle1DepthToggle(cat)}
                    className={`p-3 rounded-xl border text-left transition \${
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
            <button
              disabled={selected1Depths.length === 0}
              onClick={() => setStep(2)}
              className={`w-full py-3 rounded-xl font-bold shadow-lg transition \${
                selected1Depths.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음 단계로 ➡
            </button>
          </div>
        )}

        {/* ----------------- STEP 2: 2단계 세부 분야 선택 ----------------- */}
        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                [Step 2] 2단계: 세부 분야 선택 (최대 3개 복수선택)
              </h2>
              <span className="text-sm font-semibold text-blue-600">2 / 4 단계</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {selected1Depths.flatMap((cat) => cat.subcategories).map((sub: any) => {
                const isSelected = selected2Depths.some((item) => item.id === sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => handle2DepthToggle(sub)}
                    className={`p-3 rounded-xl border text-left transition \${
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
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-3 rounded-xl font-bold shadow-lg transition \${
                  selected2Depths.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STEP 3: 3단계 핵심 키워드 선택 ----------------- */}
        {step === 3 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                [Step 3] 3단계: 핵심 키워드 선택 (총 5개 중 최대 3개 선택)
              </h2>
              <span className="text-sm font-semibold text-blue-600">3 / 4 단계</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.from(
                new Set(selected2Depths.flatMap((sub) => sub.keywords))
              ).map((kw: any) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => handleKeywordToggle(kw)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium