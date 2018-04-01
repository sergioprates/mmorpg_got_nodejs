module.exports.index = function(application, req, res){
    res.render('index.ejs',{validacao: {}});
}

module.exports.autenticar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não deve ser vazio.').notEmpty();
    req.assert('senha', 'Senha não deve ser vazio.').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index.ejs', {validacao: erros});
    }
    else{

       var usuariosDAO = new application.app.models.UsuariosDAO(application.config.dbConnection);

       usuariosDAO.autenticar(dadosForm, req, res);
    }
}