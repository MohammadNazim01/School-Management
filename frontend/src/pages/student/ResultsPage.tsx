import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { gradeColor } from "@/lib/utils";
import { Trophy } from "lucide-react";

const results = [
  { subject: "Mathematics", exam: "Mid-Term", marks: 92, total: 100, grade: "A+", pass: 40 },
  { subject: "Science", exam: "Mid-Term", marks: 85, total: 100, grade: "A", pass: 40 },
  { subject: "English", exam: "Mid-Term", marks: 76, total: 100, grade: "B+", pass: 40 },
  { subject: "History", exam: "Mid-Term", marks: 68, total: 100, grade: "B", pass: 40 },
  { subject: "Art", exam: "Mid-Term", marks: 90, total: 100, grade: "A+", pass: 40 },
];

const totalObtained = results.reduce((s, r) => s + r.marks, 0);
const totalPossible = results.reduce((s, r) => s + r.total, 0);
const percentage = Math.round((totalObtained / totalPossible) * 100);
const overallGrade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : "B";

export function ResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Results" description="View your exam results and grades" />

      {/* Overall summary */}
      <Card className="overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              <Trophy className="size-7" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Overall Performance — Mid-Term 2025</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className={`text-xl font-bold ${gradeColor(overallGrade)}`}>{overallGrade}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{totalObtained}/{totalPossible} marks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject breakdown */}
      <div className="space-y-3">
        {results.map((r) => (
          <Card key={r.subject}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{r.subject}</p>
                  <p className="text-xs text-muted-foreground">{r.exam}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                  <p className="text-xs text-muted-foreground">{r.marks}/{r.total}</p>
                </div>
              </div>
              <Progress value={(r.marks / r.total) * 100} className="h-2" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Pass: {r.pass} marks</span>
                <span className={r.marks >= r.pass ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                  {r.marks >= r.pass ? "Passed" : "Failed"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
