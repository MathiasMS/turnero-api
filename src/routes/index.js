import authentication from './authentication/authentication.route.js';
import categories from './categories/categories.route.js';
import procedures from './procedures/procedures.route.js';
import proceduresAvailability from './procedures-availability/procedures-availability.route.js';
// import { validate } from '../middlewares/authenticaton.js';

const API_BASE_URL = '/api';

const routes = (app) => {
    app.use(`${API_BASE_URL}/authentication`, authentication);
    app.use(`${API_BASE_URL}/categories`, categories);
    app.use(`${API_BASE_URL}/procedures`, procedures);
    app.use(`${API_BASE_URL}/procedures-availability`, proceduresAvailability);
};

export { routes }
