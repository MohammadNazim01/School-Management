import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

const fees = [
  { id: "1", fee_type: "tuition", amount: 1200, due_date: "2025-01-31", status: "unpaid" as const, receipt_number: null },
  { id: "2", fee_type: "transport", amount: 200, due_date: "2025-01-15", status: "paid" as const, receipt_number: "RCP-A1B2C3", paid_date: "2025-01-10" },
  { id: "3", fee_type: "library", amount: 50, due_date: "2025-01-31", status: "paid" as const, receipt_number: "RCP-D4E5F6", paid_date: "2025-01-08" },
  { id: "4", fee_type: "exam", amount: 100, due_date: "2025-02-15", status: "unpaid" as const, receipt_number: null },
];

const pending = fees.filter((f) => f.status !== "paid").reduce((s, f) => s + f.amount, 0);
const paid = fees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);

export function StudentFeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Fees" description="Track your fee payments" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="size-8 text-red-500 shrink-0" />
            <div><p className="text-xs text-muted-foreground">Pending Fees</p><p className="text-2xl font-bold text-red-500">{formatCurrency(pending)}</p></div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="size-8 text-emerald-500 shrink-0" />
            <div><p className="text-xs text-muted-foreground">Paid This Term</p><p className="text-2xl font-bold text-emerald-500">{formatCurrency(paid)}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
              <span className="text-violet-600 font-bold text-sm">{fees.length}</span>
            </div>
            <div><p className="text-xs text-muted-foreground">Total Records</p><p className="text-2xl font-bold">{formatCurrency(pending + paid)}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Fee Records</CardTitle></CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {fees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium capitalize">{fee.fee_type} Fee</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Due: {formatDate(fee.due_date)}</p>
                  {fee.receipt_number && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{fee.receipt_number}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-bold">{formatCurrency(fee.amount)}</p>
                  <StatusBadge status={fee.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
