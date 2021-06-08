import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../config/auth';

class Auth {
    constructor() {
        // -
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, authConfig.secret, authConfig.options);
    }

    async decryptToken(token) {
        const decrypted = await promisify(jwt.verify)(token, authConfig.secret);

        return decrypted;
    }
}

export default new Auth();