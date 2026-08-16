import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CrtImage } from "./crt-image";

describe("CrtImage", () => {
  it("renders the image with the CRT tint class", () => {
    render(<CrtImage src="https://example.com/a.jpg" alt="mugshot" />);
    const img = screen.getByAltText("mugshot");
    expect(img).toHaveClass("crt-image");
    expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
  });

  it("shows the NO SIGNAL fallback when the image fails to load", () => {
    render(<CrtImage src="https://example.com/dead.jpg" alt="mugshot" />);
    fireEvent.error(screen.getByAltText("mugshot"));
    expect(screen.getByText("[ NO SIGNAL ]")).toBeInTheDocument();
    expect(screen.queryByAltText("mugshot")).not.toBeInTheDocument();
  });
});
