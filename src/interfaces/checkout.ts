export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItemPayload {
  productId: number;
  quantity: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}
