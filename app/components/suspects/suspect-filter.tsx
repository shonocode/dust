import { useSearchParams } from "react-router";
import { useRef, useState } from "react";

const TEXT_FIELDS = [
  { name: "title", placeholder: "Name" },
  { name: "field_offices", placeholder: "Field Office" },
  { name: "race", placeholder: "Race" },
  { name: "hair", placeholder: "Hair" },
  { name: "eyes", placeholder: "Eyes" },
] as const;

export function SuspectFilter() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  // Params that survive a filter search/clear (owned by other controls).
  const baseParams = () => {
    const params = new URLSearchParams();
    const category = searchParams.get("poster_classification");
    if (category) params.set("poster_classification", category);
    params.set("page", "1"); // any filter change restarts at page 1
    return params;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = baseParams();
    for (const [key, value] of new FormData(e.currentTarget)) {
      if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    }
    setSearchParams(params);
  };

  const onClear = () => {
    // NOT form.reset(): that reverts uncontrolled inputs to their
    // defaultValue (the URL values captured at mount), so a deep-linked
    // filter would snap back instead of clearing.
    for (const el of formRef.current?.elements ?? []) {
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement
      ) {
        el.value = "";
      }
    }
    setSearchParams(baseParams());
  };

  return (
    <form ref={formRef} className="w-full mb-2" onSubmit={onSubmit}>
      <button
        type="button"
        onClick={() => setIsFilterVisible((visible) => !visible)}
        aria-expanded={isFilterVisible}
        className="w-full px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded flex items-center justify-center"
      >
        {isFilterVisible ? "▲ Filter" : "▼ Filter"}
      </button>

      {/* Inputs are uncontrolled on purpose: unsubmitted text must survive
          unrelated URL changes (pagination, tab clicks). defaultValue only
          matters on mount, i.e. deep links; Clear resets via the form. */}
      {isFilterVisible && (
        <div className="bg-green-900/10 rounded-xl border border-green-500/30 p-4 my-2">
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEXT_FIELDS.map(({ name, placeholder }) => (
                <input
                  key={name}
                  name={name}
                  defaultValue={searchParams.get(name) ?? ""}
                  placeholder={placeholder}
                  className="terminal-input"
                />
              ))}
              <select
                name="sex"
                defaultValue={searchParams.get("sex") ?? ""}
                className="terminal-input"
              >
                <option value="">Sex (any)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                name="status"
                defaultValue={searchParams.get("status") ?? ""}
                className="terminal-input"
              >
                <option value="">Status (any)</option>
                <option value="na">At large</option>
                <option value="captured">Captured</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClear}
                className="px-4 py-2 bg-green-900/40 hover:bg-green-800/40 text-green-200 border border-green-500/30 rounded"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
