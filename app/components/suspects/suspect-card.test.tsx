import { describe, expect, it } from "vitest";
import { createRoutesStub } from "react-router";
import { render, screen } from "@testing-library/react";
import { SuspectCard } from "./suspect-card";
import type { FBISuspect } from "~/types/fbi-wanted";

const base: FBISuspect = {
  uid: "abc123",
  title: "JOHN DOE",
  description: "Wanted for testing",
  status: "na",
};

function renderCard(suspect: FBISuspect) {
  const Stub = createRoutesStub([
    { path: "/", Component: () => <SuspectCard suspect={suspect} /> },
  ]);
  return render(<Stub initialEntries={["/"]} />);
}

describe("SuspectCard", () => {
  it("links to the suspect detail page", () => {
    renderCard(base);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/suspects/abc123"
    );
  });

  it("shows the CAPTURED badge only for captured suspects", () => {
    renderCard({ ...base, status: "captured" });
    expect(screen.getByText("CAPTURED")).toBeInTheDocument();
  });

  it("hides the badge for at-large suspects", () => {
    renderCard(base);
    expect(screen.queryByText("CAPTURED")).not.toBeInTheDocument();
  });

  it("shows the reward when present", () => {
    renderCard({ ...base, reward_text: "Reward of up to $100,000" });
    expect(screen.getByText(/100,000/)).toBeInTheDocument();
  });
});
