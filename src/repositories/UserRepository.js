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

    set(user) {
        database.insert(this.root, user);
    }
}

export default new UserRepository();