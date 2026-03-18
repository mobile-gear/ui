import axios from "axios";
import { LoginCredentials, RegisterData, AuthResponse } from "../interfaces/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
    return data;
  },
};
