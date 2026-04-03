describe("Admin pages", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ id: 2, firstName: "Admin", lastName: "User", email: "admin@test.com", role: "admin" }));
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/orders*", { fixture: "orders.json" }).as("getOrders");
  });

  describe("Admin orders page", () => {
    beforeEach(() => {
      cy.visit("/admin/orders");
    });

    it("displays orders heading", () => {
      cy.getBySel("orders-heading").should("exist");
    });

    it("shows the admin nav", () => {
      cy.contains("Admin").should("exist");
      cy.getBySel("admin-nav-orders").should("exist");
      cy.getBySel("admin-nav-products").should("exist");
    });

    it("shows order list after loading", () => {
      cy.wait("@getOrders");
      cy.contains("#1").should("exist");
      cy.contains("$1999.98").should("exist");
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
      cy.contains("Add New Product").should("exist");
      cy.getBySel("new-product-name").should("exist");
      cy.getBySel("new-product-category").should("exist");
      cy.get('input[name="price"]').should("exist");
      cy.get('input[name="stock"]').should("exist");
    });

    it("shows product table", () => {
      cy.contains("iPhone 15 Pro").should("exist");
      cy.contains("Delete").should("exist");
    });
  });
});
