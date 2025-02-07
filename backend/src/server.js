import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';



dotenv.config();
const app = express();


//Middleware
app.use(cors());
app.use(express.json()); //Parse JSON requests

app.get('/', (req, res) => {
  res.send('CMS Backend is running...');
});


app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
