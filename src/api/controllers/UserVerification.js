export default class UserVerification {
    constructor (UserService) {
        this.UserService = UserService;
    }

    async update (req, res) {
        try {
            const { token } = req.params
            const verifiedUser = await this.UserService.verify(token);

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
    
    async delete (req, res) {
        const deletedUsersData = await this.UserService.deleteUnverifiedUsers();

        return res.sendResponse({status: 200, data: { message: 'Unverified users deleted', data: deletedUsersData } });
    }
}