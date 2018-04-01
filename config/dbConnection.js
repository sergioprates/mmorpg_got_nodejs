
var mongo = require('mongodb').MongoClient;

var cn = function(callback){
    console.log('Entrou na função da conexão');
    
    mongo.connect('mongodb://localhost:27017', function(ex, client){
        if (!ex){
          var db =  client.db('got');
          callback(client, db);
        }
        else{
            console.error(ex);
        }
    });

}

module.exports = function(){    
    return cn;
}