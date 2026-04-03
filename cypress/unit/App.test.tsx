import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "@/App";

vi.mock("@/components/Navbar", () => ({
  default: () => <div data-test="mock-navbar">Mock Navbar</div>,
}));

vi.mock("@/routes", () => ({
  default: () => <div data-test="mock-app-routes">Mock AppRoutes</div>,
}));

describe("App", () => {
  it("renders Navbar and AppRoutes inside the app container", () => {
    const { container } = render(<App />);

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-app-routes")).toBeInTheDocument();

    const appWrapper = container.querySelector(".min-h-screen.bg-gray-100");
    expect(appWrapper).toBeInTheDocument();
  });
});
