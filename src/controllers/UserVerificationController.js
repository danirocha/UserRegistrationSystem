import UserVerificationService from '../services/UserVerificationService';
import UserService from '../services/UserService';

class UserVerificationController {
    constructor () {
        this.UserVerificationService = UserVerificationService;
        this.UserService = UserService;
    }

    update (req, res) {
        const { token } = req.params;
        const userVerification = this.UserVerificationService.list({ token });

        if (!userVerification || !userVerification.userId) {
            return res.sendResponse({status: 422, data: { message: 'Invalid data' } });
        }

        const tokenExpiration = new Date(userVerification.expiresAt);
        const currentDate = new Date();

        if (currentDate > tokenExpiration) {
            return res.sendResponse({status: 422, data: { message: 'Token is expired' } });
        }

        const verifiedUser = this.UserService.update(userVerification.userId, { isVerified: true });

        return res.sendResponse({status: 200, data: { message: 'User registration verified', data: verifiedUser } });
    }
    
    async delete (req, res) {
        const today = (new Date()).toISOString().split('T')[0];
        const verificationData = await this.UserVerificationService.list();
        const expiredUserIds = verificationData.filter(item => item.expiresAt < today).map(item => item.userId);

        if (!expiredUserIds.length) {
            return res.sendResponse({status: 200, data: { message: 'No unverified users to delete', data: expiredUserIds } });
        }

        const users = await this.UserService.list();
        const unverifiedUsers = users.filter(item => expiredUserIds.indexOf(item.id) > -1 ).filter(item => !item.isVerified);

        if (!unverifiedUsers.length) {
            return res.sendResponse({status: 200, data: { message: 'No unverified users to delete', data: unverifiedUsers } });
        }

        const deletedUsers = [];

        for (let key in unverifiedUsers) {
            deletedUsers.push(await this.UserService.delete(unverifiedUsers[key].id));
        }

        return res.sendResponse({status: 200, data: { message: 'Unverified users deleted', data: deletedUsers } });
    }
}

export default new UserVerificationController();