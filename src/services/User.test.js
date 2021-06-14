import Mailer from '../libs/Mailer';
import UserRepository from '../repositories/User';
import _UserService from './User';

jest.mock('../libs/Mailer');
jest.mock('../repositories/User');

const UserService = new _UserService(UserRepository);

describe('#listById', () => {
    test('it throws an error if the id matches no user', () => {
        // -
    });

    test('it returns the user if the id matches a user', () => {
        // -
    });
});

describe('#store', () => {
    test("it throws an error if the cpf is already registered", () => {
        // -
    });

    test("it returns the new registered user if the cpf is not registered yet", () => {
        // -
    });
});

describe('#update', () => {
    test("it throws an error if the id doesn't match any user", () => {
        // -
    });
    
    test("it throws an error if the id matches a user, but the cpf is registered at another user id", () => {
        // -
    });

    test("it returns the updated user if the id matches a user and the cpf isn't registered yet", () => {
        // -
    });

    test("it returns the updated user if the id matches a user and the cpf matches the user's", () => {
        // -
    });
});

describe('#delete', () => {
    test("it throws an error if the id doesn't match any user", () => {
        // -
    });

    test("it returns the deleted user if the id matches one", () => {
        // -
    });
});

describe('#verify', () => {
    test("it throws an error if the token is not linked to any user", () => {
        // -
    });

    test("it throws an error if the token is linked to a user, but already expired", () => {
        // -
    });

    test("it returns the verified user if the token is linked to one and still in effect", () => {
        // -
    });
});

describe('#deleteUnverifiedUsers', () => {
    test("it returns null if there are no unverified users with their verification tokens' expired", () => {
        // -
    });
    test("it returns an array with all deleted users if there are unverifieds users with their verification tokens' expired", () => {
        // -
    });
});