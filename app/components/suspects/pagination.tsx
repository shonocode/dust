import { useUpdateSearchParams } from "~/lib/search-params";

// The FBI Wanted API returns 20 items per page and does not accept a
// page-size parameter.
const PAGE_SIZE = 20;

export function Pagination({
  currentPage,
  totalItems,
}: {
  currentPage: number;
  totalItems: number;
}) {
  const [, updateSearchParams] = useUpdateSearchParams();
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // zero results: the list shows its own empty state; a "1 / 0" pager
  // would be nonsense
  if (totalPages < 1) {
    return null;
  }

  const goTo = (page: number) => {
    updateSearchParams({ page: String(page) });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 bg-green-700 disabled:opacity-50 rounded"
      >
        &lt;
      </button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        aria-label="Next page"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 bg-green-700 disabled:opacity-50 rounded"
      >
        &gt;
      </button>
    </div>
  );
}
