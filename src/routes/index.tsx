import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DollarSign, Target, UserCheck, Users } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { LeadsBySourceChart } from "@/components/dashboard/LeadsBySourceChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { activities, leadsBySource, revenueByMonth, stats, type Stat } from "@/data/mockDashboard";
import { useQuery } from "@tanstack/react-query";
import { leadsQuery } from "@/lib/leads-api";
import { metricasLeads } from "@/lib/leads";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — SalesFlow" },
      { name: "description", content: "Acompanhe receita, conversão, leads e atividades do seu time de vendas no SalesFlow." },
      { property: "og:title", content: "Dashboard — SalesFlow" },
      { property: "og:description", content: "Visão geral de vendas: receita, conversão, leads e atividades recentes." },
    ],
  }),
  component: Dashboard,
});

const icons = { receita: DollarSign, conversao: Target, potenciais: UserCheck, leads: Users } as const;
const tones = { receita: "primary", conversao: "success", potenciais: "info", leads: "warning" } as const;

function formatStat(s: Stat) {
  if (s.format === "currency") return formatCurrency(s.value);
  if (s.format === "percent") return formatPercent(s.value);
  return formatNumber(s.value);
}

function Dashboard() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");
  const { data: leads } = useQuery(leadsQuery);
  const m = leads ? metricasLeads(leads) : null;
  const liveStats = stats.map((s) => {
    if (!m) return s;
    if (s.key === "receita") return { ...s, label: "Receita de leads fechados", value: m.receitaFechada };
    if (s.key === "potenciais") return { ...s, value: m.potenciais };
    if (s.key === "leads") return { ...s, value: m.totalLeads };
    return s;
  });

  useEffect(() => {
    setToday(formatDate(new Date()));
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [period]);

  return (
    <>
      <Header title="Dashboard" period={period} onPeriodChange={setPeriod} />
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <p className="text-sm text-muted-foreground">Olá, Marlon 👋 {today && `Hoje é ${today}.`}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {liveStats.map((s, i) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={formatStat(s)}
              change={s.change}
              icon={icons[s.key]}
              tone={tones[s.key]}
              loading={loading || !leads}
              delay={i * 70}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:col-span-2">
            <RevenueChart data={revenueByMonth} loading={loading} />
            <LeadsBySourceChart data={leadsBySource} loading={loading} />
          </div>
          <ActivityFeed items={activities} loading={loading} />
        </div>
      </div>
    </>
  );
}
