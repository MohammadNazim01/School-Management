import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { studentService, type StudentCreatePayload } from "@/services/student.service";
import { classService } from "@/services/class.service";
import { formatDate } from "@/lib/utils";
import type { Student } from "@/types";

const defaultForm: StudentCreatePayload = {
  email: "", password: "", first_name: "", last_name: "",
  roll_number: "", date_of_birth: "", gender: "male",
  class_id: "", section_id: "", admission_date: new Date().toISOString().split("T")[0],
};

export function StudentsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentCreatePayload>(defaultForm);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.list({ limit: 200 }),
  });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: classService.list,
  });

  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully!");
      setModalOpen(false);
      setForm(defaultForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student removed.");
      setDeleteId(null);
    },
  });

  const handleClassChange = async (classId: string) => {
    setForm((f) => ({ ...f, class_id: classId, section_id: "" }));
    const secs = await classService.listSections(classId);
    setSections(secs);
  };

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Student",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold shrink-0">
            {s.first_name[0]}{s.last_name[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{s.first_name} {s.last_name}</p>
            <p className="text-xs text-muted-foreground">{s.roll_number}</p>
          </div>
        </div>
      ),
    },
    { key: "gender", header: "Gender", render: (s) => <Badge variant="secondary">{s.gender}</Badge> },
    { key: "admission_date", header: "Admitted", render: (s) => formatDate(s.admission_date) },
    { key: "parent_name", header: "Parent", render: (s) => s.parent_name ?? "—" },
    { key: "phone", header: "Phone", render: (s) => s.phone ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${students.length} students enrolled`}
        action={
          <Button variant="gradient" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Add Student
          </Button>
        }
      />

      <DataTable<Student>
        data={students}
        columns={columns}
        isLoading={isLoading}
        searchable
        searchKey="first_name"
        searchPlaceholder="Search students..."
        rowKey="id"
        pageSize={10}
        emptyMessage="No students found. Add your first student."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button size="icon" variant="ghost" className="size-7">
              <Pencil className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteId(String(row.id))}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Create modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" /> New Student
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { id: "first_name", label: "First Name", type: "text" },
              { id: "last_name", label: "Last Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
              { id: "roll_number", label: "Roll Number", type: "text" },
              { id: "date_of_birth", label: "Date of Birth", type: "date" },
              { id: "phone", label: "Phone", type: "tel" },
              { id: "admission_date", label: "Admission Date", type: "date" },
              { id: "parent_name", label: "Parent Name", type: "text" },
              { id: "parent_phone", label: "Parent Phone", type: "tel" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={String(form[field.id as keyof StudentCreatePayload] ?? "")}
                  onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                />
              </div>
            ))}

            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={form.class_id} onValueChange={handleClassChange}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>Section</Label>
              <Select value={form.section_id} onValueChange={(v) => setForm((f) => ({ ...f, section_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {sections.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>Address</Label>
              <Input value={form.address ?? ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              variant="gradient"
              loading={createMutation.isPending}
              onClick={() => createMutation.mutate(form)}
            >
              Create Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete student?"
        description="This will permanently remove the student and all associated records. This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
