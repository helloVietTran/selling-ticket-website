import { config } from '../config/config';
import { Application } from 'express';

import authRoute from './auth.route';
import eventRoutes from './event.route';
import ticketTypeRoutes from './ticket-type.route';
import ticketRoutes from './ticket.route';
import userRoute from './user.route';
import bookingRoute from './booking.route';
import organizerRoute from './organizer.route';
import resourceRoute from './resource.route';
import paymentRoute from './payment.route';
import revenueRoute from './revenue.route';
import adminRoute from './admin.route';

function route(app: Application) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/events`, eventRoutes);
  app.use(`${urlPrefix}/ticket-types`, ticketTypeRoutes);
  app.use(`${urlPrefix}/tickets`, ticketRoutes);
  app.use(`${urlPrefix}/users`, userRoute);
  app.use(`${urlPrefix}/booking`, bookingRoute);
  app.use(`${urlPrefix}/revenue`, revenueRoute);
  app.use(`${urlPrefix}/organizer`, organizerRoute);
  app.use(`${urlPrefix}/resource`, resourceRoute);
  app.use(`${urlPrefix}/payment`, paymentRoute);
  app.use(`${urlPrefix}/admin`, adminRoute);
}

export default route;
