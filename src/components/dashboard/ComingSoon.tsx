import { Construction } from "lucide-react";
import { Header } from "./Header";

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <Header title={title} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="animate-fade-up max-w-sm rounded-xl border bg-card p-8 text-center shadow-soft">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Construction className="size-5" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Esta tela será criada em breve.</p>
        </div>
      </div>
    </>
  );
}
