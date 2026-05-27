import api from "./api";
import type { Student } from "@/types";

export interface StudentCreatePayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  date_of_birth: string;
  gender: string;
  phone?: string;
  address?: string;
  class_id: string;
  section_id: string;
  parent_name?: string;
  parent_phone?: string;
  admission_date: string;
}

export const studentService = {
  list: async (params?: { class_id?: string; skip?: number; limit?: number }): Promise<Student[]> => {
    const { data } = await api.get<Student[]>("/students", { params });
    return data;
  },

  get: async (id: string): Promise<Student> => {
    const { data } = await api.get<Student>(`/students/${id}`);
    return data;
  },

  create: async (payload: StudentCreatePayload): Promise<Student> => {
    const { data } = await api.post<Student>("/students", payload);
    return data;
  },

  update: async (id: string, payload: Partial<StudentCreatePayload>): Promise<Student> => {
    const { data } = await api.put<Student>(`/students/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
