const User=require('../model/UserModel')
const verifyToken=require('../middleware/MiddleWare');
const Post = require('../model/PostModel');



//Make post
const makePost= async (req, res) => {
    const { title, category, text } = req.body;
  
    try {
      const avatar = req.file;
      const newPost = new Post({
        title, category, img: avatar.path, text, user: req.userId
      });
  
      const successPost = await newPost.save();
      
      await User.updateOne(
        { _id: req.userId },
        {
          $push: {
            post: successPost._id,
          },
        }
      );
  
      res.status(201).json({ message: 'Post successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Post failed' });
    }
  };
  
  

//Get all post in a specific 
const getAllPosts= async (req, res) => {
    const id = req.userId;
    try {
      const posts = await User.findById(id).select('firstName lastName email').populate('post');
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error finding posts:', error);
      res.status(500).json({ message: 'Find failed' });
    }
  };
  
  //Update user post
  const UpdateSpecificPost=  async (req, res) => {
    const { title, category, img, text } = req.body;
    const id = req.params;
  
    try {
      const updateSuccess = await Post.updateOne({ _id: id }, { title, category, img, text });
      res.status(200).json(updateSuccess);
    } catch (error) {
      res.status(500).json({ message: 'Update failed', error: error.message });
    }
  };
  //Delete user post
  const deleteSpecificPost=  async (req, res) => {
    const postId = req.params.id; 
    try {
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (deletedPost) {
        res.status(200).json({ message: 'Delete success' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Delete failed', error: error.message });
    }
  };

  module.exports={makePost,getAllPosts,UpdateSpecificPost,deleteSpecificPost}