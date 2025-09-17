import authRoute from './auth.route';
import { config } from '../config/config';
import { Application } from 'express';
import eventRoutes from './event.route';
import ticketTypeRoutes from './TicketType.route';


function route(app: Application) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/events`, eventRoutes);
  app.use(`${urlPrefix}/tickettypes`, ticketTypeRoutes);

}

export default route;
