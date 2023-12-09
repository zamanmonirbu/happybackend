const Comment = require("../model/CommentModel");



//Comment
const makeComment=async(req,res)=>{
    const userId=req.userId;
    const postId=req.postId;
    const {opinion}=req.body;
    const newComment=new Comment({opinion,user:userId,post:postId});
    try {
      const commentSave=await newComment.save();
      res.status(201).json(commentSave);
    } catch (error) {
      res.status(500).json({ message: 'comment failed' });
    }
    
  };

  module.exports=makeComment;