const express = require('express')
const app = express()
const port = 3000

const knex = require('knex')({ 
    client: 'pg', 
    debug: true, 
    connection: { 
        connectionString : process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false }, 
      } 
}); 

let apiRouter = express.Router()

const endpoint = '/'
const lista_produtos = {
    produtos: [{
            id: 1,
            descricao: "Arroz parboilizado 5Kg",
            valor: 25.00,
            marca: "Tio João"
        },
        {
            id: 2,
            descricao: "Maionese 250gr",
            valor: 7.20,
            marca: "Helmans"
        },
        {
            id: 3,
            descricao: "Iogurte Natural 200ml",
            valor: 2.50,
            marca: "Itambé"
        },
        {
            id: 4,
            descricao: "Batata Maior Palha 300gr",
            valor: 15.20,
            marca: "Chipps"
        },
        {
            id: 5,
            descricao: "Nescau 400gr",
            valor: 8.00,
            marca: "Nestlé"
        },
    ]
}

app.get(endpoint, function (req, res) {
    res.send('index');
})

app.get(endpoint + 'produtos', function (req, res) {
    knex.select('*').from('produto') 
    .then( produtos => res.status(200).json(produtos) ) 
    .catch(err => { 
        res.status(500).json({  
           message: 'Erro ao recuperar produtos - ' + err.message }) 
    })   
})

app.get(endpoint + 'produtos/:id', function (req, res) {
    knex.select('*').from('produto') 
    .then( produtos => {
        const product = produtos.produtos.find(p => p.id == req.params.id)

        if (!product) {
            return res.status(404).json();
        }
        res.status(200).json(product)
    }) 
    .catch(err => { 
        res.status(500).json({  
           message: 'Erro ao recuperar produtos - ' + err.message }) 
    })   
})

app.put(endpoint + 'produtos/:id', function (req, res) {
    knex.select('*').from('produto') 
    .then( produtos => {
        const product = req.body;
        const id = req.params.id;

        const old_product = produtos.find(p => p.id == req.params.id)
        const index = produtos.indexOf(old_product);

        produtos[index] = {
            ...product,
            id
        };

        res.status(200).json(product)
    }) 
    .catch(err => { 
        res.status(500).json({  
           message: 'Erro ao atualizar produto - ' + err.message }) 
    })
})

app.delete(endpoint + 'produtos/:id', function (req, res) {
    
    knex.select('*').from('produto') 
    .then( produtos => {
        const old_product = produtos.find(p => p.id == req.params.id)
        const index = produtos.indexOf(old_product);

        if (index > -1) {
            produtos.splice(index, 1);
        }

        res.status(204).json()
    }) 
    .catch(err => { 
        res.status(500).json({  
           message: 'Erro ao deletar produtos - ' + err.message }) 
    })
})

app.post(endpoint + 'produtos', function (req, res) {
    knex.select('*').from('produto') 
    .then( produtos => {
        const product = req.body;
        const id = produtos.length + 1;

        produtos.push({
            ...product,
            id
        });
        res.status(200).json(lista_produtos)
    }) 
    .catch(err => { 
        res.status(500).json({  
           message: 'Erro ao cadastrar produto - ' + err.message }) 
    })
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = apiRouter;