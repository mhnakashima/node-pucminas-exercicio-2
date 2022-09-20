const express = require('express')
const app = express()
const port = 3000

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
    res.status(200).json(lista_produtos)
})

app.get(endpoint + 'produtos/:id', function (req, res) {
    const product = lista_produtos.produtos.find(p => p.id == req.params.id)
    if (!product) {
        return res.status(404).json();
    }
    res.status(200).json(product)
})

app.put(endpoint + 'produtos/:id', function (req, res) {
    const product = req.body;
    const id = req.params.id;

    const old_product = lista_produtos.produtos.find(p => p.id == req.params.id)
    const index = lista_produtos.produtos.indexOf(old_product);

    lista_produtos.produtos[index] = {
        ...product,
        id
    };

    res.status(200).json(product)
})

app.delete(endpoint + 'produtos/:id', function (req, res) {
    const old_product = lista_produtos.produtos.find(p => p.id == req.params.id)
    const index = lista_produtos.produtos.indexOf(old_product);

    if (index > -1) {
        lista_produtos.produtos.splice(index, 1);
    }

    res.status(204).json()
})

app.post(endpoint + 'produtos', function (req, res) {
    const product = req.body;
    const id = lista_produtos.produtos.length + 1;
    lista_produtos.produtos.push({
        ...product,
        id
    });
    res.status(200).json(lista_produtos)
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = apiRouter;