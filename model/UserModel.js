const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    email: {
      type:String,required:true
    },
    password: {
      type:String,required:true
    },
    hobby: String,
    location: String,
    img:String,
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
  
  
 
const User = mongoose.model('User', userSchema);
module.exports=User;

  
 