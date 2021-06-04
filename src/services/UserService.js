
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

    listById (userId) {
        const user = this.repository.list({ id: userId });
        
        if (!user) {
            throw {};
        }

        return user;
    }

    async store (userDTO) {
        const userAlreadyExists = this.repository.list({ cpf: userDTO.cpf });
    
        if (userAlreadyExists) {
            throw { user_already_exists: true };
        }

        const currentDate = new Date();
        const createdAt = (currentDate).toISOString().split('T')[0]; // TODO: generalize this rule

        const userData = { ...userDTO, isVerified: false, createdAt, }; // TODO: use bcrypt for the password
        
        this.repository.store(userData);
        
        const newUser = this.repository.list({ latest: true });
        const verificationData = await Mailer.sendVerification(userDTO.email, currentDate);

        this.UserVerificationService.store({ userId: newUser.id, ...verificationData });

        return newUser;
    }

    update(userId, userDTO) {
        const user = this.repository.list({ id: userId });
        
        if (!user) {
            throw { user_not_found: true };
        }

        if (userDTO.cpf) {
            const existingCPF = this.repository.list({ cpf: userDTO.cpf });
        
            if (existingCPF && existingCPF.id != userId) {
                throw  { cpf_in_use: true };
            }
        }
        
        this.repository.update(userId, userDTO);

        const updatedUser = this.repository.list({ id: userId });

        return updatedUser;
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

export default new UserService();