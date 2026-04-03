import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  registerUser,
  loginUser,
  logoutUser,
  clearAuth,
} from "@/store/slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { AxiosError, AxiosHeaders } from "axios";

vi.mock("@/services/auth.service");
const mockedService = vi.mocked(authService, true);

const createStore = () => configureStore({ reducer: { auth: authReducer } });

const makeAxiosError = (message: string) =>
  new AxiosError("fail", "ERR", undefined, undefined, {
    data: { message },
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "j@e.com",
  role: "user" as const,
};

describe("authSlice branches", () => {
  beforeEach(() => vi.clearAllMocks());

  it("clearAuth clears state", () => {
    const state = authReducer(
      { user: mockUser, isAuthenticated: true, isLoading: false, error: null },
      clearAuth(),
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  describe("registerUser", () => {
    it("sets user on success", async () => {
      mockedService.register.mockResolvedValue({ user: mockUser });
      const store = createStore();
      await store.dispatch(
        registerUser({
          firstName: "John",
          lastName: "Doe",
          email: "j@e.com",
          password: "pass",
        }),
      );
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    it("handles AxiosError", async () => {
      mockedService.register.mockRejectedValue(makeAxiosError("Email taken"));
      const store = createStore();
      await store.dispatch(
        registerUser({
          firstName: "J",
          lastName: "D",
          email: "j@e.com",
          password: "p",
        }),
      );
      expect(store.getState().auth.error).toBe("Email taken");
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    it("handles non-Axios error", async () => {
      mockedService.register.mockRejectedValue(new Error("network"));
      const store = createStore();
      await store.dispatch(
        registerUser({
          firstName: "J",
          lastName: "D",
          email: "j@e.com",
          password: "p",
        }),
      );
      expect(store.getState().auth.error).toBe("An unknown error occurred");
    });

    it("sets pending state", async () => {
      let resolve: (v: unknown) => void;
      mockedService.register.mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      );
      const store = createStore();
      const p = store.dispatch(
        registerUser({
          firstName: "J",
          lastName: "D",
          email: "j@e.com",
          password: "p",
        }),
      );
      expect(store.getState().auth.isLoading).toBe(true);
      resolve!({ user: mockUser });
      await p;
    });
  });

  describe("loginUser", () => {
    it("sets user on success", async () => {
      mockedService.login.mockResolvedValue({ user: mockUser });
      const store = createStore();
      await store.dispatch(loginUser({ email: "j@e.com", password: "pass" }));
      expect(store.getState().auth.user).toEqual(mockUser);
    });

    it("handles AxiosError", async () => {
      mockedService.login.mockRejectedValue(
        makeAxiosError("Invalid credentials"),
      );
      const store = createStore();
      await store.dispatch(loginUser({ email: "j@e.com", password: "wrong" }));
      expect(store.getState().auth.error).toBe("Invalid credentials");
    });

    it("handles non-Axios error", async () => {
      mockedService.login.mockRejectedValue(new Error("timeout"));
      const store = createStore();
      await store.dispatch(loginUser({ email: "j@e.com", password: "p" }));
      expect(store.getState().auth.error).toBe("An unknown error occurred");
    });
  });

  describe("logoutUser", () => {
    it("clears user on success", async () => {
      mockedService.logout.mockResolvedValue(undefined);
      const store = createStore();
      await store.dispatch(logoutUser());
      expect(store.getState().auth.user).toBeNull();
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    it("clears user even on rejection", async () => {
      mockedService.logout.mockRejectedValue(new Error("fail"));
      const store = createStore();
      await store.dispatch(logoutUser());
      expect(store.getState().auth.user).toBeNull();
    });
  });
});
