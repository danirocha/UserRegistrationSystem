import Database from '../libs/Database';

class UserVerification {
    constructor () {
        this.root = 'user_verification';
    }

    list(options) {
        if (!options) {
            return Database.selectAll(this.root);
        }

        if (options.latest) {
            return Database.selectLatest(this.root);
        }
        
        const property = Object.keys(options)[0];
        const value = options[property];

        return Database.select(this.root, property, value);
    }

    store(data) {
        Database.insert(this.root, data);
    }

    update(id, data) {
        Database.update(this.root, id, data);
    }

    delete(id) {
        return Database.delete(this.root, id)
    }
}

export default new UserVerification();