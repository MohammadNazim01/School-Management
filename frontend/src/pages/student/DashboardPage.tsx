import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, Trophy, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth.store";
import { gradeColor } from "@/lib/utils";

const attendanceRadial = [{ name: "Attendance", value: 93, fill: "#7c3aed" }];

const subjects = [
  { name: "Mathematics", grade: "A+", score: 95, total: 100 },
  { name: "Science", grade: "A", score: 88, total: 100 },
  { name: "English", grade: "B+", score: 76, total: 100 },
  { name: "History", grade: "B", score: 71, total: 100 },
];

const todaySchedule = [
  { time: "8:00", subject: "Mathematics", teacher: "Dr. Smith", room: "R-201" },
  { time: "9:30", subject: "Science", teacher: "Ms. Johnson", room: "Lab-2" },
  { time: "11:00", subject: "English", teacher: "Mr. Brown", room: "R-103" },
  { time: "2:00", subject: "History", teacher: "Ms. Davis", room: "R-205" },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};

export function StudentDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user?.email?.split("@")[0]} 👋`}
        description="Here's your academic overview."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Attendance" value="93%" icon={ClipboardCheck} trend={{ value: 2, label: "vs last month" }} iconColor="text-emerald-600" iconBg="bg-emerald-500/10" delay={0} />
        <StatsCard title="Overall Grade" value="A" icon={Trophy} iconColor="text-violet-600" iconBg="bg-violet-500/10" delay={0.05} />
        <StatsCard title="Fees Due" value="$200" icon={DollarSign} iconColor="text-red-600" iconBg="bg-red-500/10" delay={0.1} />
        <StatsCard title="Classes Today" value="4" icon={Calendar} iconColor="text-indigo-600" iconBg="bg-indigo-500/10" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance visual */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Attendance Rate</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative h-40 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={attendanceRadial} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(var(--muted))" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Attendance"]} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold">93%</p>
                  <p className="text-xs text-muted-foreground">present</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full mt-3 text-center text-xs">
                <div><p className="font-bold text-emerald-500">142</p><p className="text-muted-foreground">Present</p></div>
                <div><p className="font-bold text-red-500">8</p><p className="text-muted-foreground">Absent</p></div>
                <div><p className="font-bold text-amber-500">4</p><p className="text-muted-foreground">Late</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject performance */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Subject Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{s.score}/{s.total}</span>
                      <span className={`font-bold text-xs ${gradeColor(s.grade)}`}>{s.grade}</span>
                    </div>
                  </div>
                  <Progress value={(s.score / s.total) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Today's schedule */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle className="text-base">Today's Classes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaySchedule.map((slot, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-mono text-muted-foreground w-12 shrink-0">{slot.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{slot.subject}</p>
                    <p className="text-xs text-muted-foreground">{slot.teacher}</p>
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
