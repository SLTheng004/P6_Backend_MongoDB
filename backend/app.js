const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env['SECRET_MDB']).then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => { 
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
  
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;