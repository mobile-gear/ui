import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, { clearAuth, loginUser, registerUser, logoutUser } from "@/store/slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";

vi.mock("@/services/auth.service");
const mockedAuthService = vi.mocked(authService, true);

const mockUser = { id: 1, firstName: "John", lastName: "Doe", email: "john@test.com", role: "user" as const };

const createStore = () =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
    },
  });

describe("authSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("clearAuth", () => {
    it("resets auth state and clears localStorage", () => {
      const store = createStore();
      localStorage.setItem("user", JSON.stringify(mockUser));
      store.dispatch(clearAuth());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("loginUser", () => {
    it("sets user on successful login", async () => {
      mockedAuthService.login.mockResolvedValue({ user: mockUser });
      const store = createStore();

      await store.dispatch(loginUser({ email: "john@test.com", password: "pass" }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it("sets error on failed login", async () => {
      const axiosError = { response: { data: { message: "Invalid credentials" } }, isAxiosError: true };
      Object.setPrototypeOf(axiosError, Error.prototype);
      mockedAuthService.login.mockRejectedValue(axiosError);
      const store = createStore();

      await store.dispatch(loginUser({ email: "bad@test.com", password: "wrong" }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe("registerUser", () => {
    it("sets user on successful registration", async () => {
      mockedAuthService.register.mockResolvedValue({ user: mockUser });
      const store = createStore();

      await store.dispatch(registerUser({ firstName: "John", lastName: "Doe", email: "john@test.com", password: "pass123" }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe("logoutUser", () => {
    it("clears user on logout", async () => {
      mockedAuthService.logout.mockResolvedValue();
      const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: { user: mockUser, isAuthenticated: true, isLoading: false, error: null },
        },
      });

      await store.dispatch(logoutUser());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("clears user even on failed logout", async () => {
      mockedAuthService.logout.mockRejectedValue(new Error("Network error"));
      const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: { user: mockUser, isAuthenticated: true, isLoading: false, error: null },
        },
      });

      await store.dispatch(logoutUser());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
