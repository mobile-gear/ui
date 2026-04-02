describe("Products page - filters and interactions", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.visit("/products");
    cy.wait("@getProducts");
  });

  it("applies search filter", () => {
    cy.get('input[placeholder="Search products..."]').type("iPhone");
    cy.contains("Apply Filters").click();
  });

  it("applies price filters", () => {
    cy.get("#minPrice").type("100");
    cy.get("#maxPrice").type("1000");
    cy.contains("Apply Filters").click();
  });

  it("sorts by price", () => {
    cy.contains("Price").click();
  });

  it("toggles sort order on double click", () => {
    cy.contains("Price").click();
    cy.contains("Price").click();
  });

  it("clears sort on triple click", () => {
    cy.contains("Price").click();
    cy.contains("Price").click();
    cy.contains("Price").click();
  });

  it("changes category filter", () => {
    cy.get("#category").select("smartphone");
    cy.wait("@getProducts");
  });

  it("navigates to product detail on click", () => {
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" });
    cy.contains("iPhone 15 Pro").click();
    cy.url().should("include", "/products/1");
  });

  it("adds product to cart from listing", () => {
    cy.contains("Add to cart").first().click();
  });

  it("shows page number in URL", () => {
    cy.url().should("include", "page=1");
  });
});

describe("Product detail - interactions", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" }).as("getProduct");
    cy.visit("/products/1");
    cy.wait("@getProduct");
  });

  it("increments quantity", () => {
    cy.contains("+").click();
    cy.get("#quantity").should("have.value", "2");
  });

  it("decrements quantity (min 1)", () => {
    cy.contains("+").click();
    cy.contains("−").click();
    cy.get("#quantity").should("have.value", "1");
  });

  it("adds multiple items to cart", () => {
    cy.contains("+").click();
    cy.contains("+").click();
    cy.contains("Add to Cart").click();
  });
});
