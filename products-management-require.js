var seneca = require('seneca')().use('products-storage')

var products =  {
    product: "Laptop",
    price: "201.99",
    category: "PC"
}

function add_products() {
    seneca.act({role: 'products', cmd: 'add', data: products}, function (err, msg) {
        console.log(msg);
    });
}

add_products();
