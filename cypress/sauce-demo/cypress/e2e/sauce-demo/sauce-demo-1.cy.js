describe('sauce-demo', () => {
  const standardUser = Cypress.env('standard');
  const username = standardUser.username;
  const password = standardUser.password;

  beforeEach(() => {
    cy.intercept('/service-worker.js', {
      body: undefined
     });

    cy.visit('/');
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.location('pathname').should('eq', '/inventory.html');
  });

  it('asserts user is logged in', () => {
    cy.location('pathname').should('eq', '/inventory.html');
    cy.get('.app_logo').should('have.text', 'Swag Labs');
  });

  it('asserts user can add an item and checkout', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()

    cy.location('pathname').should('eq', '/cart.html')
    cy.get('[data-test="checkout"]').click()

    cy.location('pathname').should('eq', '/checkout-step-one.html')
    cy.get('[data-test="firstName"]').type('foo')
    cy.get('[data-test="lastName"]').type('bar')
    cy.get('[data-test="postalCode"]').type('12345')
    cy.get('[data-test="continue"]').click()

    cy.location('pathname').should('eq', '/checkout-step-two.html')
    cy.get('[data-test="finish"]').click()

    cy.location('pathname').should('eq', '/checkout-complete.html')
    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!')
  });

  it('asserts user can add multiple items, remove some items, and checkout', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click()
    cy.get('[data-test="shopping-cart-link"]').click()

    cy.location('pathname').should('eq', '/cart.html')
    cy.get('[data-test="remove-sauce-labs-bike-light"]').click()
    cy.get('[data-test="checkout"]').click()

    cy.location('pathname').should('eq', '/checkout-step-one.html')
    cy.get('[data-test="firstName"]').type('foo')
    cy.get('[data-test="lastName"]').type('bar')
    cy.get('[data-test="postalCode"]').type('12345')
    cy.get('[data-test="continue"]').click()

    cy.location('pathname').should('eq', '/checkout-step-two.html')
    cy.get('[data-test="finish"]').click()

    cy.location('pathname').should('eq', '/checkout-complete.html')
    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!')
  });

  it('asserts the user logs out successfully', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('[data-test="logout-sidebar-link"]').click()
    cy.location('pathname').should('eq', '/')
    cy.getCookies().should('have.length', 0);
  })


});
