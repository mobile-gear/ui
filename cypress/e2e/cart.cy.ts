describe("Cart page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    localStorage.setItem("user", JSON.stringify({ id: 1, firstName: "John", lastName: "Doe", email: "john@test.com", role: "user" }));
  });

  it("shows empty cart message when no items", () => {
    cy.visit("/cart");
    cy.contains("Your cart is empty").should("exist");
    cy.contains("Continue Shopping").should("exist");
  });

  it("adds product and shows it in cart", () => {
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" }).as("getProduct");
    cy.visit("/products/1");
    cy.wait("@getProduct");
    cy.contains("Add to Cart").click();
    cy.get('a[href="/cart"]').first().click();
    cy.contains("iPhone 15 Pro").should("exist");
    cy.contains("$999.99").should("exist");
    cy.contains("Cart Summary").should("exist");
  });
});
