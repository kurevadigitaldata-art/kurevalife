import { describe, expect, it } from "vitest";
import { introductionCopy } from "./Onboarding";

describe("introductionCopy", () => {
  it("uses feminine welcome language when requested", () => {
    const copy = introductionCopy("Nathalia", "femenino");
    expect(copy.title).toBe("Bienvenida a KurevaLife, Nathalia");
    expect(copy.first).toContain("seleccionada");
    expect(copy.second).toContain("tranquila");
  });

  it("uses masculine welcome language when requested", () => {
    const copy = introductionCopy("Carlos", "masculino");
    expect(copy.title).toBe("Bienvenido a KurevaLife, Carlos");
    expect(copy.first).toContain("seleccionado");
    expect(copy.second).toContain("tranquilo");
  });

  it("uses neutral language without gendered adjectives", () => {
    const copy = introductionCopy("Alex", "neutro");
    expect(copy.title).toBe("Te damos la bienvenida a KurevaLife, Alex");
    expect(copy.first).toContain("Agradecemos");
    expect(copy.second).toContain("sin prisas");
  });
});
