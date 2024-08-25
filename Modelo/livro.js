import livroDAO from "../Persistencia/livroDAO.js";
import Autor from "./autor.js"

export default class Livro{
    #codigo;
    #descricao;
    #preco;
    #qtdEstoque;
    #autor;


    constructor(codigo=0,descricao="", preco=0, 
                qtdEstoque=0, autor = null
                ){
        this.#codigo=codigo;
        this.#descricao=descricao;
        this.#preco=preco;
        this.#qtdEstoque=qtdEstoque;
        this.#autor=autor;
    }

    get codigo(){
        return this.#codigo;
    }
    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDesc){
        this.#descricao=novaDesc;
    }

    get preco(){
        return this.#preco;
    }

    set preco(novoPreco){
        this.#preco = novoPreco
    }

    get qtdEstoque(){
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd){
        this.#qtdEstoque = novaQtd;
    }

    get autor(){
        return this.#autor;
    }

    set autor(novaAut){
        if (novaAut instanceof Autor){
        this.#autor = novaAut;
        }
    }


    toJSON(){
        return {
            codigo:this.#codigo,
            descricao:this.#descricao,
            precoCusto:this.#preco,
            qtdEstoque:this.#qtdEstoque,
            autor:this.#autor
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const livDAO = new LivroDAO();
        await livDAO.gravar(this);
     }
 
     async excluir(){
        const livDAO = new LivroDAO();
        await livDAO.excluir(this);
     }
 
     async alterar(){
        const livDAO = new LivroDAO();
        await livDAO.atualizar(this);
     }
 
     async consultar(termo){
        const livDAO = new LivroDAO();
        return await livDAO.consultar(termo);
     }

}