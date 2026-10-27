import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/atividades")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Atividades — SalesFlow" },
      { name: "description", content: "Atividades no SalesFlow, o CRM de vendas do seu time." },
      { property: "og:title", content: "Atividades — SalesFlow" },
      { property: "og:description", content: "Gerencie Atividades no SalesFlow." },
    ],
  }),
  component: () => <ComingSoon title="Atividades" />,
});
