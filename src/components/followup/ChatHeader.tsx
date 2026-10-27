import { ArrowLeft, CalendarPlus, MoreVertical, PanelRight, Phone, Search, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Conversa } from "@/lib/followup";
import { linkTelefone } from "@/lib/leads";
import { ContactAvatar } from "./ContactAvatar";

export function ChatHeader({ conversa, detalhesAbertos, onToggleDetalhes, onVoltar }: {
  conversa: Conversa; detalhesAbertos: boolean; onToggleDetalhes: () => void; onVoltar: () => void;
}) {
  const emBreve = () => toast("Disponível em breve");
  const acoes = [
    { icon: Search, label: "Buscar na conversa", onClick: emBreve, hide: true },
    { icon: Phone, label: "Ligar", onClick: () => window.open(linkTelefone(conversa.telefone).tel, "_self") },
    { icon: Video, label: "Videochamada", onClick: emBreve, hide: true },
    { icon: CalendarPlus, label: "Agendar reunião", onClick: emBreve, hide: true },
    { icon: MoreVertical, label: "Mais opções", onClick: emBreve },
  ];
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b px-3 sm:px-4">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onVoltar} aria-label="Voltar"><ArrowLeft className="size-4" /></Button>
      <ContactAvatar conversa={conversa} badges={false} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{conversa.nome}</p>
        <p className={cn("text-xs", conversa.online ? "text-success" : "text-muted-foreground")}>{conversa.online ? "online" : "offline"}</p>
      </div>
      <div className="flex items-center">
        {acoes.map(({ icon: Icon, label, onClick, hide }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={label} onClick={onClick} className={cn("text-muted-foreground", hide && "hidden sm:inline-flex")}><Icon className="size-4" /></Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Detalhes do contato" aria-pressed={detalhesAbertos} onClick={onToggleDetalhes} className={cn(detalhesAbertos ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
              <PanelRight className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Detalhes do contato</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
