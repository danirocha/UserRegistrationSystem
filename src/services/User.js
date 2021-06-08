import Mailer from '../lib/Mailer';

export default class User {
    constructor (UserRepository, UserVerificationRepository) {
        this.UserRepository = UserRepository;
        this.UserVerificationRepository = UserVerificationRepository;
    }

    list(options) {
        const user = this.UserRepository.list(options);
        const verificationData = this.UserVerificationRepository.list({ userId: user.id });

        return { ...user, verificationData };
    }

    listById (userId) {
        const user = this.UserRepository.list({ id: userId });
        const verificationData = this.UserVerificationRepository.list({ userId });
        
        if (!user) {
            throw {};
        }

        return { ...user, verificationData };
    }

    async store (userDTO) {
        const userAlreadyExists = this.UserRepository.list({ cpf: userDTO.cpf });
    
        if (userAlreadyExists) {
            throw { user_already_exists: true };
        }

        const currentDate = new Date();
        const createdAt = (currentDate).toISOString().split('T')[0]; // TODO: generalize this rule

        const userData = { ...userDTO, isVerified: false, createdAt, }; // TODO: use bcrypt for the password
        
        this.UserRepository.store(userData);
        
        const newUser = this.UserRepository.list({ latest: true });
        const verificationData = await Mailer.sendVerification(userDTO.email, currentDate);

        this.UserVerificationRepository.store({ userId: newUser.id, ...verificationData });

        return { ...newUser, verificationData };;
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
        
        this.UserRepository.update(userId, userDTO);

        const updatedUser = this.UserRepository.list({ id: userId });
        const verificationData = this.UserVerificationRepository.list({ userId });

        return { ...updatedUser, verificationData };
    }

    delete(userId) {
        const user = this.UserRepository.list({ id: userId });
        const verificationData = this.UserVerificationRepository.list({ userId });
        
        if (!user) {
            throw { user_not_found: true };
        }
        
        this.UserRepository.delete(userId);
        this.UserVerificationRepository.delete(verificationData.id);
        
        return { ...user, verificationData };
    }

    verify(verificationToken) {
        const userVerification = this.UserVerificationRepository.list({ token: verificationToken });

        if (!userVerification || !userVerification.userId) {
            throw {};
        }

        const tokenExpiration = new Date(userVerification.expiresAt);
        const currentDate = new Date();

        if (currentDate > tokenExpiration) {
            throw { verification_expired: true };
        }

        const verifiedUser = this.update(userVerification.userId, { isVerified: true });

        return verifiedUser;
    }

    deleteUnverifiedUsers() {
        const verificationData = this.UserVerificationRepository.list();
        
        if (!verificationData) return;
        
        const today = (new Date()).toISOString().split('T')[0];
        const expiredVerifications = verificationData.filter(item => item.expiresAt < today);
        const expiredUserIds = expiredVerifications.map(item => item.userId);
        const users = this.UserRepository.list();
        
        if (!users) return;
        
        const unverifiedUsers = users.filter(item => expiredUserIds.indexOf(item.id) > -1 ).filter(item => !item.isVerified);
        const deletedUsersData = [];

        for (let key in unverifiedUsers) {
            const userId = unverifiedUsers[key].id;
            const deletedUser = this.delete(userId);

            deletedUsersData.push(deletedUser);
        }

        return deletedUsersData;
    }
}