import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { markService } from "@/services/mark.service";
import { examService } from "@/services/exam.service";
import { gradeColor } from "@/lib/utils";

const mockStudents = [
  { id: "s1", name: "Sara Ahmed", roll: "001" },
  { id: "s2", name: "Ali Hassan", roll: "002" },
  { id: "s3", name: "Fatima Malik", roll: "003" },
  { id: "s4", name: "Omar Sheikh", roll: "004" },
];

function calcGrade(marks: number, total: number): string {
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export function MarksUploadPage() {
  const qc = useQueryClient();
  const [examId, setExamId] = useState("");
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});

  const { data: exams = [] } = useQuery({ queryKey: ["exams"], queryFn: () => examService.list() });
  const selectedExam = exams.find((e) => e.id === examId);

  const submitMutation = useMutation({
    mutationFn: async () => {
      for (const [studentId, marks] of Object.entries(marksMap)) {
        await markService.add({ student_id: studentId, exam_id: examId, marks_obtained: marks });
      }
    },
    onSuccess: () => { toast.success("Marks uploaded successfully!"); setMarksMap({}); },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Upload Marks" description="Enter exam results for your students" />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={examId} onValueChange={setExamId}>
            <SelectTrigger><SelectValue placeholder="Choose an exam..." /></SelectTrigger>
            <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} (Total: {e.total_marks})</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {examId && selectedExam && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Marks Entry — {selectedExam.name}</span>
              <span className="text-sm text-muted-foreground font-normal">Out of {selectedExam.total_marks}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockStudents.map((student) => {
              const marks = marksMap[student.id] ?? 0;
              const grade = marks > 0 ? calcGrade(marks, selectedExam.total_marks) : null;
              return (
                <div key={student.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shrink-0">
                    {student.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">#{student.roll}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={0}
                      max={selectedExam.total_marks}
                      value={marks || ""}
                      onChange={(e) => setMarksMap((m) => ({ ...m, [student.id]: Number(e.target.value) }))}
                      className="w-20 h-8 text-center"
                      placeholder="—"
                    />
                    {grade && (
                      <span className={`text-sm font-bold w-8 text-center ${gradeColor(grade)}`}>{grade}</span>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-end">
              <Button variant="gradient" loading={submitMutation.isPending}
                disabled={Object.keys(marksMap).length === 0}
                onClick={() => submitMutation.mutate()}>
                <Upload className="size-4" /> Upload Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
