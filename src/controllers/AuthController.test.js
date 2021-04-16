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
        json: (param) => (param)
    }
    const token = 'AUTH_TOKEN';

    UserService.list.mockReturnValue(user);
    jwt.sign.mockReturnValue(token);

    try {
        const result = await AuthController.store(req, res);

        console.log(result);

        expect(result).toBeTruthy();
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('token');
    } catch(err) {
        expect(err).toBeFalsy();
    }
});