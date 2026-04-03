describe("Home page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as(
      "getProducts",
    );
    cy.visit("/");
  });

  it("loads and displays the navbar", () => {
    cy.getBySel("navbar").should("exist");
  });

  it("displays the hero section", () => {
    cy.getBySel("hero-tagline").should("be.visible");
    cy.getBySel("hero-subtitle").should("be.visible");
  });

  it("shows featured products after loading", () => {
    cy.wait("@getProducts");
    cy.getBySel("featured-product").should("exist");
    cy.getBySel("product-price").should("exist");
  });

  it("shows category links", () => {
    cy.getBySel("category-heading").scrollIntoView().should("be.visible");
    cy.getBySel("category-smartphone").should("be.visible");
    cy.getBySel("category-accessories").should("be.visible");
    cy.getBySel("category-tablets").should("be.visible");
  });

  it("shows guest CTA buttons when not logged in", () => {
    cy.getBySel("get-started-btn").should("be.visible");
    cy.getBySel("browse-btn").should("be.visible");
  });
});
