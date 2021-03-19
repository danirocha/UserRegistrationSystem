import UserService from '../services/UserService';

class UserController {
    constructor () {
        this.service = UserService;
    }

    post (req, res) {
        const { name, email, cpf, password } = req.body;
      
        const user = this.service.getUserByCPF(cpf);
      
        if (user) res.json({ message: 'This user already exists' });
      
        this.service.registerUser({ name, email, cpf, password });
        
        res.json({ message: 'User successfully registered' });
      }
}

export default new UserController();