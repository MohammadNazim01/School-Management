import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { StudentsPage } from "@/pages/admin/StudentsPage";
import { TeachersPage } from "@/pages/admin/TeachersPage";
import { ClassesPage } from "@/pages/admin/ClassesPage";
import { SubjectsPage } from "@/pages/admin/SubjectsPage";
import { AdminAttendancePage } from "@/pages/admin/AttendancePage";
import { ExamsPage } from "@/pages/admin/ExamsPage";
import { MarksPage } from "@/pages/admin/MarksPage";
import { FeesPage } from "@/pages/admin/FeesPage";
import { TimetablePage } from "@/pages/admin/TimetablePage";
import { ReportsPage } from "@/pages/admin/ReportsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";

import { TeacherDashboardPage } from "@/pages/teacher/DashboardPage";
import { MyClassesPage } from "@/pages/teacher/MyClassesPage";
import { TeacherAttendancePage } from "@/pages/teacher/AttendancePage";
import { MarksUploadPage } from "@/pages/teacher/MarksUploadPage";
import { TeacherTimetablePage } from "@/pages/teacher/TimetablePage";

import { StudentDashboardPage } from "@/pages/student/DashboardPage";
import { StudentAttendancePage } from "@/pages/student/AttendancePage";
import { ResultsPage } from "@/pages/student/ResultsPage";
import { StudentFeesPage } from "@/pages/student/FeesPage";
import { StudentTimetablePage } from "@/pages/student/TimetablePage";

import { RoleRedirect } from "@/pages/RoleRedirect";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // Role-agnostic dashboard redirect
  {
    element: <ProtectedRoute />,
    children: [{ path: "/dashboard", element: <RoleRedirect /> }],
  },

  // Admin routes
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      { path: "/admin/dashboard", element: <AdminDashboardPage /> },
      { path: "/students", element: <StudentsPage /> },
      { path: "/teachers", element: <TeachersPage /> },
      { path: "/classes", element: <ClassesPage /> },
      { path: "/subjects", element: <SubjectsPage /> },
      { path: "/attendance", element: <AdminAttendancePage /> },
      { path: "/exams", element: <ExamsPage /> },
      { path: "/marks", element: <MarksPage /> },
      { path: "/fees", element: <FeesPage /> },
      { path: "/timetable", element: <TimetablePage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },

  // Teacher routes
  {
    element: <ProtectedRoute allowedRoles={["teacher"]} />,
    children: [
      { path: "/teacher/dashboard", element: <TeacherDashboardPage /> },
      { path: "/my-classes", element: <MyClassesPage /> },
      { path: "/teacher/attendance", element: <TeacherAttendancePage /> },
      { path: "/teacher/marks", element: <MarksUploadPage /> },
      { path: "/teacher/timetable", element: <TeacherTimetablePage /> },
    ],
  },

  // Student routes
  {
    element: <ProtectedRoute allowedRoles={["student"]} />,
    children: [
      { path: "/student/dashboard", element: <StudentDashboardPage /> },
      { path: "/student/attendance", element: <StudentAttendancePage /> },
      { path: "/results", element: <ResultsPage /> },
      { path: "/student/fees", element: <StudentFeesPage /> },
      { path: "/student/timetable", element: <StudentTimetablePage /> },
    ],
  },
]);
