import { RECORD_GUIDE_DATA } from "./record-guide-data";
import { buildGuideContent } from "./record-guide-content";
const ADDITIONAL_BIRTH_STATES = [
  "arizona",
  "tennessee",
  "massachusetts",
  "indiana",
  "missouri",
  "maryland",
  "colorado",
] as const;
export function getAdditionalBirthGuideContent(state: string) {
  const slug = ADDITIONAL_BIRTH_STATES.find((candidate) => candidate === state);
  if (!slug) return undefined;
  const entry = RECORD_GUIDE_DATA[slug];
  return buildGuideContent(slug, entry.name, "birth", entry.records.birth);
}
