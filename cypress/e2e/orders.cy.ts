describe("Order history page", () => {
  beforeEach(() => {
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
    cy.intercept("GET", "/api/orders/my-orders", { fixture: "orders.json" }).as(
      "getOrders",
    );
    cy.visit("/orders");
  });

  it("displays order history heading", () => {
    cy.getBySel("order-history-heading").should("exist");
  });

  it("shows orders after loading", () => {
    cy.wait("@getOrders");
    cy.getBySel("order-number").should("exist");
    cy.getBySel("order-total").should("exist");
    cy.getBySel("order-status-delivered").should("exist");
  });

  it("shows shipping address", () => {
    cy.wait("@getOrders");
    cy.getBySel("shipping-address").should("contain.text", "123 Main St");
    cy.getBySel("shipping-address").should("contain.text", "Springfield");
  });

  it("shows order items", () => {
    cy.wait("@getOrders");
    cy.getBySel("order-item").should("contain.text", "iPhone 15 Pro");
  });
});
