import api from "./api";
import type { Timetable } from "@/types";

export const timetableService = {
  getByClass: async (classId: string, sectionId?: string): Promise<Timetable[]> => {
    const { data } = await api.get<Timetable[]>(`/timetable/class/${classId}`, {
      params: sectionId ? { section_id: sectionId } : undefined,
    });
    return data;
  },

  getByTeacher: async (teacherId: string): Promise<Timetable[]> => {
    const { data } = await api.get<Timetable[]>(`/timetable/teacher/${teacherId}`);
    return data;
  },

  create: async (payload: Omit<Timetable, "id" | "created_at">): Promise<Timetable> => {
    const { data } = await api.post<Timetable>("/timetable", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Timetable>): Promise<Timetable> => {
    const { data } = await api.put<Timetable>(`/timetable/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/timetable/${id}`);
  },
};
