import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "@/components/Spinner";

describe("Spinner - Branch Coverage", () => {
  it("renders spinner container", () => {
    render(<Spinner />);
    const container = screen.getByTestId("spinner");
    expect(container).toBeInTheDocument();
    expect(container.className).toMatch(/animate-spin|rounded-full|border/);
  });

  it("has correct role attribute", () => {
    render(<Spinner />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveAttribute("role", "status");
  });

  it("renders loading text for screen readers", () => {
    render(<Spinner />);
    const loadingText = screen.getByTestId("spinner-text");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveTextContent("Loading...");
    expect(loadingText.className).toMatch(/sr-only/);
  });

  it("has proper container styling", () => {
    render(<Spinner />);
    const container = screen.getByTestId("spinner").parentElement;
    expect(container).toBeInTheDocument();
    if (container) {
      expect(container.className).toMatch(/flex|justify|items-center/);
    }
  });
});
