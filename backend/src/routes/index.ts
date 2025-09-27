import authRoute from './auth.route';
import { config } from '../config/config';
import { Application } from 'express';
import eventRoutes from './event.route';

import ticketTypeRoutes from './ticket-type.route';

import ticketRoutes from './ticket.route';
import userRoute from './user.route';
<<<<<<< HEAD
import bookingRoute from './booking.route'
import revenueRoute from './revenue.route';
=======
import bookingRoute from './booking.route';
>>>>>>> 66c963f403a5499c8bb667ed1949effb8dc4b849

function route(app: Application) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/events`, eventRoutes);
  app.use(`${urlPrefix}/ticket-types`, ticketTypeRoutes);
  app.use(`${urlPrefix}/ticket`, ticketRoutes);
  app.use(`${urlPrefix}/user`, userRoute);
  app.use(`${urlPrefix}/booking`, bookingRoute);
<<<<<<< HEAD
  app.use(`${urlPrefix}`, revenueRoute);
=======
>>>>>>> 66c963f403a5499c8bb667ed1949effb8dc4b849
}

export default route;
