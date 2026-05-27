import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap, Users, DollarSign, ClipboardCheck,
  TrendingUp, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { studentService } from "@/services/student.service";
import { teacherService } from "@/services/teacher.service";
import { formatDate } from "@/lib/utils";

const attendanceData = [
  { day: "Mon", present: 142, absent: 12 },
  { day: "Tue", present: 138, absent: 16 },
  { day: "Wed", present: 150, absent: 4 },
  { day: "Thu", present: 145, absent: 9 },
  { day: "Fri", present: 131, absent: 23 },
  { day: "Sat", present: 89, absent: 8 },
];

const feeData = [
  { month: "Aug", collected: 42000, pending: 8000 },
  { month: "Sep", collected: 38000, pending: 12000 },
  { month: "Oct", collected: 45000, pending: 5000 },
  { month: "Nov", collected: 40000, pending: 10000 },
  { month: "Dec", collected: 35000, pending: 15000 },
  { month: "Jan", collected: 47000, pending: 3000 },
];

const gradeDistribution = [
  { name: "A+/A", value: 35, color: "#10b981" },
  { name: "B+/B", value: 28, color: "#6366f1" },
  { name: "C", value: 20, color: "#f59e0b" },
  { name: "D", value: 12, color: "#f97316" },
  { name: "F", value: 5, color: "#ef4444" },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};

const recentActivity = [
  { action: "New student enrolled", name: "Sara Ahmed", time: "2 min ago", type: "student" },
  { action: "Fee payment received", name: "Ali Hassan", time: "15 min ago", type: "fee" },
  { action: "Attendance marked", name: "Class 10-A", time: "1 hr ago", type: "attendance" },
  { action: "Exam scheduled", name: "Math Final", time: "2 hr ago", type: "exam" },
  { action: "Teacher registered", name: "Dr. Smith", time: "3 hr ago", type: "teacher" },
];

const activityColor: Record<string, string> = {
  student: "bg-violet-500",
  fee: "bg-emerald-500",
  attendance: "bg-blue-500",
  exam: "bg-amber-500",
  teacher: "bg-indigo-500",
};

export function AdminDashboardPage() {
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ["students", { limit: 200 }],
    queryFn: () => studentService.list({ limit: 200 }),
  });

  const { data: teachers, isLoading: loadingTeachers } = useQuery({
    queryKey: ["teachers", { limit: 200 }],
    queryFn: () => teacherService.list({ limit: 200 }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening at your school."
        action={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4 text-emerald-500" />
            <span>All metrics up this month</span>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={loadingStudents ? "—" : (students?.length ?? 0)}
          icon={GraduationCap}
          trend={{ value: 12, label: "vs last month" }}
          iconColor="text-violet-600"
          iconBg="bg-violet-500/10"
          delay={0}
        />
        <StatsCard
          title="Total Teachers"
          value={loadingTeachers ? "—" : (teachers?.length ?? 0)}
          icon={Users}
          trend={{ value: 4, label: "vs last month" }}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-500/10"
          delay={0.05}
        />
        <StatsCard
          title="Fee Collected"
          value="$47,200"
          subtitle="This month"
          icon={DollarSign}
          trend={{ value: 8, label: "vs last month" }}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-500/10"
          delay={0.1}
        />
        <StatsCard
          title="Avg. Attendance"
          value="93.4%"
          subtitle="This week"
          icon={ClipboardCheck}
          trend={{ value: -1.2, label: "vs last week" }}
          iconColor="text-amber-600"
          iconBg="bg-amber-500/10"
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard
            title="Attendance This Week"
            description="Daily present vs absent count"
            delay={0.2}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={attendanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="present" stroke="#7c3aed" fill="url(#presentGrad)" strokeWidth={2} name="Present" />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#absentGrad)" strokeWidth={2} name="Absent" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Grade Distribution" delay={0.25}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {gradeDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Fee Collection + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard
            title="Fee Collection"
            description="Monthly collected vs pending (USD)"
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={feeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]} />
                <Bar dataKey="collected" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="#e11d48" radius={[4, 4, 0, 0]} name="Pending" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 size-2 rounded-full shrink-0 ${activityColor[item.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.name}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Students</CardTitle>
            <a href="/students" className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowUpRight className="size-3" />
            </a>
          </CardHeader>
          <CardContent>
            {loadingStudents ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {students?.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shrink-0">
                      {s.first_name[0]}{s.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.first_name} {s.last_name}</p>
                      <p className="text-xs text-muted-foreground">#{s.roll_number}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Admitted {formatDate(s.admission_date)}
                    </Badge>
                  </div>
                ))}
                {(!students || students.length === 0) && (
                  <p className="py-6 text-center text-sm text-muted-foreground">No students yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
