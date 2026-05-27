import api from "./api";
import type { Attendance, AttendanceSummary } from "@/types";

export const attendanceService = {
  mark: async (payload: { student_id: string; date: string; status: string; note?: string }): Promise<Attendance> => {
    const { data } = await api.post<Attendance>("/attendance", payload);
    return data;
  },

  update: async (id: string, payload: { status?: string; note?: string }): Promise<Attendance> => {
    const { data } = await api.put<Attendance>(`/attendance/${id}`, payload);
    return data;
  },

  getStudentAttendance: async (
    studentId: string,
    params?: { from_date?: string; to_date?: string }
  ): Promise<Attendance[]> => {
    const { data } = await api.get<Attendance[]>(`/attendance/students/${studentId}`, { params });
    return data;
  },

  getSummary: async (studentId: string): Promise<AttendanceSummary> => {
    const { data } = await api.get<AttendanceSummary>(`/attendance/students/${studentId}/summary`);
    return data;
  },
};
