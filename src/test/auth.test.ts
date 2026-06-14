import { describe, expect, it } from "vitest";
import { isPasswordValid } from "../lib/auth";

describe("isPasswordValid", () => {
  it("accepts the configured password", async () => {
    expect(await isPasswordValid("secret", "secret")).toBe(true);
  });

  it("rejects incorrect passwords", async () => {
    expect(await isPasswordValid("wrong", "secret")).toBe(false);
  });

  it("rejects empty configured passwords", async () => {
    expect(await isPasswordValid("secret", "")).toBe(false);
  });
});
