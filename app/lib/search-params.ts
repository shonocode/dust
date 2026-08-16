import { useSearchParams } from "react-router";

/**
 * Shared URL-mutation helper: copies the current search params, applies a
 * patch (empty string deletes the key), and navigates. Used by pagination,
 * category tabs, and the stats selectors so replace/scroll semantics stay
 * in one place.
 */
export function useUpdateSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = (patch: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    setSearchParams(params);
  };

  return [searchParams, update] as const;
}
