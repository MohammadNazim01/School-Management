import api from "./api";
import type { Exam } from "@/types";

export const examService = {
  list: async (params?: { class_id?: string }): Promise<Exam[]> => {
    const { data } = await api.get<Exam[]>("/exams", { params });
    return data;
  },

  get: async (id: string): Promise<Exam> => {
    const { data } = await api.get<Exam>(`/exams/${id}`);
    return data;
  },

  create: async (payload: Omit<Exam, "id" | "created_at">): Promise<Exam> => {
    const { data } = await api.post<Exam>("/exams", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Exam>): Promise<Exam> => {
    const { data } = await api.put<Exam>(`/exams/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/exams/${id}`);
  },
};
