import Mailer from '../libs/Mailer';

export default class User {
    constructor (UserRepository) {
        this.UserRepository = UserRepository;
    }

    list(options) {
        return this.UserRepository.list(options);
    }

    listById (userId) {
        const user = this.UserRepository.list({ id: userId });
        
        if (!user) {
            throw {};
        }

        return user;
    }

    async store (userDTO) {
        const userAlreadyExists = this.UserRepository.list({ cpf: userDTO.cpf });
    
        if (userAlreadyExists) {
            throw { user_already_exists: true };
        }

        const currentDate = new Date();
        const createdAt = (currentDate).toISOString().split('T')[0]; // TODO: generalize this rule
        const userData = { ...userDTO, isVerified: false, createdAt, }; // TODO: use bcrypt for the password
        const verificationData = await Mailer.generateVerificationData(currentDate)
        const newUser = this.UserRepository.store({ ...userData, verificationData });
        
        Mailer.sendVerification(userDTO.email, verificationData.token);

        return newUser;
    }

    update(userId, userDTO) {
        const user = this.UserRepository.list({ id: userId });
        
        if (!user) {
            throw { user_not_found: true };
        }

        if (userDTO.cpf) {
            const existingCPF = this.UserRepository.list({ cpf: userDTO.cpf });
        
            if (existingCPF && existingCPF.id != userId) {
                throw  { cpf_in_use: true };
            }
        }

        const updatedUser = this.UserRepository.update(userId, userDTO);

        return updatedUser;
    }

    delete(userId) {
        const user = this.UserRepository.list({ id: userId });
        
        if (!user) {
            throw { user_not_found: true };
        }
        
        const deletedUser = this.UserRepository.delete(userId);
        
        return deletedUser;
    }

    verify(verificationToken) {
        const verificationData = { token: verificationToken };
        const user = this.UserRepository.list({ verificationData });

        if (!user) {
            throw {};
        }

        const tokenExpiration = new Date(user.verificationData.expiresAt);
        const currentDate = new Date();

        if (currentDate > tokenExpiration) {
            throw { verification_expired: true };
        }

        const verifiedUser = this.update(user.id, { isVerified: true });

        return verifiedUser;
    }

    deleteUnverifiedUsers() {
        const unverifiedUsers = this.UserRepository.listUnverified();

        if (!unverifiedUsers) return;

        const deletedUsersData = [];

        for (let key in unverifiedUsers) {
            const userId = unverifiedUsers[key].id;
            const deletedUser = this.delete(userId);

            deletedUsersData.push(deletedUser);
        }

        return deletedUsersData;
    }
}