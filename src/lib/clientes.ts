import type { Cliente } from "@/data/mockClientes";

export type ClienteOrdem = "recentes" | "antigos" | "nome-az" | "nome-za" | "valor-desc" | "valor-asc";
export interface ClienteFiltros { q: string; status: string; responsavel: string; ordem: ClienteOrdem }

function dateValue(date: string) {
  const [day, month, year] = date.split("/");
  return Number(`${year}${month}${day}`);
}

export function filtrarClientes(clientes: Cliente[], filtros: ClienteFiltros) {
  const query = filtros.q.trim().toLocaleLowerCase("pt-BR");
  return clientes.filter((c) =>
    (filtros.status === "todos" || c.status === filtros.status) &&
    (filtros.responsavel === "todos" || c.responsavel === filtros.responsavel) &&
    (!query || [c.empresa, c.contato, c.email, c.cidade].some((value) => value.toLocaleLowerCase("pt-BR").includes(query)))
  ).sort((a, b) => {
    switch (filtros.ordem) {
      case "recentes": return dateValue(b.clienteDesde) - dateValue(a.clienteDesde);
      case "antigos": return dateValue(a.clienteDesde) - dateValue(b.clienteDesde);
      case "nome-az": return a.empresa.localeCompare(b.empresa, "pt-BR");
      case "nome-za": return b.empresa.localeCompare(a.empresa, "pt-BR");
      case "valor-desc": return b.valorTotal - a.valorTotal;
      case "valor-asc": return a.valorTotal - b.valorTotal;
    }
  });
}