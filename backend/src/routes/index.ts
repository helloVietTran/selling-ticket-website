import authRoute from './auth.route';
import { config } from '../config/config';
import { Application } from 'express';
import eventRoutes from './event.route';
import ticketTypeRoutes from './ticket-type.route';
import ticketRoutes from './ticket.route';
import bookingRoute from './booking.route'

function route(app: Application) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/events`, eventRoutes);
  app.use(`${urlPrefix}/ticket-types`, ticketTypeRoutes);
  app.use(`${urlPrefix}/ticket`, ticketRoutes);
  app.use(`${urlPrefix}/booking`, bookingRoute);

}

export default route;
