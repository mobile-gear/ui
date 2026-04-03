describe("Admin Dashboard", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ id: 2, firstName: "Admin", lastName: "User", email: "admin@test.com", role: "admin" }));
    
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.intercept("GET", "/api/orders*", { fixture: "orders.json" }).as("getOrders");
    
    cy.intercept("GET", "/api/products*").as("productsReady");
    cy.intercept("GET", "/api/orders*").as("ordersReady");
    
    cy.visit("/admin");
  });

  it("displays orders section", () => {
    cy.wait(["@getOrders", "@getProducts"], { timeout: 10000 });
    
    cy.getBySel("admin-orders-heading").should("exist");
    cy.getBySel("order-number").should("exist");
    cy.getBySel("order-total").should("exist");
  });

  it("has status filter dropdown", () => {
    cy.wait(["@getOrders", "@getProducts"], { timeout: 10000 });
    cy.getBySel("status-filter").should("exist");
    cy.getBySel("status-filter").select("pending");
  });

  it("displays products section", () => {
    cy.wait(["@getOrders", "@getProducts"], { timeout: 10000 });
    cy.getBySel("admin-products-heading").should("exist");
    cy.getBySel("product-name").should("exist");
  });

  it("shows add/edit product form", () => {
    cy.wait(["@getOrders", "@getProducts"], { timeout: 10000 });
    cy.getBySel("add-product-btn").should("exist");
    cy.getBySel("product-name").should("exist");
    cy.getBySel("product-description").should("exist");
    cy.getBySel("product-price").should("exist");
    cy.getBySel("product-stock").should("exist");
  });

  it("fills and submits the add product form", () => {
    cy.intercept("POST", "/api/products", {
      statusCode: 200,
      body: { id: 5, name: "New Phone", description: "A new phone", price: 499, category: "smartphone", stock: 20, img: "/new.jpg" },
    }).as("createProduct");

    cy.getBySel("product-name").type("New Phone");
    cy.getBySel("product-category").select("smartphone");
    cy.getBySel("product-price").type("499");
    cy.getBySel("product-stock").type("20");
    cy.getBySel("product-description").type("A new phone");
    cy.getBySel("product-img").type("/new.jpg");
    cy.get('form button[type="submit"]').click();

    cy.wait("@createProduct");
  });

  it("can click edit on a product", () => {
    cy.wait("@getProducts");
    cy.getBySel("edit-product").first().click({ force: true });
    cy.getBySel("add-product-title").should("exist");
    cy.getBySel("update-product-btn").should("exist");
    cy.getBySel("cancel-edit-btn").should("exist");
  });

  it("can cancel editing", () => {
    cy.wait("@getProducts");
    cy.scrollTo("bottom");
    cy.getBySel("edit-product").first().click({ force: true });
    cy.getBySel("add-product-title").should("exist");
    cy.getBySel("cancel-edit-btn").click({ force: true });
    cy.getBySel("add-product-btn").should("exist");
  });

  it("shows order items and shipping info", () => {
    cy.wait("@getOrders");
    cy.getBySel("order-items-section").should("exist");
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
