import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { ChatHeader } from "@/components/followup/ChatHeader";
import { ContactDetailsPanel } from "@/components/followup/ContactDetailsPanel";
import { ConversationList } from "@/components/followup/ConversationList";
import { MessageBubble } from "@/components/followup/MessageBubble";
import { MessageInput } from "@/components/followup/MessageInput";
import { criarConversasIniciais } from "@/data/mockConversas";
import {
  enviarMensagem,
  marcarComoLida,
  ordenarConversas,
  type Conversa,
  type ConversaAba,
} from "@/lib/followup";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/negocios")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Negócios — SalesFlow" },
      {
        name: "description",
        content: "Follow up em tempo real com leads e clientes das suas negociações no SalesFlow.",
      },
      { property: "og:title", content: "Negócios — SalesFlow" },
      { property: "og:description", content: "Converse com leads e clientes sem sair do SalesFlow." },
    ],
  }),
  component: NegociosPage,
});

function NegociosPage() {
  // As conversas de exemplo usam a data atual; carregar só no navegador evita
  // diferença entre o HTML do servidor e o da tela.
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [ativaId, setAtivaId] = useState<string | null>(null);
  const [aba, setAba] = useState<ConversaAba>("todas");
  const [busca, setBusca] = useState("");
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [rascunhos, setRascunhos] = useState<Record<string, string>>({});
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iniciais = criarConversasIniciais();
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const primeira = desktop ? ordenarConversas(iniciais)[0] : undefined;
    setConversas(primeira ? marcarComoLida(iniciais, primeira.id) : iniciais);
    setAtivaId(primeira?.id ?? null);
    setDetalhesAbertos(window.matchMedia("(min-width: 1280px)").matches);
    setCarregado(true);
  }, []);

  const ativa = conversas.find((c) => c.id === ativaId) ?? null;
  const texto = ativaId ? (rascunhos[ativaId] ?? "") : "";
  const totalMensagens = ativa?.mensagens.length ?? 0;

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: "end" });
  }, [ativaId, totalMensagens]);

  const selecionar = (id: string) => {
    setAtivaId(id);
    setConversas((atual) => marcarComoLida(atual, id));
  };

  const enviar = () => {
    if (!ativa || !texto.trim()) return;
    setConversas((atual) => enviarMensagem(atual, ativa.id, texto));
    setRascunhos((atual) => ({ ...atual, [ativa.id]: "" }));
  };

  return (
    <>
      <Header title="Negócios" />
      <div className="min-h-0 flex-1 md:p-6">
        <div className="animate-fade-up relative flex h-[calc(100svh-4rem)] overflow-hidden border-y bg-card shadow-soft md:h-[calc(100svh-7rem)] md:rounded-xl md:border">
          <section
            aria-label="Conversas"
            className={cn(
              "min-h-0 w-full shrink-0 border-r md:w-[340px]",
              ativa ? "hidden md:block" : "block",
            )}
          >
            {carregado ? (
              <ConversationList
                conversas={conversas}
                ativaId={ativaId}
                aba={aba}
                busca={busca}
                onAba={setAba}
                onBusca={setBusca}
                onSelect={selecionar}
              />
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">Carregando conversas...</p>
            )}
          </section>

          <section
            aria-label="Conversa"
            className={cn("min-h-0 min-w-0 flex-1 flex-col", ativa ? "flex" : "hidden md:flex")}
          >
            {ativa ? (
              <>
                <ChatHeader
                  conversa={ativa}
                  detalhesAbertos={detalhesAbertos}
                  onToggleDetalhes={() => setDetalhesAbertos((aberto) => !aberto)}
                  onVoltar={() => setAtivaId(null)}
                />
                <div className="min-h-0 flex-1 overflow-y-auto bg-muted/40 p-4">
                  <div className="flex flex-col gap-2.5">
                    {ativa.mensagens.map((mensagem) => (
                      <MessageBubble key={mensagem.id} mensagem={mensagem} />
                    ))}
                    <div ref={fimRef} />
                  </div>
                </div>
                <MessageInput
                  valor={texto}
                  onChange={(valor) => setRascunhos((atual) => ({ ...atual, [ativa.id]: valor }))}
                  onEnviar={enviar}
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-muted/40 p-8 text-center">
                <MessageCircle className="size-10 text-muted-foreground" />
                <p className="font-semibold">Selecione uma conversa</p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Escolha um lead ou cliente na lista para continuar o follow up.
                </p>
              </div>
            )}
          </section>

          {ativa && detalhesAbertos && (
            <div className="absolute inset-y-0 right-0 z-10 w-full max-w-[340px] border-l shadow-xl xl:static xl:z-auto xl:w-[320px] xl:max-w-none xl:shrink-0 xl:shadow-none">
              <ContactDetailsPanel conversa={ativa} onFechar={() => setDetalhesAbertos(false)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
