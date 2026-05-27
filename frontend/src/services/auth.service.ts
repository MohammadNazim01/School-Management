import api from "./api";
import type { AuthTokens, User } from "@/types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>("/auth/login", { email, password });
    return data;
  },

  register: async (payload: { email: string; password: string; role: string }): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", payload);
    return data;
  },

  me: async (token?: string): Promise<User> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const { data } = await api.get<User>("/auth/me", { headers });
    return data;
  },

  changePassword: async (current_password: string, new_password: string): Promise<void> => {
    await api.post("/auth/change-password", { current_password, new_password });
  },
};
