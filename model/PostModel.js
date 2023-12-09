const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: String,
    category: String,
    img: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
  });

  const Post = mongoose.model("Post", postSchema);
  module.exports=Post;
