import dotenv from "dotenv";
import 'dotenv/config';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";


const app = express();


//Middleware
app.use(cors());
app.use(express.json()); //Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Handle form data
app.use(cors({ origin: "*" })); // Allow all domains

// Connect to MongoDB
mongoose.connect("mongodb+srv://andrew:iPJBzpEtPRE4bP3q@cms.biv7m.mongodb.net/?retryWrites=true&w=majority&appName=cms", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

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
