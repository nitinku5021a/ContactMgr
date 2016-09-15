var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

/* for local db connection ***/
var db = mongojs('contactList', ['contactList']);

//var db = mongojs(process.env.PROD_MONGODB, ['contactList']);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/contactList', function(req, res){
console.log("app.get response");

    db.contactList.find(function(err, docs){
    //console.log(docs);
    res.json(docs);
    });

});

app.post('/contactList', function(req, res){
    console.log(req.body);
    db.contactList.insert(req.body, function(err, docs){
        res.json(docs);
    });
});

app.delete('/contactList/:id', function(req, res){
    var id = req.params.id;
    //console.log(id);
    db.contactList.remove({_id: mongojs.ObjectId(id)}, function(err, docs){
        res.json(docs);

    });

});

app.get('/contactList/:id', function(req, res){
    var id = req.params.id;
    db.contactList.findOne({_id: mongojs.ObjectId(id)}, function(err, docs){
        res.json(docs);
    });

});

app.put('/contactList/:id', function(req, res){
    var id = req.params.id;
    db.contactList.findAndModify({ query: {_id: mongojs.ObjectId(id)}, 
        update: {$set: {Name: req.body.Name, Mobile: req.body.Mobile}}, new: true}, function(err, docs){
            res.json(docs);
        });

    });

var port = process.env.PORT || 3000 ;
app.listen(port);

console.log("Server is running");
