import UserService from '../services/UserService';

class UserController {
    constructor () {
        this.service = UserService;
    }

    store (req, res) {
        const { name, email, cpf, password } = req.body;
      
        const user = this.service.getUserByCPF(cpf);
      
        if (user) {
            return res.json({ message: 'This user already exists' });
        }
      
        this.service.registerUser({ name, email, cpf, password });
        
        return res.json({ message: 'User successfully registered' });
      }

      list (req, res) {
        const userId = +req.params.userId;
      
        const user = this.service.getUserByID(userId);
      
        if (!user) {
            return res.json({ message: "User not found" });
        }
        
        return res.json({ user });
      }

      update (req, res) {
        const { name, email, cpf, password } = req.body;
        const userId = +req.params.userId;
      
        const user = this.service.getUserByID(userId);
      
        if (!user) {
            return res.json({ message: "User not found" });
        }

        if (cpf) {
            const existingCPF = this.service.getUserByCPF(cpf);
        
            if (existingCPF && existingCPF.id != userId) {
                return res.json({ message: 'This CPF is already in use' });
            }
        }
      
        this.service.updateUser(userId, { name, email, cpf, password });
        
        return res.json({ message: 'User successfully updated' });
      }
}

export default new UserController();