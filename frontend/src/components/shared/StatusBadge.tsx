import { cn, statusColor, capitalize } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", statusColor(status), className)}>
      {capitalize(status)}
    </span>
  );
}
