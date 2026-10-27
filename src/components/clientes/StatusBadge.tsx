import { cn } from "@/lib/utils";
import { statusLabel, type ClienteStatus } from "@/data/mockClientes";

const tones: Record<ClienteStatus, string> = {
  ativo: "bg-success/12 text-success",
  negociacao: "bg-primary/10 text-primary",
  inativo: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: ClienteStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[status])}>
      {statusLabel[status]}
    </span>
  );
}
