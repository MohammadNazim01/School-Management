import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, BookOpen, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth.store";

const weekAttendance = [
  { day: "Mon", marked: 28, total: 30 },
  { day: "Tue", marked: 30, total: 30 },
  { day: "Wed", marked: 25, total: 30 },
  { day: "Thu", marked: 29, total: 30 },
  { day: "Fri", marked: 27, total: 30 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};

const upcomingExams = [
  { name: "Math Mid-Term", class: "Class 10-A", date: "Jan 15", subject: "Mathematics" },
  { name: "Science Quiz", class: "Class 9-B", date: "Jan 18", subject: "Science" },
  { name: "English Test", class: "Class 10-B", date: "Jan 22", subject: "English" },
];

export function TeacherDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good morning, ${user?.email?.split("@")[0]} 👋`}
        description="Here's your teaching overview for today."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="My Classes" value="4" icon={BookOpen} iconColor="text-violet-600" iconBg="bg-violet-500/10" delay={0} />
        <StatsCard title="Students" value="128" icon={Users} iconColor="text-indigo-600" iconBg="bg-indigo-500/10" delay={0.05} />
        <StatsCard title="Attendance Today" value="94%" icon={ClipboardCheck} trend={{ value: 2, label: "vs yesterday" }} iconColor="text-emerald-600" iconBg="bg-emerald-500/10" delay={0.1} />
        <StatsCard title="Pending Marks" value="12" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-500/10" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Weekly Attendance Marked" description="Students marked present vs total" delay={0.2}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekAttendance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="marked" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Marked" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.name} className="rounded-lg border p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{exam.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">{exam.date}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{exam.class} · {exam.subject}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Today's schedule */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle className="text-base">Today's Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { time: "8:00 – 9:00", subject: "Mathematics", class: "Class 10-A", room: "R-201" },
                { time: "9:30 – 10:30", subject: "Mathematics", class: "Class 10-B", room: "R-201" },
                { time: "11:00 – 12:00", subject: "Mathematics", class: "Class 9-A", room: "R-201" },
                { time: "2:00 – 3:00", subject: "Mathematics Lab", class: "Class 10-A", room: "Lab-1" },
              ].map((slot, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-mono text-muted-foreground w-28 shrink-0">{slot.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{slot.subject}</p>
                    <p className="text-xs text-muted-foreground">{slot.class}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{slot.room}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
