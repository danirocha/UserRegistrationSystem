import UserService from '../services/UserService';
import UserVerificationService from '../services/UserVerificationService';
import Mailer from '../lib/Mailer';
import * as yup from 'yup';

class UserController {
    constructor () {
        this.userService = UserService;
        this.UserVerificationService = UserVerificationService;
        this.newUserSchema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            cpf: yup.string().length(11).matches(/\d/).required(),
            password: yup.string().min(6).required()
        });
        this.updatedUserSchema = yup.object().shape({
            name: yup.string(),
            email: yup.string().email(),
            cpf: yup.string().length(11).matches(/\d/),
            password: yup.string().min(6)
        });
    }

    async store (req, res) {
        try {
            await this.newUserSchema.validate(req.body, { abortEarly: false });
            const { name, email, cpf, password } = req.body;
        
            const user = this.userService.list({ cpf });
        
            if (user) {
                return res.sendResponse({ status: 422, data: { message: 'This user already exists' } });
            }

            const currentDate = new Date();
            const createdAt = (currentDate).toISOString();

            const newUser = this.userService.store({ name, email, cpf, password, isVerified: false, createdAt, }); // TODO: use bcrypt for the password
            
            const verificationData = await Mailer.sendVerification(email, currentDate);

            this.UserVerificationService.store({ userId: newUser.id, ...verificationData });

            return res.sendResponse({ status: 201, data: { message: 'User successfully registered', data: newUser } });
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: 'invalid data', errors: err.errors }});
        };
      }

    list (req, res) {
      const userId = req.user.id;
    
      const user = this.userService.list({ id: userId });
    
      if (!user) {
          return res.sendResponse({ status: 422, data: { message: "User not found" } });
      }
      
      return res.sendResponse({ status: 200, data: user });
    }

    async update (req, res) {
        try {
            await this.updatedUserSchema.validate(req.body, { abortEarly: false });

            const { name, email, cpf, password } = req.body;
            const userId = req.user.id;      
            const user = this.userService.list({ id: userId });
            
            if (!user) {
                return res.sendResponse({ status: 422, data: { message: "User not found" } });
            }

            if (cpf) {
                const existingCPF = this.userService.list({ cpf });
            
                if (existingCPF && existingCPF.id != userId) {
                    return res.sendResponse({ status: 400, data: { message: 'This CPF is already in use' } });
                }
            }
            
            const updatedUser = this.userService.update(userId, { name, email, cpf, password });
            
            return res.sendResponse({ status: 200, data: { message: 'User successfully updated', data: updatedUser } });
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: 'invalid data', errors: err.errors }});
        };
    }

    delete (req, res) {
        const userId = req.user.id;
        const user = this.userService.list({ id: userId });
    
        if (!user) {
            return res.sendResponse({status: 422, data: { message: "User not found" } });
        }

        const deletedUser = this.userService.delete(userId);
      
        return res.sendResponse({status: 200, data: { message: 'User successfully deleted', data: deletedUser } });
    }
}

export default new UserController();