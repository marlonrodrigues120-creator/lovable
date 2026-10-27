import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";

interface Props {
  data: { origem: string; leads: number }[];
  loading?: boolean;
}

export function LeadsBySourceChart({ data, loading }: Props) {
  return (
    <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
      <h2 className="font-semibold">Leads por origem</h2>
      <p className="text-sm text-muted-foreground">Distribuição no período</p>
      <div className="mt-4 h-72">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="origem" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                formatter={(v: number) => [formatNumber(v), "Leads"]}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }}
              />
              <Bar dataKey="leads" fill="var(--chart-1)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
