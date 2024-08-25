import Livro from '../Modelo/livro.js';
import Autor from '../Modelo/autor.js';
import conectar from './conexao.js';

export default class LivroDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS livro(
                liv_codigo INT NOT NULL AUTO_INCREMENT,
                liv_descricao VARCHAR(100) NOT NULL,
                liv_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
                liv_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                aut_codigo INT NOT NULL,
                CONSTRAINT pk_livro PRIMARY KEY(liv_codigo),
                CONSTRAINT fk_autor FOREIGN KEY(aut_codigo) REFERENCES autor(aut_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(livro) {
        if (livro instanceof Livro) {
            const sql = `INSERT INTO livro(liv_descricao, liv_preco, liv_qtdEstoque, aut_codigo)
                VALUES(?,?,?,?)`;
            const parametros = [livro.descricao, livro.preco, livro.qtdEstoque, livro.autor.codigo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            livro.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(livro) {
        if (livro instanceof Livro) {
            const sql = `UPDATE livro SET liv_descricao = ?, liv_preco = ?, liv_qtdEstoque = ?, aut_codigo = ?
            WHERE liv_codigo = ?`;
            const parametros = [livro.descricao, livro.preco, livro.qtdEstoque, livro.autor.codigo, livro.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(livro) {
        if (livro instanceof Livro) {
            const sql = `DELETE FROM livro WHERE liv_codigo = ?`;
            const parametros = [livro.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo){
            termo="";
        }
        //termo é um número
        const conexao = await conectar();
        let listaLivros = [];
        if (!isNaN(parseInt(termo))){
            //consulta pelo código do livro
            const sql = `SELECT l.liv_codigo, l.liv_descricao,
              l.liv_preco, l.liv_qtdEstoque, a.aut_codigo, a.aut_nome
              FROM livro l
              INNER JOIN autor a ON l.aut_codigo = a.aut_codigo
              WHERE l.liv_codigo = ?
              ORDER BY l.liv_descricao ;              
            `;
            const parametros=[termo];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const livro = new Livro(registro.liv_codigo,registro.liv_descricao,
                                            registro.liv_preco, registro.liv_qtdEstoque
                                            );
                listaLivros.push(livro);
            }
        }
        else
        {
            //consulta pelo termo
            const sql = `SELECT l.liv_codigo, l.liv_descricao,
                         l.liv_preco, l.liv_qtdEstoque, a.aut_codigo, a.aut_nome
                         FROM livro l
                         INNER JOIN autor a ON l.aut_codigo = a.aut_codigo
                         WHERE l.liv_descricao like ?
                         ORDER BY l.liv_descricao`;
            const parametros=['%'+termo+'%'];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const autor = new Autor(registro.aut_codigo, registro.aut_nome);
                const livro = new Livro(registro.liv_codigo,registro.liv_descricao,
                                            registro.liv_preco, registro.liv_qtdEstoque,
                                            autor
                                            );
                listaLivros.push(livro);
            }
        }

        return listaLivros;
    }
}