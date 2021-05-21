import UserConfirmationService from '../services/UserConfirmationService';

class UserConfirmationController {
    constructor () {
        this.service = UserConfirmationService;
    }

    update (req, res) {
        return res.sendResponse({status: 200, data: { message: 'User registration confirmed' } });
    }
}

export default new UserConfirmationController();