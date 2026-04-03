describe("Register page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" });
    cy.visit("/register");
  });

  it("displays the registration form", () => {
    cy.getBySel("register-title").should("exist");
    cy.get("#firstName").should("exist");
    cy.get("#lastName").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.get("#confirmPassword").should("exist");
  });

  it("shows validation error for short password", () => {
    cy.get("#password").type("short");
    cy.get("#confirmPassword").click();
    cy.contains("Password must be at least 8 characters").should("exist");
  });

  it("shows mismatch error for passwords", () => {
    cy.get("#password").type("password123");
    cy.get("#confirmPassword").type("different");
    cy.get("#firstName").click();
    cy.contains("Passwords must match").should("exist");
  });

  it("submits the form when all fields are valid", () => {
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@test.com",
          role: "user",
        },
      },
    }).as("register");

    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("john@test.com");
    cy.get("#password").type("password123");
    cy.get("#confirmPassword").type("password123");

    cy.getBySel("register-form").submit();

    cy.wait("@register", { timeout: 10000 });
    cy.url().should("include", "/login");
  });

  it("has a link to login page", () => {
    cy.contains("Sign in here").click();
    cy.url().should("include", "/login");
  });
});
