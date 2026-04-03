import { describe, it, expect } from "vitest";
import { shippingAddressSchema } from "@/utils/schemas/checkoutSchemas";

describe("shippingAddressSchema", () => {
  const validAddress = {
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    country: "US",
  };

  it("validates a correct address", async () => {
    await expect(shippingAddressSchema.validate(validAddress)).resolves.toEqual(
      validAddress,
    );
  });

  it("rejects missing street", async () => {
    const { street, ...data } = validAddress;
    void street;
    await expect(shippingAddressSchema.validate(data)).rejects.toThrow(
      "Street address is required",
    );
  });

  it("rejects missing city", async () => {
    const { city, ...data } = validAddress;
    void city;
    await expect(shippingAddressSchema.validate(data)).rejects.toThrow(
      "City is required",
    );
  });

  it("rejects missing state", async () => {
    const { state, ...data } = validAddress;
    void state;
    await expect(shippingAddressSchema.validate(data)).rejects.toThrow(
      "State is required",
    );
  });

  it("rejects missing zipCode", async () => {
    const { zipCode, ...data } = validAddress;
    void zipCode;
    await expect(shippingAddressSchema.validate(data)).rejects.toThrow(
      "ZIP code is required",
    );
  });

  it("rejects missing country", async () => {
    const { country, ...data } = validAddress;
    void country;
    await expect(shippingAddressSchema.validate(data)).rejects.toThrow(
      "Country is required",
    );
  });
});
