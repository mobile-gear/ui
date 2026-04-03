describe("Register page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/products*", { fixture: "products.json" }).as("getProducts");
    cy.visit("/register");
  });

  it("displays the registration form", () => {
    cy.wait(1000);
    
    cy.getBySel("register-title").should("exist");
    cy.get("#firstName").should("exist");
    cy.get("#lastName").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.get("#confirmPassword").should("exist");
  });

  it("shows validation error for short password", () => {
    cy.wait(1000);
    cy.get("#password").type("short");
    cy.get("#confirmPassword").click();
    cy.contains("Password must be at least 8 characters").should("exist");
  });

  it("shows mismatch error for passwords", () => {
    cy.wait(1000);
    cy.get("#password").type("password123");
    cy.get("#confirmPassword").type("different");
    cy.get("#firstName").click();
    cy.contains("Passwords must match").should("exist");
  });

  it("submits the form when all fields are valid", () => {
    cy.wait(1000);
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 200,
      body: {
        id: 3,
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      },
    }).as("registerUser");

    cy.get("#firstName").type("Test");
    cy.get("#lastName").type("User");
    cy.get("#email").type("test@example.com");
    cy.get("#password").type("password123");
    cy.get("#confirmPassword").type("password123");

    cy.get('[data-test="register-submit"]').click();
    cy.wait("@registerUser");
  });

  it("has a link to login page", () => {
    cy.contains("Sign in here").click();
    cy.url().should("include", "/login");
  });
});
