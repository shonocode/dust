import type { Route } from "./+types/stats";

import { Suspense } from "react";
import { useLoaderData, Await } from "react-router";
import { fetchCrimeStats, hasOwnApiKey, type CrimeStats } from "~/lib/cde-api";
import { useUpdateSearchParams } from "~/lib/search-params";
import { AwaitError } from "~/components/await-error";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

// verified against the live CDE API; other offense slugs 404 or return empty
const OFFENSES = [
  { value: "violent-crime", label: "VIOLENT CRIME" },
  { value: "property-crime", label: "PROPERTY CRIME" },
  { value: "homicide", label: "HOMICIDE" },
  { value: "rape", label: "RAPE" },
  { value: "robbery", label: "ROBBERY" },
  { value: "burglary", label: "BURGLARY" },
];

const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

const DEFAULTS = { state: "CA", offense: "violent-crime", year: "2024" };

// URL params go into the API request path, so anything unknown falls back
// to the defaults instead of being forwarded verbatim.
function readParams(searchParams: URLSearchParams) {
  const pick = (key: keyof typeof DEFAULTS, allowed: string[]) => {
    const value = searchParams.get(key);
    return value && allowed.includes(value) ? value : DEFAULTS[key];
  };
  return {
    state: pick("state", STATES),
    offense: pick("offense", OFFENSES.map((o) => o.value)),
    year: pick("year", YEARS),
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "D.U.S.T - Crime Stats" },
    { name: "description", content: "DUST - Crime Statistics" },
  ];
}

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { state, offense, year } = readParams(
    new URL(request.url).searchParams
  );
  return { stats: fetchCrimeStats(state, offense, year) };
}

export default function Stats() {
  const { stats } = useLoaderData<typeof clientLoader>();
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const current = readParams(searchParams);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl mb-6 border-b pb-2">CRIME STATISTICS</h1>

      {!hasOwnApiKey && (
        <p className="mb-4 text-sm opacity-70">
          Running on the shared DEMO_KEY (~10 requests/hour). Configure a free
          api.data.gov key via VITE_DATA_GOV_API_KEY for regular use.
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={current.state}
          onChange={(e) => updateSearchParams({ state: e.target.value })}
          className="terminal-input"
          aria-label="State"
        >
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={current.offense}
          onChange={(e) => updateSearchParams({ offense: e.target.value })}
          className="terminal-input"
          aria-label="Offense"
        >
          {OFFENSES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={current.year}
          onChange={(e) => updateSearchParams({ year: e.target.value })}
          className="terminal-input"
          aria-label="Year"
        >
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Suspense fallback={<p>Loading…</p>}>
        <Await
          resolve={stats}
          errorElement={
            <AwaitError fallback="Error loading crime statistics." />
          }
        >
          {(resolved) => <RateChart stats={resolved} state={current.state} />}
        </Await>
      </Suspense>

      <p className="mt-6 text-sm opacity-70">
        Rate = offenses per 100,000 population, from the FBI Crime Data
        Explorer API. Monthly figures are preliminary and subject to revision.
      </p>
    </div>
  );
}

const BAR_WIDTH = 30;

function RateChart({ stats, state }: { stats: CrimeStats; state: string }) {
  // union: recent years often have national data before state submissions
  // catch up, and vice versa
  const months = [
    ...new Set([
      ...Object.keys(stats.stateRates),
      ...Object.keys(stats.usRates),
    ]),
  ].sort();
  if (months.length === 0) {
    return <p>No data reported for this selection.</p>;
  }

  const max = Math.max(
    ...months.map((month) =>
      Math.max(stats.stateRates[month] ?? 0, stats.usRates[month] ?? 0)
    )
  );

  const bar = (value: number | undefined) => {
    const ratio = max > 0 ? Math.max(0, value ?? 0) / max : 0;
    return "█".repeat(Math.round(ratio * BAR_WIDTH)).padEnd(BAR_WIDTH);
  };

  const cell = (value: number | undefined) =>
    value == null ? "—" : value.toFixed(1);

  return (
    <div className="overflow-x-auto">
      <table className="whitespace-pre">
        <thead>
          <tr className="text-left border-b">
            <th className="pr-4">MONTH</th>
            <th className="pr-4">{state}</th>
            <th className="pr-4"></th>
            <th className="pr-4">US</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {months.map((month) => (
            <tr key={month}>
              <td className="pr-4">{month}</td>
              <td className="pr-4 text-right">{cell(stats.stateRates[month])}</td>
              <td className="pr-4 text-green-300">
                {bar(stats.stateRates[month])}
              </td>
              <td className="pr-4 text-right">{cell(stats.usRates[month])}</td>
              <td className="text-green-700">{bar(stats.usRates[month])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
