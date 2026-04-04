describe("Admin pages", () => {
  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: 2,
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        role: "admin",
      }),
    );
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/orders*", { fixture: "orders.json" }).as(
      "getOrders",
    );
  });

  describe("Admin orders page", () => {
    beforeEach(() => {
      cy.visit("/admin/orders");
    });

    it("displays orders heading", () => {
      cy.getBySel("orders-heading").should("exist");
    });

    it("shows the admin nav", () => {
      cy.getBySel("admin-badge").should("exist");
      cy.getBySel("admin-nav-orders").should("exist");
      cy.getBySel("admin-nav-products").should("exist");
    });

    it("shows order list after loading", () => {
      cy.wait("@getOrders");
      cy.getBySel("order-number-short").should("exist");
      cy.getBySel("order-total").should("exist");
    });

    it("has status filter", () => {
      cy.getBySel("order-status-filter").should("exist");
    });
  });

  describe("Admin products page", () => {
    beforeEach(() => {
      cy.visit("/admin/products");
    });

    it("displays products heading", () => {
      cy.getBySel("admin-products-heading").should("exist");
    });

    it("shows add product form", () => {
      cy.getBySel("add-product-btn").should("exist");
      cy.getBySel("new-product-name").should("exist");
      cy.getBySel("new-product-category").should("exist");
      cy.get('input[name="price"]').should("exist");
      cy.get('input[name="stock"]').should("exist");
    });

    it("shows product table", () => {
      cy.getBySel("product-name").should("contain.text", "iPhone 15 Pro");
      cy.getBySel("delete-product").should("exist");
    });
  });
});
