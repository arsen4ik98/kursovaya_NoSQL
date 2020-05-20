const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const neo4j = require('neo4j-driver');

const app = express();
const jsonParser = express.json();
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '123456'));
const session = driver.session();
   
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
 
let dbClient;


app.use(express.static(__dirname + "/public"));

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("test").collection("Routen_Trol");
    app.locals.collection2 = client.db("test").collection("Routen_Avto");
    app.locals.collection3 = client.db("test").collection("Routen_Tram");
    
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/Routen_Trol", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get("/Routen_Avto", function(req, res){
        
    const collection = req.app.locals.collection2;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get('/123',function(req,res){
    session
        .run('match (e1:Route) return e1')
        .then(function(result){
            result.records.forEach(function(record) {
                console.log(record._fields[0].properties);
            });
        })
        .catch(function(err){
console.log(err);
        });
res.send('It Works');
});

app.get("/Routen_Tram", function(req, res){
        
    const collection = req.app.locals.collection3;
    collection.find({}).toArray(function(err, users){
         
        if(err) return console.log(err);
        res.send(users)
    });
     
});


// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});