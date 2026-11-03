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

    const uniqueMatched = Array.from(new Set(matched.map((c: any) => c.id))).map(
      (id) => matched.find((c: any) => c.id === id)
    );

    const requiredCount = targetHours / 2;
    const finalCourses = uniqueMatched.slice(0, requiredCount);

    setRecommendations(finalCourses);
    setStep(5);
  };

  // 해커스 사이트로 이동하며 검색어를 자동 입력/조회하는 함수
  const handleExternalSearch = (title: string) => {
    const encodedTitle = encodeURIComponent(title);
    const searchUrl = `https://archive.hackershrd.com/lecture_240216.php?mode=lecList_240216&sword=${encodedTitle}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans flex items-center justify-center">
      {/* 창 폭과 여백을 기존 대비 약 1.5배 확장 (max-w-6xl 및 p-12) */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          🎯 아카이브 맞춤형 지능형 큐레이션 플랫폼
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          임직원 역량 강화를 위한 스텝별 맞춤 추천 시스템
        </p>

        {/* ----------------- STEP 1 ----------------- */}
        {step === 1 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                [Step 1] 1단계: 관심 카테고리 선택 (최대 3개 복수선택)
              </h2>
              <span className="text-base font-semibold text-blue-600">1 / 4 단계</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {data.categories.map((cat) => {
                const isSelected = selected1Depths.some((item) => item.id === cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handle1DepthToggle(cat)}
                    className={`p-5 rounded-2xl border text-left text-lg transition ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
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
              className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg transition ${
                selected1Depths.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음 단계로 ➡
            </button>
          </div>
        )}

        {/* ----------------- STEP 2 ----------------- */}
        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                [Step 2] 2단계: 세부 분야 선택 (최대 3개 복수선택)
              </h2>
              <span className="text-base font-semibold text-blue-600">2 / 4 단계</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {selected1Depths.flatMap((cat) => cat.subcategories).map((sub: any) => {
                const isSelected = selected2Depths.some((item) => item.id === sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => handle2DepthToggle(sub)}
                    className={`p-5 rounded-2xl border text-left text-lg transition ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 text-gray-700 py-4 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-4 rounded-2xl text-lg font-bold shadow-lg transition ${
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

        {/* ----------------- STEP 3 ----------------- */}
        {step === 3 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                [Step 3] 3단계: 핵심 키워드 선택 (총 5개 중 최대 3개 선택)
              </h2>
              <span className="text-base font-semibold text-blue-600">3 / 4 단계</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              {Array.from(
                new Set(selected2Depths.flatMap((sub) => sub.keywords))
              ).map((kw: any) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => handleKeywordToggle(kw)}
                    className={`px-6 py-3 rounded-full border text-base font-medium transition ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    #{kw}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-gray-200 text-gray-700 py-4 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selectedKeywords.length === 0}
                onClick={() => setStep(4)}
                className={`w-2/3 py-4 rounded-2xl text-lg font-bold shadow-lg transition ${
                  selectedKeywords.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음 단계로 ➡
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STEP 4 ----------------- */}
        {step === 4 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                [Step 4] 목표 학습 시간 선택 (2시간 모듈 자동 조합)
              </h2>
              <span className="text-base font-semibold text-blue-600">4 / 4 단계</span>
            </div>
            <div className="flex gap-6 mb-10">
              {[5, 10, 15].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setTargetHours(hours)}
                  className={`flex-1 py-5 rounded-2xl border text-lg font-medium ${
                    targetHours === hours
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {hours}시간 과정
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-gray-200 text-gray-700 py-4 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleGenerateRecommendation}
                className="w-2/3 bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-blue-700 transition"
              >
                맞춤형 큐레이션 결과 생성하기 ✨
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STEP 5: 결과 페이지 및 외부 검색 연동 ----------------- */}
        {step === 5 && recommendations && (
          <div>
            {/* 요청하신 안내 문구 */}
            <div className="mb-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
              <p className="text-lg font-bold text-blue-900">
                큐레이션 과정을 바로 확인해보세요.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🎉 추천 학습 로드맵 결과 (총 목표: {targetHours}시간)
            </h2>

            <div className="space-y-6 mb-10">
              {recommendations.map((course: any, idx: number) => (
                <div
                  key={course.id}
                  className="p-6 rounded-2xl border border-gray-200 bg-white shadow-md flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg mr-3">
                      Module {idx + 1} ({course.hours}시간)
                    </span>
                    <span className="text-base text-gray-500 font-medium mr-3">
                      [{course.difficulty}]
                    </span>
                    <h3 className="font-bold text-gray-800 mt-2 text-xl">
                      {course.title}
                    </h3>
                  </div>
                  {/* 해커스 사이트 검색 자동 연동 버튼 */}
                  <button
                    onClick={() => handleExternalSearch(course.title)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-emerald-700 transition shadow-md whitespace-nowrap"
                  >
                    해커스 아카이브에서 검색하기 🔍
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStep(1);
                setSelected1Depths([]);
                setSelected2Depths([]);
                setSelectedKeywords([]);
              }}
              className="w-full bg-gray-800 text-white py-4 rounded-2xl text-lg font-bold hover:bg-gray-900 transition shadow-lg"
            >
              처음부터 다시 시작하기 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}