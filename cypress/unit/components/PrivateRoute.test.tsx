import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "@/store/slices/authSlice";
import PrivateRoute from "@/components/PrivateRoute";

const createStore = (authState: AuthState) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

const renderRoute = (authState: AuthState, allowedRoles: string[]) =>
  render(
    <Provider store={createStore(authState)}>
      <MemoryRouter>
        <PrivateRoute allowedRoles={allowedRoles}>
          <div data-test="protected-content">Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>
    </Provider>,
  );

describe("PrivateRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when authenticated with correct role", () => {
    renderRoute(
      {
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "a@b.com",
          role: "admin",
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      ["admin"],
    );
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects when not authenticated", () => {
    renderRoute(
      { user: null, isAuthenticated: false, isLoading: false, error: null },
      ["user"],
    );
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("redirects when role not allowed", () => {
    renderRoute(
      {
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "a@b.com",
          role: "user",
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      ["admin"],
    );
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("renders nothing when loading", () => {
    const { container } = renderRoute(
      { user: null, isAuthenticated: false, isLoading: true, error: null },
      ["user"],
    );
    expect(container.firstChild).toBeNull();
  });
});
