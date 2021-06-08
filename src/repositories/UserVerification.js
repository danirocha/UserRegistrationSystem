import database from '../config/database';

class UserVerification {
    constructor () {
        this.root = 'user_verification';
    }

    list(options) {
        if (!options) {
            return database.selectAll(this.root);
        }

        if (options.latest) {
            return database.selectLatest(this.root);
        }
        
        const property = Object.keys(options)[0];
        const value = options[property];

        return database.select(this.root, property, value);
    }

    store(data) {
        database.insert(this.root, data);
    }

    update(id, data) {
        database.update(this.root, id, data);
    }

    delete(id) {
        return database.delete(this.root, id)
    }
}

export default new UserVerification();