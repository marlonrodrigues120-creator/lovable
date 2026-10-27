export type ClienteStatus = "ativo" | "negociacao" | "inativo";
export type ClientePlano = "basico" | "intermediario" | "pro";
export const planoLabel: Record<ClientePlano, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  pro: "Pro",
};

export interface Cliente {
  id: string;
  empresa: string;
  contato: string;
  cargo: string;
  email: string;
  telefone: string;
  cidade: string;
  segmento: string;
  status: ClienteStatus;
  valorTotal: number;
  negociosAbertos: number;
  clienteDesde: string; // dd/mm/aaaa
  ultimoContato: string; // dd/mm/aaaa
  responsavel: string;
  plano: ClientePlano;
}

export const statusLabel: Record<ClienteStatus, string> = {
  ativo: "Ativo",
  negociacao: "Em negociação",
  inativo: "Inativo",
};

export const clientes: Cliente[] = [
  { id: "alfa-tech", empresa: "Alfa Tech", contato: "Mariana Costa", cargo: "Diretora de TI", email: "mariana@alfatech.com.br", telefone: "(11) 98765-4321", cidade: "São Paulo, SP", segmento: "Tecnologia", status: "negociacao", valorTotal: 86500, negociosAbertos: 2, clienteDesde: "14/03/2024", ultimoContato: "22/10/2026", plano: "pro", responsavel: "Marlon Rodrigues" },
  { id: "empresa-beta", empresa: "Empresa Beta Ltda", contato: "Rafael Souza", cargo: "Gerente de compras", email: "rafael@beta.com.br", telefone: "(21) 99654-1122", cidade: "Rio de Janeiro, RJ", segmento: "Varejo", status: "ativo", valorTotal: 42300, negociosAbertos: 1, clienteDesde: "02/08/2023", ultimoContato: "22/10/2026", plano: "intermediario", responsavel: "Juliana Alves" },
  { id: "grupo-horizonte", empresa: "Grupo Horizonte", contato: "Fernanda Lima", cargo: "CEO", email: "fernanda@horizonte.com", telefone: "(31) 98123-4567", cidade: "Belo Horizonte, MG", segmento: "Construção", status: "negociacao", valorTotal: 128000, negociosAbertos: 3, clienteDesde: "19/11/2022", ultimoContato: "21/10/2026", plano: "pro", responsavel: "Marlon Rodrigues" },
  { id: "studio-nova", empresa: "Studio Nova", contato: "Pedro Martins", cargo: "Sócio-fundador", email: "pedro@studionova.design", telefone: "(41) 99876-5432", cidade: "Curitiba, PR", segmento: "Design", status: "ativo", valorTotal: 18000, negociosAbertos: 0, clienteDesde: "05/06/2025", ultimoContato: "22/10/2026", plano: "basico", responsavel: "Juliana Alves" },
  { id: "carlos-mendes", empresa: "Mendes Consultoria", contato: "Carlos Mendes", cargo: "Consultor sênior", email: "carlos@mendes.com.br", telefone: "(51) 98444-2211", cidade: "Porto Alegre, RS", segmento: "Consultoria", status: "ativo", valorTotal: 27600, negociosAbertos: 1, clienteDesde: "28/01/2024", ultimoContato: "22/10/2026", plano: "intermediario", responsavel: "Marlon Rodrigues" },
  { id: "delta-engenharia", empresa: "Delta Engenharia", contato: "Ana Ribeiro", cargo: "Coordenadora de projetos", email: "ana@deltaeng.com.br", telefone: "(61) 99222-3344", cidade: "Brasília, DF", segmento: "Engenharia", status: "negociacao", valorTotal: 64200, negociosAbertos: 2, clienteDesde: "10/10/2023", ultimoContato: "22/10/2026", plano: "pro", responsavel: "Lucas Pereira" },
  { id: "vertice-digital", empresa: "Vértice Digital", contato: "Bruno Oliveira", cargo: "Head de marketing", email: "bruno@vertice.digital", telefone: "(85) 98777-6655", cidade: "Fortaleza, CE", segmento: "Marketing", status: "ativo", valorTotal: 35900, negociosAbertos: 1, clienteDesde: "17/04/2025", ultimoContato: "21/10/2026", plano: "intermediario", responsavel: "Juliana Alves" },
  { id: "sol-alimentos", empresa: "Sol Alimentos", contato: "Patrícia Gomes", cargo: "Diretora financeira", email: "patricia@solalimentos.com.br", telefone: "(71) 99111-8899", cidade: "Salvador, BA", segmento: "Alimentos", status: "inativo", valorTotal: 51800, negociosAbertos: 0, clienteDesde: "08/09/2021", ultimoContato: "03/07/2026", plano: "basico", responsavel: "Lucas Pereira" },
  { id: "orbita-log", empresa: "Órbita Logística", contato: "Thiago Almeida", cargo: "Gerente de operações", email: "thiago@orbitalog.com.br", telefone: "(19) 98555-0033", cidade: "Campinas, SP", segmento: "Logística", status: "ativo", valorTotal: 73400, negociosAbertos: 1, clienteDesde: "22/02/2023", ultimoContato: "18/10/2026", plano: "pro", responsavel: "Marlon Rodrigues" },
  { id: "verde-saude", empresa: "Verde Saúde", contato: "Camila Rocha", cargo: "Gerente administrativa", email: "camila@verdesaude.med.br", telefone: "(81) 99333-7788", cidade: "Recife, PE", segmento: "Saúde", status: "inativo", valorTotal: 22100, negociosAbertos: 0, clienteDesde: "30/05/2022", ultimoContato: "12/05/2026", plano: "basico", responsavel: "Juliana Alves" },
];

export interface ClienteNegocio { titulo: string; valor: number; etapa: string }
export interface ClienteAtividade { texto: string; data: string }

export function getNegocios(c: Cliente): ClienteNegocio[] {
  const etapas = ["Qualificação", "Proposta", "Negociação"];
  const base: ClienteNegocio[] = Array.from({ length: c.negociosAbertos }, (_, i) => ({
    titulo: `${["Contrato", "Renovação", "Expansão"][i % 3]} ${c.empresa}`,
    valor: Math.round((c.valorTotal / (c.negociosAbertos + 1)) / 100) * 100,
    etapa: etapas[i % 3] ?? "Qualificação",
  }));
  return base;
}

export function getAtividades(c: Cliente): ClienteAtividade[] {
  return [
    { texto: `Último contato com ${c.contato}`, data: c.ultimoContato },
    { texto: `E-mail de follow-up enviado para ${c.contato}`, data: "15/10/2026" },
    { texto: `Reunião de alinhamento com ${c.empresa}`, data: "02/10/2026" },
    { texto: `Proposta comercial enviada`, data: "20/09/2026" },
    { texto: `Cliente cadastrado no SalesFlow`, data: c.clienteDesde },
  ];
}

export const getCliente = (id: string) => clientes.find((c) => c.id === id);
export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
