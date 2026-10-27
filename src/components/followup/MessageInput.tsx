import { useRef } from "react";
import { Mic, Paperclip, SendHorizonal, Smile } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { respostasRapidas } from "@/data/mockConversas";

const emojis = ["😊", "👍", "🙏", "🎉", "🤝"];

export function MessageInput({ valor, onChange, onEnviar }: { valor: string; onChange: (v: string) => void; onEnviar: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const temTexto = valor.trim().length > 0;
  return (
    <div className="shrink-0 border-t bg-card">
      <div className="flex items-center gap-2 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">Respostas rápidas</span>
        {respostasRapidas.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => { onChange(r); ref.current?.focus(); }}
            className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-1 p-3">
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground" aria-label="Emoji"
          onClick={() => { onChange(valor + emojis[Math.floor(Math.random() * emojis.length)]); ref.current?.focus(); }}>
          <Smile className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground" aria-label="Anexar" onClick={() => toast("Anexos disponíveis em breve")}>
          <Paperclip className="size-5" />
        </Button>
        <textarea
          ref={ref}
          rows={1}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onEnviar(); }
          }}
          placeholder="Digite uma mensagem"
          aria-label="Digite uma mensagem"
          className="max-h-32 min-h-10 flex-1 resize-none rounded-3xl border border-input bg-background px-4 py-2.5 text-sm outline-none field-sizing-content focus-visible:ring-2 focus-visible:ring-ring/40"
        />
        {temTexto ? (
          <Button size="icon" className="shrink-0 rounded-full" onClick={onEnviar} aria-label="Enviar"><SendHorizonal className="size-4" /></Button>
        ) : (
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground" aria-label="Áudio" onClick={() => toast("Áudio disponível em breve")}><Mic className="size-5" /></Button>
        )}
      </div>
    </div>
  );
}
