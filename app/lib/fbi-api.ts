import type { FBISuspect, FBIWantedListResponse } from "~/types/fbi-wanted";
import { fetchJson } from "~/lib/http";

const API_BASE = "https://api.fbi.gov";

// Query params the FBI Wanted API accepts (undocumented but verified);
// anything else in the page URL is ignored rather than forwarded.
const LIST_FILTER_KEYS = [
  "title",
  "field_offices",
  "poster_classification",
  "status",
  "sex",
  "race",
  "hair",
  "eyes",
] as const;

export function fetchSuspects(
  searchParams: URLSearchParams
): Promise<FBIWantedListResponse> {
  const params = new URLSearchParams({
    page: searchParams.get("page") ?? "1",
  });

  for (const key of LIST_FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }

  return fetchJson(`${API_BASE}/@wanted?${params}`);
}

export function fetchSuspect(uid: string): Promise<FBISuspect> {
  return fetchJson(`${API_BASE}/@wanted-person/${uid}`);
}
