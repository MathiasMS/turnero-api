import boom from 'boom'
import pkg from 'jsonwebtoken';
import { TURNERO_AUTH_SECRET } from '../config/config.js';

const { JsonWebTokenError, sign, TokenExpiredError, verify } = pkg;

export const signToken = (userId, expiresIn) => {
    try {
        const payload = {
            userId,
        };

        const jwtoken = sign(payload, TURNERO_AUTH_SECRET, {
            expiresIn,
        });

        return jwtoken;
    } catch (error) {
        throw error;
    }
}

export const verifyToken = token => {
    try {
        return verify(token, TURNERO_AUTH_SECRET);
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw boom.unauthorized('Token no valido.')
        } else if (error instanceof TokenExpiredError) {
            throw boom.unauthorized('Token expirado.')
        } else {
            throw error;
        }
    }
}
