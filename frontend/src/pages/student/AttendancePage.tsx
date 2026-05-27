import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth.store";
import { attendanceService } from "@/services/attendance.service";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_STUDENT_ID = "demo-student-id";

export function StudentAttendancePage() {
  const { user } = useAuthStore();

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["attendance-summary", user?.id],
    queryFn: () => attendanceService.getSummary(MOCK_STUDENT_ID),
    enabled: false, // enable when real student ID is available
  });

  const { data: records = [], isLoading: loadingRecords } = useQuery({
    queryKey: ["attendance-records", user?.id],
    queryFn: () => attendanceService.getStudentAttendance(MOCK_STUDENT_ID),
    enabled: false,
  });

  // Display mock data
  const mockSummary = { total_days: 154, present: 142, absent: 8, late: 4, attendance_percentage: 93.2 };
  const mockRecords = [
    { id: "1", date: "2025-01-15", status: "present" as const },
    { id: "2", date: "2025-01-14", status: "present" as const },
    { id: "3", date: "2025-01-13", status: "late" as const },
    { id: "4", date: "2025-01-12", status: "absent" as const },
    { id: "5", date: "2025-01-11", status: "present" as const },
    { id: "6", date: "2025-01-10", status: "present" as const },
  ];

  const disp = summary ?? mockSummary;
  const recs = records.length > 0 ? records : mockRecords;

  return (
    <div className="space-y-6">
      <PageHeader title="My Attendance" description="Track your attendance record" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Days", value: disp.total_days, color: "" },
          { label: "Present", value: disp.present, color: "text-emerald-500" },
          { label: "Absent", value: disp.absent, color: "text-red-500" },
          { label: "Late", value: disp.late, color: "text-amber-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Overall Attendance Rate</p>
            <p className="text-lg font-bold text-violet-600">{disp.attendance_percentage}%</p>
          </div>
          <Progress value={disp.attendance_percentage} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {disp.attendance_percentage >= 75 ? "✓ Good standing — above minimum requirement (75%)" : "⚠ Below minimum requirement (75%)"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recs.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{formatDate(r.date)}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
