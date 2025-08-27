import authRoute from './auth.route';
import { config } from '../config/config';
import { Application } from "express";   

function route(app: Application) {
    const urlPrefix = config.api_prefix + config.api_version;

    app.use(`${urlPrefix}/auth`, authRoute);

}

export default route;