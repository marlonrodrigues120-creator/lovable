export type StatKey = "receita" | "conversao" | "potenciais" | "leads";

export interface Stat {
  key: StatKey;
  label: string;
  value: number;
  format: "currency" | "percent" | "number";
  change: number;
}

export const stats: Stat[] = [
  { key: "receita", label: "Receita total", value: 248500, format: "currency", change: 12.5 },
  { key: "conversao", label: "Taxa de conversão", value: 24.8, format: "percent", change: 3.2 },
  { key: "potenciais", label: "Clientes em potencial", value: 186, format: "number", change: 8.1 },
  { key: "leads", label: "Total de leads", value: 1243, format: "number", change: -2.4 },
];

export const revenueByMonth = [
  { mes: "Nov", receita: 142000 },
  { mes: "Dez", receita: 158000 },
  { mes: "Jan", receita: 149500 },
  { mes: "Fev", receita: 167000 },
  { mes: "Mar", receita: 181200 },
  { mes: "Abr", receita: 175800 },
  { mes: "Mai", receita: 194300 },
  { mes: "Jun", receita: 203900 },
  { mes: "Jul", receita: 198400 },
  { mes: "Ago", receita: 219700 },
  { mes: "Set", receita: 231000 },
  { mes: "Out", receita: 248500 },
];

export const leadsBySource = [
  { origem: "Site", leads: 412 },
  { origem: "Indicação", leads: 298 },
  { origem: "Redes sociais", leads: 276 },
  { origem: "E-mail", leads: 154 },
  { origem: "Eventos", leads: 103 },
];

export type ActivityType = "move" | "lead" | "call" | "proposal" | "won" | "email" | "meeting" | "note";

export interface Activity {
  id: number;
  type: ActivityType;
  text: string;
  minutesAgo: number;
}

export const activities: Activity[] = [
  { id: 1, type: "move", text: 'Mariana Costa moveu "Contrato Alfa Tech" para Negociação', minutesAgo: 5 },
  { id: 2, type: "lead", text: "Novo lead cadastrado: Rafael Souza (Site)", minutesAgo: 18 },
  { id: 3, type: "call", text: "Ligação realizada com Empresa Beta Ltda", minutesAgo: 42 },
  { id: 4, type: "proposal", text: "Proposta enviada para Grupo Horizonte", minutesAgo: 95 },
  { id: 5, type: "won", text: "Negócio fechado: R$ 18.000 com Studio Nova", minutesAgo: 180 },
  { id: 6, type: "email", text: "E-mail de follow-up enviado para Carlos Mendes", minutesAgo: 260 },
  { id: 7, type: "meeting", text: "Reunião agendada com Delta Engenharia para 24/10/2026", minutesAgo: 420 },
  { id: 8, type: "note", text: "Juliana Alves adicionou uma nota em Vértice Digital", minutesAgo: 1500 },
];

export const currentUser = { name: "Marlon Rodrigues", role: "Gerente comercial", initials: "MR" };
