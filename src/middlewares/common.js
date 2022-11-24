import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

export const handleCors = (app) => {
    app.use(cors({ credentials: true, origin: true }));
};

export const handleBodyRequestParsing = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
};

export const handleCompression = (app) => {
    app.use(compression());
};

export const handleHelmet = (app) => {
    app.use(helmet());
};
