import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { authService } from "@/services/auth.service";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("posts credentials and returns auth response", async () => {
      const response = {
        data: {
          user: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john@test.com",
            role: "user" as const,
          },
        },
      };
      mockedAxios.post.mockResolvedValue(response);

      const result = await authService.login({
        email: "john@test.com",
        password: "pass123",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        { email: "john@test.com", password: "pass123" },
        { withCredentials: true },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("register", () => {
    it("posts user data and returns auth response", async () => {
      const userData = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@test.com",
        password: "pass123",
      };
      const response = {
        data: { user: { id: 2, ...userData, role: "user" as const } },
      };
      mockedAxios.post.mockResolvedValue(response);

      const result = await authService.register(userData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        userData,
        { withCredentials: true },
      );
      expect(result).toEqual(response.data);
    });
  });

  describe("getProfile", () => {
    it("fetches and returns user profile", async () => {
      const user = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        role: "user" as const,
      };
      mockedAxios.get.mockResolvedValue({ data: user });

      const result = await authService.getProfile();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/auth/profile"),
        { withCredentials: true },
      );
      expect(result).toEqual(user);
    });
  });

  describe("logout", () => {
    it("posts to logout endpoint", async () => {
      mockedAxios.post.mockResolvedValue({});

      await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        {},
        { withCredentials: true },
      );
    });
  });
});
