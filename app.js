const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
   
const app = express();
const jsonParser = express.json();
const mongoClient = new MongoClient("mongodb://localhost:27017/test", { useNewUrlParser: true });
let dbClient;
app.use(express.static("public"));

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
  
    
    dbClient = client;
    app.locals.collection = client.db("test").collection("Routen_avto");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/test", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, Routen_avto){
         
        if(err) return console.log(err);
        res.send(Routen_avto)
    });
     
});
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});