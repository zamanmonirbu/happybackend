const mongoose = require("mongoose");
const Post = require("./PostModel");
const User = require("./UserModel");

const likeSchema = new mongoose.Schema({
    count: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  
  });
  const Like = mongoose.model('Like', likeSchema);
  module.exports=Like;
