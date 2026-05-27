export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface Student {
  id: string;
  user_id: string;
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
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  phone?: string;
  address?: string;
  qualification?: string;
  salary?: number;
  joining_date: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  created_at: string;
}

export interface Section {
  id: string;
  name: string;
  class_id: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  class_id: string;
  teacher_id?: string;
  created_at: string;
}

export type AttendanceStatus = "present" | "absent" | "late";

export interface Attendance {
  id: string;
  student_id: string;
  marked_by_id: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
  created_at: string;
}

export interface AttendanceSummary {
  student_id: string;
  total_days: number;
  present: number;
  absent: number;
  late: number;
  attendance_percentage: number;
}

export interface Exam {
  id: string;
  name: string;
  subject_id: string;
  class_id: string;
  exam_date: string;
  total_marks: number;
  pass_marks: number;
  created_at: string;
}

export interface Mark {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number;
  grade?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentResult {
  student_id: string;
  student_name: string;
  roll_number: string;
  marks: Mark[];
  total_marks_obtained: number;
  total_marks_possible: number;
  percentage: number;
  overall_grade: string;
}

export type FeeType = "tuition" | "transport" | "library" | "exam" | "other";
export type FeeStatus = "paid" | "unpaid" | "partial";

export interface Fee {
  id: string;
  student_id: string;
  fee_type: FeeType;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: FeeStatus;
  receipt_number?: string;
  created_at: string;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface Timetable {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface PaginatedParams {
  skip?: number;
  limit?: number;
}

export interface ApiError {
  detail: string;
}
