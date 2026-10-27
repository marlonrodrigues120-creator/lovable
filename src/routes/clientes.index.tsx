import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, UserCheck, Handshake, ChevronRight, LayoutGrid, List, UserRound } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatusBadge } from "@/components/clientes/StatusBadge";
import { PlanBadge } from "@/components/clientes/PlanBadge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { filtrarClientes, type ClienteOrdem } from "@/lib/clientes";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientes, initials, type ClienteStatus } from "@/data/mockClientes";
import { formatCurrency, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Clientes — SalesFlow" },
      { name: "description", content: "Lista de clientes do SalesFlow com status, valor total e último contato." },
      { property: "og:title", content: "Clientes — SalesFlow" },
      { property: "og:description", content: "Veja e gerencie todos os seus clientes no SalesFlow." },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"todos" | ClienteStatus>("todos");
  const [responsavel, setResponsavel] = useState("todos");
  const [ordem, setOrdem] = useState<ClienteOrdem>("recentes");
  const [view, setView] = useState<"linhas" | "cards">("linhas");
  const responsaveis = [...new Set(clientes.map((c) => c.responsavel))].sort();

  const list = useMemo(() => {
    return filtrarClientes(clientes, { q, status, responsavel, ordem });
  }, [q, status, responsavel, ordem]);

  const resumo = [
    { label: "Total de clientes", value: formatNumber(clientes.length), icon: Users, tone: "bg-primary/10 text-primary" },
    { label: "Clientes ativos", value: formatNumber(clientes.filter((c) => c.status === "ativo").length), icon: UserCheck, tone: "bg-success/12 text-success" },
    { label: "Em negociação", value: formatNumber(clientes.filter((c) => c.status === "negociacao").length), icon: Handshake, tone: "bg-info/12 text-info" },
  ];

  return (
    <>
      <Header title="Clientes" />
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {resumo.map((r, i) => (
            <div key={r.label} className="animate-fade-up flex items-center gap-4 rounded-xl border bg-card p-5 shadow-soft" style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`flex size-11 items-center justify-center rounded-full ${r.tone}`}><r.icon className="size-5" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{r.label}</p>
                <p className="text-2xl font-bold tracking-tight">{r.value}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="animate-fade-up space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Lista de clientes <span className="ml-2 text-sm font-normal text-muted-foreground">{list.length}</span></h2>
            <div className="flex gap-1 rounded-lg border bg-card p-1" role="group" aria-label="Visualização de clientes">
              {([{ value: "linhas", label: "Ver em linhas", icon: List }, { value: "cards", label: "Ver em cards", icon: LayoutGrid }] as const).map((option) => (
                <Tooltip key={option.value}><TooltipTrigger asChild><Button variant={view === option.value ? "secondary" : "ghost"} size="icon" aria-label={option.label} aria-pressed={view === option.value} onClick={() => setView(option.value)}><option.icon /></Button></TooltipTrigger><TooltipContent>{option.label}</TooltipContent></Tooltip>
              ))}
            </div>
          </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input aria-label="Buscar cliente" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente..." className="bg-card pl-9" />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger aria-label="Filtrar por status" className="w-full bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="negociacao">Em negociação</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={responsavel} onValueChange={setResponsavel}>
                <SelectTrigger aria-label="Filtrar por responsável" className="w-full bg-card"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="todos">Todos os responsáveis</SelectItem>{responsaveis.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={ordem} onValueChange={(value) => setOrdem(value as ClienteOrdem)}>
                <SelectTrigger aria-label="Ordenar clientes" className="w-full bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recentes">Mais recentes</SelectItem><SelectItem value="antigos">Mais antigos</SelectItem>
                  <SelectItem value="nome-az">Nome: A–Z</SelectItem><SelectItem value="nome-za">Nome: Z–A</SelectItem>
                  <SelectItem value="valor-desc">Maior valor investido</SelectItem><SelectItem value="valor-asc">Menor valor investido</SelectItem>
                </SelectContent>
              </Select>
            </div>

          {view === "cards" ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => <Link key={c.id} to="/clientes/$clienteId" params={{ clienteId: c.id }} className="group flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-5 shadow-soft transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-start gap-3"><Avatar className="size-11 shrink-0"><AvatarFallback className="bg-accent font-semibold text-accent-foreground">{initials(c.empresa)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><h3 className="break-words font-semibold group-hover:text-primary">{c.empresa}</h3><p className="break-words text-xs text-muted-foreground">{c.contato}</p></div><ChevronRight className="size-4 shrink-0 text-muted-foreground" /></div>
              <div className="flex flex-wrap gap-2"><StatusBadge status={c.status} /><PlanBadge plano={c.plano} /></div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><UserRound className="size-4 shrink-0" />{c.responsavel}</p>
              <div className="mt-auto flex flex-wrap justify-between gap-3 border-t pt-3"><div><p className="text-xs text-muted-foreground">Valor investido</p><p className="font-semibold">{formatCurrency(c.valorTotal)}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">Cliente desde</p><p className="text-sm">{c.clienteDesde}</p></div></div>
            </Link>)}
          </div> : <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
          {/* Tabela (desktop) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Segmento</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Plano</th>
                  <th className="px-5 py-3 font-medium">Responsável</th>
                  <th className="px-5 py-3 text-right font-medium">Valor investido</th>
                  <th className="px-5 py-3 font-medium">Último contato</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="relative cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9"><AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">{initials(c.empresa)}</AvatarFallback></Avatar>
                        <div>
                          <Link to="/clientes/$clienteId" params={{ clienteId: c.id }} className="font-medium after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring">{c.empresa}</Link>
                          <p className="text-xs text-muted-foreground">{c.contato} · {c.cidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{c.segmento}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                     <td className="px-5 py-3"><PlanBadge plano={c.plano} /></td>
                     <td className="px-5 py-3 text-muted-foreground">{c.responsavel}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(c.valorTotal)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.ultimoContato}</td>
                    <td className="pr-4"><ChevronRight className="size-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lista (mobile) */}
          <ul className="divide-y md:hidden">
            {list.map((c) => (
              <li key={c.id}>
                <Button variant="ghost" asChild className="h-auto w-full justify-start whitespace-normal rounded-none p-4"><Link to="/clientes/$clienteId" params={{ clienteId: c.id }}>
                  <Avatar className="size-10"><AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">{initials(c.empresa)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.empresa}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.contato} · {formatCurrency(c.valorTotal)}</p>
                     <p className="truncate text-xs text-muted-foreground">{c.responsavel}</p>
                  </div>
                   <div className="flex shrink-0 flex-col items-end gap-1"><StatusBadge status={c.status} /><PlanBadge plano={c.plano} /></div>
                </Link></Button>
              </li>
            ))}
          </ul>
          </div>}

          {list.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</p>}
        </section>
      </div>
    </>
  );
}
