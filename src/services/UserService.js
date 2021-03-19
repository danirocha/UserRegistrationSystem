import repository from '../repositories/UserRepository';

class UserService {
    constructor () {
        this.repository = repository;
    }

    getUserByCPF(cpf) {
        return this.repository.get({ cpf });
    }

    registerUser(newUser) {
        this.repository.set(newUser);
    }
}

export default new UserService();