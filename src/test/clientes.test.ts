import { describe, expect, it } from "vitest";
import { clientes, planoLabel } from "@/data/mockClientes";
import { filtrarClientes, type ClienteFiltros } from "@/lib/clientes";

const filtros: ClienteFiltros = { q: "", status: "todos", responsavel: "todos", ordem: "recentes" };
describe("Client filters and ordering", () => {
  it("filters by the selected responsible person", () => {
    const list = filtrarClientes(clientes, { ...filtros, responsavel: "Marlon Rodrigues" });
    expect(list.map((c) => c.id).sort()).toEqual(["alfa-tech", "carlos-mendes", "grupo-horizonte", "orbita-log"]);
  });
  it("combines responsible person and status filters", () => {
    expect(filtrarClientes(clientes, { ...filtros, responsavel: "Marlon Rodrigues", status: "ativo" }).map((c) => c.id).sort()).toEqual(["carlos-mendes", "orbita-log"]);
  });
  it("orders newest customers by registration date, not last contact", () => {
    expect(filtrarClientes(clientes, filtros).slice(0, 2).map((c) => c.id)).toEqual(["studio-nova", "vertice-digital"]);
  });
  it("orders by company name", () => {
    expect(filtrarClientes(clientes, { ...filtros, ordem: "nome-az" })[0]?.empresa).toBe("Alfa Tech");
    expect(filtrarClientes(clientes, { ...filtros, ordem: "nome-za" })[0]?.empresa).toBe("Vértice Digital");
  });
  it("orders by invested value in either direction", () => {
    expect(filtrarClientes(clientes, { ...filtros, ordem: "valor-desc" })[0]?.valorTotal).toBe(128000);
    expect(filtrarClientes(clientes, { ...filtros, ordem: "valor-asc" })[0]?.valorTotal).toBe(18000);
  });
  it("uses exactly the three requested plan categories", () => {
    expect(Object.keys(planoLabel).sort()).toEqual(["basico", "intermediario", "pro"]);
    expect([...new Set(clientes.map((c) => c.plano))].sort()).toEqual(["basico", "intermediario", "pro"]);
  });
});