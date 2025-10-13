import authRoute from './auth.route';
import { config } from '../config/config';
import { Application } from 'express';
import eventRoutes from './event.route';
import ticketTypeRoutes from './ticket-type.route';
import ticketRoutes from './ticket.route';
import userRoute from './user.route';
import bookingRoute from './booking.route';
import organizerRoute from './organizer.route';
import uploadRoute from './upload.route';
import paymentRoute from './payment.route';

function route(app: Application) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/events`, eventRoutes);
  app.use(`${urlPrefix}/ticket-types`, ticketTypeRoutes);
  app.use(`${urlPrefix}/ticket`, ticketRoutes);
  app.use(`${urlPrefix}/user`, userRoute);
  app.use(`${urlPrefix}/booking`, bookingRoute);
  app.use(`${urlPrefix}/organizer`, organizerRoute);
  app.use(`${urlPrefix}/upload`, uploadRoute);
  app.use(`${urlPrefix}/payment`, paymentRoute)
}

export default route;
