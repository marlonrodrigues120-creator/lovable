import { Link } from "@tanstack/react-router";
import {
  ArrowRightLeft, CalendarClock, FileText, Mail, Phone, StickyNote, Trophy, UserPlus, type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import type { Activity, ActivityType } from "@/data/mockDashboard";

const map: Record<ActivityType, { icon: LucideIcon; tone: string }> = {
  move: { icon: ArrowRightLeft, tone: "bg-primary/10 text-primary" },
  lead: { icon: UserPlus, tone: "bg-info/12 text-info" },
  call: { icon: Phone, tone: "bg-warning/15 text-warning" },
  proposal: { icon: FileText, tone: "bg-primary/10 text-primary" },
  won: { icon: Trophy, tone: "bg-success/12 text-success" },
  email: { icon: Mail, tone: "bg-info/12 text-info" },
  meeting: { icon: CalendarClock, tone: "bg-warning/15 text-warning" },
  note: { icon: StickyNote, tone: "bg-muted text-muted-foreground" },
};

export function ActivityFeed({ items, loading }: { items: Activity[]; loading?: boolean }) {
  return (
    <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Últimas atividades</h2>
        <Link to="/atividades" className="text-sm font-medium text-primary hover:underline">Ver todas</Link>
      </div>
      <ul className="mt-4 space-y-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="flex gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-16" /></div>
              </li>
            ))
          : items.map((a) => {
              const { icon: Icon, tone } = map[a.type];
              return (
                <li key={a.id} className="flex gap-3">
                  <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tone)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(a.minutesAgo)}</p>
                  </div>
                </li>
              );
            })}
      </ul>
    </div>
  );
}
