describe("Order history page", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ id: 1, firstName: "John", lastName: "Doe", email: "john@test.com", role: "user" }));
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/orders/my-orders", { fixture: "orders.json" }).as("getOrders");
    cy.visit("/orders");
  });

  it("displays order history heading", () => {
    cy.getBySel("order-history-heading").should("exist");
  });

  it("shows orders after loading", () => {
    cy.wait("@getOrders");
    cy.contains("Order #1").should("exist");
    cy.contains("$1999.98").should("exist");
    cy.contains("Delivered").should("exist");
  });

  it("shows shipping address", () => {
    cy.wait("@getOrders");
    cy.contains("123 Main St").should("exist");
    cy.contains("Springfield").should("exist");
  });

  it("shows order items", () => {
    cy.wait("@getOrders");
    cy.contains("iPhone 15 Pro").should("exist");
  });
});
