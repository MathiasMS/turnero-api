import express from 'express'
import { applyMiddleware } from './utils/applymiddlewares.js';
import commonMiddlewares from './middlewares/index.js';
import { TURNERO_APPLICATION_PORT } from './config/config.js';
import { errorMiddleware } from './middlewares/error.js';
import { routes } from './routes/index.js';
import { getPSQLConnection } from './db/index.js';

const app = express();
applyMiddleware(app, commonMiddlewares);

routes(app)
getPSQLConnection()
app.use(errorMiddleware);

try {
    app.listen(TURNERO_APPLICATION_PORT, () => {
        console.log(`[STARTUP] TURNERO API ${process.pid} Running on ${TURNERO_APPLICATION_PORT}`);
    });
} catch (e) {
    console.log(e)
}
