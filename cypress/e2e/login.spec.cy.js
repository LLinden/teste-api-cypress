/// <reference types="cypress" />

describe("Login - Teste da API ServeRest", () => {
  it("Deve fazer login com sucesso", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/login",
      body: {
        email: "fulano@qa.com",
        password: "teste",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Login realizado com sucesso")
    });
  });
});
