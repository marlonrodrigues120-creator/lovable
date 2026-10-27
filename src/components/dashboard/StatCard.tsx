import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  tone: "primary" | "success" | "info" | "warning";
  loading?: boolean;
  delay?: number;
}

const tones = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  info: "bg-info/12 text-info",
  warning: "bg-warning/15 text-warning",
};

export function StatCard({ label, value, change, icon: Icon, tone, loading, delay = 0 }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-soft">
        <Skeleton className="size-11 rounded-full" />
        <Skeleton className="mt-4 h-4 w-28" />
        <Skeleton className="mt-2 h-8 w-36" />
      </div>
    );
  }
  const up = change >= 0;
  return (
    <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className={cn("flex size-11 items-center justify-center rounded-full", tones[tone])}>
          <Icon className="size-5" />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
            up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
          )}
        >
          {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {up ? "+" : "-"}{formatPercent(Math.abs(change))}
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">vs. período anterior</p>
    </div>
  );
}
