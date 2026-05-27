import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { attendanceService } from "@/services/attendance.service";
import type { AttendanceStatus } from "@/types";
import { cn } from "@/lib/utils";

const mockStudents = [
  { id: "1", name: "Sara Ahmed", roll: "001" },
  { id: "2", name: "Ali Hassan", roll: "002" },
  { id: "3", name: "Fatima Malik", roll: "003" },
  { id: "4", name: "Omar Sheikh", roll: "004" },
  { id: "5", name: "Zara Khan", roll: "005" },
];

type AttendanceMap = Record<string, AttendanceStatus>;

export function TeacherAttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      for (const [studentId, status] of Object.entries(attendance)) {
        await attendanceService.mark({ student_id: studentId, date, status });
      }
    },
    onSuccess: () => { toast.success("Attendance submitted!"); setSubmitted(true); },
    onError: () => toast.error("Failed to submit. Make sure you have a teacher profile."),
  });

  const setStatus = (id: string, status: AttendanceStatus) =>
    setAttendance((a) => ({ ...a, [id]: status }));

  const statusBtn = (id: string, status: AttendanceStatus, color: string) => (
    <button
      onClick={() => setStatus(id, status)}
      className={cn(
        "px-3 py-1 rounded-md text-xs font-semibold transition-all border",
        attendance[id] === status
          ? `${color} border-transparent`
          : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Mark Attendance" description="Record daily student attendance" />

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Class 10-A — Attendance Sheet</CardTitle>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Date:</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto h-8 text-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shrink-0">
                {student.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">#{student.roll}</p>
              </div>
              <div className="flex items-center gap-1">
                {statusBtn(student.id, "present", "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}
                {statusBtn(student.id, "absent", "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}
                {statusBtn(student.id, "late", "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}
              </div>
            </div>
          ))}

          <div className="pt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {Object.keys(attendance).length} / {mockStudents.length} marked
            </p>
            <Button
              variant="gradient"
              disabled={Object.keys(attendance).length === 0 || submitted}
              loading={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {submitted ? "Submitted ✓" : "Submit Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
