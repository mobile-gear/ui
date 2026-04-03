describe("Cart page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
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
  });

  it("shows empty cart message when no items", () => {
    cy.visit("/cart");
    cy.getBySel("empty-cart").should("exist");
    cy.getBySel("continue-shopping").should("exist");
  });

  it("adds product and shows it in cart", () => {
    cy.intercept("GET", "/api/products/1", {
      fixture: "product-detail.json",
    }).as("getProduct");
    cy.visit("/products/1");
    cy.wait("@getProduct");
    cy.getBySel("add-to-cart").click();
    cy.getBySel("cart-link").first().click();
    cy.getBySel("product-name").should("exist");
    cy.getBySel("product-price").should("exist");
    cy.contains("Cart Summary").should("exist");
  });
});
