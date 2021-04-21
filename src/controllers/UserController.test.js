import UserController from './UserController';
import UserService from '../services/UserService';

jest.mock('../services/UserService');

test('User with valid data should register normally', async () => {
    const user = {
        name: 'Gilberto gil',
        email: 'gilberto@gil.com',
        cpf: '5874911023',
        password: '123456'
    };
    const req = {
        body: user
    };
    const res = {
        sendRequest: (options) => { return options }
    };

    UserService.list.mockReturnValue(null);
    UserService.store.mockReturnValue(user);

    try {
        const { status, data } = await UserController.store(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(201);
        expect(data.data).toBe(user);
    } catch (err) {
        expect(err).toBeFalsy();
    }
});

test("User with an already registered cpf can't register", async () => {
    const cpfUser = {
        id: 1,
        email: 'caetano@velrojo.com',
        cpf: '145833066',
        password: '123456'
    };
    const req = {
        body: {
            name: 'Gilberto gil',
            email: 'gilberto@gil.com',
            cpf: '145833066',
            password: '123456'
        }
    };
    const res = {
        sendRequest: (options) => { return options }
    };

    UserService.list.mockReturnValue(cpfUser);

    try {
        const { status, data } = await UserController.store(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(422);
        expect(UserService.store).not.toBeCalled();
    } catch (err) {
        expect(err).toBeFalsy();
    }
});

test('Existing user should be returned', async () => {
    const user = {
        id: 3,
        email: 'gilberto@gil.com',
        cpf: '145833066',
        password: '123456'
    };
    const req = {
        user: {
            id: user.id
        }
    };
    const res = {
        sendRequest: (options) => { return options }
    };

    UserService.list.mockReturnValue(user);

    try {
        const { status, data } = await UserController.list(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(200);
        expect(data).toBe(user);
    } catch (err) {
        expect(err).toBeFalsy();
    }
});

test("User can't update its cpf to an already registered one", async () => {
    const user = {
        id: 2,
        email: 'beth@nia.com',
        cpf: '25689574113',
        password: '123456'
    };
    const cpfUser = {
        id: 1,
        email: 'caetano@velrojo.com',
        cpf: '145833066',
        password: '123456'
    };
    const req = {
        user: {
            id: user.id
        },
        body: {
            cpf: cpfUser.cpf
        }
    };
    const res = {
        sendRequest: (options) => { return options }
    };

    // UserService.list.mockReturnValue(user);

    try {
        const { status, data } = await UserController.update(req, res);

        expect(data).toBeTruthy();
        expect(status).toBe(400);
    } catch (err) {
        expect(err).toBeFalsy();
    }
});

