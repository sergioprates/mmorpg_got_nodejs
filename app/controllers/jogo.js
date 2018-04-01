module.exports.jogo = function(application, req, res){
    
    if(req.session.autorizado == undefined){
        res.redirect('/');
        return; 
    }  

    var param ={sucesso: req.query.sucesso, msg: req.query.msg};

    var JogoDAO = new application.app.models.JogoDAO(application.config.dbConnection);
    JogoDAO.iniciaJogo(req.session.usuario, function(result){
        res.render('jogo.ejs', {img_casa: req.session.casa, info: result, msg: param});
    });
}

module.exports.sair = function(application, req, res){    
    req.session.destroy(function(ex){
        res.redirect('/');
    });
}

module.exports.suditos = function(application, req, res){  
    if(req.session.autorizado == undefined){
        res.redirect('/');
        return; 
    }   
    res.render('aldeoes.ejs', {validacao:{}});
}

module.exports.pergaminhos = function(application, req, res){  
    if(req.session.autorizado == undefined){
        res.redirect('/');
        return; 
    }   

    var cn = application.config.dbConnection;

    var JogoDAO = new application.app.models.JogoDAO(cn);
    JogoDAO.getAcoes(req, res, function(result){
        res.render('pergaminhos.ejs', {acoes:result});
    });

   
}

module.exports.ordenar_acao_sudito = function(application, req, res){    
   var dadosForm = req.body;

   req.assert('acao', 'Ação deve ser informada').notEmpty();
   req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();
   
    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=Operação inválida! Verifique se todos os campos foram informados!&sucesso=0');
        return;
    }

    var cn = application.config.dbConnection;

    var JogoDAO = new application.app.models.JogoDAO(cn);
    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);
    res.redirect('jogo?msg=Recursos alocados.&sucesso=1');
}


module.exports.revogar_acao = function(application, req, res){  
    if(req.session.autorizado == undefined){
        res.redirect('/');
        return; 
    }   
    var id_acao = req.query.id_acao;
    var cn = application.config.dbConnection;

    var JogoDAO = new application.app.models.JogoDAO(cn);
    JogoDAO.revogar_acao(id_acao, function(){
        res.redirect('jogo?msg=Ordem revogada.&sucesso=1');
    });
   
}