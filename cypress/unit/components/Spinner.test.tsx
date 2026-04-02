import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Spinner from "@/components/Spinner";

describe("Spinner", () => {
  it("renders a loading indicator", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("contains accessible loading text", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
