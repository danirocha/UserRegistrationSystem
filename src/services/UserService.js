
import repository from '../repositories/UserRepository';
import UserVerificationService from './UserVerificationService';
import Mailer from '../lib/Mailer';

class UserService {
    constructor () {
        this.repository = repository;
        this.UserVerificationService = UserVerificationService;
    }

    list(options) {
        return this.repository.list(options);
    }

    async store(userDTO) {
        const { name, email, cpf, password } = userDTO;
    
        const userAlreadyExists = this.list({ cpf });
    
        if (userAlreadyExists) {
            throw { user_already_exists: true };
        }

        const currentDate = new Date();
        const createdAt = (currentDate).toISOString().split('T')[0]; // TODO: generalize this rule

        const userData = { name, email, cpf, password, isVerified: false, createdAt, }; // TODO: use bcrypt for the password
        
        this.repository.store(userData);
        
        const newUser = this.repository.list({ latest: true });
        const verificationData = await Mailer.sendVerification(email, currentDate);

        this.UserVerificationService.store({ userId: newUser.id, ...verificationData });

        return newUser;
    }

    update(id, data) {
        this.repository.update(id, data);

        return this.repository.list({ id });
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

export default new UserService();