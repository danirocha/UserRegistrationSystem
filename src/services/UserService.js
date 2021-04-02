import repository from '../repositories/UserRepository';

class UserService {
    constructor () {
        this.repository = repository;
    }

    getUserByCPF(cpf) {
        return this.repository.get({ cpf });
    }

    getUserByID(id) {
        return this.repository.get({ id });
    }

    registerUser(newUser) {
        this.repository.set(newUser);
    }
}

export default new UserService();