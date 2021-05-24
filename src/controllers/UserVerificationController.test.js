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
                    token: 'INVALID_CONFIRMATION_TOKEN'
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
                token: "VALID_CONFIRMATION_TOKEN",
                expiresAt: yesterday.toISOString().split('T')[0],
                id: 1
            };
            const req = {
                params: {
                    token: 'VALID_CONFIRMATION_TOKEN'
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
                token: "VALID_CONFIRMATION_TOKEN",
                expiresAt: tomorrow.toISOString().split('T')[0],
                id: 1
            };
            const req = {
                params: {
                    token: 'CONFIRMATION_TOKEN'
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