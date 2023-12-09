const Post = require("../model/PostModel");

//Category
const happyContent= async (req, res) => {
    try {
      const happyPosts = await Post.find({ category: 'Happiness' }).populate('user', 'firstName lastName email') // Assuming 'happy' is the category field in your Post model
      // const happyPosts = await Post.find({ category: 'Happiness' }); 
      // const posts = await User.findById(id).select('firstName lastName email').populate('post');
  
      // Assuming 'happy' is the category field in your Post model
      // console.log("happy",happyPosts);
      res.json(happyPosts);
      // console.log(object);
    } catch (error) {
      console.error('Error fetching happy content:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const sadContent= async (req, res) => {
    try {
      const sadPosts = await Post.find({ category: 'Sadness' }); // Assuming 'happy' is the category field in your Post model
      res.json(sadPosts);
      // console.log(object);
    } catch (error) {
      console.error('Error fetching happy content:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const helpContent= async (req, res) => {
    try {
      const helpPosts = await Post.find({ category: 'Help' }); // Assuming 'happy' is the category field in your Post model
      res.json(helpPosts);
      // console.log(object);
    } catch (error) {
      console.error('Error fetching happy content:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const newsContent=async (req, res) => {
    try {
      const newsPosts = await Post.find({ category: 'News' }); // Assuming 'happy' is the category field in your Post model
      res.json(newsPosts);
      // console.log(object);
    } catch (error) {
      console.error('Error fetching happy content:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports={newsContent,helpContent,sadContent,happyContent}