"""엑셀 과정 리스트(2025/2026) → 경량 JSON (public/courses_roadmap.json)."""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
EXCEL_NAME = "아카이브_과정리스트_26.05.11_최종_내부용_썸네일명.xlsx"
OUT_PATH = ROOT / "public" / "courses_roadmap.json"

KEEP_FIELDS = ("id", "cat", "sub_cat", "title", "hours", "desc")


def _cell(v) -> str:
    if v is None or (isinstance(v, float) and math.isnan(v)):
        return ""
    text = str(v).strip()
    if text.lower() in {"nan", "none", "-"}:
        return ""
    return text


def _hours_from_minutes(raw) -> float | None:
    """원본 훈련시간은 분 단위. 매칭을 위해 시간(소수 1자리)으로 환산."""
    if raw is None or (isinstance(raw, float) and math.isnan(raw)):
        return None
    if isinstance(raw, str):
        raw = raw.strip().replace(",", "")
        if not raw or raw == "-":
            return None
        try:
            raw = float(raw)
        except ValueError:
            return None
    minutes = float(raw)
    if minutes <= 0:
        return None
    hours = round(minutes / 60.0, 1)
    return hours if hours >= 0.1 else 0.1


def _desc(v) -> str:
    text = _cell(v)
    text = re.sub(r"[\r\n]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:400]


def _title(row: pd.Series, year: str) -> str:
    if year == "2025":
        return _cell(row.get("과정명")) or _cell(row.get("변경 과정명")) or _cell(row.get("원과정명"))
    return _cell(row.get("차시명")) or _cell(row.get("원과정 강의명"))


def sheet_to_records(df: pd.DataFrame, year: str) -> list[dict]:
    records: list[dict] = []
    seen: set[str] = set()
    for _, row in df.iterrows():
        if _cell(row.get("제외과정여부")).upper() == "Y":
            continue
        cid = _cell(row.get("연번(콘텐츠PK)"))
        title = _title(row, year)
        hours = _hours_from_minutes(row.get("훈련시간"))
        if not cid or not title or hours is None:
            continue
        if cid in seen:
            continue
        seen.add(cid)
        records.append(
            {
                "id": cid,
                "cat": _cell(row.get("분류")),
                "sub_cat": _cell(row.get("세부분야")),
                "title": title,
                "hours": hours,
                "desc": _desc(row.get("주요훈련내용")),
            }
        )
    return records


def main() -> None:
    excel = ROOT / EXCEL_NAME
    if not excel.exists():
        raise FileNotFoundError(f"엑셀 파일을 찾을 수 없습니다: {excel}")

    xl = pd.ExcelFile(excel)
    needed = {"2025", "2026"}
    missing = needed - set(xl.sheet_names)
    if missing:
        raise ValueError(f"필수 시트가 없습니다: {missing}")

    courses: list[dict] = []
    for year in ("2025", "2026"):
        df = pd.read_excel(excel, sheet_name=year)
        courses.extend(sheet_to_records(df, year))

    courses.sort(key=lambda c: c["id"])
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = [{k: c[k] for k in KEEP_FIELDS} for c in courses]
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {len(payload)} courses → {OUT_PATH} ({OUT_PATH.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
