import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { examService } from "@/services/exam.service";
import { classService } from "@/services/class.service";
import { formatDate } from "@/lib/utils";
import type { Exam } from "@/types";
import api from "@/services/api";
import type { Subject } from "@/types";

export function ExamsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", subject_id: "", class_id: "", exam_date: "", total_marks: 100, pass_marks: 40 });

  const { data: exams = [], isLoading } = useQuery({ queryKey: ["exams"], queryFn: () => examService.list() });
  const { data: classes = [] } = useQuery({ queryKey: ["classes"], queryFn: classService.list });
  const { data: subjects = [] } = useQuery<Subject[]>({ queryKey: ["subjects"], queryFn: async () => { const { data } = await api.get("/subjects"); return data; } });

  const createMutation = useMutation({
    mutationFn: () => examService.create(form as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["exams"] }); toast.success("Exam scheduled!"); setModal(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: examService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["exams"] }); toast.success("Exam deleted."); setDeleteId(null); },
  });

  const columns: Column<Exam>[] = [
    { key: "name", header: "Exam Name", render: (e) => <span className="font-medium">{e.name}</span> },
    { key: "exam_date", header: "Date", render: (e) => formatDate(e.exam_date) },
    { key: "total_marks", header: "Total Marks", render: (e) => <Badge variant="secondary">{e.total_marks} marks</Badge> },
    { key: "pass_marks", header: "Pass Marks", render: (e) => <span className="text-emerald-600 font-medium">{e.pass_marks}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description={`${exams.length} exams scheduled`}
        action={<Button variant="gradient" onClick={() => setModal(true)}><Plus className="size-4" /> Schedule Exam</Button>} />
      <DataTable<Exam> data={exams} columns={columns}
        isLoading={isLoading} rowKey="id" pageSize={10} searchable searchKey="name" searchPlaceholder="Search exams..."
        actions={(row) => (
          <Button size="icon" variant="ghost" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(String(row.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        )} />
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Schedule Exam</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Exam Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.class_id} onValueChange={(v) => setForm((f) => ({ ...f, class_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={form.subject_id} onValueChange={(v) => setForm((f) => ({ ...f, subject_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Exam Date</Label><Input type="date" value={form.exam_date} onChange={(e) => setForm((f) => ({ ...f, exam_date: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Total Marks</Label><Input type="number" value={form.total_marks} onChange={(e) => setForm((f) => ({ ...f, total_marks: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label>Pass Marks</Label><Input type="number" value={form.pass_marks} onChange={(e) => setForm((f) => ({ ...f, pass_marks: Number(e.target.value) }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="gradient" loading={createMutation.isPending} onClick={() => createMutation.mutate()}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete exam?" description="Remove this exam permanently?" onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} loading={deleteMutation.isPending} />
    </div>
  );
}
