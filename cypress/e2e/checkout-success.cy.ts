describe("Checkout success page", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ id: 1, firstName: "John", lastName: "Doe", email: "john@test.com", role: "user" }));
    localStorage.setItem("checkoutState", JSON.stringify({
      isLoading: false,
      error: null,
      clientSecret: "pi_test_123",
      shippingAddress: { street: "123 Main St", city: "Springfield", state: "IL", zipCode: "62704", country: "US" },
      success: false,
    }));
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
  });

  it("shows error when payment_intent is missing", () => {
    cy.visit("/checkout/success");
    cy.contains("Payment").should("exist");
  });

  it("shows error when redirect_status is not succeeded", () => {
    cy.visit("/checkout/success?payment_intent=pi_123&redirect_status=failed");
    cy.contains("Payment verification failed").should("exist");
    cy.getBySel("return-to-cart").should("exist");
  });

  it("shows success message on valid payment", () => {
    cy.intercept("POST", "/api/orders", {
      statusCode: 200,
      body: {
        id: 1,
        userId: 1,
        items: [],
        total: 999.99,
        paymentIntentId: "pi_123",
        status: "completed",
        shippingAddress: { street: "123 Main St", city: "Springfield", state: "IL", zipCode: "62704", country: "US" },
        createdAt: "2025-03-15T10:00:00Z",
      },
    }).as("createOrder");

    cy.visit("/checkout/success?payment_intent=pi_123&redirect_status=succeeded");
    cy.wait("@createOrder");
    cy.getBySel("payment-success").should("exist");
    cy.contains("Thank you for your purchase").should("exist");
  });

  it("navigates to cart on error", () => {
    cy.visit("/checkout/success?payment_intent=pi_123&redirect_status=failed");
    cy.getBySel("return-to-cart").click();
    cy.url().should("include", "/cart");
  });
});
