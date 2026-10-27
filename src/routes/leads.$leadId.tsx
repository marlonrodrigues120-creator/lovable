import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Briefcase, Building2, DollarSign, Mail, MessageCircle, Pencil, Phone, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TemperaturaBadge, temperaturaTones } from "@/components/leads/TemperaturaBadge";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { leadsQuery, useDeleteLead, useUpdateLead } from "@/lib/leads-api";
import {
  iniciais, leadStatuses, leadTemperaturas, linkTelefone, statusOptionLabel, temperaturaEmoji, temperaturaLabel,
  type LeadStatus,
} from "@/lib/leads";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leads/$leadId")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Lead — SalesFlow" },
      { name: "description", content: "Detalhes do lead no SalesFlow: contato, valor, etapa, temperatura e observações." },
      { property: "og:title", content: "Lead — SalesFlow" },
      { property: "og:description", content: "Acompanhe cada lead do seu funil no SalesFlow." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: LeadPage,
});

function LeadPage() {
  const { leadId } = Route.useParams();
  const { data: leads } = useSuspenseQuery(leadsQuery);
  const lead = leads.find((l) => l.id === leadId);
  const update = useUpdateLead();
  const remove = useDeleteLead();
  const navigate = useNavigate();
  const [obs, setObs] = useState(lead?.observacoes ?? "");
  const [editando, setEditando] = useState(false);

  useEffect(() => setObs(lead?.observacoes ?? ""), [lead?.id, lead?.observacoes]);

  const voltar = (
    <Link to="/leads" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-4" /> Voltar para leads
    </Link>
  );

  if (!lead) {
    return (
      <>
        <Header title="Lead" />
        <div className="p-4 md:p-6">
          {voltar}
          <div className="mt-6 rounded-xl border bg-card p-10 text-center shadow-soft">
            <p className="font-semibold">Lead não encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Ele pode ter sido excluído.</p>
          </div>
        </div>
      </>
    );
  }

  const salvar = (patch: Parameters<typeof update.mutate>[0]["patch"], msg: string) =>
    update.mutate({ id: lead.id, patch }, {
      onSuccess: () => toast.success(msg),
      onError: () => toast.error("Não foi possível salvar. Tente novamente."),
    });

  const tel = linkTelefone(lead.telefone);
  const infos = [
    { icon: Building2, label: "Empresa", value: lead.empresa || "—" },
    { icon: Briefcase, label: "Cargo", value: lead.cargo || "—" },
    { icon: UserRound, label: "Vendedor responsável", value: lead.vendedor || "—" },
    { icon: DollarSign, label: "Valor estimado", value: formatCurrency(lead.valor_estimado) },
  ];

  return (
    <>
      <Header title="Perfil do lead" />
      <div className="space-y-6 p-4 md:p-6">
        {voltar}
        <div className="animate-fade-up flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{iniciais(lead.nome)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{lead.nome}</h2>
              <TemperaturaBadge temperatura={lead.temperatura} />
            </div>
            <p className="text-sm text-muted-foreground">{[lead.cargo, lead.empresa].filter(Boolean).join(" · ") || "Sem empresa"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditando(true)}><Pencil /> Editar lead</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive"><Trash2 /> Excluir lead</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir {lead.nome}?</AlertDialogTitle>
                  <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => remove.mutate(lead.id, {
                      onSuccess: () => { toast.success("Lead excluído"); navigate({ to: "/leads" }); },
                      onError: () => toast.error("Não foi possível excluir o lead."),
                    })}
                  >Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="animate-fade-up space-y-4 rounded-xl border bg-card p-5 shadow-soft" style={{ animationDelay: "70ms" }}>
            <h3 className="font-semibold">Informações</h3>
            {infos.map((i) => (
              <div key={i.label} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><i.icon className="size-4" /></div>
                <div><p className="text-xs text-muted-foreground">{i.label}</p><p className="text-sm font-medium">{i.value}</p></div>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Mail className="size-4" /></div>
              <div className="min-w-0"><p className="text-xs text-muted-foreground">E-mail</p>
                {lead.email ? <a href={`mailto:${lead.email}`} className="break-all text-sm font-medium text-primary hover:underline">{lead.email}</a> : <p className="text-sm">—</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Phone className="size-4" /></div>
              <div><p className="text-xs text-muted-foreground">Telefone</p>
                {lead.telefone ? (
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                    <a href={tel.tel} className="text-primary hover:underline">{lead.telefone}</a>
                    <a href={tel.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-success hover:underline"><MessageCircle className="size-3.5" /> WhatsApp</a>
                  </div>
                ) : <p className="text-sm">—</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="animate-fade-up grid gap-5 rounded-xl border bg-card p-5 shadow-soft sm:grid-cols-2" style={{ animationDelay: "140ms" }}>
              <div className="space-y-2">
                <h3 className="font-semibold">Etapa atual</h3>
                <Select value={lead.status} onValueChange={(v) => salvar({ status: v as LeadStatus }, "Etapa atualizada")}>
                  <SelectTrigger aria-label="Etapa atual"><SelectValue /></SelectTrigger>
                  <SelectContent>{leadStatuses.map((s) => <SelectItem key={s} value={s}>{statusOptionLabel[s]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Temperatura</h3>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Temperatura do lead">
                  {leadTemperaturas.map((t) => {
                    const on = lead.temperatura === t;
                    return (
                      <button
                        key={t} type="button" role="radio" aria-checked={on}
                        onClick={() => !on && salvar({ temperatura: t }, "Temperatura atualizada")}
                        className={cn("rounded-lg border px-2 py-2 text-sm font-semibold transition", on ? cn(temperaturaTones[t], "ring-2 ring-current/20") : "bg-card text-muted-foreground hover:bg-muted")}
                      >
                        <span aria-hidden>{temperaturaEmoji[t]}</span> {temperaturaLabel[t]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="animate-fade-up space-y-3 rounded-xl border bg-card p-5 shadow-soft" style={{ animationDelay: "210ms" }}>
              <h3 className="font-semibold">Observações</h3>
              <Textarea rows={6} maxLength={5000} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Escreva anotações sobre este lead..." />
              <div className="flex justify-end">
                <Button disabled={obs === lead.observacoes || update.isPending} onClick={() => salvar({ observacoes: obs }, "Observação salva")}>Salvar observação</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadFormDialog
        open={editando}
        onOpenChange={setEditando}
        lead={lead}
        saving={update.isPending}
        onSubmit={async (input) => {
          try {
            await update.mutateAsync({ id: lead.id, patch: input });
            toast.success("Lead atualizado");
            setEditando(false);
          } catch {
            toast.error("Não foi possível salvar o lead.");
          }
        }}
      />
    </>
  );
}
