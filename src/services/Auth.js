import Auth from '../lib/Auth';

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
        const authToken = Auth.generateToken(id);

        return { user: { name, email }, token: authToken };
    }
}