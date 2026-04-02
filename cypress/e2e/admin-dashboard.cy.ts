describe("Admin Dashboard", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ id: 2, firstName: "Admin", lastName: "User", email: "admin@test.com", role: "admin" }));
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.intercept("GET", "/api/orders*", { fixture: "orders.json" }).as("getOrders");
    cy.visit("/admin");
  });

  it("displays orders section", () => {
    cy.wait("@getOrders");
    cy.contains("Orders").should("exist");
    cy.contains("Order #1").should("exist");
    cy.contains("$1999.98").should("exist");
  });

  it("has status filter dropdown", () => {
    cy.wait("@getOrders");
    cy.get("select").first().should("exist");
    cy.get("select").first().select("pending");
  });

  it("displays products section", () => {
    cy.wait("@getProducts");
    cy.contains("Products").should("exist");
    cy.contains("iPhone 15 Pro").should("exist");
  });

  it("shows add/edit product form", () => {
    cy.contains("Add Product").should("exist");
    cy.get('input[placeholder="Product name"]').should("exist");
    cy.get('textarea[placeholder="Product description"]').should("exist");
    cy.get('input[placeholder="Price"]').should("exist");
    cy.get('input[placeholder="Stock"]').should("exist");
    cy.get('input[placeholder="Image URL"]').should("exist");
  });

  it("fills and submits the add product form", () => {
    cy.intercept("POST", "/api/products", {
      statusCode: 200,
      body: { id: 5, name: "New Phone", description: "A new phone", price: 499, category: "smartphone", stock: 20, img: "/new.jpg" },
    }).as("createProduct");

    cy.get('input[placeholder="Product name"]').type("New Phone");
    cy.get('form select').select("smartphone");
    cy.get('input[placeholder="Price"]').type("499");
    cy.get('input[placeholder="Stock"]').type("20");
    cy.get('textarea[placeholder="Product description"]').type("A new phone");
    cy.get('input[placeholder="Image URL"]').type("/new.jpg");
    cy.get('form button[type="submit"]').click();

    cy.wait("@createProduct");
  });

  it("can click edit on a product", () => {
    cy.wait("@getProducts");
    cy.contains("Edit").first().click({ force: true });
    cy.contains("Edit Product").should("exist");
    cy.contains("Update").should("exist");
    cy.contains("Cancel").should("exist");
  });

  it("can cancel editing", () => {
    cy.wait("@getProducts");
    cy.scrollTo("bottom");
    cy.contains("Edit").first().click({ force: true });
    cy.contains("Edit Product").should("exist");
    cy.contains("button", "Cancel").click({ force: true });
    cy.contains("Add Product").should("exist");
  });

  it("shows order items and shipping info", () => {
    cy.wait("@getOrders");
    cy.contains("Items").should("exist");
    cy.contains("Shipping").should("exist");
    cy.contains("123 Main St").should("exist");
  });

  it("can change order status", () => {
    cy.intercept("PATCH", "/api/orders/*/status", {
      statusCode: 200,
      body: {},
    }).as("updateStatus");

    cy.wait("@getOrders");
    cy.get("select").eq(1).select("shipped");
  });
});
