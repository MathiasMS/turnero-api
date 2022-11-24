// Application variables
export const TURNERO_APPLICATION_PORT = parseInt(`${process.env.PORT}`, 10) || 5012;
export const TURNERO_PAGINATION_LIMIT = parseInt(`${process.env.TURNERO_PAGINATION_LIMIT}`, 10) || 10;

// Database variables
export const VIVA_DATABASE_MONGO_HOST = process.env.VIVA_DATABASE_MONGO_HOST || 'localhost';
export const VIVA_DATABASE_MONGO_DRIVER = process.env.VIVA_DATABASE_MONGO_DRIVER || 'mongodb';
export const VIVA_DATABASE_MONGO_PORT = parseInt(`${process.env.VIVA_DATABASE_MONGO_PORT}`, 10) || 2717;
export const VIVA_DATABASE_MONGO_DB = process.env.VIVA_DATABASE_MONGO_DB || 'viva';
export const VIVA_DATABASE_MONGO_USER = process.env.VIVA_DATABASE_MONGO_USER || '';
export const VIVA_DATABASE_MONGO_PASSWORD = process.env.VIVA_DATABASE_MONGO_PASSWORD || '';

//Auth variables
export const TURNERO_AUTH_SECRET =
    process.env.TURNERO_AUTH_SECRET || 'Kd9bJNvok3tNZgMGSoFiRtIUJhHGz6Db474EgowUJ8jI545rdE5q05aTJMM0W4H';
export const TURNERO_AUTH_TOKEN_EXPIRATION_TIME = '1d';
