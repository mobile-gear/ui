describe("Products page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.visit("/products");
  });

  it("displays the products heading", () => {
    cy.contains("Products").should("exist");
  });

  it("shows product cards after loading", () => {
    cy.wait("@getProducts");
    cy.contains("iPhone 15 Pro").should("exist");
    cy.contains("$999.99").should("exist");
    cy.contains("Samsung Galaxy S24").should("exist");
  });

  it("has a search input", () => {
    cy.get('input[placeholder="Search products..."]').should("exist");
  });

  it("has category filter", () => {
    cy.get("#category").should("exist");
    cy.get("#category").select("smartphone");
  });

  it("has price filter inputs", () => {
    cy.get("#minPrice").should("exist");
    cy.get("#maxPrice").should("exist");
  });

  it("has Apply Filters button", () => {
    cy.contains("Apply Filters").should("exist");
  });

  it("shows Add to cart buttons", () => {
    cy.wait("@getProducts");
    cy.contains("Add to cart").should("exist");
  });
});

describe("Product detail page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" }).as("getProduct");
    cy.visit("/products/1");
  });

  it("displays product details", () => {
    cy.wait("@getProduct");
    cy.contains("iPhone 15 Pro").should("exist");
    cy.contains("$999.99").should("exist");
    cy.contains("smartphone").should("exist");
    cy.contains("25 in stock").should("exist");
  });

  it("has quantity controls", () => {
    cy.wait("@getProduct");
    cy.get("#quantity").should("exist");
    cy.contains("Add to Cart").should("exist");
  });
});
