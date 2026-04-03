import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/utils/schemas/authSchemas";

describe("loginSchema", () => {
  it("validates a correct login payload", async () => {
    const valid = { email: "test@example.com", password: "password123" };
    await expect(loginSchema.validate(valid)).resolves.toEqual(valid);
  });

  it("rejects missing email", async () => {
    await expect(
      loginSchema.validate({ password: "password123" }),
    ).rejects.toThrow("Email is required");
  });

  it("rejects invalid email", async () => {
    await expect(
      loginSchema.validate({ email: "not-an-email", password: "password123" }),
    ).rejects.toThrow("Invalid email address");
  });

  it("rejects missing password", async () => {
    await expect(
      loginSchema.validate({ email: "test@example.com" }),
    ).rejects.toThrow("Password is required");
  });
});

describe("registerSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("validates a correct register payload", async () => {
    await expect(registerSchema.validate(validData)).resolves.toEqual(
      validData,
    );
  });

  it("rejects missing firstName", async () => {
    const { firstName, ...data } = validData;
    void firstName;
    await expect(registerSchema.validate(data)).rejects.toThrow(
      "First name is required",
    );
  });

  it("rejects missing lastName", async () => {
    const { lastName, ...data } = validData;
    void lastName;
    await expect(registerSchema.validate(data)).rejects.toThrow(
      "Last name is required",
    );
  });

  it("rejects a short password", async () => {
    await expect(
      registerSchema.validate({
        ...validData,
        password: "short",
        confirmPassword: "short",
      }),
    ).rejects.toThrow("Password must be at least 8 characters");
  });

  it("rejects mismatched passwords", async () => {
    await expect(
      registerSchema.validate({
        ...validData,
        confirmPassword: "different123",
      }),
    ).rejects.toThrow("Passwords must match");
  });

  it("rejects missing confirmPassword", async () => {
    const { confirmPassword, ...data } = validData;
    void confirmPassword;
    await expect(registerSchema.validate(data)).rejects.toThrow(
      "Please confirm your password",
    );
  });
});
