module.exports.cadastro = function(application, req, res){
    res.render('cadastro.ejs', {validacao:{}, dadosForm:{}});
}

module.exports.cadastrar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    var erros = req.validationErrors();
    var cn = application.config.dbConnection;
    
    
    if(erros){
        res.render('cadastro.ejs', {validacao: erros, dadosForm: dadosForm});
    }
    else{
        var UsuariosDAO = new application.app.models.UsuariosDAO(cn);
        var JogoDAO = new application.app.models.JogoDAO(cn);
        UsuariosDAO.inserirUsuario(dadosForm);
        JogoDAO.gerarParametros(dadosForm.usuario);
        //gerar parametros
        res.render('cadastro.ejs', {validacao: erros, dadosForm:{}});
    }
}