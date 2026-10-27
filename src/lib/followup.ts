import type { LeadTemperatura } from "@/lib/leads";

export type Canal = "whatsapp" | "email";
export type ContatoTipo = "lead" | "cliente";
export type AtendenteStatus = "online" | "ausente" | "offline";
export type ConversaAba = "todas" | "nao-lidas" | "leads" | "clientes";

export interface Mensagem {
  id: string;
  texto: string;
  enviadaEm: string; // ISO
  deMim: boolean;
  lida?: boolean;
}

export interface Conversa {
  id: string;
  nome: string;
  tipo: ContatoTipo;
  vip?: boolean;
  temperatura?: LeadTemperatura;
  canal: Canal;
  online: boolean;
  fixada: boolean;
  naoLidas: number;
  cor: 1 | 2 | 3 | 4 | 5;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
  vendedor: string;
  valorEstimado: number;
  etapa: string;
  mensagens: Mensagem[];
}

export function ultimaMensagem(c: Conversa) {
  return c.mensagens[c.mensagens.length - 1];
}

/** Fixadas primeiro, depois pela mensagem mais recente. */
export function ordenarConversas(conversas: Conversa[]) {
  return [...conversas].sort((a, b) => {
    if (a.fixada !== b.fixada) return a.fixada ? -1 : 1;
    const ta = new Date(ultimaMensagem(a)?.enviadaEm ?? 0).getTime();
    const tb = new Date(ultimaMensagem(b)?.enviadaEm ?? 0).getTime();
    return tb - ta;
  });
}

export function filtrarConversas(conversas: Conversa[], aba: ConversaAba, busca: string) {
  const q = busca.trim().toLocaleLowerCase("pt-BR");
  return ordenarConversas(conversas).filter((c) => {
    if (aba === "nao-lidas" && c.naoLidas === 0) return false;
    if (aba === "leads" && c.tipo !== "lead") return false;
    if (aba === "clientes" && c.tipo !== "cliente") return false;
    if (!q) return true;
    return c.nome.toLocaleLowerCase("pt-BR").includes(q) || (ultimaMensagem(c)?.texto.toLocaleLowerCase("pt-BR").includes(q) ?? false);
  });
}

export function totalNaoLidas(conversas: Conversa[]) {
  return conversas.filter((c) => c.naoLidas > 0).length;
}

export function tagConversa(c: Conversa): { label: string; tone: "vip" | "cliente" | LeadTemperatura } {
  if (c.tipo === "cliente") return c.vip ? { label: "Cliente VIP", tone: "vip" } : { label: "Cliente", tone: "cliente" };
  const t = c.temperatura ?? "morno";
  return { label: `Lead ${t}`, tone: t };
}

/** "12:24" para hoje, "ontem" para ontem, dd/mm para datas anteriores. */
export function horarioLista(iso: string, agora = new Date()) {
  const d = new Date(iso);
  const dia = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((dia(agora) - dia(d)) / 86_400_000);
  if (diff <= 0) return horaCurta(iso);
  if (diff === 1) return "ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function enviarMensagem(conversas: Conversa[], id: string, texto: string, agora = new Date()): Conversa[] {
  const t = texto.trim();
  if (!t) return conversas;
  return conversas.map((c) =>
    c.id === id
      ? { ...c, mensagens: [...c.mensagens, { id: `m-${agora.getTime()}`, texto: t, enviadaEm: agora.toISOString(), deMim: true, lida: false }] }
      : c,
  );
}

export function marcarComoLida(conversas: Conversa[], id: string): Conversa[] {
  return conversas.map((c) => (c.id === id && c.naoLidas > 0 ? { ...c, naoLidas: 0 } : c));
}
