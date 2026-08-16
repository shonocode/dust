import DOMPurify from "dompurify";

// strips ALL trailing empty paragraphs the FBI CMS leaves behind (they
// often stack), then sanitizes since this is third-party HTML going
// into innerHTML
export function processHTML(html: string): string {
  return DOMPurify.sanitize(
    html.replace(/(?:<p>\s*(?:&nbsp;)?\s*<\/p>\s*)+$/g, "")
  );
}

const valid = (n?: number | null): n is number => n != null && n > 0;

// "32", "32 – 34", or just the max when the FBI record only carries a
// max bound; undefined when both ends are missing/nonsense
export function formatRange(
  min?: number | null,
  max?: number | null,
  render: (n: number) => string = String
): string | undefined {
  if (valid(min) && valid(max) && max !== min) {
    return `${render(min)} – ${render(max)}`;
  }
  if (valid(min)) return render(min);
  if (valid(max)) return render(max);
  return undefined;
}

// FBI heights are inches: 67 → 5'7"
export function formatHeightRange(
  min?: number | null,
  max?: number | null
): string | undefined {
  const toFeet = (inches: number) =>
    `${Math.floor(inches / 12)}'${inches % 12}"`;
  return formatRange(min, max, toFeet);
}
