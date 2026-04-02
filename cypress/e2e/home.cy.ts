describe("Home page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as(
      "getProducts",
    );
    cy.visit("/");
  });

  it("loads and displays the navbar", () => {
    cy.get("nav").should("exist");
  });

  it("displays the hero section", () => {
    cy.contains("The gear you need.").should("be.visible");
    cy.contains("The signal you send.").should("be.visible");
  });

  it("shows featured products after loading", () => {
    cy.wait("@getProducts");
    cy.contains("iPhone 15 Pro").should("exist");
    cy.contains("$999.99").should("exist");
  });

  it("shows category links", () => {
    cy.contains("Shop by Category").scrollIntoView().should("be.visible");
    cy.contains("Smartphones").should("be.visible");
    cy.contains("Accessories").should("be.visible");
    cy.contains("Tablets").should("be.visible");
  });

  it("shows guest CTA buttons when not logged in", () => {
    cy.contains("Get Started").should("be.visible");
    cy.contains("Browse").should("be.visible");
  });
});
