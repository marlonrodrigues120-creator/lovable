import { Briefcase, Building2, Mail, Phone, User, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemperaturaBadge } from "@/components/leads/TemperaturaBadge";
import { formatCurrency } from "@/lib/format";
import { horaCurta, type Conversa } from "@/lib/followup";
import { ContactAvatar } from "./ContactAvatar";
import { ConversationTag } from "./ConversationItem";

export function ContactDetailsPanel({ conversa, onFechar }: { conversa: Conversa; onFechar: () => void }) {
  const linhas = [
    { icon: Building2, label: "Empresa", valor: conversa.empresa },
    { icon: Briefcase, label: "Cargo", valor: conversa.cargo },
    { icon: Mail, label: "E-mail", valor: conversa.email, href: `mailto:${conversa.email}` },
    { icon: Phone, label: "Telefone", valor: conversa.telefone, href: `tel:+55${conversa.telefone.replace(/\D/g, "")}` },
    { icon: User, label: "Vendedor", valor: conversa.vendedor },
    { icon: Wallet, label: "Valor estimado", valor: formatCurrency(conversa.valorEstimado) },
  ];
  const historico = [...conversa.mensagens].reverse().slice(0, 4);
  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-card" aria-label="Detalhes do contato">
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <p className="font-semibold">Detalhes do contato</p>
        <Button variant="ghost" size="icon" onClick={onFechar} aria-label="Fechar detalhes"><X className="size-4" /></Button>
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <div className="flex flex-col items-center text-center">
          <ContactAvatar conversa={conversa} size="lg" badges={false} />
          <p className="mt-2 font-semibold">{conversa.nome}</p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
            <ConversationTag conversa={conversa} />
            {conversa.temperatura && <TemperaturaBadge temperatura={conversa.temperatura} />}
          </div>
        </div>
        <dl className="space-y-3 text-sm">
          {linhas.map(({ icon: Icon, label, valor, href }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate font-medium">{href ? <a href={href} className="hover:text-primary hover:underline">{valor}</a> : valor}</dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Negociação vinculada</p>
          <p className="mt-1 text-sm font-semibold">{conversa.empresa} · {formatCurrency(conversa.valorEstimado)}</p>
          <span className="mt-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{conversa.etapa}</span>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Histórico de interações</p>
          <ol className="space-y-3 border-l pl-4">
            {historico.map((m) => (
              <li key={m.id} className="relative text-sm">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                <p className="line-clamp-2">{m.texto}</p>
                <p className="text-xs text-muted-foreground">{m.deMim ? "Mensagem enviada" : "Mensagem recebida"} · {horaCurta(m.enviadaEm)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}
