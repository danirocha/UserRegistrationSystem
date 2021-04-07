import repository from '../repositories/UserRepository';

class UserService {
    constructor () {
        this.repository = repository;
    }

    list(options) {
        return this.repository.list(options);
    }

    store(data) {
        this.repository.store(data);
    }

    update(id, data) {
        this.repository.update(id, data);
    }
}

export default new UserService();