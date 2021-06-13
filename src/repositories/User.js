import Database from '../libs/Database';

class User {
    constructor () {
        this.root = {
            user: 'user',
            userVerification: 'user_verification'
        };
    }

    _list(property, value) {
        const user = Database.select(this.root.user, property, value);

        if (!user) return false;

        const verificationData = Database.select(this.root.userVerification, 'userId', user.id);

        return { ...user, verificationData };
    }

    _listAll() {
        const users = Database.selectAll(this.root.user);

        if (!users) return false;

        for (let key in users) {
            const user = users[key];

            user.verificationData = Database.select(this.root.userVerification, 'userId', user.id);
        }

        return users;
    }

    _listByVerification(options) {
        const property = Object.keys(options)[0];
        const value = options[property];

        const verificationData = Database.select(this.root.userVerification, property, value);
        
        if (!verificationData) return false;
        
        const user = Database.select(this.root.user, 'id', verificationData.userId);

        return { ...user, verificationData };
    }

    list(options) {
        if (!options) {
            return this._listAll();
        }

        if (options.verificationData) {
            return this._listByVerification(options.verificationData);
        }

        const property = Object.keys(options)[0];
        const value = options[property];

        return this._list(property, value);
    }

    listUnverified() {
        const allUsers = this._listAll();
        
        const today = (new Date()).toISOString().split('T')[0];
        const unverifiedUsers = allUsers.filter(user => (!user.isVerified && user.verificationData.expiresAt < today));

        return unverifiedUsers
    }

    store(userData) {
        const { verificationData } = userData;

        delete userData.verificationData;

        const user = Database.insert(this.root.user, userData);
        user.verificationData = Database.insert(this.root.userVerification, { userId: user.id, ...verificationData });

        return user;
    }

    update(id, data) {
        const user = Database.update(this.root.user, id, data);
        const verificationData = Database.select(this.root.userVerification, 'userId', user.id);

        return { ...user, verificationData };
    }

    delete(id) {
        const user = Database.delete(this.root.user, id);
        const verificationData = Database.select(this.root.userVerification, 'userId', user.id);

        user.verificationData = Database.delete(this.root.userVerification, verificationData.id);

        return user;
    }
}

export default new User();