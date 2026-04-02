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
      cy.contains("Orders").should("exist");
    });

    it("shows the admin nav", () => {
      cy.contains("Admin").should("exist");
      cy.get('a[href="/admin/orders"]').should("exist");
      cy.get('a[href="/admin/products"]').should("exist");
    });

    it("shows order list after loading", () => {
      cy.wait("@getOrders");
      cy.contains("#1").should("exist");
      cy.contains("$1999.98").should("exist");
    });

    it("has status filter", () => {
      cy.get("select").should("exist");
    });
  });

  describe("Admin products page", () => {
    beforeEach(() => {
      cy.visit("/admin/products");
    });

    it("displays products heading", () => {
      cy.contains("Products").should("exist");
    });

    it("shows add product form", () => {
      cy.contains("Add New Product").should("exist");
      cy.get('input[name="name"]').should("exist");
      cy.get('select[name="category"]').should("exist");
      cy.get('input[name="price"]').should("exist");
      cy.get('input[name="stock"]').should("exist");
    });

    it("shows product table", () => {
      cy.contains("iPhone 15 Pro").should("exist");
      cy.contains("Delete").should("exist");
    });
  });
});
