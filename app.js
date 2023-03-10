/****
 * Objetivo: Criar uma API para manipulaçao de dados de Estado e Cidades
 * Autor: Lucas Vinicius
 * Data: 10/03/2023
 * Versao: 1.0
 */

/* Express - depencia do Node, que permite a integraçao entre o protocolo http com o codigo
 *      npm install express --save
 *      
 * Cors - gerenciador de permissoes para protocolo HTTP 
 *      npm install cors --save 
 * 
 * Body-parser - é uma depedencia que permite manipular dados enviados pelo body da requisiçao
 *      npm install body-parser --save
 */

//Import das dependencias para criar a API

//reponsavel pelas requisiçoes
const express = require('express')

//reponsavel pelas permissoes das requisiçoes
const cors = require('cors')

//responsavel pela manipulacao do body da requisiçao
const bodyParser = require('body-parser')


//cria um objeto com as informaçoes da classe express
const app = express()

app.use((request, response, next) =>{
    /* Permite gerenciar a origem das requisiçoes
       * - significa que a API sera publica
       IP - se colocar o IP, a API somente respondera para aquela maquina 
    */
    response.header('Access-Control-Allow-Origin', '*')

    //Permite gerenciar quais metodos (verbos) poderao fazer requisiçao     
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Ativa no cors das requisiçoes as permissoes estabelecidas
    app.use(cors())

    next()
})

//endPoints

//endPoint para Listar os Estados
app.get('/estados', cors(), async function(request, response, next){

    const estadosCidades = require('./modulo/estados_cidades.js')

    let listaDeEstados = estadosCidades.getListaDeEstados()

    response.json(listaDeEstados)
    response.status(200)

})

/*
    Permite carregar os endPoints criados e aguardar as requisiçoes
 pelo ponto HTTP na porta 8080   
*/  
app.listen(8080, function(){
    console.log('Servidor aguardando requisições na porta 8080.')
})