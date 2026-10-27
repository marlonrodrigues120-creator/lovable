import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { horarioLista, tagConversa, ultimaMensagem, type Conversa } from "@/lib/followup";
import { temperaturaTones } from "@/components/leads/TemperaturaBadge";
import { ContactAvatar } from "./ContactAvatar";

const tagTones = {
  vip: "bg-primary/12 text-primary",
  cliente: "bg-info/12 text-info",
  ...temperaturaTones,
};

export function ConversationTag({ conversa }: { conversa: Conversa }) {
  const tag = tagConversa(conversa);
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", tagTones[tag.tone])}>{tag.label}</span>;
}

export function ConversationItem({ conversa, ativa, onSelect }: { conversa: Conversa; ativa: boolean; onSelect: () => void }) {
  const ultima = ultimaMensagem(conversa);
  const naoLida = conversa.naoLidas > 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={ativa}
      className={cn(
        "relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
        ativa && "bg-accent/60 hover:bg-accent/60",
      )}
    >
      {ativa && <span className="absolute inset-y-0 left-0 w-1 rounded-r bg-primary" />}
      <ContactAvatar conversa={conversa} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{conversa.nome}</span>
          {conversa.fixada && <Pin className="size-3.5 shrink-0 text-muted-foreground" aria-label="Fixada" />}
          <span className={cn("ml-auto shrink-0 text-xs", naoLida ? "font-semibold text-primary" : "text-muted-foreground")}>
            {ultima ? horarioLista(ultima.enviadaEm) : ""}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p className={cn("truncate text-sm", naoLida ? "text-foreground" : "text-muted-foreground")}>
            {ultima?.deMim && "Você: "}{ultima?.texto}
          </p>
          {naoLida && (
            <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {conversa.naoLidas}
            </span>
          )}
        </div>
        <div className="mt-1.5"><ConversationTag conversa={conversa} /></div>
      </div>
    </button>
  );
}
