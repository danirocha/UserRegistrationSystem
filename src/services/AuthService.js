import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import UserService from './UserService';

class AuthService {
    constructor () {
        this.UserService = UserService;
    }

    login(loginDTO) {
        const { email, password } = loginDTO;
        const user = this.UserService.list({ email });

        if (!user || (user && password != user.password)) { // TODO: use bcrypt for the password
            throw {};
        }

        const { id, name } = user;
        const authToken = jwt.sign({ id }, authConfig.secret, authConfig.options);

        return { user: { name, email }, token: authToken };
    }
}

export default new AuthService();