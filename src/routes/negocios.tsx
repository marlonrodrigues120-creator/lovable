import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/negocios")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Negócios — SalesFlow" },
      { name: "description", content: "Negócios no SalesFlow, o CRM de vendas do seu time." },
      { property: "og:title", content: "Negócios — SalesFlow" },
      { property: "og:description", content: "Gerencie Negócios no SalesFlow." },
    ],
  }),
  component: () => <ComingSoon title="Negócios" />,
});
