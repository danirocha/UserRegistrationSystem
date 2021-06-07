import UserVerificationService from '../services/UserVerificationService';
import UserService from '../services/UserService';

class UserVerificationController {
    constructor () {
        this.UserService = UserService;
    }

    update (req, res) {
        try {
            const { token } = req.params
            const verifiedUser = this.UserService.verify(token);

            return res.sendResponse({status: 200, data: { message: 'User registration verified', data: verifiedUser } });
        } catch(err) {
            const errorResponse = {
                status: 422,
                data: {
                    message: 'Invalid data'
                }
            };

            if (err.verification_expired) {
                errorResponse.data.message = 'Verification token is expired';
            }

            return res.sendResponse(errorResponse);
        };
    }
    
    delete (req, res) {
        const verificationData = this.UserVerificationService.list();
        
        if (!verificationData) {
            return res.sendResponse({status: 200, data: { message: 'No unverified users to delete', data: [] } });
        }
        
        const today = (new Date()).toISOString().split('T')[0];
        const expiredVerifications = verificationData.filter(item => item.expiresAt < today);
        const expiredUserIds = expiredVerifications.map(item => item.userId);
        const users = this.UserService.list();
        
        if (!users) {
            return res.sendResponse({status: 200, data: { message: 'No unverified users to delete', data: [] } });
        }
        
        const unverifiedUsers = users.filter(item => expiredUserIds.indexOf(item.id) > -1 ).filter(item => !item.isVerified);
        const deletedUsersData = [];

        for (let key in unverifiedUsers) {
            const userId = unverifiedUsers[key].id;
            const verificationDataForUser = expiredVerifications.find(item => item.userId === userId);
            const deletedUser = this.UserService.delete(userId);
            const deletedVerification = this.UserVerificationService.delete(verificationDataForUser.id);

            deletedUsersData.push({ ...deletedUser , verificationData: { token: deletedVerification.token, expiresAt: deletedVerification.expiresAt} });
        }

        return res.sendResponse({status: 200, data: { message: 'Unverified users deleted', data: deletedUsersData } });
    }
}

export default new UserVerificationController();