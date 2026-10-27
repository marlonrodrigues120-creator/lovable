import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Relatórios — SalesFlow" },
      { name: "description", content: "Relatórios no SalesFlow, o CRM de vendas do seu time." },
      { property: "og:title", content: "Relatórios — SalesFlow" },
      { property: "og:description", content: "Gerencie Relatórios no SalesFlow." },
    ],
  }),
  component: () => <ComingSoon title="Relatórios" />,
});
