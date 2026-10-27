import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — SalesFlow" },
      {
        name: "description",
        content: "Acesse sua conta no SalesFlow, o CRM de vendas do seu time.",
      },
      { property: "og:title", content: "Entrar — SalesFlow" },
      { property: "og:description", content: "Acesse sua conta no SalesFlow." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Digite um e-mail válido, como nome@empresa.com."),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type FormValues = z.infer<typeof schema>;
type Mode = "entrar" | "criar";

type AuthFailure = { message: string; code?: string | undefined; status?: number | undefined };

function traduzErro(error: AuthFailure): string {
  console.error("[login] erro de autenticação", error);
  const text = error.message.toLowerCase();
  const code = error.code ?? "";
  if (code === "invalid_credentials" || text.includes("invalid login credentials"))
    return "E-mail ou senha incorretos. Se ainda não tem conta, use “Criar conta”.";
  if (code === "email_not_confirmed" || text.includes("email not confirmed"))
    return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (code === "user_already_exists" || text.includes("already registered"))
    return "Este e-mail já tem uma conta. Entre com a sua senha.";
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit")
    return "Muitas tentativas. Aguarde um pouco e tente de novo.";
  if (code === "email_provider_disabled" || text.includes("email logins are disabled"))
    return "O login por e-mail e senha está desativado no backend do projeto.";
  if (code === "signup_disabled" || text.includes("signups not allowed"))
    return "A criação de contas está desativada no backend do projeto.";
  if (code === "weak_password" || text.includes("password should"))
    return "Senha recusada. Use uma senha mais forte, com letras e números.";
  if (error.status === 0 || text.includes("failed to fetch") || text.includes("network"))
    return "Não foi possível falar com o servidor de login. Verifique a internet e tente de novo.";
  const detalhe = [error.code, error.status, error.message].filter(Boolean).join(" · ");
  return `Não foi possível concluir. Detalhe: ${detalhe}`;
}

const preview = [
  {
    stage: "Avaliação",
    name: "Juliana Pires",
    initials: "JP",
    value: "R$ 8.400",
    tag: "Lead quente",
    tone: "hot",
    avatar: "bg-chart-5",
  },
  {
    stage: "Proposta",
    name: "Patrícia Souza",
    initials: "PS",
    value: "R$ 12.900",
    tag: "Cliente",
    tone: "client",
    avatar: "bg-chart-4",
  },
  {
    stage: "Negociação",
    name: "Marina Costa",
    initials: "MC",
    value: "R$ 21.500",
    tag: "Cliente",
    tone: "client",
    avatar: "bg-chart-3",
  },
  {
    stage: "Fechados",
    name: "Ricardo Almeida",
    initials: "RA",
    value: "R$ 36.000",
    tag: "Cliente VIP",
    tone: "vip",
    avatar: "bg-chart-1",
  },
] as const;

const tagTone = {
  hot: "bg-destructive/10 text-destructive",
  client: "bg-info/15 text-info",
  vip: "bg-accent text-accent-foreground",
} as const;

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("entrar");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const isLogin = mode === "entrar";

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) {
          setFormError(traduzErro(error));
          return;
        }
        navigate({ to: "/", replace: true });
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        ...values,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        setFormError(traduzErro(error));
        return;
      }
      if (data.session) {
        navigate({ to: "/", replace: true });
        return;
      }
      toast.success("Conta criada. Enviamos um link de confirmação para o seu e-mail.");
      setMode("entrar");
    } catch (err) {
      console.error("[login] falha inesperada", err);
      setFormError(
        `Não foi possível conectar. Detalhe: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setSubmitting(false);
    }
  });

  function trocaModo() {
    setMode(isLogin ? "criar" : "entrar");
    setFormError(null);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-14">
        <section aria-labelledby="login-title" className="animate-fade-up">
          <div className="mb-7 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Zap className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">SalesFlow</span>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
            <h1 id="login-title" className="text-2xl font-bold tracking-tight text-balance">
              {isLogin ? "Entre na sua conta" : "Crie sua conta"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isLogin
                ? "Acesse seus leads, negociações e conversas de follow up."
                : "Use seu e-mail de trabalho para começar a usar o SalesFlow."}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="h-11 rounded-xl bg-muted/60 pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder="Digite sua senha"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className="h-11 rounded-xl bg-muted/60 pl-10 pr-11"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting} className="h-11 rounded-xl">
                {submitting && <Loader2 className="animate-spin" />}
                {isLogin
                  ? submitting
                    ? "Entrando"
                    : "Entrar"
                  : submitting
                    ? "Criando"
                    : "Criar conta"}
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={trocaModo}
              className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </section>

        <aside
          aria-label="Prévia do quadro de negociações"
          className="animate-fade-up hidden min-w-0 flex-col gap-4 lg:flex"
        >
          <h2 className="max-w-[24ch] text-2xl font-bold tracking-tight text-balance">
            Todas as negociações do time em um só quadro
          </h2>
          <p className="max-w-[46ch] text-sm text-muted-foreground">
            Acompanhe cada lead da avaliação ao fechamento e continue a conversa com o cliente sem
            sair da tela.
          </p>
          <div className="grid grid-cols-4 gap-3 rounded-2xl border bg-card p-4 shadow-soft">
            {preview.map((item) => (
              <div
                key={item.stage}
                className="flex min-w-0 flex-col gap-2 rounded-xl bg-muted/60 p-2.5"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.stage}
                </span>
                <div className="flex min-w-0 flex-col gap-1.5 rounded-lg border bg-card p-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${item.avatar}`}
                    >
                      {item.initials}
                    </span>
                    <span className="truncate text-xs font-semibold">{item.name}</span>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{item.value}</span>
                  <span
                    className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${tagTone[item.tone]}`}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Exemplo ilustrativo do quadro de negociações.
          </span>
        </aside>
      </div>
    </div>
  );
}
