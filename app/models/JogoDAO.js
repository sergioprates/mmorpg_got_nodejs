function JogoDAO(cn){
    this._cn = cn;
 }

 var objectId = require('mongodb').ObjectId;

 JogoDAO.prototype.gerarParametros = function(usuario){     
     this._cn(function (client, db) {
         db.collection('jogo').insertOne({
             usuario: usuario,
             moeda: 15,
             suditos: 10,
             temor: Math.floor(Math.random() * 1000),
             sabedoria: Math.floor(Math.random() * 1000),
             comercio: Math.floor(Math.random() * 1000),
             magia: Math.floor(Math.random() * 1000),
         });



         client.close();
     });
 }

 JogoDAO.prototype.iniciaJogo = function(usuario, callback){
    console.log('Iniciando jogo');
   
    this._cn(function (client, db) {
       db.collection('jogo').findOne({usuario: {$eq: usuario.toLowerCase()}}, function(ex, result){
            
            
            client.close();
            callback(result);
        });       
    });
}

JogoDAO.prototype.acao = function(acao, callback){
    console.log('Iniciando jogo');
   
    this._cn(function (client, db) {
        var date = new Date();
        var tempo = 1*60*60000;
         switch (acao.acao) {
             case '1':
                 {
                    tempo = 1*60*60000;
                 }
                 break;
                 case '2':
                 {
                    tempo = 2*60*60000;
                 }
                 break;
                 case '3':
                 {
                    tempo = 5*60*60000;
                 }
                 break;
                 case '4':
                 {
                    tempo = 5*60*60000;
                 }
                 break;
             default:
                tempo = 1*60*60000;
                 break;
         }
        
        acao.acao_termina_em = date.getTime() + tempo;

        db.collection('acao').insertOne(acao);

         var moedas = null;
        switch (acao.acao.toString()) {
            case '1':
                {
                    moedas = -2 * acao.quantidade;
                }
                break;
                case '2':
                {
                    moedas = -3 * acao.quantidade;
                }
                break;
                case '3':
                {
                    moedas = -1 * acao.quantidade;
                }
                break;
                case '4':
                {
                    moedas = -1 * acao.quantidade;
                }
                break;
            default:
                moedas = -1 * acao.quantidade;
                break;
        }

        db.collection('jogo').update(
            {usuario: acao.usuario},
            { $inc:{moeda: moedas}}
        );

        client.close();             
    });
}


JogoDAO.prototype.getAcoes = function(req, res, callback){
  
    this._cn(function (client, db) {
        db.collection('acao').find({usuario: 
            {$eq: req.session.usuario.toLowerCase()},
            acao_termina_em: {$gt: new Date().getTime()}
        }).toArray(function(ex, result){
             
             console.log(result);
             client.close();
             callback(result);
         });       
     });
}

JogoDAO.prototype.revogar_acao = function(id_acao, callback){
  
    this._cn(function (client, db) {
        db.collection('acao').remove({_id: 
            {$eq: objectId(id_acao)}}, function(ex){
                client.close();
                callback();
            })});       
    
}
 module.exports = function(){
    return JogoDAO;
};