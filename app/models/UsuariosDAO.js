var crypto = require('crypto');

function UsuariosDAO(cn){
   this._cn = cn;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
    console.log('Abrindo conexão');
    this._cn(function (client, db) {
        usuario.usuario = usuario.usuario.toLowerCase();
        usuario.senha = crypto.createHash('sha256').update(usuario.senha).digest('hex');
        db.collection('usuarios').insertOne(usuario);
        client.close();
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    console.log('Autenticando');
    usuario.senha = crypto.createHash('sha256').update(usuario.senha).digest('hex');
        

    this._cn(function (client, db) {
       db.collection('usuarios').findOne({usuario: {$eq: usuario.usuario.toLowerCase()}}, function(ex, u){
            if(u != undefined){
                if(u.senha == usuario.senha){
                    console.log('autenticou');
                    req.session.autorizado=true;
                    req.session.usuario = u.usuario;
                    req.session.casa = u.casa;
                    res.redirect('jogo');
                }
                else{
                    res.render('index.ejs', {validacao:{}});
                }
            }
            else{
                res.render('index.ejs', {validacao:{}});
            }
            client.close();
        });       
    });
}
module.exports = function(){
    return UsuariosDAO;
};