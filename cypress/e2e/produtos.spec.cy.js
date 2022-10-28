/// <reference types="cypress" />
import contrato from "../contracts/produtos.contract";

describe("Testes da Funcionalidade Produtos", () => {
  let token;
  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Deve validar contrato de produtos", () => {
    cy.request("produtos").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Listar produtos", () => {
    cy.request({
      method: "GET",
      url: "produtos",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("produtos");
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Cadastrar produto", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
    cy.cadastrarProduto(
      token,
      produto,
      250,
      "Descrição do produto novo",
      100
    ).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar mensagem de erro ao cadastrar produto repetido", () => {
    cy.cadastrarProduto(
      token,
      "Produto EBAC novo",
      250,
      "Descrição do produto novo",
      100
    ).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq("Já existe produto com esse nome");
    });
  });

  it("Deve editar um produto já cadastrado", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
    cy.request("produtos").then((response) => {
      let id = response.body.produtos[0]._id;
      cy.request({
        method: "PUT",
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          nome: produto,
          preco: 100,
          descricao: "Produto editado",
          quantidade: 100,
        },
      }).then((response) => {
        expect(response.body.message).to.eq("Registro alterado com sucesso");
      });
    });
  });

  it("Deve editar um produto cadastrado previamente", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
    cy.cadastrarProduto(
      token,
      produto,
      250,
      "Descrição do produto novo",
      100
    ).then((response) => {
      let id = response.body._id;

      cy.request({
        method: "PUT",
        url: `produtos/${id}`,
        headers: { authorization: token },
        body: {
          nome: produto,
          preco: 100,
          descricao: "Produto editado",
          quantidade: 100,
        },
      }).then((response) => {
        expect(response.body.message).to.eq("Registro alterado com sucesso");
      });
    });
  });

  it("Deve deletar um produto previamente cadastrado", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
    cy.cadastrarProduto(
      token,
      produto,
      250,
      "Descrição do produto novo",
      100
    ).then((response) => {
      let id = response.body._id;
      cy.request({
        method: "DELETE",
        url: `produtos/${id}`,
        headers: { authorization: token },
      }).then((response) => {
        expect(response.body.message).to.eq("Registro excluído com sucesso");
        expect(response.status).to.eq(200);
      });
    });
  });
});
