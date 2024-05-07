// LoginForm.spec.js
describe('Login Form E2E Testing', () => {
  beforeEach(() => {
    // Define the base URL from your configuration
    cy.visit('https://nbad-frontend.vercel.app/login');
  });

  it('should display the login form', () => {
    cy.get('form').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('allows user to enter email and password', () => {
    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password');

    cy.get('input#email').should('have.value', 'bharadwaaja43@gmail.com');
    cy.get('input#password').should('have.value', 'Ballu@4321');
  });

  it('submits the form and navigates to dashboard on successful login', () => {
    // Mock the backend response
    cy.intercept('POST', '**/user/signin', {
      statusCode: 200,
      body: {
        user: { name: 'John Doe' },
        token: 'fake_token',
        refreshToken: 'fake_refresh_token'
      }
    }).as('loginRequest');

    cy.get('input#email').type('test@example.com');
    cy.get('input#password').type('password');
    cy.get('button[type="submit"]').click();

    // Check if the request body is as expected
    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'bharadwaaja43@gmail.com',
      password: 'Ballu@4321'
    });

    // Simulate successful login and check navigation
    cy.url().should('include', '/dashboard');
  });

  it('shows an error message on login failure', () => {
    // Mock the backend response for failure
    cy.intercept('POST', '**/user/signin', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('loginFailure');

    cy.get('input#email').type('wrong@example.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailure');
    cy.get('.Toastify').should('contain', 'Invalid credentials');
  });
});
