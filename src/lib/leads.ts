import { z } from "zod";

export const leadStatuses = ["avaliacao", "proposta", "negociacao", "fechado"] as const;
export const leadTemperaturas = ["frio", "morno", "quente"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export type LeadTemperatura = (typeof leadTemperaturas)[number];

export interface Lead {
  id: string;
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  vendedor: string;
  valor_estimado: number;
  status: LeadStatus;
  temperatura: LeadTemperatura;
  observacoes: string;
  criado_em: string;
}

export const statusLabel: Record<LeadStatus, string> = {
  avaliacao: "Avaliação",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechado: "Fechados",
};
export const statusOptionLabel: Record<LeadStatus, string> = { ...statusLabel, fechado: "Fechado" };

export const temperaturaLabel: Record<LeadTemperatura, string> = { frio: "Frio", morno: "Morno", quente: "Quente" };
export const temperaturaEmoji: Record<LeadTemperatura, string> = { frio: "❄️", morno: "🌤️", quente: "🔥" };

export const vendedores = ["Marlon Rodrigues", "Juliana Alves", "Mariana Costa"];

export const leadSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do lead").max(120, "Máximo de 120 caracteres"),
  empresa: z.string().trim().max(120, "Máximo de 120 caracteres"),
  cargo: z.string().trim().max(120, "Máximo de 120 caracteres"),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido").max(255)]),
  telefone: z.string().trim().max(30, "Máximo de 30 caracteres"),
  vendedor: z.string().trim().max(120),
  valor_estimado: z.number({ message: "Valor inválido" }).min(0, "O valor não pode ser negativo").max(999_999_999_999),
  status: z.enum(leadStatuses),
  temperatura: z.enum(leadTemperaturas),
  observacoes: z.string().max(5000, "Máximo de 5000 caracteres"),
});
export type LeadInput = z.infer<typeof leadSchema>;

export function filtrarLeads(leads: Lead[], busca: string) {
  const q = busca.trim().toLocaleLowerCase("pt-BR");
  if (!q) return leads;
  return leads.filter((l) => l.nome.toLocaleLowerCase("pt-BR").includes(q));
}

export function agruparPorStatus(leads: Lead[]) {
  return leadStatuses.map((status) => {
    const items = leads.filter((l) => l.status === status);
    return { status, items, total: items.reduce((s, l) => s + Number(l.valor_estimado), 0) };
  });
}

/** Números do dashboard derivados dos leads. */
export function metricasLeads(leads: Lead[]) {
  return {
    totalLeads: leads.length,
    potenciais: leads.filter((l) => l.status !== "fechado").length,
    receitaFechada: leads.filter((l) => l.status === "fechado").reduce((s, l) => s + Number(l.valor_estimado), 0),
  };
}

export function iniciais(nome: string) {
  return nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?";
}

/** Link de telefone: celulares abrem no WhatsApp, fixos na ligação. */
export function linkTelefone(telefone: string) {
  const digits = telefone.replace(/\D/g, "");
  return { tel: `tel:+55${digits}`, whatsapp: `https://wa.me/55${digits}` };
}
