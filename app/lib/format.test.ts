import { describe, expect, it } from "vitest";
import { formatHeightRange, formatRange, processHTML } from "./format";

describe("formatRange", () => {
  it("renders a single value when only min is present", () => {
    expect(formatRange(32)).toBe("32");
    expect(formatRange(32, null)).toBe("32");
    expect(formatRange(32, 32)).toBe("32");
  });

  it("renders a range when min and max differ", () => {
    expect(formatRange(32, 34)).toBe("32 – 34");
  });

  it("falls back to max when the record only carries a max bound", () => {
    expect(formatRange(null, 71)).toBe("71");
    expect(formatRange(0, 71)).toBe("71");
  });

  it("returns undefined when both ends are missing or nonsense", () => {
    expect(formatRange(null, null)).toBeUndefined();
    expect(formatRange(undefined, undefined)).toBeUndefined();
    expect(formatRange(0, 0)).toBeUndefined();
    expect(formatRange(-3)).toBeUndefined();
  });
});

describe("formatHeightRange", () => {
  it("converts inches to feet'inches\"", () => {
    expect(formatHeightRange(67)).toBe(`5'7"`);
    expect(formatHeightRange(72)).toBe(`6'0"`);
  });

  it("renders ranges", () => {
    expect(formatHeightRange(64, 68)).toBe(`5'4" – 5'8"`);
  });

  it("handles max-only records", () => {
    expect(formatHeightRange(null, 71)).toBe(`5'11"`);
  });

  it("returns undefined for missing data", () => {
    expect(formatHeightRange(null, null)).toBeUndefined();
  });
});

describe("processHTML", () => {
  it("strips all trailing empty paragraphs, not just the last", () => {
    expect(processHTML("<p>text</p><p>&nbsp;</p><p> </p><p></p>")).toBe(
      "<p>text</p>"
    );
  });

  it("keeps empty paragraphs in the middle", () => {
    expect(processHTML("<p>a</p><p></p><p>b</p>")).toBe(
      "<p>a</p><p></p><p>b</p>"
    );
  });

  it("sanitizes script tags and event handlers", () => {
    expect(processHTML(`<p>hi</p><script>alert(1)</script>`)).toBe("<p>hi</p>");
    expect(processHTML(`<img src=x onerror="alert(1)">`)).not.toContain(
      "onerror"
    );
  });
});
