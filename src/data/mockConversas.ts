import type { Conversa, Mensagem } from "@/lib/followup";

function at(diasAtras: number, hora: string) {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  const [h, m] = hora.split(":").map(Number);
  d.setHours(h!, m!, 0, 0);
  return d.toISOString();
}

let n = 0;
const msg = (texto: string, dias: number, hora: string, deMim = false, lida = true): Mensagem => ({
  id: `seed-${++n}`, texto, enviadaEm: at(dias, hora), deMim, lida,
});

export function criarConversasIniciais(): Conversa[] {
  n = 0;
  return [
    {
      id: "ricardo-almeida", nome: "Ricardo Almeida", tipo: "cliente", vip: true, canal: "whatsapp", online: true, fixada: true, naoLidas: 0, cor: 1,
      empresa: "Alfa Tech", cargo: "Diretor de Operações", email: "ricardo@alfatech.com.br", telefone: "(11) 98877-1020",
      vendedor: "Marlon Rodrigues", valorEstimado: 48000, etapa: "Fechado",
      mensagens: [
        msg("Bom dia, Ricardo! Conseguiu analisar a proposta revisada?", 0, "09:12", true),
        msg("Bom dia! Sim, ficou ótima. Só queria confirmar o prazo de implantação.", 0, "09:40"),
        msg("Implantação em 15 dias úteis, com treinamento incluso para a equipe.", 0, "09:45", true),
        msg("Perfeito, fechamos então!", 0, "12:24"),
      ],
    },
    {
      id: "juliana-pires", nome: "Juliana Pires", tipo: "lead", temperatura: "quente", canal: "whatsapp", online: true, fixada: false, naoLidas: 2, cor: 5,
      empresa: "Studio Nova", cargo: "Sócia", email: "juliana@studionova.com", telefone: "(21) 99654-3311",
      vendedor: "Juliana Alves", valorEstimado: 22000, etapa: "Negociação",
      mensagens: [
        msg("Oi Juliana, te enviei o acesso ao ambiente de testes.", 0, "10:05", true),
        msg("Obrigada! Vou tentar agora.", 0, "11:50"),
        msg("Acabei de conseguir entrar no painel, está tudo funcionando!", 0, "11:58"),
      ],
    },
    {
      id: "marina-costa", nome: "Marina Costa", tipo: "cliente", canal: "email", online: false, fixada: false, naoLidas: 0, cor: 3,
      empresa: "Verde Saúde", cargo: "Gerente de Compras", email: "marina@verdesaude.com.br", telefone: "(31) 3222-4455",
      vendedor: "Mariana Costa", valorEstimado: 15500, etapa: "Proposta",
      mensagens: [
        msg("Marina, segue em anexo o contrato de renovação.", 0, "10:30", true),
        msg("Vou conferir e te retorno", 0, "11:15"),
      ],
    },
    {
      id: "patricia-souza", nome: "Patrícia Souza", tipo: "lead", temperatura: "morno", canal: "whatsapp", online: true, fixada: false, naoLidas: 1, cor: 4,
      empresa: "Sol Alimentos", cargo: "Coordenadora de TI", email: "patricia@solalimentos.com", telefone: "(41) 98123-4567",
      vendedor: "Marlon Rodrigues", valorEstimado: 31000, etapa: "Avaliação",
      mensagens: [
        msg("Olá Patrícia! Gostaria de apresentar o SalesFlow para seu time.", 0, "08:20", true),
        msg("Quando podemos agendar a demonstração?", 0, "10:47"),
      ],
    },
    {
      id: "bruno-ferreira", nome: "Bruno Ferreira", tipo: "lead", temperatura: "frio", canal: "email", online: false, fixada: false, naoLidas: 0, cor: 2,
      empresa: "Órbita Logística", cargo: "Analista Comercial", email: "bruno@orbitalog.com.br", telefone: "(51) 3344-9988",
      vendedor: "Juliana Alves", valorEstimado: 9800, etapa: "Proposta",
      mensagens: [
        msg("Bruno, te enviei a proposta comercial por e-mail.", 1, "15:10", true),
        msg("Obrigado pela proposta, vou avaliar com a diretoria.", 1, "17:32"),
      ],
    },
  ];
}

export const atendente = { nome: "Ana Silva" };
export const respostasRapidas = [
  "Enviar proposta",
  "Agendar reunião",
  "Obrigado!",
  "Posso te ligar agora?",
];
