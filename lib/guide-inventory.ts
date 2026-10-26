import { BIRTH_GUIDE_SOURCES } from "./seo";

export const GUIDE_CERTIFICATES = ["birth", "death", "marriage", "divorce"] as const;
export const GUIDE_INVENTORY = Object.entries(BIRTH_GUIDE_SOURCES).flatMap(([state, source]) =>
  GUIDE_CERTIFICATES.map((type) => ({
    state,
    stateName: source.state,
    type,
    certificate: `${type}-certificate`,
    path: `/guides/${state}/${type}-certificate`,
  })),
);
