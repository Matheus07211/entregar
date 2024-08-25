import { Router } from "express";
import LivroCtrl from "../Controle/livroCtrl.js";

const livCtrl = new LivroCtrl();
const rotaLivro = new Router();

rotaProduto
.get('/', livCtrl.consultar)
.get('/:termo', livCtrl.consultar)
.post('/', livCtrl.gravar)
.patch('/', livCtrl.atualizar)
.put('/', livCtrl.atualizar)
.delete('/', livCtrl.excluir);

export default rotaLivro;