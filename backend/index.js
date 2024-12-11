import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
// import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { handleError } from './utils/error.js';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://e-commerce-web-app-steel.vercel.app',
    ],
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTION'],
  })
);

connectDB();
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/zentromart', apiRouter);

app.use(handleError);

app.all('*', (req, res) => {
  res.status(404).json({ message: 'End point does not exist.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
