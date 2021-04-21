import UserService from '../services/UserService';

class UserController {
    constructor () {
        this.service = UserService;
    }

    store (req, res) {
        const { name, email, cpf, password } = req.body;
      
        const user = this.service.list({ cpf });
      
        if (user) {
            return res.sendRequest({ status: 422, data: { message: 'This user already exists' } });
        }
      
        const newUser = this.service.store({ name, email, cpf, password }); // TODO: use bcrypt for the password
        
        return res.sendRequest({ status: 201, data: { message: 'User successfully registered', data: newUser } });
      }

    list (req, res) {
      const userId = req.user.id;
    
      const user = this.service.list({ id: userId });
    
      if (!user) {
          return res.sendRequest({ status: 422, data: { message: "User not found" } });
      }
      
      return res.sendRequest({ status: 200, data: user });
    }

    update (req, res) {
      const { name, email, cpf, password } = req.body;
      const userId = req.user.id;      
      const user = this.service.list({ id: userId });
    
      if (!user) {
          return res.sendRequest({ status: 422, data: { message: "User not found" } });
      }

      if (cpf) {
          const existingCPF = this.service.list({ cpf });
      
          if (existingCPF && existingCPF.id != userId) {
              return sendRequest({ status: 400, data: { message: 'This CPF is already in use' } });
          }
      }
    
      const updatedUser = this.service.update(userId, { name, email, cpf, password });
      
      return res.sendRequest({ status: 200, data: { message: 'User successfully updated', data: updatedUser } });
    }

    delete (req, res) {
        const userId = req.user.id;
        const user = this.service.list({ id: userId });
    
        if (!user) {
            return res.json({ message: "User not found" });
        }

        const deletedUser = this.service.delete(userId);
      
        return res.json({ message: 'User successfully deleted', data: deletedUser });
    }
}

export default new UserController();