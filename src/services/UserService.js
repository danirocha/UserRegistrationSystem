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

        return this.repository.list({ latest: true });
    }

    update(id, data) {
        this.repository.update(id, data);

        return this.repository.list({ id });
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

export default new UserService();