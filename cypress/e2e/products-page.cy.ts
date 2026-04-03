describe("Products page - filters and interactions", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.visit("/products");
    cy.wait("@getProducts");
  });

  it("applies search filter", () => {
    cy.getBySel("search-input").type("iPhone");
    cy.getBySel("apply-filters").click();
  });

  it("applies price filters", () => {
    cy.getBySel("min-price").type("100");
    cy.getBySel("max-price").type("1000");
    cy.getBySel("apply-filters").click();
  });

  it("sorts by price", () => {
    cy.getBySel("sort-price").click();
  });

  it("toggles sort order on double click", () => {
    cy.getBySel("sort-price").click();
    cy.getBySel("sort-price").click();
  });

  it("clears sort on triple click", () => {
    cy.getBySel("sort-price").click();
    cy.getBySel("sort-price").click();
    cy.getBySel("sort-price").click();
  });

  it("changes category filter", () => {
    cy.getBySel("category-filter").select("smartphone");
    cy.wait("@getProducts");
  });

  it("navigates to product detail on click", () => {
    cy.intercept("GET", "/api/products/1", { fixture: "product-detail.json" });
    cy.getBySel("product-name").click();
    cy.url().should("include", "/products/1");
  });

  it("adds product to cart from listing", () => {
    cy.getBySel("add-to-cart").first().click();
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
    cy.getBySel("qty-increment").click();
    cy.getBySel("quantity-input").should("have.value", "2");
  });

  it("decrements quantity (min 1)", () => {
    cy.getBySel("qty-increment").click();
    cy.getBySel("qty-decrement").click();
    cy.getBySel("quantity-input").should("have.value", "1");
  });

  it("adds multiple items to cart", () => {
    cy.getBySel("qty-increment").click();
    cy.getBySel("qty-increment").click();
    cy.getBySel("add-to-cart").click();
  });
});
