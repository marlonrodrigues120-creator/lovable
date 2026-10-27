import { cn } from "@/lib/utils";
import { iniciais } from "@/lib/leads";
import type { Conversa } from "@/lib/followup";

const tons: Record<Conversa["cor"], string> = {
  1: "bg-chart-1/15 text-chart-1",
  2: "bg-chart-2/15 text-chart-2",
  3: "bg-chart-3/15 text-chart-3",
  4: "bg-chart-4/20 text-chart-4",
  5: "bg-chart-5/15 text-chart-5",
};

export function ContactAvatar({ conversa, size = "md", badges = true }: { conversa: Conversa; size?: "md" | "lg"; badges?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className={cn("flex items-center justify-center rounded-full font-semibold", tons[conversa.cor], size === "lg" ? "size-14 text-lg" : "size-11 text-sm")}>
        {iniciais(conversa.nome)}
      </div>
      {badges && (
        <>
          <span
            title={conversa.canal === "whatsapp" ? "WhatsApp" : "E-mail"}
            className={cn(
              "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-card text-[8px] font-bold text-primary-foreground",
              conversa.canal === "whatsapp" ? "bg-success" : "bg-info",
            )}
          >
            {conversa.canal === "whatsapp" ? "W" : "@"}
          </span>
          {conversa.online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-success" aria-label="online" />}
        </>
      )}
    </div>
  );
}
