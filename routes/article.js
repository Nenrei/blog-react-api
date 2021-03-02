'use strict'

var express = require('express');
var ArticleController = require('../controllers/articles');

var router = express.Router();
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './upload/articles'});

router.post('/saveArticle', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/updateArticle/:id', ArticleController.updateArticle);
router.delete('/removeArticle/:id', ArticleController.removeArticle);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;