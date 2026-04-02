describe("Login page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.visit("/login");
  });

  it("displays the login form", () => {
    cy.contains("Welcome back").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.contains("Sign in").should("exist");
  });

  it("shows validation errors for empty submit", () => {
    cy.get("#email").click();
    cy.get("#password").click();
    cy.get("#email").click();
    cy.contains("Email is required").should("exist");
  });

  it("shows invalid email error", () => {
    cy.get("#email").type("notanemail");
    cy.get("#password").click();
    cy.contains("Invalid email address").should("exist");
  });

  it("submits and redirects on successful login", () => {
    cy.intercept("POST", "/api/auth/login", { fixture: "user.json" }).as("login");

    cy.get("#email").type("john@test.com");
    cy.get("#password").type("password123");
    cy.contains("Sign in").click();

    cy.wait("@login");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("has a link to register page", () => {
    cy.contains("Register here").click();
    cy.url().should("include", "/register");
  });
});
