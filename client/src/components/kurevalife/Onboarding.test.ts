import { describe, expect, it } from "vitest";
import { introductionCopy } from "./Onboarding";

describe("introductionCopy", () => {
  it("uses the approved neutral wording without profile data", () => {
    const copy = introductionCopy();
    expect(copy.title).toBe("Bienvenidos");
    expect(copy.greeting).toContain("Muchas gracias por formar parte");
    expect(copy.greeting).not.toMatch(/Hola|Nathalia|Carlos|seleccionad[oa]/i);
    expect(copy.exploration).toContain("con total tranquilidad, sin prisas");
  });

  it("preserves KurevaLife's humanised and origin statements", () => {
    const copy = introductionCopy();
    expect(copy.humanized).toContain("herramienta humanizada");
    expect(copy.origin).toContain("experiencia real");
  });
});
