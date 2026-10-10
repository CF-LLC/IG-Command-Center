export function n(v: number) {
  return new Intl.NumberFormat("en-US").format(v);
}

export function when(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
