import UserVerificationController from './UserVerificationController';
import UserVerificationService from '../services/UserVerificationService';
import UserService from '../services/UserService';

jest.mock('../services/UserVerificationService');
jest.mock('../services/UserService');

describe('#update', () => {
    describe('with a provided token', () => {
        test('it returns error with status 422 when the token is invalid', async () => {
            const req = {
                params: {
                    token: 'INVALID_VERIFICATION_TOKEN'
                }
            };
            const res = {
                sendResponse: (options) => { return options; }
            }

            UserVerificationService.list.mockReturnValue(null);

            try {
                const { status, data } = await UserVerificationController.update(req, res);

                expect(status).toBe(422);
                expect(data).toBeTruthy();
                expect(UserVerificationService.list).toBeCalledTimes(1);
                expect(UserVerificationService.list).toBeCalledWith(req.params);
                expect(UserService.update).not.toBeCalled();
            } catch (err) {
                expect(err).toBeFalsy();
            }
        });

        test('it returns error with status 422 when the token is expired', async () => {
            const today = new Date();
            const yesterday = new Date(today.setDate(today.getDate() - 1));
            const userVerification = {
                userId: 1,
                token: "VALID_VERIFICATION_TOKEN",
                expiresAt: yesterday.toISOString().split('T')[0],
                id: 1
            };
            const req = {
                params: {
                    token: 'VALID_VERIFICATION_TOKEN'
                }
            };
            const res = {
                sendResponse: (options) => { return options; }
            }

            UserVerificationService.list.mockReturnValue(userVerification);

            try {
                const { status, data } = await UserVerificationController.update(req, res);

                expect(status).toBe(422);
                expect(data).toBeTruthy();
                expect(UserVerificationService.list).toBeCalledTimes(1);
                expect(UserVerificationService.list).toBeCalledWith(req.params);
                expect(UserService.update).not.toBeCalled();
            } catch (err) {
                expect(err).toBeFalsy();
            }
        });

        test("it confirms the user's registration and returns success with status 200 when the token is valid and not expired", async () => {
            const today = new Date();
            const tomorrow = new Date(today.setDate(today.getDate() + 1));
            const userVerification = {
                userId: 1,
                token: "VALID_VERIFICATION_TOKEN",
                expiresAt: tomorrow.toISOString().split('T')[0],
                id: 1
            };
            const req = {
                params: {
                    token: 'VERIFICATION_TOKEN'
                }
            };
            const res = {
                sendResponse: (options) => { return options; }
            }

            UserVerificationService.list.mockReturnValue(userVerification);
            UserService.update.mockReturnValue({});

            try {
                const { status, data } = await UserVerificationController.update(req, res);

                expect(status).toBe(200);
                expect(data).toBeTruthy();
                expect(UserVerificationService.list).toBeCalledTimes(1);
                expect(UserVerificationService.list).toBeCalledWith(req.params);
                expect(UserService.update).toBeCalledTimes(1);
                expect(UserService.update).toBeCalledWith(userVerification.userId, expect.anything());
            } catch (err) {
                expect(err).toBeFalsy();
            }
        });
    });
});

describe('#delete', () => {
    describe('with no expired verifications', () => {
        test('it returns success with a status 200', async () => {
            const req = {};
            const res = {
                sendResponse: (options) => { return options; }
            };

            UserVerificationService.list.mockReturnValue(null);

            try {
                const { status, data } = await UserVerificationController.delete(req, res);

                expect(status).toBe(200);
                expect(data).toBeTruthy();
                expect(data.data).toEqual([]);
                expect(UserVerificationService.list).toBeCalledTimes(1);
            } catch (err) {
                expect(err).toBeFalsy();
            }
        })
    })

    describe('with expired verifications', () => {
        test('it returns success with a status 200 when there are no unverified users to delete', async () => {
            const today = new Date();
            const yesterday = new Date(today.setDate(today.getDate() - 1));
            const expiredVerificationData = [{
                userId: 1,
                expiresAt: yesterday.toISOString().split('T')[0]
            }];
            const req = {};
            const res = {
                sendResponse: (options) => { return options; }
            };

            UserVerificationService.list.mockReturnValue(expiredVerificationData);
            UserService.list.mockReturnValue(null);

            try {
                const { status, data } = await UserVerificationController.delete(req, res);

                expect(status).toBe(200);
                expect(data).toBeTruthy();
                expect(data.data).toEqual([]);
                expect(UserVerificationService.list).toBeCalledTimes(1);
                expect(UserService.list).toBeCalledTimes(1);
            } catch (err) {
                expect(err).toBeFalsy();
            }
        })

        test('it returns success with a status 200 when there are unverified users to delete', async () => {
            const today = new Date();
            const yesterday = new Date(today.setDate(today.getDate() - 1));
            const expiredVerificationData = [{
                id: 11,
                userId: 10,
                expiresAt: yesterday.toISOString().split('T')[0],
                token: 'VALID_VERIFICATION_TOKEN'
            }];
            const unverifiedUserData = [{
                id: 10,
                isVerified: false
            }]
            const req = {};
            const res = {
                sendResponse: (options) => { return options; }
            };

            UserVerificationService.list.mockReturnValue(expiredVerificationData);
            UserVerificationService.delete.mockReturnValue(expiredVerificationData);
            UserService.list.mockReturnValue(unverifiedUserData);
            UserService.delete.mockReturnValue(unverifiedUserData);

            try {
                const { status, data } = await UserVerificationController.delete(req, res);

                expect(status).toBe(200);
                expect(data).toBeTruthy();
                expect(UserVerificationService.list).toBeCalledTimes(1);
                expect(UserService.list).toBeCalledTimes(1);
                expect(UserService.delete).toBeCalledTimes(1);
                expect(UserVerificationService.delete).toBeCalledTimes(1);
            } catch (err) {
                expect(err).toBeFalsy();
                console.log(err);
            }
        })
    })
})