const Like = require("../model/LikeModel");
//Like
const makeLike=async(req,res)=>{
    const userId=req.userId;
    const {count,postId}=req.body;
     const newLike=new Like({count,userId:userId,postId:postId});
    try {
      const likeSave=await newLike.save();
      res.status(201).json(likeSave);
    } catch (error) {
      res.status(500).json({ message: 'Like failed' });
    }
    
  };
  module.exports=makeLike;