

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import authRoutes from './routes/auth.js'
import websiteRoutes from './routes/websites.js';
import contentRoutes from './routes/content.js';

dotenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json()); //Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Handle form data
app.use(cors({ origin: "*" })); // Allow all domains
app.use('/auth', authRoutes);
app.use('/websites', websiteRoutes);
app.use('/content', contentRoutes);

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// }).then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

connectDB();
app.get('/', (req, res) => {
  res.send('CMS Backend is running...');
});


app.get('/api/data', (req, res) => {
    res.json({
      "message": "Hello from backend",
      "data": [
        { "id": 1, "title": "Item 1" },
        { "id": 2, "title": "Item 2" }
      ]
    });
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
