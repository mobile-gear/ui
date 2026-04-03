import axios from "axios";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../interfaces/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      credentials,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(
      `${API_URL}/auth/register`,
      userData,
      {
        withCredentials: true,
      },
    );
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axios.get<User>(`${API_URL}/auth/profile`, {
      withCredentials: true,
    });
    return data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  },
};
