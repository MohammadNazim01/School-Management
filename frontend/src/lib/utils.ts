import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, len = 40): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export function gradeColor(grade: string): string {
  const g = grade?.toUpperCase();
  if (g === "A+" || g === "A") return "text-emerald-500";
  if (g === "B+" || g === "B") return "text-blue-500";
  if (g === "C") return "text-yellow-500";
  if (g === "D") return "text-orange-500";
  return "text-red-500";
}

export function statusColor(status: string): string {
  switch (status) {
    case "present":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "absent":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "late":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "paid":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "unpaid":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "partial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
