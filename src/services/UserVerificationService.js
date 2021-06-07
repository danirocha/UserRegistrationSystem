import repository from '../repositories/UserVerificationRepository';

class UserVerificationService {
    constructor() {
        this.repository = repository;
    }

    list(options) {
        return this.repository.list(options);
    }
    
    delete(id) {
        return this.repository.delete(id);
    }
}

export default new UserVerificationService();