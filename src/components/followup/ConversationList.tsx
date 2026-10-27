import { PenSquare, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { filtrarConversas, totalNaoLidas, type Conversa, type ConversaAba } from "@/lib/followup";
import { ConversationItem } from "./ConversationItem";

const abas: { id: ConversaAba; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "nao-lidas", label: "Não lidas" },
  { id: "leads", label: "Leads" },
  { id: "clientes", label: "Clientes" },
];

interface Props {
  conversas: Conversa[];
  ativaId: string | null;
  aba: ConversaAba;
  busca: string;
  onAba: (a: ConversaAba) => void;
  onBusca: (q: string) => void;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversas, ativaId, aba, busca, onAba, onBusca, onSelect }: Props) {
  const lista = filtrarConversas(conversas, aba, busca);
  const naoLidas = totalNaoLidas(conversas);
  const emBreve = () => toast("Disponível em breve");
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 p-4 pb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={busca} onChange={(e) => onBusca(e.target.value)} placeholder="Buscar conversa..." className="rounded-full pl-9" aria-label="Buscar conversa" />
        </div>
        {[{ icon: PenSquare, label: "Nova mensagem" }, { icon: UserPlus, label: "Novo contato" }].map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label={label} onClick={emBreve}><Icon className="size-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div role="tablist" className="flex gap-4 overflow-x-auto border-b px-4 [scrollbar-width:none]">
        {abas.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={aba === a.id}
            onClick={() => onAba(a.id)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-1.5 border-b-2 pb-2.5 text-sm font-medium transition-colors",
              aba === a.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {a.label}
            {a.id === "nao-lidas" && naoLidas > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">{naoLidas}</span>
            )}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {lista.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
        ) : (
          lista.map((c) => <ConversationItem key={c.id} conversa={c} ativa={c.id === ativaId} onSelect={() => onSelect(c.id)} />)
        )}
      </div>
    </div>
  );
}
