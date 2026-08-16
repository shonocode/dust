import { useUpdateSearchParams } from "~/lib/search-params";

// poster_classification values observed in the live FBI Wanted API
const CATEGORIES = [
  { value: "", label: "ALL" },
  { value: "ten", label: "TEN MOST WANTED" },
  { value: "missing", label: "MISSING" },
  { value: "kidnapping", label: "KIDNAPPING" },
  { value: "fraudster", label: "FRAUDSTERS" },
  { value: "information", label: "SEEKING INFO" },
] as const;

export function CategoryTabs() {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const current = searchParams.get("poster_classification") ?? "";

  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist">
      {CATEGORIES.map(({ value, label }) => (
        <button
          type="button"
          role="tab"
          aria-selected={current === value}
          key={value}
          onClick={() =>
            updateSearchParams({ poster_classification: value, page: "1" })
          }
          className={`px-3 py-1 border rounded transition ${
            current === value
              ? "bg-green-700 text-white border-green-500"
              : "border-green-500/30 hover:bg-green-900/30"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
