export type JobId =
  | "planning"
  | "marketing"
  | "itsw"
  | "hr"
  | "leadership"
  | "finance"
  | "design"
  | "common";

export type LevelId = "beginner" | "practitioner" | "advanced";
export type PurposeId = "new-skill" | "performance" | "core" | "leading";
export type StageId = "basic" | "practical" | "advanced";
export type HourPlanId = 5 | 10 | 15;

export interface Course {
  id: string;
  cat: string;
  sub_cat: string;
  title: string;
  hours: number;
  desc: string;
}

export interface Profile {
  job: JobId;
  level: LevelId;
  purpose: PurposeId;
  hours: HourPlanId;
}

export interface ScoredCourse extends Course {
  score: number;
  stage: StageId;
  tags: string[];
  reason: string;
}

export interface StageBlock {
  id: StageId;
  label: string;
  hint: string;
  courses: ScoredCourse[];
  hours: number;
}

export interface Roadmap {
  stages: StageBlock[];
  totalHours: number;
  targetHours: number;
  planLabel: string;
  courseCount: number;
}
