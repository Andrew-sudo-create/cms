import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to Database
connectDB();


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});