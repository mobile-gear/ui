describe("Checkout page", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Stripe")) return false;
      return true;
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        role: "user",
      }),
    );
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" });
    cy.intercept("POST", "/api/checkout/create-payment-intent", {
      statusCode: 200,
      body: { clientSecret: "pi_test_secret_123" },
    }).as("createPayment");
  });

  it("redirects to cart if no items", () => {
    cy.visit("/checkout");
    cy.url().should("include", "/cart");
  });

  function addItemAndGoToCheckout() {
    cy.visit("/products/1");
    cy.getBySel("add-to-cart").click();
    cy.getBySel("checkout-btn").should("not.exist");
    cy.getBySel("cart-link").first().click();
    cy.getBySel("checkout-btn").click();
  }

  it("shows checkout page with items", () => {
    addItemAndGoToCheckout();
    cy.wait("@createPayment");
    cy.getBySel("checkout-heading").should("exist");
    cy.getBySel("shipping-heading").should("exist");
    cy.getBySel("order-summary").should("exist");
    cy.getBySel("product-name").should("exist");
  });

  it("shows shipping address form fields", () => {
    addItemAndGoToCheckout();
    cy.wait("@createPayment");
    cy.get("#street").should("exist");
    cy.get("#city").should("exist");
    cy.get("#state").should("exist");
    cy.get("#zipCode").should("exist");
    cy.get("#country").should("exist");
  });

  it("validates shipping address form", () => {
    addItemAndGoToCheckout();
    cy.wait("@createPayment");
    cy.getBySel("save-address").click();
    cy.contains("Street address is required").should("exist");
  });

  it("saves shipping address", () => {
    addItemAndGoToCheckout();
    cy.wait("@createPayment");
    cy.get("#street").type("123 Main St");
    cy.get("#city").type("Springfield");
    cy.get("#state").type("IL");
    cy.get("#zipCode").type("62704");
    cy.get("#country").type("US");
    cy.getBySel("save-address").click();
    cy.contains("Update address").should("exist");
  });
});
