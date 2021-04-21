import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import UserService from '../services/UserService';

class AuthController {
    constructor () {
       this.userService = UserService;
    }

    store (req, res) {
        const { email, password } = req.body;
        const user = this.userService.list({ email });
      
        if (!user || (user && password != user.password)) { // TODO: use bcrypt for the password
            return res.sendResponse({ status: 400, data: { message: 'invalid login data' }});
        }

        const { id, name } = user;
        const token = jwt.sign({ id }, authConfig.secret, authConfig.options);
        
        return res.sendResponse({ status: 200, data: { user: { name, email }, token }});
      }
}

export default new AuthController();