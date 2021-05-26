import repository from '../repositories/UserVerificationRepository';

class UserVerificationService {
    constructor() {
        this.repository = repository;
    }

    list(options) {
        return this.repository.list(options);
    }

    store(data) {
        this.repository.store(data);

        return this.repository.list({ latest: true });
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

export default new UserVerificationService();