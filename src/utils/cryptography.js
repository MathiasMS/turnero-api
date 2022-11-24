import * as crypto from 'crypto';

const LENGTH = 64;

function cleanup(buffer) {
    const cleaned = buffer
        .toString('base64') // convert to base64 format
        .substr(0, LENGTH) // return required number of characters
        .replace(/\+/g, '_') // replace '+' with '_'
        .replace(/\//g, '|'); // replace '/' with '-');

    return cleaned;
}

export const generateSalt = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(Math.ceil((LENGTH * 3) / 4), (err, buffer) => {
            if (err) {
                return reject(err);
            }

            return resolve(cleanup(buffer).toString());
        });
    });
}

export const generateHash = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 10000, LENGTH, 'sha512', (err, buffer) => {
            if (err) {
                return reject(err);
            }

            return resolve(cleanup(buffer).toString());
        });
    });
}

export const validate = async(password, _hash, salt) => {
    const newHash = await generateHash(password, salt);
    return newHash === _hash;
}
