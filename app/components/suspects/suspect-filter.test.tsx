import { describe, expect, it } from "vitest";
import { createRoutesStub, useLocation } from "react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuspectFilter } from "./suspect-filter";

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="search">{location.search}</output>;
}

function renderFilter(url = "/") {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <>
          <SuspectFilter />
          <LocationProbe />
        </>
      ),
    },
  ]);
  return render(<Stub initialEntries={[url]} />);
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /Filter/ }));
}

describe("SuspectFilter", () => {
  it("submits trimmed values and resets to page 1", async () => {
    const user = userEvent.setup();
    renderFilter("/?page=5");
    await openPanel(user);
    await user.type(screen.getByPlaceholderText("Name"), "  smith  ");
    await user.click(screen.getByRole("button", { name: "Search" }));

    const search = screen.getByTestId("search").textContent!;
    const params = new URLSearchParams(search);
    expect(params.get("title")).toBe("smith");
    expect(params.get("page")).toBe("1");
  });

  it("omits empty fields from the URL", async () => {
    const user = userEvent.setup();
    renderFilter();
    await openPanel(user);
    await user.click(screen.getByRole("button", { name: "Search" }));

    const params = new URLSearchParams(
      screen.getByTestId("search").textContent!
    );
    expect(params.has("title")).toBe(false);
    expect(params.has("field_offices")).toBe(false);
    expect(params.has("sex")).toBe(false);
  });

  it("preserves the active category tab on search and clear", async () => {
    const user = userEvent.setup();
    renderFilter("/?poster_classification=ten&title=old");
    await openPanel(user);

    await user.click(screen.getByRole("button", { name: "Search" }));
    let params = new URLSearchParams(
      screen.getByTestId("search").textContent!
    );
    expect(params.get("poster_classification")).toBe("ten");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    params = new URLSearchParams(screen.getByTestId("search").textContent!);
    expect(params.get("poster_classification")).toBe("ten");
    expect(params.has("title")).toBe(false);
  });

  it("empties deep-linked inputs on clear (not form.reset semantics)", async () => {
    const user = userEvent.setup();
    renderFilter("/?title=smith&sex=male");
    await openPanel(user);
    expect(screen.getByPlaceholderText("Name")).toHaveValue("smith");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    const [sexSelect] = screen.getAllByRole("combobox");
    expect(sexSelect).toHaveValue("");
  });

  it("prefills inputs from the URL on mount", async () => {
    const user = userEvent.setup();
    renderFilter("/?title=doe&sex=female");
    await openPanel(user);
    expect(screen.getByPlaceholderText("Name")).toHaveValue("doe");
    const [sexSelect] = screen.getAllByRole("combobox");
    expect(sexSelect).toHaveValue("female");
  });
});
