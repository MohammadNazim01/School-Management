import api from "./api";
import type { Mark, StudentResult } from "@/types";

export const markService = {
  add: async (payload: { student_id: string; exam_id: string; marks_obtained: number }): Promise<Mark> => {
    const { data } = await api.post<Mark>("/marks", payload);
    return data;
  },

  update: async (id: string, marks_obtained: number): Promise<Mark> => {
    const { data } = await api.put<Mark>(`/marks/${id}`, { marks_obtained });
    return data;
  },

  getStudentResult: async (studentId: string): Promise<StudentResult> => {
    const { data } = await api.get<StudentResult>(`/marks/students/${studentId}/result`);
    return data;
  },
};
