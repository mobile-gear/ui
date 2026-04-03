Cypress.Commands.add("getBySel", (selector: string, ...args: unknown[]) => {
  return cy.get(`[data-test="${selector}"]`, ...args);
});

declare global {
  namespace Cypress {
    interface Chainable {
      getBySel(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
