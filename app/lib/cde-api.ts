// FBI Crime Data Explorer (CDE) API — https://cde.ucr.cjis.gov
// Requires a free api.data.gov key; DEMO_KEY works but is limited to
// ~10 requests/hour. Set VITE_DATA_GOV_API_KEY in .env for a real key.
import { fetchJson } from "~/lib/http";

const API_BASE = "https://api.usa.gov/crime/fbi/cde";
const API_KEY = import.meta.env.VITE_DATA_GOV_API_KEY || "DEMO_KEY";

export const hasOwnApiKey = Boolean(import.meta.env.VITE_DATA_GOV_API_KEY);

export interface CrimeStats {
  /** "01-2024" → offenses per 100k population */
  stateRates: Record<string, number>;
  usRates: Record<string, number>;
}

interface CdeSummarizedResponse {
  offenses?: {
    rates?: Record<string, Record<string, number>>;
  };
}

export async function fetchCrimeStats(
  state: string,
  offense: string,
  year: string
): Promise<CrimeStats> {
  const url =
    `${API_BASE}/summarized/state/${state}/${offense}` +
    `?from=01-${year}&to=12-${year}&API_KEY=${API_KEY}`;
  const data = await fetchJson<CdeSummarizedResponse>(url, (status) =>
    status === 429
      ? "Crime API rate limit reached — the shared DEMO_KEY allows ~10 requests/hour. Try again later or configure a free api.data.gov key."
      : `Crime API request failed (HTTP ${status})`
  );

  // The response keys are display labels ("California Offenses",
  // "United States Offenses"). There is no stable machine-readable key,
  // so fail loudly if the shape drifts instead of rendering empty data.
  const rates = data.offenses?.rates ?? {};
  const offenseKeys = Object.keys(rates).filter((key) =>
    key.endsWith(" Offenses")
  );
  const usKey = offenseKeys.find((key) => key.startsWith("United States"));
  const stateKey = offenseKeys.find((key) => !key.startsWith("United States"));
  if (Object.keys(rates).length > 0 && !stateKey) {
    throw new Error("Crime API returned an unexpected response shape.");
  }

  return {
    stateRates: stateKey ? rates[stateKey] : {},
    usRates: usKey ? rates[usKey] : {},
  };
}
