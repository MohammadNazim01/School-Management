import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { teacherService, type TeacherCreatePayload } from "@/services/teacher.service";
import { formatDate } from "@/lib/utils";
import type { Teacher } from "@/types";

const defaultForm: TeacherCreatePayload = {
  email: "", password: "", first_name: "", last_name: "",
  employee_id: "", joining_date: new Date().toISOString().split("T")[0],
};

export function TeachersPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TeacherCreatePayload>(defaultForm);

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => teacherService.list({ limit: 200 }),
  });

  const createMutation = useMutation({
    mutationFn: teacherService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher created successfully!");
      setModalOpen(false);
      setForm(defaultForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teacherService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher removed.");
      setDeleteId(null);
    },
  });

  const columns: Column<Teacher>[] = [
    {
      key: "name",
      header: "Teacher",
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold shrink-0">
            {t.first_name[0]}{t.last_name[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{t.first_name} {t.last_name}</p>
            <p className="text-xs text-muted-foreground">ID: {t.employee_id}</p>
          </div>
        </div>
      ),
    },
    { key: "qualification", header: "Qualification", render: (t) => t.qualification ?? "—" },
    { key: "phone", header: "Phone", render: (t) => t.phone ?? "—" },
    { key: "salary", header: "Salary", render: (t) => t.salary ? `$${t.salary.toLocaleString()}` : "—" },
    { key: "joining_date", header: "Joined", render: (t) => formatDate(t.joining_date) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description={`${teachers.length} teachers on staff`}
        action={
          <Button variant="gradient" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Add Teacher
          </Button>
        }
      />

      <DataTable<Teacher>
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        searchable
        searchKey="first_name"
        searchPlaceholder="Search teachers..."
        rowKey="id"
        pageSize={10}
        emptyMessage="No teachers yet."
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Teacher</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { id: "first_name", label: "First Name", type: "text" },
              { id: "last_name", label: "Last Name", type: "text" },
              { id: "email", label: "Email", type: "email" },
              { id: "password", label: "Password", type: "password" },
              { id: "employee_id", label: "Employee ID", type: "text" },
              { id: "qualification", label: "Qualification", type: "text" },
              { id: "phone", label: "Phone", type: "tel" },
              { id: "salary", label: "Salary (USD)", type: "number" },
              { id: "joining_date", label: "Joining Date", type: "date" },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={String(form[field.id as keyof TeacherCreatePayload] ?? "")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      [field.id]: field.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <div className="col-span-2 space-y-1.5">
              <Label>Address</Label>
              <Input value={form.address ?? ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="gradient" loading={createMutation.isPending} onClick={() => createMutation.mutate(form)}>
              Create Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete teacher?"
        description="This will permanently remove the teacher and their assignments."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
