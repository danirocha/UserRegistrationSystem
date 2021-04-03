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

    registerUser(data) {
        this.repository.set(data);
    }

    updateUser(userId, data) {
        this.repository.update(userId, data);
    }
}

export default new UserService();