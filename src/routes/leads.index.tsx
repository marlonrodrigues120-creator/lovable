import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  DndContext, DragOverlay, PointerSensor, TouchSensor, KeyboardSensor, useDraggable, useDroppable, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { Plus, Search, X, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TemperaturaBadge } from "@/components/leads/TemperaturaBadge";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { leadsQuery, useCreateLead, useUpdateLead } from "@/lib/leads-api";
import { agruparPorStatus, filtrarLeads, iniciais, statusLabel, type Lead, type LeadStatus } from "@/lib/leads";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Leads — SalesFlow" },
      { name: "description", content: "Quadro de leads do SalesFlow por etapa: avaliação, proposta, negociação e fechados." },
      { property: "og:title", content: "Leads — SalesFlow" },
      { property: "og:description", content: "Arraste seus leads entre as etapas do funil de vendas." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: LeadsPage,
});

const dotTone: Record<LeadStatus, string> = {
  avaliacao: "bg-info", proposta: "bg-primary", negociacao: "bg-warning", fechado: "bg-success",
};

function LeadsPage() {
  const { data: leads } = useSuspenseQuery(leadsQuery);
  const [busca, setBusca] = useState("");
  const [novoAberto, setNovoAberto] = useState(false);
  const [ativo, setAtivo] = useState<Lead | null>(null);
  const update = useUpdateLead();
  const create = useCreateLead();

  const filtrados = useMemo(() => filtrarLeads(leads, busca), [leads, busca]);
  const colunas = useMemo(() => agruparPorStatus(filtrados), [filtrados]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (e: DragStartEvent) => setAtivo(leads.find((l) => l.id === e.active.id) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setAtivo(null);
    const lead = leads.find((l) => l.id === e.active.id);
    const destino = e.over?.id as LeadStatus | undefined;
    if (!lead || !destino || destino === lead.status) return;
    update.mutate(
      { id: lead.id, patch: { status: destino } },
      { onError: () => toast.error("Não foi possível mover o lead. Tente novamente.") },
    );
  };

  return (
    <>
      <Header title="Leads" />
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-6">
        <div className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar lead pelo nome..." className="bg-card pl-9 pr-9" aria-label="Buscar lead pelo nome" />
            {busca && (
              <button type="button" onClick={() => setBusca("")} aria-label="Limpar busca" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground sm:ml-2">{formatNumber(filtrados.length)} leads</p>
          <Button className="sm:ml-auto" onClick={() => setNovoAberto(true)}><Plus /> Novo Lead</Button>
        </div>

        {busca && filtrados.length === 0 ? (
          <div className="animate-fade-up rounded-xl border bg-card p-10 text-center shadow-soft">
            <Search className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">Nenhum lead encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Tente buscar por outro nome.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setAtivo(null)}>
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 xl:grid xl:grid-cols-4 xl:overflow-visible">
              {colunas.map((col, i) => (
                <Coluna key={col.status} status={col.status} total={col.total} count={col.items.length} delay={i * 70}>
                  {col.items.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
                </Coluna>
              ))}
            </div>
            <DragOverlay>{ativo && <LeadCardView lead={ativo} overlay />}</DragOverlay>
          </DndContext>
        )}
      </div>

      <LeadFormDialog
        open={novoAberto}
        onOpenChange={setNovoAberto}
        saving={create.isPending}
        onSubmit={async (input) => {
          try {
            await create.mutateAsync(input);
            toast.success("Lead criado com sucesso");
            setNovoAberto(false);
          } catch {
            toast.error("Não foi possível salvar o lead.");
          }
        }}
      />
    </>
  );
}

function Coluna({ status, total, count, delay, children }: { status: LeadStatus; total: number; count: number; delay: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section
      ref={setNodeRef}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "animate-fade-up flex w-[280px] shrink-0 snap-start flex-col rounded-xl border bg-muted/50 p-3 transition-colors xl:w-auto",
        isOver && "border-primary bg-primary/10 ring-2 ring-primary/30",
      )}
      aria-label={`Etapa ${statusLabel[status]}`}
    >
      <header className="mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", dotTone[status])} />
          <h2 className="text-sm font-semibold">{statusLabel[status]}</h2>
          <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-muted-foreground shadow-soft">{count}</span>
        </div>
        <p className="mt-1 text-sm font-bold tracking-tight">{formatCurrency(total)}</p>
      </header>
      <div className="flex min-h-24 flex-1 flex-col gap-2.5">
        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            <Inbox className="mb-1 size-5" />
            Nenhum lead nesta etapa
          </div>
        ) : children}
      </div>
    </section>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={cn("touch-manipulation", isDragging && "opacity-40")}>
      <Link to="/leads/$leadId" params={{ leadId: lead.id }} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" draggable={false}>
        <LeadCardView lead={lead} />
      </Link>
    </div>
  );
}

function LeadCardView({ lead, overlay }: { lead: Lead; overlay?: boolean }) {
  return (
    <article className={cn("cursor-grab rounded-xl border bg-card p-3.5 shadow-soft transition hover:border-primary/40", overlay && "rotate-2 scale-105 cursor-grabbing shadow-xl")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{lead.nome}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.empresa || "Sem empresa"}</p>
        </div>
        <TemperaturaBadge temperatura={lead.temperatura} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-bold">{formatCurrency(lead.valor_estimado)}</p>
        <Avatar className="size-7" title={lead.vendedor}>
          <AvatarFallback className="bg-accent text-[10px] font-semibold text-accent-foreground">{iniciais(lead.vendedor)}</AvatarFallback>
        </Avatar>
      </div>
    </article>
  );
}
