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
    cy.contains("The gear you need.").should("be.visible");
    cy.getBySel("hero-subtitle").should("be.visible");
  });

  it("shows featured products after loading", () => {
    cy.wait("@getProducts");
    cy.contains("iPhone 15 Pro").should("exist");
    cy.contains("$999.99").should("exist");
  });

  it("shows category links", () => {
    cy.getBySel("category-heading").scrollIntoView().should("be.visible");
    cy.contains("Smartphones").should("be.visible");
    cy.contains("Accessories").should("be.visible");
    cy.contains("Tablets").should("be.visible");
  });

  it("shows guest CTA buttons when not logged in", () => {
    cy.getBySel("get-started-btn").should("be.visible");
    cy.getBySel("browse-btn").should("be.visible");
  });
});
