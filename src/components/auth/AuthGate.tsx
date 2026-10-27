import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "signed-in" | "signed-out";

/**
 * Protege o app: sem sessão, qualquer rota leva para /login. A tela de login
 * aparece sozinha, sem a sidebar. `children` é o layout do app (sidebar + conteúdo).
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = path === "/login";
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setStatus(data.session ? "signed-in" : "signed-out");
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "signed-in" : "signed-out");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (status === "signed-out" && !isLogin) navigate({ to: "/login", replace: true });
    if (status === "signed-in" && isLogin) navigate({ to: "/", replace: true });
  }, [status, isLogin, navigate]);

  if (isLogin) return <Outlet />;

  if (status !== "signed-in") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Carregando" />
      </div>
    );
  }

  return <>{children}</>;
}
