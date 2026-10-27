import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { criarConversasIniciais } from "@/data/mockConversas";
import { totalNaoLidas } from "@/lib/followup";
import { Route } from "@/routes/negocios";

beforeAll(() => {
  // jsdom não implementa scrollIntoView, usado para rolar o chat até a última mensagem.
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderPagina() {
  const Pagina = Route.options.component!;
  return render(
    <ThemeProvider>
      <SidebarProvider>
        <Pagina />
      </SidebarProvider>
    </ThemeProvider>,
  );
}

describe("Negócios · Follow up", () => {
  it("lista as conversas e abre uma ao clicar, zerando as não lidas dela", async () => {
    const naoLidasAntes = totalNaoLidas(criarConversasIniciais());
    expect(naoLidasAntes).toBeGreaterThan(0);

    renderPagina();

    const lista = await screen.findByRole("region", { name: "Conversas" });
    const aba = within(lista).getByRole("tab", { name: /Não lidas/ });
    expect(aba).toHaveTextContent(String(naoLidasAntes));

    fireEvent.click(within(lista).getByText("Juliana Pires"));

    const chat = screen.getByRole("region", { name: "Conversa" });
    expect(within(chat).getByText("Juliana Pires")).toBeInTheDocument();
    expect(
      within(chat).getByText("Acabei de conseguir entrar no painel, está tudo funcionando!"),
    ).toBeInTheDocument();

    const abaDepois = within(lista).getByRole("tab", { name: /Não lidas/ });
    const restantes = naoLidasAntes - 1;
    if (restantes > 0) expect(abaDepois).toHaveTextContent(String(restantes));
    else expect(abaDepois).not.toHaveTextContent(String(naoLidasAntes));
  });

  it("envia uma mensagem, limpa o campo e guarda o rascunho de cada conversa", async () => {
    renderPagina();
    const lista = await screen.findByRole("region", { name: "Conversas" });

    fireEvent.click(within(lista).getByText("Juliana Pires"));
    const chat = screen.getByRole("region", { name: "Conversa" });
    const campo = within(chat).getByLabelText("Digite uma mensagem") as HTMLTextAreaElement;

    fireEvent.change(campo, { target: { value: "Podemos agendar a demonstração?" } });
    fireEvent.click(within(chat).getByRole("button", { name: "Enviar" }));

    await waitFor(() =>
      expect(within(chat).getByText("Podemos agendar a demonstração?")).toBeInTheDocument(),
    );
    expect(campo.value).toBe("");

    // Rascunho em uma conversa não vaza para outra.
    fireEvent.change(campo, { target: { value: "rascunho da Juliana" } });
    fireEvent.click(within(chat).getByRole("button", { name: "Voltar" }));
    fireEvent.click(within(lista).getByText("Ricardo Almeida"));
    expect(
      (within(chat).getByLabelText("Digite uma mensagem") as HTMLTextAreaElement).value,
    ).toBe("");

    fireEvent.click(within(chat).getByRole("button", { name: "Voltar" }));
    fireEvent.click(within(lista).getByText("Juliana Pires"));
    expect(
      (within(chat).getByLabelText("Digite uma mensagem") as HTMLTextAreaElement).value,
    ).toBe("rascunho da Juliana");
  });

  it("filtra a lista pela busca e mostra aviso quando nada é encontrado", async () => {
    renderPagina();
    const lista = await screen.findByRole("region", { name: "Conversas" });

    fireEvent.change(within(lista).getByLabelText("Buscar conversa"), {
      target: { value: "zzz-ninguem" },
    });

    expect(within(lista).getByText("Nenhuma conversa encontrada.")).toBeInTheDocument();
  });
});
