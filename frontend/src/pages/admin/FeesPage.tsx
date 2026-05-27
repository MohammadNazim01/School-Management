import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { feeService } from "@/services/fee.service";
import { studentService } from "@/services/student.service";
import type { Fee } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

export function FeesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [form, setForm] = useState({ student_id: "", fee_type: "tuition", amount: 0, due_date: "" });

  const { data: students = [] } = useQuery({ queryKey: ["students"], queryFn: () => studentService.list({ limit: 200 }) });

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ["fees", selectedStudent],
    queryFn: () => feeService.getStudentFees(selectedStudent),
    enabled: !!selectedStudent,
  });

  const createMutation = useMutation({
    mutationFn: () => feeService.create({ ...form, student_id: selectedStudent || form.student_id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fees"] }); toast.success("Fee record created!"); setModal(false); },
  });

  const markPaidMutation = useMutation({
    mutationFn: (feeId: string) => feeService.update(feeId, { status: "paid", paid_date: new Date().toISOString().split("T")[0] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fees"] }); toast.success("Fee marked as paid!"); },
  });

  const totalPending = fees.filter((f) => f.status !== "paid").reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Fees Management" description="Track and manage student fee records"
        action={<Button variant="gradient" onClick={() => setModal(true)}><Plus className="size-4" /> Add Fee</Button>} />

      <div className="flex items-center gap-3">
        <div className="w-72">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger><SelectValue placeholder="Select student to view fees" /></SelectTrigger>
            <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.roll_number})</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {selectedStudent && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Collected", value: formatCurrency(totalCollected), color: "text-emerald-500" },
              { label: "Total Pending", value: formatCurrency(totalPending), color: "text-red-500" },
              { label: "Total Records", value: String(fees.length), color: "text-foreground" },
            ].map((s) => (
              <Card key={s.label}><CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent></Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Fee Records</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}</div>
              ) : (
                <div className="divide-y divide-border">
                  {fees.map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium capitalize">{fee.fee_type} Fee</p>
                        <p className="text-xs text-muted-foreground">Due: {formatDate(fee.due_date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{formatCurrency(fee.amount)}</span>
                        <StatusBadge status={fee.status} />
                        {fee.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => markPaidMutation.mutate(fee.id)}>
                            <CheckCircle className="size-3.5" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {fees.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">No fee records for this student.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Fee Record</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <Select value={form.student_id} onValueChange={(v) => setForm((f) => ({ ...f, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students.map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fee Type</Label>
              <Select value={form.fee_type} onValueChange={(v) => setForm((f) => ({ ...f, fee_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["tuition", "transport", "library", "exam", "other"].map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Amount (USD)</Label><Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} /></div>
              <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="gradient" loading={createMutation.isPending} onClick={() => createMutation.mutate()}>Add Fee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
