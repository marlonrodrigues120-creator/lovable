const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const number = new Intl.NumberFormat("pt-BR");
const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatCurrency = (v: number) => currency.format(v);
export const formatCompactCurrency = (v: number) => compactCurrency.format(v);
export const formatNumber = (v: number) => number.format(v);
export const formatPercent = (v: number) => `${decimal.format(v)}%`;
export const formatDate = (d: Date) => d.toLocaleDateString("pt-BR");

export function formatRelative(minutes: number) {
  if (minutes < 60) return `há ${minutes} min`;
  const h = Math.floor(minutes / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "há 1 dia" : `há ${d} dias`;
}
