import type { HourPlanId, JobId, LevelId, PurposeId } from "../types";

export const JOBS: {
  id: JobId;
  label: string;
  blurb: string;
  subs: string[];
  keywords: string[];
  cats?: string[];
}[] = [
  {
    id: "planning",
    label: "경영/기획",
    blurb: "전략 · 예산 · 문서 · 사무 역량",
    subs: [
      "경영기획",
      "예산",
      "사무행정",
      "문서작성",
      "사무자동화",
      "조사설계",
      "프레젠테이션",
      "지식재산관리",
      "법무",
      "세무",
      "회계·감사",
      "법인세무",
      "세무회계",
      "재무회계",
      "회계정보처리",
      "재무관리",
      "조세관리",
      "병원행정",
    ],
    keywords: ["기획", "전략", "경영", "예산", "보고서", "문서", "회계", "재무", "세무", "법무", "의사결정"],
  },
  {
    id: "marketing",
    label: "마케팅",
    blurb: "전략 · 영업 · 고객 · 브랜딩",
    subs: [
      "마케팅전략",
      "마케팅전략기획",
      "PR",
      "일반영업",
      "고객관리",
      "매장판매",
      "접객서비스",
      "유통관리",
      "물류관리",
      "수출입관리",
      "무역관리",
      "보세화물관리",
    ],
    keywords: ["마케팅", "브랜딩", "고객", "영업", "홍보", "콘텐츠", "퍼널", "세일즈", "유통", "CS"],
  },
  {
    id: "itsw",
    label: "IT/SW",
    blurb: "개발 · 데이터 · AI · 보안",
    subs: [
      "응용SW엔지니어링",
      "빅데이터분석",
      "데이터사이언스",
      "인공지능(AI)",
      "인공지능모델링",
      "인공지능서비스구현",
      "인공지능서비스운영관리",
      "인공지능플랫폼구축",
      "정보기술전략",
      "정보기술기획",
      "정보보호관리·운영",
      "DB엔지니어링",
      "블록체인분석·설계",
    ],
    keywords: ["개발", "프로그래밍", "파이썬", "데이터", "AI", "인공지능", "클라우드", "보안", "SQL", "자동화", "코딩"],
  },
  {
    id: "hr",
    label: "인사",
    blurb: "채용 · 평가 · 조직 · 노무",
    subs: ["인사", "인적자원관리"],
    keywords: ["인사", "HR", "채용", "평가", "조직", "노무", "교육", "보상", "온보딩", "성과관리"],
  },
  {
    id: "leadership",
    label: "리더십",
    blurb: "팀 리딩 · 코칭 · 의사결정",
    subs: [],
    keywords: ["리더", "리더십", "코칭", "팀장", "동기부여", "피드백", "위임", "조직문화", "갈등"],
    cats: ["리더십"],
  },
  {
    id: "finance",
    label: "금융",
    blurb: "여신 · 투자 · 리스크 · 창구",
    subs: [
      "여신심사",
      "창구사무",
      "보험계약·보전",
      "주식·채권운용",
      "금융영업",
      "투자자산관리",
      "금융리스크관리",
      "기업신용분석",
      "금융컴플라이언스",
      "증권분석",
      "파생상품자문",
      "금융자산관리",
      "외환관리",
    ],
    keywords: ["금융", "여신", "투자", "리스크", "보험", "증권", "자산", "신용", "외환"],
  },
  {
    id: "design",
    label: "디자인/콘텐츠",
    blurb: "시각 · 디지털 · 영상",
    subs: ["시각디자인", "디지털디자인", "영상편집"],
    keywords: ["디자인", "UX", "UI", "영상", "편집", "그래픽", "브랜딩"],
  },
  {
    id: "common",
    label: "공통역량",
    blurb: "업무 기본기 · 커뮤니케이션 · AI",
    subs: ["인공지능(AI)", "인문", "프레젠테이션", "문서작성", "사무자동화"],
    keywords: ["AI", "생성형", "생산성", "커뮤니케이션", "글쓰기", "발표", "엑셀", "업무"],
    cats: ["공통역량"],
  },
];

export const LEVELS: { id: LevelId; label: string; desc: string }[] = [
  { id: "beginner", label: "입문", desc: "개념부터 차근히, 기초 비중을 높입니다." },
  { id: "practitioner", label: "실무", desc: "바로 업무에 쓰는 실전 과정을 중심에 둡니다." },
  { id: "advanced", label: "심화", desc: "전략·고급 주제로 난이도를 올립니다." },
];

export const PURPOSES: { id: PurposeId; label: string; desc: string }[] = [
  { id: "new-skill", label: "신규 스킬 습득", desc: "처음 배우는 분야를 체계적으로 쌓기" },
  { id: "performance", label: "업무 성과 향상", desc: "현재 업무의 속도와 품질을 올리기" },
  { id: "core", label: "핵심 역량 강화", desc: "직무 기본기를 단단히 다지기" },
  { id: "leading", label: "팀 리딩 역량 강화", desc: "사람과 성과를 이끄는 힘 키우기" },
];

export const HOUR_PLANS: {
  id: HourPlanId;
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
}[] = [
  {
    id: 5,
    emoji: "⚡",
    title: "5시간 완성",
    subtitle: "핵심 단기 집중 플랜",
    desc: "가장 중요한 핵심만 빠르게 익히고 싶을 때",
  },
  {
    id: 10,
    emoji: "🚀",
    title: "10시간 완성",
    subtitle: "실무 역량 심화 플랜",
    desc: "업무에 바로 쓰는 실전 역량을 탄탄히 쌓을 때",
  },
  {
    id: 15,
    emoji: "🎓",
    title: "15시간 완성",
    subtitle: "표준 종합 마스터 플랜",
    desc: "기초부터 심화까지 한 번에 완성하고 싶을 때",
  },
];

export const STAGE_META = {
  basic: { label: "기초", hint: "핵심 개념과 기본기를 먼저 잡습니다." },
  practical: { label: "실무", hint: "업무에 바로 적용할 방법론을 익힙니다." },
  advanced: { label: "심화", hint: "전략과 고급 활용으로 완성도를 높입니다." },
} as const;

export function jobById(id: JobId) {
  return JOBS.find((j) => j.id === id)!;
}

export function hourPlanById(id: HourPlanId) {
  return HOUR_PLANS.find((p) => p.id === id)!;
}
