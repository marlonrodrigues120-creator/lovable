import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { horaCurta, type Mensagem } from "@/lib/followup";

export function MessageBubble({ mensagem }: { mensagem: Mensagem }) {
  const minha = mensagem.deMim;
  return (
    <div className={cn("flex", minha ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-3.5 py-2 text-sm shadow-soft",
          minha ? "rounded-br-md bg-accent text-foreground" : "rounded-bl-md bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{mensagem.texto}</p>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {horaCurta(mensagem.enviadaEm)}
          {minha && <CheckCheck className={cn("size-3.5", mensagem.lida ? "text-info" : "text-muted-foreground")} aria-label={mensagem.lida ? "Lida" : "Enviada"} />}
        </div>
      </div>
    </div>
  );
}
