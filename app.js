const express = require("express");
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const neo4j = require('neo4j-driver');


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
            var tramArr = [];
            result.records.forEach(function(record) {
                tramArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name,
                    name1: record._fields[0].properties.route,
                    name2: record._fields[0].properties.number
                });
            });
                res.render('about',{
                    tram: tramArr
                
            });
            console.log(tramArr);
        })
        .catch(function(err){
console.log(err);
        });
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