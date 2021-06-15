import AuthLib from '../libs/Auth';
import _AuthService from './Auth';

jest.mock('../libs/Auth');

const UserService = {
    list: jest.fn()
};
const AuthService = new _AuthService(UserService);

describe('#login', () => {
    test('it throws an error when the email is not from a user', () => {
        const loginDTO = {
            email: 'not_user@gmail.com',
            password: '123456'
        };

        UserService.list.mockReturnValue(null);

        try {
            const result = AuthService.login(loginDTO);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserService.list).toBeCalledWith({ email: loginDTO.email });
            expect(UserService.list).toReturn();
        }
    });
    test("it throws an error when the email matches a user, but the password doesn't match the user's", () => {
        const loginDTO = {
            email: 'user@gmail.com',
            password: '123456'
        };
        const user = {
            password: '654321'
        };

        UserService.list.mockReturnValue(user);

        try {
            const result = AuthService.login(loginDTO);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserService.list).toBeCalledWith({ email: loginDTO.email });
            expect(UserService.list).toReturn();
        }
    });
    test("it returns user's name, email and auth token when the email and password matches the data of an existing user", () => {
        const loginDTO = {
            email: 'user@gmail.com',
            password: '123456'
        };
        const user = { ...loginDTO, id: 21, name: 'User Name'};
        const authToken = 'AUTH_TOKEN';
        const resultModel = {
            user: {
                name: user.name,
                email: user.email
            },
            token: authToken
        }

        UserService.list.mockReturnValue(user);
        AuthLib.generateToken.mockReturnValue(authToken);

        try {
            const result = AuthService.login(loginDTO);

            expect(result).toBeTruthy();
            expect(result).toEqual(resultModel);
            expect(UserService.list).toBeCalledWith({ email: loginDTO.email });
            expect(UserService.list).toReturn();
            expect(AuthLib.generateToken).toBeCalledWith(user.id);
            expect(AuthLib.generateToken).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});