import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { checkoutService } from "@/services/checkout.service";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("checkoutService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPaymentIntent", () => {
    it("posts cart items and returns client secret", async () => {
      const response = { data: { clientSecret: "cs_test_123" } };
      mockedAxios.post.mockResolvedValue(response);

      const items = [{ productId: 1, quantity: 2 }];
      const result = await checkoutService.createPaymentIntent(items);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/checkout/create-payment-intent"),
        { items },
        { withCredentials: true },
      );
      expect(result).toEqual({ clientSecret: "cs_test_123" });
    });
  });
});
