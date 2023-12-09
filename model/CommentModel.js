const mongoose = require("mongoose");
const Post = require("./PostModel");
const User = require("./UserModel");

const commentSchema = new mongoose.Schema({
    opinion: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  
  });
  const Comment = mongoose.model('Comment', commentSchema);
  module.exports=Comment;
