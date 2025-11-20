export function installments(amount: number, parts = 3): { parts: number; value: number } {
  const value = Math.max(0, amount) / parts;
  return { parts, value: Math.round(value * 100) / 100 };
}

