import authRoute from './auth.route.js';
import { config } from '../config/config.js';

function route(app) {
    const urlPrefix = config.api_prefix + config.api_version;

    app.use(`${urlPrefix}/auth`, authRoute);

}

export default route;