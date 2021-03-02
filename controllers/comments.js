"use strict";

const validator = require("validator");
const Comment = require("../models/comment");

const controller = {
  save: (req, res) => {
    const params = req.body;

    try {
      var validatorUser = !validator.isEmpty(params.userName);
      var validatorComment = !validator.isEmpty(params.comment);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "Missing data",
      });
    }

    if (validatorUser && validatorComment) {
      var comment = new Comment();
      comment.userName = params.userName;
      comment.comment = params.comment;
      comment.articleId = params.articleId;

      comment.save((error, savedComment) => {
        if (error || !savedComment) {
          return res.status(404).send({
            status: "error",
            message: "The comment wasn't saved.",
          });
        }

        return res.status(200).send({
          status: "success",
          comment: savedComment,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "los datos no son validos",
      });
    }
  },

  getCommentsByArticle: (req, res) => {
    Comment.find({ articleId: req.params.articleId })
      .sort([["date", "descending"]])
      .exec((error, comments) => {
        if (error) {
          return res.status(500).send({
            status: "error",
            message: "Error returning comments",
          });
        }
        if (!comments) {
          return res.status(404).send({
            status: "error",
            message: "Error returning comments",
          });
        }
        return res.status(200).send({
          status: "success",
          comments,
        });
      });
  },
};

module.exports = controller;
