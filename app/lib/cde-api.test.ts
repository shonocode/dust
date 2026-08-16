import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCrimeStats } from "./cde-api";

function mockFetch(body: unknown, ok = true, status = 200) {
  const mock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCrimeStats", () => {
  it("separates state and national series", async () => {
    mockFetch({
      offenses: {
        rates: {
          "California Offenses": { "01-2024": 46.4 },
          "California Clearances": { "01-2024": 16.9 },
          "United States Offenses": { "01-2024": 30.1 },
          "United States Clearances": { "01-2024": 12.0 },
        },
      },
    });
    const stats = await fetchCrimeStats("CA", "violent-crime", "2024");
    expect(stats.stateRates).toEqual({ "01-2024": 46.4 });
    expect(stats.usRates).toEqual({ "01-2024": 30.1 });
  });

  it("returns empty series for an empty response", async () => {
    mockFetch({ offenses: { rates: {} } });
    const stats = await fetchCrimeStats("CA", "violent-crime", "2024");
    expect(stats.stateRates).toEqual({});
    expect(stats.usRates).toEqual({});
  });

  it("throws when the label shape drifts", async () => {
    mockFetch({
      offenses: { rates: { "Some Renamed Series": { "01-2024": 1 } } },
    });
    await expect(
      fetchCrimeStats("CA", "violent-crime", "2024")
    ).rejects.toThrow(/unexpected response shape/i);
  });

  it("explains the DEMO_KEY rate limit on 429", async () => {
    mockFetch({}, false, 429);
    await expect(
      fetchCrimeStats("CA", "violent-crime", "2024")
    ).rejects.toThrow(/rate limit/i);
  });
});
