import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';

import route from './routes';
import { AppDataSource } from './config/data-source';
import { responseErr } from './config/exception';
import { startCronTicketBooking } from './controllers/cron/booking.cron';
import emailController from './controllers/email.controller';
import adminController from './controllers/admin.controller';

const app: Application = express();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// clear exprired booking
startCronTicketBooking();

// send ticket mail job
// cron.schedule('*/3 * * * *', async () => {
//   await emailController.sendAllTicketsMail();
// });

// routes
route(app);

// connect to db
AppDataSource.initialize()
  .then(async () => {
    console.log('INFO: Data Source has been initialized!');
    await adminController.initAdmin();
  })
  .catch((err) => {
    console.error('ERROR: Error during Data Source initialization:', err);
  });

// handle global error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  responseErr(err, res);
  return next();
});

// test endpoint
app.get('/ping', (req: Request, res: Response) => {
  res.send('pong');
});

export default app;
