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
}

export default new UserVerificationController();