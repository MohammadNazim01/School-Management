import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { markService } from "@/services/mark.service";
import { examService } from "@/services/exam.service";
import { studentService } from "@/services/student.service";
import { gradeColor } from "@/lib/utils";
import type { Mark } from "@/types";

export function MarksPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ student_id: "", exam_id: "", marks_obtained: 0 });
  const [resultStudentId, setResultStudentId] = useState("");

  const { data: exams = [] } = useQuery({ queryKey: ["exams"], queryFn: () => examService.list() });
  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: () => studentService.list({ limit: 200 }) });
  const { data: result, isLoading: loadingResult } = useQuery({
    queryKey: ["result", resultStudentId],
    queryFn: () => markService.getStudentResult(resultStudentId),
    enabled: !!resultStudentId,
  });

  const addMutation = useMutation({
    mutationFn: () => markService.add(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["result"] }); toast.success("Marks added!"); setModal(false); },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Marks & Results" description="Manage student exam results"
        action={<Button variant="gradient" onClick={() => setModal(true)}><Plus className="size-4" /> Add Marks</Button>} />

      {/* Student result lookup */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">View Student Result</Label>
              <Select value={resultStudentId} onValueChange={setResultStudentId}>
                <SelectTrigger><SelectValue placeholder="Select a student to view their result" /></SelectTrigger>
                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.roll_number})</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Student", value: result.student_name },
                  { label: "Total Obtained", value: `${result.total_marks_obtained}/${result.total_marks_possible}` },
                  { label: "Percentage", value: `${result.percentage}%` },
                  { label: "Grade", value: result.overall_grade },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-lg font-bold mt-0.5 ${stat.label === "Grade" ? gradeColor(stat.value) : ""}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Exam</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.marks.map((m: Mark) => (
                      <tr key={m.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">{m.exam_id.slice(0, 8)}…</td>
                        <td className="px-4 py-3 font-medium">{m.marks_obtained}</td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${gradeColor(m.grade ?? "")}`}>{m.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Trophy className="size-4 text-primary" /> Add Marks</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select value={form.student_id} onValueChange={(v) => setForm((f) => ({ ...f, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Exam</Label>
              <Select value={form.exam_id} onValueChange={(v) => setForm((f) => ({ ...f, exam_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Marks Obtained</Label><Input type="number" value={form.marks_obtained} onChange={(e) => setForm((f) => ({ ...f, marks_obtained: Number(e.target.value) }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="gradient" loading={addMutation.isPending} onClick={() => addMutation.mutate()}>Save Marks</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
