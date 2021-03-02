'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {
    save: (req, res) => {
        var params = req.body;

        try {
            var validator_title = !validator.isEmpty(params.title);
            var validator_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validator_title && validator_content){

            var article = new Article();
            article.title = params.title;
            article.content = params.content;
            article.contentShort = params.contentShort;
            article.image = null;

            article.save((error, articleStored) => {
                if(error || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });

            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'los datos no son validos'
            });
        }
        
    },

    getArticles: (req, res) => {

        var query = Article.find({});
        var last = req.params.last;
        
        if(last || last != undefined){
            query.limit(4);
        }

        query.sort('-_id').exec((error, articles) => {
            if(error){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req, res) => {
        var articleId = req.params.id;
        
        if(!articleId || articleId == undefined){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        Article.findById(articleId, (error, article) => {
            if(error || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    updateArticle: (req, res) => {
        var articleId = req.params.id;
        var params = req.body;

        if(!articleId || articleId == undefined){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        try {
            validator
            var validator_title = !validator.isEmpty(params.title);
            var validator_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        
        

        if(validator_title && validator_content){

            Article.findByIdAndUpdate({_id: articleId}, params, {new: true}, (error, updatedArticle) => {
                if(error || !updatedArticle){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: updatedArticle
                });
            });
        }else{
            return res.status(500).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    removeArticle: (req, res) => {
        var articleId = req.params.id;

        if(!articleId || articleId == undefined){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        Article.findOneAndDelete({_id: articleId}, (error, removedArticle) => {
            if(error || !removedArticle){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: removedArticle
            });
        });
    },

    upload: (req, res) => {
        var fileName = 'imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: fileName
            });
        }

        var filePath = req.files.file0.path;
        fileName = filePath.split('\\')[2];
        var extension = fileName.split('.')[1];


        if( extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif' ){
            fs.unlink(filePath, (error) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        }else{
            Article.findOneAndUpdate({_id: req.params.id}, {image: fileName}, {new: true}, (error, updatedArticle) => {
                if(error || !updatedArticle){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: updatedArticle
                });
            });
        }
    },

    getImage: (req, res) => {
        var fileName = req.params.image;
        var filePath = './upload/articles/' + fileName

        if (fs.existsSync(filePath)) {
            return res.sendFile(path.resolve(filePath));
        } else {
            return res.status(404).send({
                status: 'error',
                mesagge: 'La imagen no existe'
            });
        }
    },

    search: (req, res) => {
        var searchText = req.params.search;

        Article.find({ "$or":[
            { "title": {"$regex": searchText, "$options": "i"}},
            { "content": {"$regex": searchText, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((error, articles) => {
            if(error){
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la peticion'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'no hay articulos'
                });
            }

            return res.status(200).send({
                status: 'error',
                articles
            });
            
        });
    },

}

module.exports = controller;