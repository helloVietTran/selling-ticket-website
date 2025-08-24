import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import route from './routes/index.js';
import { AppDataSource } from './config/data-source.js';

const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
route(app);

// connect to db
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });

// test endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

export default app;
