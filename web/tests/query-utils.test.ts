import { describe, it, expect } from "vitest";
import { toggleInQueryArray, setInQuery } from "@/components/catalog/utils";

describe("query utils", () => {
  it("toggles array param", () => {
    const sp = new URLSearchParams("color=preto&size=M");
    const next = toggleInQueryArray("color", "preto", sp);
    expect(next.getAll("color")).toEqual([]);
    const next2 = toggleInQueryArray("color", "azul", next);
    expect(next2.getAll("color")).toEqual(["azul"]);
  });
  it("sets single param", () => {
    const sp = new URLSearchParams("sort=relevance");
    const next = setInQuery("sort", "price-asc", sp);
    expect(next.get("sort")).toBe("price-asc");
  });
});

