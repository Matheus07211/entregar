import Livro from "../Modelo/livro.js";
import Autor from "../Modelo/autor.js";

export default class LivroCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const aut_codigo = dados.autor.codigo;

            if (descricao && preco > 0 && qtdEstoque >= 0 && aut_codigo > 0) {
                const autor = new Autor(aut_codigo);
                const livro = new Livro(0, descricao, preco,
                qtdEstoque, autor
                );
                //resolver a promise
                livro.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": livro.codigo,
                        "mensagem": "Livro incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o livro:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, os dados do livro segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um livro!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const aut_codigo = dados.autor.codigo;

            if (codigo && descricao && preco > 0 && qtdEstoque >= 0 && aut_codigo > 0) {
                const autor = new Autor(aut_codigo);
                const livro = new Livro(codigo, descricao, preco,
                    qtdEstoque, autor);
                //resolver a promise
                livro.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o livro:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados do livro segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um livro!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const livro = new Livro(codigo);
                //resolver a promise
                livro.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Livro excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o livro:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do livro!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um livro!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        //express, por meio do controle de rotas, será
        //preparado para esperar um termo de busca
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const livro = new Livro();
            livro.consultar(termo).then((listaLivros) => {
                resposta.json(
                    {
                        status: true,
                        listaLivros
                    });
            })
                .catch((erro) => {
                    resposta.json(
                        {
                            status: false,
                            mensagem: "Não foi possível obter os livros: " + erro.message
                        }
                    );
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar livros!"
            });
        }
    }
}