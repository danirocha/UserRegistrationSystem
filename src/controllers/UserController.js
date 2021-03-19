class UserController {
    constructor () {
        // -
    }

    post (req, res) {
        res.json({ message: 'User successfully registered' });
      }
}

export default new UserController();