import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lead, LeadInput } from "@/lib/leads";

const toLead = (row: Record<string, unknown>) => ({ ...row, valor_estimado: Number(row["valor_estimado"]) }) as Lead;

export const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("*").order("criado_em", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toLead);
  },
});

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<LeadInput> }) => {
      const { error } = await supabase.from("leads").update(patch).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: leadsQuery.queryKey });
      const prev = qc.getQueryData(leadsQuery.queryKey);
      qc.setQueryData(leadsQuery.queryKey, (old) => old?.map((l) => (l.id === id ? { ...l, ...patch } : l)));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(leadsQuery.queryKey, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: leadsQuery.queryKey }),
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LeadInput) => {
      const { error } = await supabase.from("leads").insert(input);
      if (error) throw error;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: leadsQuery.queryKey }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: leadsQuery.queryKey }),
  });
}
