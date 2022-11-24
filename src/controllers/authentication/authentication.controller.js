import boom from 'boom'
import { TURNERO_AUTH_SECRET, TURNERO_AUTH_TOKEN_EXPIRATION_TIME } from '../../config/config.js';
import Users from '../../models/Users.js';
import { generateHash, generateSalt, validate } from '../../utils/cryptography.js';
import { signToken } from '../../utils/authentication.js'

//Authentication Manipulation
export const signUpUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const existingUser = await Users.findOne({
            where: {
                username
            }
        });

        if (existingUser) {
            throw boom.badRequest('Ya existe un usuario con ese mismo nombre.');
        }

        const salt = await generateSalt();
        const hashedPassword = await generateHash(password, salt);

        const createdUser = await Users.create({
            username,
            salt,
            password: hashedPassword
        })

        return res.send(createdUser);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const existingUser = await Users.findOne({
            where: { username }
        });

        if (!existingUser) {
            throw boom.badRequest('Login fallido. Por favor verificar usuario y contraseña.');
        }

        const isCorrect = await validate(password, existingUser.password, existingUser.salt);

        if (!isCorrect) {
            throw boom.unauthorized('Login fallido. Por favor verificar usuario y contraseña.');
        }

        const { id } = existingUser;

        const token = await signToken(id, TURNERO_AUTH_TOKEN_EXPIRATION_TIME);

        return res.send({ token, user: existingUser });
    } catch (error) {
        next(error);
    }
};
