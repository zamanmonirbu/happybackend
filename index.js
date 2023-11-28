const express = require('express');
express.static('uploads')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv')
var bodyParser = require('body-parser')
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json());
const multer = require('multer');
const path = require('path');
const url = process.env.URL;
const port = process.env.PORT || 3000;
const cors = require('cors')
app.use(cors())
mongoose.connect(url);
const your_secret_key = "helloBanglaDesh"


const userSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  email: String,
  password: String,
  hobby: String,
  location: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]

});


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
    ref: 'Post'
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
});

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


const Post = mongoose.model("Post", postSchema);
const User = mongoose.model('User', userSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Like = mongoose.model('Like', likeSchema);

//Register
app.post('/api/register', async (req, res) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, middleName, lastName, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid Password' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, your_secret_key, { expiresIn: '10h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

//middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, your_secret_key);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

//Get All user
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'Users not found' });
    }
  } catch (error) {
    console.error('Error finding users:', error);
    res.status(500).json({ message: 'Find failed' });
  }
});

//Specific user
app.get('/api/user', verifyToken, async (req, res) => {
  const id = req.userId;
  try {
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'Find failed' });
  }
});

app.put('/api/user', verifyToken, async (req, res) => {
  const userId = req.userId;
  const { firstName, middleName, lastName, email, password, address, hobby } = req.body;

  try {
    // Use the updateOne method on the User model
    const updatedUser = await User.updateOne({ _id: userId }, { firstName, middleName, lastName, email, password, address, hobby });

    if (updatedUser.nModified === 1) {
      res.status(200).json({ message: 'Update successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

app.delete('/api/user', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Use the deleteOne method on the User model
    const deleteResult = await User.deleteOne({ _id: userId });

    if (deleteResult.deletedCount === 1) {
      res.status(200).json({ message: 'Delete successful' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});


//Post by user

const UPLOADED_FOLDER = './uploads/';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADED_FOLDER);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
    cb(null, fileName + fileExt);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    console.log(file);
    if (file.fieldname === 'img') { // Only accept files for the 'avatar' field
      if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('This format is not supported'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  }
});


app.post('/api/post', verifyToken, upload.single('img'), async (req, res) => {
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
});



//Get all post in a specific 
app.get('/api/posts', verifyToken, async (req, res) => {
  const id = req.userId;
  // console.log(id);
  try {
    const posts = await Post.find({ user: id });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error finding posts:', error);
    res.status(500).json({ message: 'Find failed' });
  }
});

//Update user post
app.put('/api/post/:id', verifyToken, async (req, res) => {
  const { title, category, img, text } = req.body;
  const id = req.params;

  try {
    const updateSuccess = await Post.updateOne({ _id: id }, { title, category, img, text });
    res.status(200).json(updateSuccess);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});
//Delete user post
app.delete('/api/post/:id', verifyToken, async (req, res) => {
  const postId = req.params.id; // Correctly extract the id from req.params
  try {
    // Use findByIdAndDelete method on the Post model
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (deletedPost) {
      res.status(200).json({ message: 'Delete success' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

//Like
app.post('/api/thanks',verifyToken,async(req,res)=>{
  const userId=req.userId;
  // const postId=req.postId;
  // const postId="65621ee5f70ac41449fdf7e2";
  const {count,postId}=req.body;
  // console.log(postId);
  const newLike=new Like({count,userId:userId,postId:postId});
  try {
    const likeSave=await newLike.save();
    res.status(201).json(likeSave);
  } catch (error) {
    res.status(500).json({ message: 'Like failed' });
  }
  
});
//Comment
app.post('/api/comment',verifyToken,async(req,res)=>{
  const userId=req.userId;
  const postId=req.postId;
  // const postId="65621ee5f70ac41449fdf7e2";
  const {opinion}=req.body;
  const newComment=new Comment({opinion,user:userId,post:postId});
  try {
    const commentSave=await newComment.save();
    res.status(201).json(commentSave);
  } catch (error) {
    res.status(500).json({ message: 'comment failed' });
  }
  
});


app.get('/api/content/happy', async (req, res) => {
  try {
    const happyPosts = await Post.find({ category: 'Happiness' }); // Assuming 'happy' is the category field in your Post model
    res.json(happyPosts);
    // console.log(object);
  } catch (error) {
    console.error('Error fetching happy content:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/content/sad', async (req, res) => {
  try {
    const sadPosts = await Post.find({ category: 'Sadness' }); // Assuming 'happy' is the category field in your Post model
    res.json(sadPosts);
    // console.log(object);
  } catch (error) {
    console.error('Error fetching happy content:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/content/help', async (req, res) => {
  try {
    const helpPosts = await Post.find({ category: 'Help' }); // Assuming 'happy' is the category field in your Post model
    res.json(helpPosts);
    // console.log(object);
  } catch (error) {
    console.error('Error fetching happy content:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/content/news', async (req, res) => {
  try {
    const newsPosts = await Post.find({ category: 'News' }); // Assuming 'happy' is the category field in your Post model
    res.json(newsPosts);
    // console.log(object);
  } catch (error) {
    console.error('Error fetching happy content:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});