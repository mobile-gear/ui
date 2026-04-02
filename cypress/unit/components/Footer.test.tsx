import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/Mobile Gear/)).toBeInTheDocument();
  });

  it("renders policy links", () => {
    render(<Footer />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });
});
