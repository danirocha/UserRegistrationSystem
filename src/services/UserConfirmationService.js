import repository from '../repositories/UserConfirmationRepository';

class UserConfirmationService {
    constructor() {
        this.repository = repository;
    }

    store(data) {
        this.repository.store(data);

        return this.repository.list({ latest: true });
    }
}

export default new UserConfirmationService();