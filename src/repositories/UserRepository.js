import database from '../config/database';

class UserRepository {
    constructor () {
        this.root = 'users';
    }

    get(options) {
        const property = Object.keys(options)[0];
        const value = options[property];

        return database.select (this.root, property, value);
    }

    set(data) {
        database.insert(this.root, data);
    }

    update(userId, data) {
        database.update(this.root, userId, data);
    }
}

export default new UserRepository();