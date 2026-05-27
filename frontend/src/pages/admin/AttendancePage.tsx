import { useQuery } from "@tanstack/react-query";
import { Calendar, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChartCard } from "@/components/shared/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { studentService } from "@/services/student.service";
import { attendanceService } from "@/services/attendance.service";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/lib/utils";

const weeklyData = [
  { day: "Mon", present: 142, absent: 12, late: 4 },
  { day: "Tue", present: 138, absent: 16, late: 3 },
  { day: "Wed", present: 150, absent: 4, late: 2 },
  { day: "Thu", present: 145, absent: 9, late: 4 },
  { day: "Fri", present: 131, absent: 23, late: 4 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};

export function AdminAttendancePage() {
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.list({ limit: 10 }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Overview"
        description="School-wide attendance analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Present Today", value: "142", sub: "out of 158", color: "text-emerald-500" },
          { label: "Absent Today", value: "12", sub: "7.6% absence rate", color: "text-red-500" },
          { label: "Late Today", value: "4", sub: "2.5% late rate", color: "text-amber-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartCard title="Weekly Attendance" description="Present vs absent vs late per day">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
            <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="size-4" /> Recent Students Attendance</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {students.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shrink-0">
                  {s.first_name[0]}{s.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{s.first_name} {s.last_name}</p>
                  <p className="text-xs text-muted-foreground">Roll #{s.roll_number}</p>
                </div>
                <StatusBadge status={["present", "present", "present", "absent", "late"][Math.floor(Math.random() * 5)] as string} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
