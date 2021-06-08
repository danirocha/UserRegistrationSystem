export default class Auth {
    constructor (AuthService) {
       this.AuthService = AuthService;
    }

    async store (req, res) {
        try {
            const loginData = await this.AuthService.login(req.body);

            return res.sendResponse({ status: 200, data: loginData });
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: 'invalid login data' } });
        };
    }
}