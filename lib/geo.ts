/** County/city datasets served from /public/geo/{ABBR}.json (copied from reference).
 *  Only the selected state's file is fetched. Never hard-code counties/cities. */

export interface GeoJurisdiction {
  id: string;
  name: string;
  type: string;
  cities: string[];
}
export interface StateGeography {
  state: string;
  counties: GeoJurisdiction[];
}

const cache = new Map<string, StateGeography>();
const inflight = new Map<string, Promise<StateGeography>>();

export async function loadStateGeography(abbreviation: string): Promise<StateGeography> {
  const key = abbreviation.toUpperCase();
  const cached = cache.get(key);
  if (cached) return cached;
  const existing = inflight.get(key);
  if (existing) return existing;
  const request = fetch(`/geo/${key}.json`)
    .then(async (response) => {
      if (!response.ok) return { state: key, counties: [] };
      const data = (await response.json()) as StateGeography;
      cache.set(key, data);
      return data;
    })
    .catch(() => ({ state: key, counties: [] }) as StateGeography)
    .finally(() => inflight.delete(key));
  inflight.set(key, request);
  return request;
}

export function jurisdictionLabel(j: GeoJurisdiction): string {
  if (j.type === "District" || j.type === "Independent City") return j.name;
  return `${j.name} ${j.type}`;
}

export function jurisdictionNoun(geo: StateGeography | undefined): string {
  const type = geo?.counties[0]?.type ?? "County";
  if (type === "Parish") return "parish";
  if (type === "Borough") return "borough";
  if (type === "Municipio") return "municipio";
  if (type === "District") return "district";
  return "county";
}
