import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSuspect, fetchSuspects } from "./fbi-api";

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

describe("fetchSuspects", () => {
  it("defaults to page 1", async () => {
    const mock = mockFetch({ total: 0, page: 1, items: [] });
    await fetchSuspects(new URLSearchParams());
    expect(mock).toHaveBeenCalledWith("https://api.fbi.gov/@wanted?page=1");
  });

  it("forwards only whitelisted filter params", async () => {
    const mock = mockFetch({ total: 0, page: 1, items: [] });
    await fetchSuspects(
      new URLSearchParams({
        page: "3",
        title: "smith",
        poster_classification: "ten",
        sex: "male",
        utm_source: "evil", // not whitelisted
      })
    );
    const url = new URL(mock.mock.calls[0][0]);
    expect(url.searchParams.get("page")).toBe("3");
    expect(url.searchParams.get("title")).toBe("smith");
    expect(url.searchParams.get("poster_classification")).toBe("ten");
    expect(url.searchParams.get("sex")).toBe("male");
    expect(url.searchParams.has("utm_source")).toBe(false);
  });

  it("skips empty filter values", async () => {
    const mock = mockFetch({ total: 0, page: 1, items: [] });
    await fetchSuspects(new URLSearchParams({ title: "", field_offices: "" }));
    const url = new URL(mock.mock.calls[0][0]);
    expect(url.searchParams.has("title")).toBe(false);
    expect(url.searchParams.has("field_offices")).toBe(false);
  });

  it("throws on a non-ok response", async () => {
    mockFetch({}, false, 503);
    await expect(fetchSuspects(new URLSearchParams())).rejects.toThrow(
      /503/
    );
  });
});

describe("fetchSuspect", () => {
  it("requests the wanted-person endpoint", async () => {
    const mock = mockFetch({ uid: "abc", title: "X" });
    await fetchSuspect("abc");
    expect(mock).toHaveBeenCalledWith(
      "https://api.fbi.gov/@wanted-person/abc"
    );
  });
});
