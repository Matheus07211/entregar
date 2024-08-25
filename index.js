import express from 'express';
import cors from 'cors';
import rotaAutor from './Rotas/rotaAutor.js';
import rotaLivro from './Rotas/rotaLivro.js';

const host='0.0.0.0';
const porta=3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/categoria',rotaAutor);
app.use('/produto',rotaLivro);

app.listen(porta, host, ()=>{
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
})
