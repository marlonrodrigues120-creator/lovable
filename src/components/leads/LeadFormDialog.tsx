import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  leadSchema, leadStatuses, leadTemperaturas, statusOptionLabel, temperaturaEmoji, temperaturaLabel, vendedores,
  type Lead, type LeadInput,
} from "@/lib/leads";

const empty: LeadInput = {
  nome: "", empresa: "", cargo: "", email: "", telefone: "", vendedor: vendedores[0]!,
  valor_estimado: 0, status: "avaliacao", temperatura: "frio", observacoes: "",
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lead?: Lead;
  saving?: boolean;
  onSubmit: (input: LeadInput) => Promise<void> | void;
}

export function LeadFormDialog({ open, onOpenChange, lead, saving, onSubmit }: Props) {
  const [form, setForm] = useState<LeadInput>(empty);
  const [valor, setValor] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const base = lead ? { ...empty, ...lead } : empty;
    setForm(base);
    setValor(base.valor_estimado ? String(base.valor_estimado).replace(".", ",") : "");
    setErrors({});
  }, [open, lead]);

  const set = <K extends keyof LeadInput>(k: K, v: LeadInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const num = valor.trim() === "" ? 0 : Number(valor.replace(/\./g, "").replace(",", "."));
    const parsed = leadSchema.safeParse({ ...form, valor_estimado: num });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      return;
    }
    await onSubmit(parsed.data);
  }

  const field = (k: keyof LeadInput, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={`lead-${k}`}>{label}</Label>
      <Input id={`lead-${k}`} value={String(form[k])} onChange={(e) => set(k, e.target.value as never)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar lead" : "Novo lead"}</DialogTitle>
          <DialogDescription>Campos marcados com * são obrigatórios.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("nome", "Nome do lead *", { maxLength: 120, autoFocus: true })}
            {field("empresa", "Empresa", { maxLength: 120 })}
            {field("cargo", "Cargo", { maxLength: 120 })}
            {field("email", "E-mail", { type: "email", maxLength: 255 })}
            {field("telefone", "Telefone", { type: "tel", maxLength: 30, placeholder: "(11) 99999-9999" })}
            <div className="space-y-1.5">
              <Label htmlFor="lead-valor">Valor estimado (R$)</Label>
              <Input id="lead-valor" inputMode="decimal" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} aria-invalid={!!errors["valor_estimado"]} />
              {errors["valor_estimado"] && <p className="text-xs text-destructive">{errors["valor_estimado"]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Vendedor responsável</Label>
              <Select value={form.vendedor} onValueChange={(v) => set("vendedor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from(new Set([...vendedores, form.vendedor].filter(Boolean))).map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Etapa</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as LeadInput["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((s) => <SelectItem key={s} value={s}>{statusOptionLabel[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Temperatura</Label>
              <Select value={form.temperatura} onValueChange={(v) => set("temperatura", v as LeadInput["temperatura"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {leadTemperaturas.map((t) => <SelectItem key={t} value={t}>{temperaturaEmoji[t]} {temperaturaLabel[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-obs">Observações</Label>
            <Textarea id="lead-obs" rows={3} maxLength={5000} value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
