import AuthLib from '../libs/Auth';

export default class Auth {
    constructor (UserService) {
        this.UserService = UserService;
    }

    login(loginDTO) {
        const { email, password } = loginDTO;
        const user = this.UserService.list({ email });

        if (!user || (user && password != user.password)) { // TODO: use bcrypt for the password
            throw {};
        }

        const { id, name } = user;
        const authToken = AuthLib.generateToken(id);

        return { user: { name, email }, token: authToken };
    }
}