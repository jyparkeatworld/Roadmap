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

    // 매칭된 결과가 부족할 경우 전체 과정에서 안전하게 채워넣기
    if (matched.length === 0) {
      matched = data.courses;
    }

    const uniqueMatched = Array.from(new Set(matched.map((c: any) => c.id))).map(
      (id) => matched.find((c: any) => c.id === id)
    );

    const requiredCount = targetHours / 2;
    let finalCourses = uniqueMatched.slice(0, requiredCount);

    // 만약 개수가 모자라면 반복해서 채워줌
    while (finalCourses.length < requiredCount && data.courses.length > 0) {
      const nextCourse = data.courses[finalCourses.length % data.courses.length];
      finalCourses.push(nextCourse);
    }

    setRecommendations(finalCourses);
    setStep(5);
  };

  const handleExternalSearch = (title: string) => {
    const encodedTitle = encodeURIComponent(title);
    const searchUrl = `https://archive.hackershrd.com/lecture_240216.php?mode=lecList_240216&sword=${encodedTitle}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans flex items-center justify-center">
      {/* 템플릿 가로 크기는 고정하고 세로 높이를 1.5배(py-16, min-h-[750px] 등) 확대 */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 min-h-[720px] flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🎯 HRD 아카이브 과정을 관심사에 맞게 큐레이션 해보세요.
          </h1>
          <p className="text-gray-600 mb-8">
            임직원 역량 강화를 위한 스텝별 맞춤 추천 시스템
          </p>

          {/* ----------------- STEP 1 ----------------- */}
          {step === 1 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  [Step 1] 1단계: 관심 카테고리 선택 (최대 3개 복수선택)
                </h2>
                <span className="text-sm font-semibold text-blue-600">1 / 4 단계</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                {data.categories.map((cat) => {
                  const isSelected = selected1Depths.some((item) => item.id === cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handle1DepthToggle(cat)}
                      className={`p-4 rounded-xl border text-left transition ${
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  [Step 2] 2단계: 세부 분야 선택 (최대 3개 복수선택)
                </h2>
                <span className="text-sm font-semibold text-blue-600">2 / 4 단계</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {selected1Depths.flatMap((cat) => cat.subcategories).map((sub: any) => {
                  const isSelected = selected2Depths.some((item) => item.id === sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handle2DepthToggle(sub)}
                      className={`p-4 rounded-xl border text-left transition ${
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  [Step 3] 3단계: 핵심 키워드 선택 (총 5개 중 최대 3개 선택)
                </h2>
                <span className="text-sm font-semibold text-blue-600">3 / 4 단계</span>
              </div>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {Array.from(
                  new Set(selected2Depths.flatMap((sub) => sub.keywords))
                ).map((kw: any) => {
                  const isSelected = selectedKeywords.includes(kw);
                  return (
                    <button
                      key={kw}
                      onClick={() => handleKeywordToggle(kw)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition ${
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  [Step 4] 목표 학습 시간 선택 (2시간 모듈 자동 조합)
                </h2>
                <span className="text-sm font-semibold text-blue-600">4 / 4 단계</span>
              </div>
              <div className="flex gap-4 mb-10">
                {[5, 10, 15].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setTargetHours(hours)}
                    className={`flex-1 py-4 rounded-xl border text-base font-medium ${
                      targetHours === hours
                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {hours}시간 과정
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- STEP 5: 결과 페이지 ----------------- */}
          {step === 5 && recommendations && (
            <div>
              <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <p className="text-sm font-bold text-blue-900">
                  큐레이션 과정을 바로 확인해보세요.
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎉 추천 학습 로드맵 결과 (총 목표: {targetHours}시간)
              </h2>

              <div className="space-y-4 mb-6">
                {recommendations.map((course: any, idx: number) => (
                  <div
                    key={course.id || idx}
                    className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md mr-2">
                        Module {idx + 1} ({course.hours || 2}시간)
                      </span>
                      {/* 레벨(난이도) 표기 복원 */}
                      <span className="text-sm text-gray-500 font-medium mr-2">
                        [{course.difficulty || "초급"}]
                      </span>
                      <h3 className="font-bold text-gray-800 mt-1 text-base">
                        {course.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleExternalSearch(course.title)}
                      className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow whitespace-nowrap"
                    >
                      해커스 아카이브에서 검색하기 🔍
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 네비게이션 버튼 영역 */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          {step === 1 && (
            <button
              disabled={selected1Depths.length === 0}
              onClick={() => setStep(2)}
              className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition ${
                selected1Depths.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음 단계로 ➡
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selected2Depths.length === 0}
                onClick={() => setStep(3)}
                className={`w-2/3 py-3.5 rounded-xl font-bold shadow-lg transition ${
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
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                disabled={selectedKeywords.length === 0}
                onClick={() => setStep(4)}
                className={`w-2/3 py-3.5 rounded-xl font-bold shadow-lg transition ${
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
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleGenerateRecommendation}
                className="w-2/3 bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
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
              className="w-full bg-gray-800 text-white py-3.5 rounded-xl font-bold hover:bg-gray-900 transition shadow-lg"
            >
              처음부터 다시 시작하기 🔄
            </button>
          )}
        </div>
      </div>
    </div>
  );
}