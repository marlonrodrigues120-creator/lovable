import { planoLabel, type ClientePlano } from "@/data/mockClientes";
import { cn } from "@/lib/utils";

const tones: Record<ClientePlano, string> = {
  basico: "bg-muted text-muted-foreground",
  intermediario: "bg-info/12 text-info",
  pro: "bg-primary/10 text-primary",
};

export function PlanBadge({ plano }: { plano: ClientePlano }) {
  return <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[plano])}>{planoLabel[plano]}</span>;
}