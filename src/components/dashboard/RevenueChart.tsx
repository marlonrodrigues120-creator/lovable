import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

interface Props {
  data: { mes: string; receita: number }[];
  loading?: boolean;
}

export function RevenueChart({ data, loading }: Props) {
  return (
    <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
      <h2 className="font-semibold">Receita ao longo do tempo</h2>
      <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
      <div className="mt-4 h-72">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis
                width={70}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip
                formatter={(v: number) => [formatCurrency(v), "Receita"]}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }}
              />
              <Area type="monotone" dataKey="receita" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
