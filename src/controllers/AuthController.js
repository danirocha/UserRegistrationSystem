import jwt from 'jsonwebtoken';
import authConfig from '../config/auth';
import UserService from '../services/UserService';
import * as yup from 'yup';

class AuthController {
    constructor () {
       this.userService = UserService;
       this.loginSchema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required()
       });
    }

    async store (req, res) {
        try {
            await this.loginSchema.validate(req.body, { abortEarly: false });
            
            const { email, password } = req.body;
            const user = this.userService.list({ email });
        
            if (!user || (user && password != user.password)) { // TODO: use bcrypt for the password
                return res.sendResponse({ status: 400, data: { message: 'invalid login data' }});
            }

            const { id, name } = user;
            const token = jwt.sign({ id }, authConfig.secret, authConfig.options);
            
            return res.sendResponse({ status: 200, data: { user: { name, email }, token }});
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: 'invalid login data', errors: err.errors }});
        };
      }
}

export default new AuthController();