import UserConfirmationService from '../services/UserConfirmationService';
import UserService from '../services/UserService';

class UserConfirmationController {
    constructor () {
        this.UserConfirmationService = UserConfirmationService;
        this.UserService = UserService;
    }

    update (req, res) {
        const { token } = req.params;
        const userConfirmation = this.UserConfirmationService.list({ token });

        if (!userConfirmation || !userConfirmation.userId) {
            return res.sendResponse({status: 422, data: { message: 'Invalid data' } });
        }

        const tokenExpiration = new Date(userConfirmation.expiresAt);
        const currentDate = new Date();

        if (currentDate > tokenExpiration) {
            return res.sendResponse({status: 422, data: { message: 'Token is expired' } });
        }

        const confirmedUser = this.UserService.update(userConfirmation.userId, { isConfirmed: true });

        return res.sendResponse({status: 200, data: { message: 'User registration confirmed', data: confirmedUser } });
    }
}

export default new UserConfirmationController();