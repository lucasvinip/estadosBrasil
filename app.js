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
// boa pratica colocar a versao no endPoint
app.get('/v1/senai/estados', cors(), async function(request, response, next){

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
app.get('/v1/senai/estado/sigla/:uf', cors(), async function(request, response, next){
   
    //:uf - é uma variael que sera utilizada para passagens de valores, na URL da requisiçao

    // recebe o valor da variavel uf, que sera encaminhada na url da requisiçao
    let siglaEstado = request.params.uf
    let statusCode
    let dadosEstado = {}

    // Tratamento para valida encaminhados no parametro
    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message =  'Não é possivel processar a requisição o paremetro esta errada'
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
app.get('/v1/senai/estado/capital/sigla/:uf', cors(), async function(request, response, next){

    let siglaEstado = request.params.uf
    let statusCode
    let dadosEstado = {}

    if(siglaEstado == '' || siglaEstado == undefined || siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstado.message =  'Não é possivel processar a requisição o paremetro esta errada'
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

//endPoint para estado filtrado pela regiao
app.get('/v1/senai/estado/regiao/:regiao', cors(), async function(request, response, next){
    
    let regiao = request.params.regiao
    let statusCode
    let dadosRegiao = {}

    if(regiao == '' || regiao == undefined || !isNaN(regiao)){
        statusCode = 400
        dadosRegiao.message =  'Não é possivel processar a requisição o paremetro esta errada'
    }
    else{
        let estado = estadosCidades.getEstadosRegiao(regiao)

        if(estado){
            statusCode = 200
            dadosRegiao = estado
        }
        else
            statusCode = 404
    }
    
    response.status(statusCode)
    response.json(dadosRegiao)
})

//endPoint para Listar as capitais do pais
app.get('/v1/senai/estado/capital/pais', cors(), async function(request, response, next){
    
    let listaCapitalPais = estadosCidades.getCapitalPais()
    let statusCode

    if(listaCapitalPais){
        response.json(listaCapitalPais)
        statusCode = 200
    }
    else
        statusCode = 500
    
    response.status(statusCode)
})

//endPoint Lista de cidades filtrada pela sigla do estado
app.get('/v1/senai/cidades', cors(), async function(request, response, next){

    /*** Recebe o valor da variavel que sera enviada por QueryString
     *  Ex: www.uol.com.br?uf=sp
     *  antes do ponto de interrogaçao '?' é o endereço do site,
     *  depois do '?' sao varieveis
     * 
     *  Diferença entre Query e params
     *  Usamos query para recebr diversos variaveis para realizar filtros;
     *  Usamos o params para receber ID (PK), geralmente
     *      para fazer put, delete e get
     *
     */
    let siglaEstado = request.query.uf
    let statusCode
    let dadosEstadoCidades = {}

    if(siglaEstado == '' || siglaEstado == undefined ||siglaEstado.length != 2 || !isNaN(siglaEstado)){
        statusCode = 400
        dadosEstadoCidades.message =  'Não é possivel processar a requisição o paremetro esta errada'
    }
    else{
        let cidades = estadosCidades.getCidades(siglaEstado)
        
        if(cidades){
            statusCode = 200
            dadosEstadoCidades = cidades
        }
        else
            statusCode = 404
    }

    response.status(statusCode)
    response.json(dadosEstadoCidades)
})

//endPoint versao 2 para Listar os Estados com mais detalhes/exemplo
app.get('/v2/senai/cidades', cors(), async function(request, response, next){

})

/*
    Permite carregar os endPoints criados e aguardar as requisiçoes
 pelo ponto HTTP na porta 8080   
*/  
app.listen(8080, function(){
    console.log('Servidor aguardando requisições na porta 8080.')
})