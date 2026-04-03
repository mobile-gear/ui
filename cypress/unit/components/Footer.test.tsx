import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-copyright")).toHaveTextContent(/Mobile Gear/);
  });

  it("renders policy links", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-privacy")).toHaveTextContent("Privacy Policy");
    expect(screen.getByTestId("footer-terms")).toHaveTextContent("Terms of Service");
    expect(screen.getByTestId("footer-contact")).toHaveTextContent("Contact Us");
  });
});
