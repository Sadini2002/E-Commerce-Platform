import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';



import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();
//import fetch from 'node-fetch'; 
import cors from 'cors';
  




const app = express();

app.use(cors());

app.use(bodyParser.json())
app.use(express.json());

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(); // no token, skip

  const token = authHeader.replace("Bearer ", "");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // returns payload directly
    req.user = decoded; // attach user info to request
    next(); // proceed
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(403).json({ message: "Invalid Token" }); 
  }
});









mongoose.connect(process.env.MONGODB_url)
.then(() => 
    console.log('Connected to MongoDB'))
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }); 
})
.catch(err => console.error('Could not connect to MongoDB...', err));












