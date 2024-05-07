describe('Login Page Visual Test', () => {
    it('should look good', () => {
      cy.visit('https://nbad-frontend.vercel.app/login');
      cy.eyesOpen({
        appName: 'MyApp',
        testName: 'Login Page Test',
        browser: { width: 800, height: 600 }
      });
      cy.eyesCheckWindow('Login Page');
      cy.eyesClose();
    });
  });
  