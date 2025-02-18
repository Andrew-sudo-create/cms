import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import websiteRoutes from './routes/website.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to Database
connectDB();

//routes
app.use('/api/websites', websiteRoutes);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});