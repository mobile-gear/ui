import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("react-router-dom", () => ({
  Outlet: () => <div data-test="outlet" />,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

vi.mock("react-redux", () => ({
  useSelector: () => ({ user: null, isAuthenticated: false, items: [] }),
  useDispatch: () => vi.fn(),
}));

import Layout from "@/components/Layout";

describe("Layout", () => {
  it("renders navbar, outlet and footer", () => {
    render(<Layout />);
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByTestId("footer-copyright")).toHaveTextContent(
      /Mobile Gear/,
    );
  });
});
