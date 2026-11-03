import type {
  Course,
  HourPlanId,
  LevelId,
  Profile,
  PurposeId,
  Roadmap,
  ScoredCourse,
  StageId,
} from "../types";
import { STAGE_META, hourPlanById, jobById } from "./jobs";

const BASIC_WORDS = ["기초", "입문", "초급", "기본", "처음", "스타트", "한 걸음", "핵심 개념", "알아보기", "첫걸음"];
const PRACTICAL_WORDS = ["실무", "실전", "활용", "적용", "업무", "실습", "노하우", "바로 쓰는", "성과", "케이스"];
const ADVANCED_WORDS = ["심화", "고급", "마스터", "전략", "전문가", "리더", "고수", "완성", "심층", "아키텍처"];

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function includesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

function inferStage(course: Course): StageId {
  const blob = `${course.title} ${course.desc}`;
  const a = includesAny(blob, ADVANCED_WORDS);
  const b = includesAny(blob, BASIC_WORDS);
  const p = includesAny(blob, PRACTICAL_WORDS);
  if (a && !b) return "advanced";
  if (b && !a) return "basic";
  if (p) return "practical";
  if (course.hours <= 0.6) return "basic";
  if (course.hours >= 4) return "advanced";
  return "practical";
}

function purposeBoost(course: Course, purpose: PurposeId, blob: string): { score: number; tag?: string } {
  if (purpose === "new-skill") {
    const hit = includesAny(blob, BASIC_WORDS) || includesAny(blob, ["이해", "개념", "배우", "시작"]);
    return { score: hit ? 12 : 0, tag: hit ? "스킬입문" : undefined };
  }
  if (purpose === "performance") {
    const hit = includesAny(blob, ["성과", "업무", "실무", "효율", "생산성", "적용", "개선"]);
    return { score: hit ? 14 : 2, tag: hit ? "성과향상" : undefined };
  }
  if (purpose === "leading") {
    const hit = course.cat === "리더십" || includesAny(blob, ["리더", "팀", "코칭", "피드백", "조직"]);
    return { score: hit ? 16 : 0, tag: hit ? "리더십" : undefined };
  }
  return { score: 4, tag: "핵심역량" };
}

function levelFit(stage: StageId, level: LevelId): number {
  const table: Record<LevelId, Record<StageId, number>> = {
    beginner: { basic: 16, practical: 8, advanced: 0 },
    practitioner: { basic: 6, practical: 16, advanced: 8 },
    advanced: { basic: 2, practical: 10, advanced: 16 },
  };
  return table[level][stage];
}

function budgets(level: LevelId, target: HourPlanId): Record<StageId, number> {
  const scale = target / 15;
  const base: Record<LevelId, Record<StageId, number>> = {
    beginner: { basic: 6, practical: 6, advanced: 3 },
    practitioner: { basic: 4, practical: 7, advanced: 4 },
    advanced: { basic: 3, practical: 5, advanced: 7 },
  };
  const src = base[level];
  return {
    basic: round1(src.basic * scale),
    practical: round1(src.practical * scale),
    advanced: round1(src.advanced * scale),
  };
}

function maxItemsFor(target: HourPlanId) {
  if (target === 5) return 3;
  if (target === 10) return 5;
  return 7;
}

export function scoreCourse(course: Course, profile: Profile): ScoredCourse {
  const job = jobById(profile.job);
  const blob = `${course.title} ${course.desc} ${course.sub_cat} ${course.cat}`;
  const stage = inferStage(course);
  const tags: string[] = [];
  let score = 0;

  if (job.subs.includes(course.sub_cat)) {
    score += 52;
    tags.push("직무적합");
  } else if (job.cats?.includes(course.cat)) {
    score += 48;
    tags.push("분야적합");
  } else if (profile.job === "leadership" && course.cat !== "리더십") {
    score -= 12;
  }

  const kwHits = job.keywords.filter((k) => blob.includes(k)).length;
  score += Math.min(18, kwHits * 6);
  if (kwHits >= 2) tags.push("관심주제");

  if (course.cat === "공통역량" && profile.job !== "common") {
    score += profile.purpose === "new-skill" ? 6 : 3;
  }

  const pb = purposeBoost(course, profile.purpose, blob);
  score += pb.score;
  if (pb.tag) tags.push(pb.tag);

  score += levelFit(stage, profile.level);
  if (stage === "basic") tags.push("기초추천");
  if (stage === "practical") tags.push("실무추천");
  if (stage === "advanced") tags.push("심화추천");

  if (String(course.id).startsWith("26")) {
    score += 5;
    tags.push("최신과정");
  }

  if (course.hours >= 0.5 && course.hours <= 4) score += 4;

  const uniqueTags = [...new Set(tags)].slice(0, 3);
  const reason = uniqueTags.length
    ? `${job.label} 학습 흐름에 맞춰 ${uniqueTags.join(" · ")} 과정으로 배치했습니다.`
    : `${job.label} 학습 경로를 보완하는 과정입니다.`;

  return { ...course, score, stage, tags: uniqueTags, reason };
}

function sumHours(list: ScoredCourse[]) {
  return round1(list.reduce((s, c) => s + c.hours, 0));
}

function greedyFill(
  pool: ScoredCourse[],
  budget: number,
  used: Set<string>,
  maxItems: number,
  maxCourseHours: number,
): ScoredCourse[] {
  const picked: ScoredCourse[] = [];
  let remain = budget;
  const candidates = [...pool].filter(
    (c) => !used.has(c.id) && c.hours <= maxCourseHours && c.hours >= 0.3,
  );

  const pickNext = () =>
    candidates
      .filter((c) => !used.has(c.id) && c.hours <= remain + 0.4)
      .sort((a, b) => {
        if (remain >= 1.2) return b.score * Math.sqrt(b.hours) - a.score * Math.sqrt(a.hours);
        return Math.abs(remain - a.hours) - Math.abs(remain - b.hours) || b.score - a.score;
      })[0];

  while (picked.length < maxItems && remain >= 0.3) {
    const course = pickNext();
    if (!course) break;
    picked.push(course);
    used.add(course.id);
    remain = round1(remain - course.hours);
  }
  return picked;
}

function fillRemainder(
  pool: ScoredCourse[],
  used: Set<string>,
  remain: number,
  maxAdd: number,
  maxCourseHours: number,
) {
  const extra: ScoredCourse[] = [];
  const sorted = pool
    .filter((c) => !used.has(c.id) && c.hours <= Math.min(remain + 0.3, maxCourseHours) && c.hours >= 0.3)
    .sort((a, b) => {
      const da = Math.abs(remain - a.hours);
      const db = Math.abs(remain - b.hours);
      return da - db || b.score - a.score;
    });
  let left = remain;
  for (const course of sorted) {
    if (extra.length >= maxAdd) break;
    if (course.hours > left + 0.3) continue;
    extra.push(course);
    used.add(course.id);
    left = round1(left - course.hours);
    if (left < 0.3) break;
  }
  return extra;
}

function trimToTarget(courses: ScoredCourse[], target: number) {
  let list = [...courses];
  while (list.length > 1) {
    const current = sumHours(list);
    if (current <= target + 0.3) break;
    const idx = list.reduce((worst, c, i, arr) => (c.score <= arr[worst].score ? i : worst), 0);
    const next = list.filter((_, i) => i !== idx);
    const nextSum = sumHours(next);
    if (Math.abs(nextSum - target) <= Math.abs(current - target)) {
      list = next;
    } else {
      break;
    }
  }
  return list;
}

export function buildRoadmap(courses: Course[], profile: Profile): Roadmap {
  const target = profile.hours;
  const plan = hourPlanById(target);
  const maxCourseHours = Math.min(8, round1(target * 0.7));
  const scored = courses
    .map((c) => scoreCourse(c, profile))
    .filter((c) => c.score >= 18 && c.hours > 0 && c.hours <= maxCourseHours);

  scored.sort((a, b) => b.score - a.score);
  const used = new Set<string>();
  const budget = budgets(profile.level, target);
  const order: StageId[] = ["basic", "practical", "advanced"];
  const maxItems = maxItemsFor(target);

  const byStage: Record<StageId, ScoredCourse[]> = {
    basic: [],
    practical: [],
    advanced: [],
  };

  for (const stage of order) {
    const preferred = scored.filter((c) => c.stage === stage);
    const flex = scored.filter((c) => c.stage !== stage);
    const pool = preferred.length >= 6 ? preferred : [...preferred, ...flex];
    byStage[stage] = greedyFill(pool, budget[stage], used, maxItems, maxCourseHours);
  }

  let all = order.flatMap((s) => byStage[s]);
  let total = sumHours(all);
  const remain = round1(target - total);

  if (remain >= 0.4) {
    const extra = fillRemainder(scored, used, remain, maxItems + 2, maxCourseHours);
    for (const c of extra) {
      byStage[c.stage].push(c);
    }
    all = order.flatMap((s) => byStage[s]);
    total = sumHours(all);
  }

  if (total - target > 0.3) {
    const trimmed = trimToTarget(all, target);
    const keep = new Set(trimmed.map((c) => c.id));
    for (const stage of order) {
      byStage[stage] = byStage[stage].filter((c) => keep.has(c.id));
    }
    all = trimmed;
    total = sumHours(all);
  }

  if (all.length === 0) {
    const fallback = scored.slice(0, Math.max(3, maxItems));
    for (const c of fallback) byStage[c.stage].push(c);
    all = fallback;
    total = sumHours(all);
  }

  const stages = order
    .map((id) => ({
      id,
      label: STAGE_META[id].label,
      hint: STAGE_META[id].hint,
      courses: byStage[id],
      hours: sumHours(byStage[id]),
    }))
    .filter((s) => s.courses.length > 0);

  return {
    stages,
    totalHours: sumHours(all),
    targetHours: target,
    planLabel: plan.subtitle,
    courseCount: all.length,
  };
}

export function jobLabel(id: Profile["job"]) {
  return jobById(id).label;
}

export function formatHours(h: number) {
  const n = round1(h);
  return Number.isInteger(n) ? `${n}시간` : `${n.toFixed(1)}시간`;
}
