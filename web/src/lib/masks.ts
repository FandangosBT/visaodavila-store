export function maskCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function maskCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  const part = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9)];
  return part
    .map((p, i) => (i === 0 ? p : i < 3 ? (p ? `.${p}` : "") : p ? `-${p}` : ""))
    .join("");
}

export function formatDateTimeBR(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

