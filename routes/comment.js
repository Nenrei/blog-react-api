'use strict'

const express = require('express');
const CommentController = require('../controllers/comments');
const router = express.Router();


router.post('/saveComment', CommentController.save);
router.get('/getCommentsByArticle/:articleId', CommentController.getCommentsByArticle);

module.exports = router;