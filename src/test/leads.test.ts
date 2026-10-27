import { describe, expect, it } from "vitest";
import { agruparPorStatus, filtrarLeads, leadSchema, metricasLeads, type Lead } from "@/lib/leads";
const l = (o: Partial<Lead>): Lead => ({ id: "1", nome: "A", empresa: "", cargo: "", email: "", telefone: "", vendedor: "", valor_estimado: 0, status: "avaliacao", temperatura: "frio", observacoes: "", criado_em: "", ...o });
const leads = [l({ id: "1", nome: "Rafael", valor_estimado: 100 }), l({ id: "2", nome: "Camila", valor_estimado: 50, status: "fechado" }), l({ id: "3", nome: "Bruno", valor_estimado: 30, status: "fechado" })];
describe("leads", () => {
  it("soma o valor por coluna", () => { expect(agruparPorStatus(leads).find((c) => c.status === "fechado")!.total).toBe(80); });
  it("busca pelo nome", () => { expect(filtrarLeads(leads, "cam").map((x) => x.id)).toEqual(["2"]); });
  it("métricas do dashboard", () => { expect(metricasLeads(leads)).toEqual({ totalLeads: 3, potenciais: 1, receitaFechada: 80 }); });
  it("nome obrigatório e e-mail válido", () => {
    const base = { nome: "X", empresa: "", cargo: "", email: "", telefone: "", vendedor: "", valor_estimado: 0, status: "avaliacao", temperatura: "frio", observacoes: "" };
    expect(leadSchema.safeParse({ ...base, nome: " " }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "abc" }).success).toBe(false);
    expect(leadSchema.safeParse(base).success).toBe(true);
  });
});
