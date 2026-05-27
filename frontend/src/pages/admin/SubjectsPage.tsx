import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, BookOpen } from "lucide-react";
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
import { classService } from "@/services/class.service";
import api from "@/services/api";
import type { Subject } from "@/types";

export function SubjectsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", class_id: "" });

  const { data: subjects = [], isLoading } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => { const { data } = await api.get("/subjects"); return data; },
  });

  const { data: classes = [] } = useQuery({ queryKey: ["classes"], queryFn: classService.list });

  const createMutation = useMutation({
    mutationFn: async () => { const { data } = await api.post("/subjects", form); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); toast.success("Subject created!"); setModal(false); setForm({ name: "", code: "", class_id: "" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/subjects/${id}`); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); toast.success("Subject deleted."); setDeleteId(null); },
  });

  const columns: Column<Subject>[] = [
    {
      key: "name", header: "Subject",
      render: (s) => (
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-muted-foreground" />
          <span className="font-medium">{s.name}</span>
        </div>
      ),
    },
    { key: "code", header: "Code", render: (s) => <Badge variant="outline" className="font-mono">{s.code}</Badge> },
    { key: "teacher_id", header: "Teacher", render: (s) => s.teacher_id ? "Assigned" : <span className="text-muted-foreground text-xs">Unassigned</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        description={`${subjects.length} subjects`}
        action={<Button variant="gradient" onClick={() => setModal(true)}><Plus className="size-4" /> Add Subject</Button>}
      />
      <DataTable<Subject>
        data={subjects}
        columns={columns}
        isLoading={isLoading}
        searchable searchKey="name" searchPlaceholder="Search subjects..." rowKey="id" pageSize={10}
        actions={(row) => (
          <Button size="icon" variant="ghost" className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(String(row.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        )}
      />
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Subject</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Code</Label><Input placeholder="e.g. MATH101" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} /></div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.class_id} onValueChange={(v) => setForm((f) => ({ ...f, class_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="gradient" loading={createMutation.isPending} onClick={() => createMutation.mutate()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete subject?" description="Remove this subject permanently?" onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} loading={deleteMutation.isPending} />
    </div>
  );
}
