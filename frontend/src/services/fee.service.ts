import api from "./api";
import type { Fee, FeeStatus } from "@/types";

export const feeService = {
  create: async (payload: {
    student_id: string;
    fee_type: string;
    amount: number;
    due_date: string;
  }): Promise<Fee> => {
    const { data } = await api.post<Fee>("/fees", payload);
    return data;
  },

  getStudentFees: async (studentId: string, fee_status?: FeeStatus): Promise<Fee[]> => {
    const { data } = await api.get<Fee[]>(`/fees/students/${studentId}`, {
      params: fee_status ? { fee_status } : undefined,
    });
    return data;
  },

  update: async (
    id: string,
    payload: { status?: FeeStatus; paid_date?: string; receipt_number?: string }
  ): Promise<Fee> => {
    const { data } = await api.put<Fee>(`/fees/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/fees/${id}`);
  },
};
