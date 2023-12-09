const verifyToken=require('../middleware/MiddleWare');
const {register,login,allUser,specificUser,updateUser,deleteUser}=require("../controller/UserController");

const {newsContent,helpContent,sadContent,happyContent}=require('../controller/CategoryController');
const makeComment=require('../controller/CommentController');
const makeLike = require('../controller/LikeController');
const { makePost,getAllPosts,UpdateSpecificPost,deleteSpecificPost } = require('../controller/PostController');


// For Image all config 

const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
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
    fileSize: 1000000, // 1 MB
  },
  fileFilter(req, file, cb) {
    if (file.fieldname === 'img') {
      if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Invalid image format'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  }
});





//Auth
router.post('/register',register);
router.post('/login',login);

//User
router.get('/users',verifyToken,allUser);
router.get('/user',verifyToken,specificUser);
router.put('/user',verifyToken,updateUser);
router.delete('/user',verifyToken,deleteUser);

//Post
router.post('/post',verifyToken, upload.single('img'),makePost);
router.get('/posts',verifyToken,getAllPosts);
router.put('/post/:id',verifyToken,UpdateSpecificPost);
router.delete('/post/:id',verifyToken,deleteSpecificPost);

//Categories
router.get('/content/happy',verifyToken,happyContent);
router.get('/content/sad',verifyToken,sadContent);
router.get('/content/help',verifyToken,helpContent);
router.get('/content/news',verifyToken,newsContent);

//Like 
router.post('/thanks',verifyToken,makeLike);

//Comment
router.post('/comment',verifyToken,makeComment);

module.exports=router;