
var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'products', cmd: 'add' }, function (msg, respond) {
        this.make('products').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'products', cmd: 'get' }, function (msg, respond) {
        this.make('products').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'products', cmd: 'get-all' }, function (msg, respond) {
        this.make('products').list$({}, respond);
    });

    seneca.add({ role: 'products', cmd: 'delete' }, function (msg, respond) {
        this.make('products').remove$(msg.data.user_id, respond);
    });


}

module.exports = plugin;




var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-user', function (args, done) {
    console.log("--> cmd:add-user");
    var products = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> products: " + JSON.stringify(products));
    seneca.act({ role: 'products', cmd: 'add', data: products }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-users', function (args, done) {
    console.log("--> cmd:get-all-users");
    seneca.act({ role: 'products', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-user', function (args, done) {
    console.log("--> cmd:get-user, args.user_id: " + args.user_id);
    seneca.act({ role: 'products', cmd: 'get', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-user', function (args, done) {
    console.log("--> cmd:delete-user, args.user_id: " + args.user_id);
    seneca.act({ role: 'products', cmd: 'delete', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-users', function (args, done) {
    done(null, { cmd: "delete-all-users" });
});

seneca.act('role:web', {
    use: {
        prefix: '/products',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-user': { GET: true },
            'get-all-users': { GET: true },
            'get-user': { GET: true, },
            'delete-user': { GET: true, }
        }
    }
})

var express = require('express');
var app = express();
app.use(require("body-parser").json())



var Seneca  = require("seneca");
var Express = require("express");
var Web     = require("seneca-web");
var seneca = Seneca();
var server = Express();


var PORT = 3009; 
  
server.listen(PORT, "127.0.0.1");



console.log("----- Requests -------------------------");
console.log("http://localhost:3009/products/add-user?product=Peter&price=Doe&category=Developer");
console.log("http://localhost:3009/products/get-all-users");
console.log("http://localhost:3009/products/get-user?user_id=1245");
console.log("http://localhost:3009/products/delete-user?user_id=1245");
