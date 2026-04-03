describe("Login page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.visit("/login");
  });

  it("displays the login form", () => {
    cy.getBySel("login-title").should("exist");
    cy.getBySel("login-email").should("exist");
    cy.getBySel("login-password").should("exist");
    cy.getBySel("login-submit").should("exist");
  });

  it("shows validation errors for empty submit", () => {
    cy.getBySel("login-email").click();
    cy.getBySel("login-password").click();
    cy.getBySel("login-email").click();
    cy.getBySel("email-required-error").should("exist");
  });

  it("shows invalid email error", () => {
    cy.getBySel("login-email").type("notanemail");
    cy.getBySel("login-password").click();
    cy.getBySel("email-required-error").should("exist");
  });

  it("submits and redirects on successful login", () => {
    cy.intercept("POST", "/api/auth/login", { fixture: "user.json" }).as(
      "login",
    );

    cy.getBySel("login-email").type("john@test.com");
    cy.getBySel("login-password").type("password123");
    cy.getBySel("login-submit").click();

    cy.wait("@login");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("has a link to register page", () => {
    cy.getBySel("register-link").first().click();
    cy.url().should("include", "/register");
  });
});
