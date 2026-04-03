describe("Products page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as(
      "getProducts",
    );
    cy.visit("/products");
  });

  it("displays the products heading", () => {
    cy.getBySel("products-heading").should("exist");
  });

  it("shows product cards after loading", () => {
    cy.wait("@getProducts");
    cy.getBySel("product-name").should("exist");
    cy.getBySel("product-price").should("exist");
    cy.contains("Samsung Galaxy S24").should("exist");
  });

  it("has a search input", () => {
    cy.getBySel("search-input").should("exist");
  });

  it("has category filter", () => {
    cy.getBySel("category-filter").should("exist");
    cy.getBySel("category-filter").select("smartphone");
  });

  it("has price filter inputs", () => {
    cy.getBySel("min-price").should("exist");
    cy.getBySel("max-price").should("exist");
  });

  it("has Apply Filters button", () => {
    cy.getBySel("apply-filters").should("exist");
  });

  it("shows Add to cart buttons", () => {
    cy.wait("@getProducts");
    cy.getBySel("add-to-cart").first().should("exist");
  });
});

describe("Product detail page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/products/1", {
      fixture: "product-detail.json",
    }).as("getProduct");
    cy.visit("/products/1");
  });

  it("displays product details", () => {
    cy.wait("@getProduct");
    cy.getBySel("product-name").should("exist");
    cy.getBySel("product-price").should("exist");
    cy.contains("smartphone").should("exist");
    cy.contains("25 in stock").should("exist");
  });

  it("has quantity controls", () => {
    cy.wait("@getProduct");
    cy.getBySel("quantity-input").should("exist");
    cy.getBySel("add-to-cart").should("exist");
  });
});
