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

// import do arquivo de funcoes
const estadosCidades = require('./modulo/estados_cidades.js')

//cria um objeto com as informaçoes da classe express
const app = express()

//Defini as premissoes no hearder da API
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

    // chama a funcao que retorna os estados
    let listaDeEstados = estadosCidades.getListaDeEstados()
    
    // Tratamento para validar se a funcao realizou o processamento
    if(listaDeEstados){
        // retorna o Json e o Status code
        response.json(listaDeEstados)
        response.status(200)
    }
    else{
        response.status(500)
    }

    

})

//endPoint para as caracteristicas do estado pela sigla
app.get('/estado/sigla/:uf', cors(), async function(request, response, next){
   
    //:uf - é uma variael que sera utilizada para passagens de valores, na URL da requisiçao

    // recebe o valor da variavel uf, que sera encaminhada na url da requisiçao
    let siglaEstado = request.params.uf
    let statusCode
    let dadosEstado = {}

    // Tratamento para valida encaminhados no parametro
    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message =  'Não é possivel processar a requisição a sliga esta errada'
    }
    else{
        //chama a funcao que filtra o estado na sliga
        let estado = estadosCidades.getDadosEstado(siglaEstado)
        
        //Validar se houve retorno valido da funcao
        if(estado){
            statusCode = 200 // estado encontrado
            dadosEstado = estado
        }
        else
            statusCode = 404// estado nao encontrado
    }

    response.status(statusCode)
    response.json(dadosEstado)
})

//endPoint para as capitais do estado pela sigla
app.get('/estado/capital/sigla/:uf', cors(), async function(request, response, next){

    let siglaEstado = request.params.uf
    let statusCode
    let dadosEstado = {}

    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message =  'Não é possivel processar a requisição a sliga esta errada'
    }
    else{
        let estado = estadosCidades.getCapitalEstado(siglaEstado)
        
        if(estado){
            statusCode = 200
            dadosEstado = estado
        }
        else
        statusCode = 404
    }

    response.status(statusCode)
    response.json(dadosEstado)
})

/*
    Permite carregar os endPoints criados e aguardar as requisiçoes
 pelo ponto HTTP na porta 8080   
*/  
app.listen(8080, function(){
    console.log('Servidor aguardando requisições na porta 8080.')
})