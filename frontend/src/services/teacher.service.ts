import api from "./api";
import type { Teacher } from "@/types";

export interface TeacherCreatePayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  phone?: string;
  address?: string;
  qualification?: string;
  salary?: number;
  joining_date: string;
}

export const teacherService = {
  list: async (params?: { skip?: number; limit?: number }): Promise<Teacher[]> => {
    const { data } = await api.get<Teacher[]>("/teachers", { params });
    return data;
  },

  get: async (id: string): Promise<Teacher> => {
    const { data } = await api.get<Teacher>(`/teachers/${id}`);
    return data;
  },

  create: async (payload: TeacherCreatePayload): Promise<Teacher> => {
    const { data } = await api.post<Teacher>("/teachers", payload);
    return data;
  },

  update: async (id: string, payload: Partial<TeacherCreatePayload>): Promise<Teacher> => {
    const { data } = await api.put<Teacher>(`/teachers/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },
};
