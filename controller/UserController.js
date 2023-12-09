const bcrypt = require('bcrypt');
const User=require('../model/UserModel')
const dotenv=require('dotenv');
require('dotenv').config();
const your_secret_key = process.env.SECRETE_KEY;
const jwt = require('jsonwebtoken');
// console.log(your_secret_key);

//Register
const register= async (req, res) => {
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
  };

  //Login
  const login= async (req, res) => {
    const { email, password } = req.body;
    console.log("Hello",email)
  
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
  };

  
//Get All user
const allUser= async (req, res) => {
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
  };
  
  //Specific user
  const specificUser= async (req, res) => {
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
  };
  
  const updateUser= async (req, res) => {
    const userId = req.userId;
    const { firstName, middleName, lastName, email, password, address, hobby } = req.body;
  
    try {
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
  };
  
  const deleteUser= async (req, res) => {
    const userId = req.userId;
  
    try {
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
  };
  
  

  module.exports={register,login,allUser,specificUser,updateUser,deleteUser}