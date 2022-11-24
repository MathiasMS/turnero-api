import boom from 'boom'
/* eslint-disable no-unused-vars */
export const errorMiddleware = (err, req, res, next) => {
    // Log Error to CloudWatch
    console.error(err);

    // If it's a validation error throw right away
    if (err.isJoi) {
        const resError = formatError(400, err);

        return res.status(resError.status).json(resError);
    }

    let error = err;

    // Catch any error that isn't boom and make it a Boom error
    if (!error.isBoom) {
        error = boom.badRequest(err);
    }

    const resError = formatError(
        error.output.statusCode,
        error,
    );

    return res.status(resError.status).json(resError);
};

const formatError = (status, error) => {
    if (error.isBoom) {
        return {
            status: error.output.statusCode,
            error: error.output.payload.error,
            message: error.isJoi
                ? error.details[0].message
                : error.message,
        };
    }

    // Default
    return {
        status: status || 500,
        error: error || 'Internal Server Error',
        message: 'An error has occured',
    };
}

export default { errorMiddleware, formatError }
