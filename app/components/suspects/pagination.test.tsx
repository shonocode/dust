import { describe, expect, it } from "vitest";
import { createRoutesStub, useLocation } from "react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

// the stub uses a memory router, so expose the current URL in the DOM
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="search">{location.search}</output>;
}

function renderPagination(currentPage: number, totalItems: number, url = "/") {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <>
          <Pagination currentPage={currentPage} totalItems={totalItems} />
          <LocationProbe />
        </>
      ),
    },
  ]);
  return render(<Stub initialEntries={[url]} />);
}

describe("Pagination", () => {
  it("shows current page and total pages (20 per page)", () => {
    renderPagination(2, 90);
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("renders nothing for zero results instead of '1 / 0'", () => {
    renderPagination(1, 0);
    expect(screen.queryByText("1 / 0")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables prev on the first page and next on the last", () => {
    renderPagination(1, 20);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("preserves other search params when paging", async () => {
    const user = userEvent.setup();
    renderPagination(1, 100, "/?title=smith&page=1");
    await user.click(screen.getByLabelText("Next page"));
    const search = screen.getByTestId("search").textContent;
    expect(search).toContain("page=2");
    expect(search).toContain("title=smith");
  });
});
