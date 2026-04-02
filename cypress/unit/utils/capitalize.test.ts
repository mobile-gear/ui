import { describe, it, expect } from "vitest";
import capitalize from "@/utils/capitalize";

describe("capitalize", () => {
  it("capitalizes the first letter of a lowercase string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("keeps an already capitalized string unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles a single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles an empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("capitalizes first letter and preserves the rest", () => {
    expect(capitalize("hELLO wORLD")).toBe("HELLO wORLD");
  });
});
