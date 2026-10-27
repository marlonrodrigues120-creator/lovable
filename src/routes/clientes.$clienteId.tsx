import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, Building2, Calendar, Mail, MapPin, Phone, UserRound, Wallet, Handshake, Clock,
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatusBadge } from "@/components/clientes/StatusBadge";
import { PlanBadge } from "@/components/clientes/PlanBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAtividades, getCliente, getNegocios, initials } from "@/data/mockClientes";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/clientes/$clienteId")({
  loader: ({ params }) => {
    const cliente = getCliente(params.clienteId);
    if (!cliente) throw notFound();
    return { cliente };
  },
  head: ({ loaderData }) => {
    const nome = loaderData?.cliente.empresa ?? "Cliente";
    return {
      meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
        { title: `${nome} — Perfil do cliente — SalesFlow` },
        { name: "description", content: `Perfil de ${nome}: contato, negócios e histórico de atividades.` },
        { property: "og:title", content: `${nome} — SalesFlow` },
        { property: "og:description", content: `Perfil do cliente ${nome} no SalesFlow.` },
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <Header title="Perfil do cliente" />
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
        <Link to="/clientes" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Voltar para clientes</Link>
      </div>
    </>
  ),
  component: PerfilCliente,
});

function PerfilCliente() {
  const { cliente: c } = Route.useLoaderData();
  const negocios = getNegocios(c);
  const atividades = getAtividades(c);

  const info = [
    { icon: UserRound, label: "Contato", value: `${c.contato} · ${c.cargo}` },
    { icon: Mail, label: "E-mail", value: c.email },
    { icon: Phone, label: "Telefone", value: c.telefone },
    { icon: MapPin, label: "Cidade", value: c.cidade },
    { icon: Building2, label: "Segmento", value: c.segmento },
    { icon: UserRound, label: "Responsável", value: c.responsavel },
  ];
  const kpis = [
    { icon: Wallet, label: "Valor total", value: formatCurrency(c.valorTotal), tone: "bg-primary/10 text-primary" },
    { icon: Handshake, label: "Negócios abertos", value: String(c.negociosAbertos), tone: "bg-info/12 text-info" },
    { icon: Calendar, label: "Cliente desde", value: c.clienteDesde, tone: "bg-success/12 text-success" },
    { icon: Clock, label: "Último contato", value: c.ultimoContato, tone: "bg-warning/15 text-warning" },
  ];

  return (
    <>
      <Header title="Perfil do cliente" />
      <div className="space-y-6 p-4 md:p-6">
        <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Voltar para clientes
        </Link>

        <div className="animate-fade-up flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
          <Avatar className="size-16"><AvatarFallback className="bg-accent text-lg font-bold text-accent-foreground">{initials(c.empresa)}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{c.empresa}</h2>
              <StatusBadge status={c.status} />
              <PlanBadge plano={c.plano} />
            </div>
            <p className="text-sm text-muted-foreground">{c.contato} · {c.cidade}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><a href={`mailto:${c.email}`}><Mail /> E-mail</a></Button>
            <Button asChild><a href={`tel:${c.telefone.replace(/\D/g, "")}`}><Phone /> Ligar</a></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => (
            <div key={k.label} className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft" style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`flex size-11 items-center justify-center rounded-full ${k.tone}`}><k.icon className="size-5" /></div>
              <p className="mt-4 text-sm text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="font-semibold">Informações</h3>
            <dl className="mt-4 space-y-4">
              {info.map((it) => (
                <div key={it.label} className="flex gap-3">
                  <it.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{it.label}</dt>
                    <dd className="break-words text-sm font-medium">{it.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="font-semibold">Negócios abertos</h3>
            {negocios.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nenhum negócio aberto no momento.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {negocios.map((n) => (
                  <li key={n.titulo} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{n.titulo}</p>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{n.etapa}</span>
                      <span className="font-semibold">{formatCurrency(n.valor)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="animate-fade-up rounded-xl border bg-card p-5 shadow-soft">
            <h3 className="font-semibold">Histórico de atividades</h3>
            <ol className="mt-4 space-y-4 border-l pl-4">
              {atividades.map((a) => (
                <li key={a.texto} className="relative">
                  <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary" />
                  <p className="text-sm">{a.texto}</p>
                  <p className="text-xs text-muted-foreground">{a.data}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
