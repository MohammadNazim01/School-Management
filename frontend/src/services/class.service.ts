import api from "./api";
import type { Class, Section } from "@/types";

export const classService = {
  list: async (): Promise<Class[]> => {
    const { data } = await api.get<Class[]>("/classes");
    return data;
  },

  get: async (id: string): Promise<Class> => {
    const { data } = await api.get<Class>(`/classes/${id}`);
    return data;
  },

  create: async (name: string): Promise<Class> => {
    const { data } = await api.post<Class>("/classes", { name });
    return data;
  },

  update: async (id: string, name: string): Promise<Class> => {
    const { data } = await api.put<Class>(`/classes/${id}`, { name });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/classes/${id}`);
  },

  listSections: async (classId: string): Promise<Section[]> => {
    const { data } = await api.get<Section[]>(`/classes/${classId}/sections`);
    return data;
  },

  createSection: async (classId: string, name: string): Promise<Section> => {
    const { data } = await api.post<Section>(`/classes/${classId}/sections`, { name, class_id: classId });
    return data;
  },
};
