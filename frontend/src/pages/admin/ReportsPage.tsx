import { ChartCard } from "@/components/shared/ChartCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

const enrollmentTrend = [
  { month: "Aug", students: 120 }, { month: "Sep", students: 135 },
  { month: "Oct", students: 142 }, { month: "Nov", students: 148 },
  { month: "Dec", students: 150 }, { month: "Jan", students: 158 },
];

const subjectPerformance = [
  { subject: "Math", avg: 72 }, { subject: "Science", avg: 78 },
  { subject: "English", avg: 81 }, { subject: "History", avg: 69 },
  { subject: "Art", avg: 88 }, { subject: "PE", avg: 91 },
];

const feeMonthly = [
  { month: "Aug", tuition: 35000, transport: 5000, library: 2000 },
  { month: "Sep", tuition: 33000, transport: 4800, library: 1900 },
  { month: "Oct", tuition: 38000, transport: 5200, library: 2100 },
  { month: "Nov", tuition: 36000, transport: 4900, library: 2000 },
  { month: "Dec", tuition: 30000, transport: 4500, library: 1800 },
  { month: "Jan", tuition: 40000, transport: 5400, library: 2200 },
];

const radarData = [
  { metric: "Attendance", value: 93 }, { metric: "Performance", value: 78 },
  { metric: "Fee Collection", value: 88 }, { metric: "Enrollment", value: 95 },
  { metric: "Teacher Ratio", value: 82 }, { metric: "Satisfaction", value: 87 },
];

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="School-wide performance insights" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Attendance", value: "93.4%", color: "from-violet-500 to-violet-700" },
          { label: "Fee Collection Rate", value: "88.2%", color: "from-emerald-500 to-emerald-700" },
          { label: "Pass Rate", value: "91.6%", color: "from-blue-500 to-blue-700" },
          { label: "Student Growth", value: "+31.7%", color: "from-amber-500 to-amber-700" },
        ].map((kpi) => (
          <Card key={kpi.label} className="overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${kpi.color}`} />
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Student Enrollment Trend" description="Monthly enrollment over the year">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={enrollmentTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Students" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="School Health Radar" description="Overall performance metrics">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={80}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Average Subject Performance" description="Mean score per subject this semester">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="subject" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Average"]} />
            <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} name="Average Score" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Fee Collection Breakdown" description="Monthly fees by type (USD)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={feeMonthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]} />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
            <Bar dataKey="tuition" stackId="a" fill="#7c3aed" name="Tuition" />
            <Bar dataKey="transport" stackId="a" fill="#6366f1" name="Transport" />
            <Bar dataKey="library" stackId="a" fill="#a78bfa" name="Library" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
