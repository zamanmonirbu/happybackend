const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser')
const cors = require('cors');
const router = require('./routes/AllRoutes');
const app = express();
const dotenv=require('dotenv');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config();

const url = process.env.URL;
const port = process.env.PORT || 3000;

app.use(cors());

mongoose.connect(url);

app.use('/api',router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});