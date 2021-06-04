import UserService from '../services/UserService';

class UserController {
    constructor () {
        this.UserService = UserService;
    }

    async store (req, res) {
        try {
            const newUser = await this.UserService.store(req.body);

            return res.sendResponse({ status: 201, data: { message: 'User successfully registered', data: newUser } });
        } catch (err) {
            const errorResponse = {
                status: 422,
                data: {
                    message: 'Invalid registration data'
                }
            };

            if (err.user_already_exists) {
                errorResponse.data.message = 'This user already exists';
            }

            return res.sendResponse(errorResponse);
        };
      }

    list (req, res) {
      const userId = req.user.id;
    
      const user = this.UserService.list({ id: userId });
    
      if (!user) {
          return res.sendResponse({ status: 422, data: { message: "User not found" } });
      }
      
      return res.sendResponse({ status: 200, data: user });
    }

    async update (req, res) {
        try {
            const { name, email, cpf, password } = req.body;
            const userId = req.user.id;      
            const user = this.UserService.list({ id: userId });
            
            if (!user) {
                return res.sendResponse({ status: 422, data: { message: "User not found" } });
            }

            if (cpf) {
                const existingCPF = this.UserService.list({ cpf });
            
                if (existingCPF && existingCPF.id != userId) {
                    return res.sendResponse({ status: 400, data: { message: 'This CPF is already in use' } });
                }
            }
            
            const updatedUser = this.UserService.update(userId, { name, email, cpf, password });
            
            return res.sendResponse({ status: 200, data: { message: 'User successfully updated', data: updatedUser } });
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: 'invalid data', errors: err.errors }});
        };
    }

    delete (req, res) {
        const userId = req.user.id;
        const user = this.UserService.list({ id: userId });
    
        if (!user) {
            return res.sendResponse({status: 422, data: { message: "User not found" } });
        }

        const deletedUser = this.UserService.delete(userId);
      
        return res.sendResponse({status: 200, data: { message: 'User successfully deleted', data: deletedUser } });
    }
}

export default new UserController();