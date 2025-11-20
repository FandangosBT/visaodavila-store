import { describe, it, expect } from "vitest";
import { formatPriceBRL } from "@/lib/format";
import { installments } from "@/lib/installments";

describe("format helpers", () => {
  it("formats BRL correctly", () => {
    expect(formatPriceBRL(199.9)).toContain("R$");
  });
  it("calculates installments", () => {
    const i = installments(300, 3);
    expect(i.parts).toBe(3);
    expect(i.value).toBe(100);
  });
});

