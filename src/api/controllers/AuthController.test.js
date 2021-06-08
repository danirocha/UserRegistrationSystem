import AuthController from './AuthController';
import UserService from '../services/UserService';
import jwt from 'jsonwebtoken';

jest.mock('../services/UserService');
jest.mock('jsonwebtoken');

test('User with valid data should login normally', async () => {
    const user = {
        id: 3,
        name: 'Gilberto Gil',
        password: '123456'
    };
    const req = {
        body: {
            email: 'gilberto@gil.com',
            password: user.password
        }
    };
    const res = {
        sendResponse: (options) => { return options; }
    }
    const token = 'AUTH_TOKEN';

    UserService.list.mockReturnValue(user);
    jwt.sign.mockReturnValue(token);

    try {
        const { status, data } = await AuthController.store(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(200);
        expect(data).toHaveProperty('user');
        expect(data).toHaveProperty('token');
    } catch(err) {
        expect(err).toBeFalsy();
    }
});

test('User with invalid password should not login', async () => {
    const user = {
        id: 3,
        name: 'Gilberto Gil',
        password: '123456'
    };
    const req = {
        body: {
            email: 'gilberto@gil.com',
            password: '123457'
        }
    };
    const res = {
        sendResponse: (options) => { return options; }
    }
    const token = 'AUTH_TOKEN';

    UserService.list.mockReturnValue(user);
    jwt.sign.mockReturnValue(token);

    try {
        const { status, data } = await AuthController.store(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(400);
    } catch(err) {
        expect(err).toBeFalsy();
    }
});

test('User with invalid email should not login', async () => {
    const user = {};
    const req = {
        body: {
            email: 'gilberto@gila.com',
            password: '123456'
        }
    };
    const res = {
        sendResponse: (options) => { return options; }
    }
    const token = 'AUTH_TOKEN';

    UserService.list.mockReturnValue(user);
    jwt.sign.mockReturnValue(token);

    try {
        const { status, data } = await AuthController.store(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(400);
    } catch(err) {
        expect(err).toBeFalsy();
    }
});