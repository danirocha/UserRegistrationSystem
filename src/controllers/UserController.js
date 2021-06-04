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

    async list (req, res) {
        try {
            const userId = req.user.id;
            const user = await this.UserService.listById(userId);

            return res.sendResponse({ status: 200, data: user });
        } catch (err) {
            return res.sendResponse({ status: 422, data: { message: "User not found" } });
        }      
    }

    async update (req, res) {
        try {
            const updatedUser = await this.UserService.update(req.user.id, req.body);
            
            return res.sendResponse({ status: 200, data: { message: 'User successfully updated', data: updatedUser } });
          } catch (err) {
            const errorResponse = {
                status: 422,
                data: {
                    message: 'Invalid update data'
                }
            };

            if (err.user_not_found) {
                errorResponse.data.message = 'User not found';
            } else if (err.cpf_in_use) {
              errorResponse.data.message = 'This CPF is already in use';
            }

            return res.sendResponse(errorResponse);
        };
    }

    async delete (req, res) {
      try {
          const userId = req.user.id;
          const deletedUser = await this.UserService.delete(userId);

          return res.sendResponse({ status: 200, data: { message: 'User successfully deleted', data: deletedUser } });
      } catch (err) {
          return res.sendResponse({ status: 422, data: { message: "User not found" } });
      }     
    }
}

export default new UserController();