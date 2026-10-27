import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Configurações — SalesFlow" },
      { name: "description", content: "Configurações no SalesFlow, o CRM de vendas do seu time." },
      { property: "og:title", content: "Configurações — SalesFlow" },
      { property: "og:description", content: "Gerencie Configurações no SalesFlow." },
    ],
  }),
  component: () => <ComingSoon title="Configurações" />,
});
