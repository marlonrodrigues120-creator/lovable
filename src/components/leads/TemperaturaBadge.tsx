import { cn } from "@/lib/utils";
import { temperaturaEmoji, temperaturaLabel, type LeadTemperatura } from "@/lib/leads";

export const temperaturaTones: Record<LeadTemperatura, string> = {
  frio: "bg-info/12 text-info border-info/40",
  morno: "bg-warning/15 text-warning border-warning/40",
  quente: "bg-destructive/12 text-destructive border-destructive/40",
};

export function TemperaturaBadge({ temperatura }: { temperatura: LeadTemperatura }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", temperaturaTones[temperatura])}>
      <span aria-hidden>{temperaturaEmoji[temperatura]}</span>
      {temperaturaLabel[temperatura]}
    </span>
  );
}
