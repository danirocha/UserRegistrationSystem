import Mailer from '../libs/Mailer';
import UserRepository from '../repositories/User';
import _UserService from './User';

jest.mock('../libs/Mailer');
jest.mock('../repositories/User');

const UserService = new _UserService(UserRepository);

describe('#listById', () => {
    test('it throws an error if the id matches no user', () => {
        const userId = 15;

        UserRepository.list.mockReturnValue(null);

        try {
            const result = UserService.listById(userId);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ id: userId });
            expect(UserRepository.list).toReturn();
        }
    });

    test('it returns the user if the id matches a user', () => {
        const user = {
            id: 11
        };

        UserRepository.list.mockReturnValue(user);

        try {
            const result = UserService.listById(user.id);

            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ id: user.id });
            expect(UserRepository.list).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#store', () => {
    test("it throws an error if the cpf is already registered", async () => {
        const userDTO = {
            cpf: '12345678910'
        };

        UserRepository.list.mockReturnValue(userDTO);

        try {
            const result = await UserService.store(userDTO);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ cpf: userDTO.cpf });
            expect(UserRepository.list).toReturn();
        }
    });

    test("it returns the new registered user if the cpf is not registered yet", async () => {
        const userDTO = {
            cpf: '12345678910'
        };
        const verificationData = {
            expiresAt: '2021-06-13',
            token: 'VERIFICATION_TOKEN'
        };
        const newUser = {
            id: 21,
            ...userDTO,
            verificationData
        };

        UserRepository.list.mockReturnValue(null);
        Mailer.generateVerificationData.mockResolvedValue(verificationData);
        UserRepository.store.mockReturnValue(newUser);

        try {
            const result = await UserService.store(userDTO);

            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ cpf: userDTO.cpf });
            expect(UserRepository.list).toReturn();
            expect(Mailer.generateVerificationData).toReturn();
            expect(UserRepository.store).toBeCalledWith(
                expect.objectContaining({
                    ...userDTO,
                    verificationData,
                    isVerified: false,
                    createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}/g),
                })
              );
            expect(UserRepository.store).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#update', () => {
    test("it throws an error if the id doesn't match any user", () => {
        const userId = 12;

        UserRepository.list.mockReturnValue(null);

        try {
            const result = UserService.update(userId, {});

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ id: userId });
            expect(UserRepository.list).toReturn();
        }
    });
    
    test("it throws an error if the id matches a user, but the cpf is registered at another user id", () => {
        const userId = 12;
        const userDTO = {
            cpf: '12345678910'
        };

        UserRepository.list.mockReturnValueOnce({ id: userId });
        UserRepository.list.mockReturnValueOnce({ id: 13, ...userDTO });

        try {
            const result = UserService.update(userId, userDTO);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledTimes(2);
            expect(UserRepository.list).nthCalledWith(1, { id: userId });
            expect(UserRepository.list).nthCalledWith(2, { cpf: userDTO.cpf });
            expect(UserRepository.list).toReturnTimes(2);
        }
    });

    test("it returns the updated user if the id matches a user and the cpf isn't registered yet", () => {
        const userId = 12;
        const userDTO = {
            cpf: '12345678910'
        };

        UserRepository.list.mockReturnValueOnce({ id: userId });
        UserRepository.list.mockReturnValueOnce(null);
        UserRepository.update.mockReturnValueOnce({});

        try {
            const result = UserService.update(userId, userDTO);

            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledTimes(2);
            expect(UserRepository.list).nthCalledWith(1, { id: userId });
            expect(UserRepository.list).nthCalledWith(2, { cpf: userDTO.cpf });
            expect(UserRepository.list).toReturnTimes(2);
            expect(UserRepository.update).toBeCalledWith(userId , userDTO);
            expect(UserRepository.update).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });

    test("it returns the updated user if the id matches a user and the cpf matches the user's", () => {
        const userId = 12;
        const userDTO = {
            cpf: '12345678910'
        };

        UserRepository.list.mockReturnValueOnce({ id: userId });
        UserRepository.list.mockReturnValueOnce({ id: userId, ...userDTO });
        UserRepository.update.mockReturnValueOnce({});

        try {
            const result = UserService.update(userId, userDTO);

            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledTimes(2);
            expect(UserRepository.list).nthCalledWith(1, { id: userId });
            expect(UserRepository.list).nthCalledWith(2, { cpf: userDTO.cpf });
            expect(UserRepository.list).toReturnTimes(2);
            expect(UserRepository.update).toBeCalledWith(userId , userDTO);
            expect(UserRepository.update).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#delete', () => {
    test("it throws an error if the id doesn't match any user", () => {
        const userId = 25;

        UserRepository.list.mockReturnValue(null);

        try {
            const result = UserService.delete(userId);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ id: userId });
            expect(UserRepository.list).toReturn();
        }
    });

    test("it returns the deleted user if the id matches one", () => {
        const user = {
            id: 25
        };

        UserRepository.list.mockReturnValue(user);
        UserRepository.delete.mockReturnValue({});

        try {
            const result = UserService.delete(user.id);

            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith({ id: user.id });
            expect(UserRepository.list).toReturn();
            expect(UserRepository.delete).toBeCalledWith(user.id);
            expect(UserRepository.delete).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
});

describe('#verify', () => {
    test("it throws an error if the token is not linked to any user", () => {
        const verificationToken = 'VERIFICATION_TOKEN';
        const verificationDataObject = {
            verificationData: {
                token: verificationToken
            }
        };

        UserRepository.list.mockReturnValue(null);

        try {
            const result = UserService.verify(verificationToken);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith(verificationDataObject);
            expect(UserRepository.list).toReturn();
        }
    });

    test("it throws an error if the token is linked to a user, but already expired", () => {
        const today = new Date();
        const yesterday = new Date(today.setDate(today.getDate() - 1));
        const verificationToken = 'VERIFICATION_TOKEN';
        const verificationDataObject = {
            verificationData: {
                token: verificationToken
            }
        };
        const user = {
            id: 32,
            verificationData: { 
                token: verificationToken,
                expiresAt: yesterday.toISOString().split('T')[0]
            }
        };

        UserRepository.list.mockReturnValue(user);

        try {
            const result = UserService.verify(verificationToken);

            expect(result).toBeFalsy();
        } catch (err) {
            expect(err).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith(verificationDataObject);
            expect(UserRepository.list).toReturn();
        }
    });

    test("it returns the verified user if the token is linked to one and still in effect", () => {
        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1));
        const verificationToken = 'VERIFICATION_TOKEN';
        const verificationDataObject = {
            verificationData: {
                token: verificationToken
            }
        };
        const user = {
            id: 32,
            verificationData: { 
                token: verificationToken,
                expiresAt: tomorrow.toISOString().split('T')[0]
            }
        };
        const verifiedObject = {
            isVerified: true
        };
        const updateMock = jest.spyOn(UserService, "update");

        updateMock.mockImplementation(jest.mock());
        updateMock.mockReturnValue({ ...user, ...verifiedObject });
        UserRepository.list.mockReturnValue(user);
        
        try {
            const result = UserService.verify(verificationToken);
            
            expect(result).toBeTruthy();
            expect(UserRepository.list).toBeCalledWith(verificationDataObject);
            expect(UserRepository.list).toReturn();
            expect(updateMock).toBeCalledWith(user.id, verifiedObject);
            expect(updateMock).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }

        updateMock.mockRestore();
    });
});

describe('#deleteUnverifiedUsers', () => {
    test("it returns an empty array if there are no unverified users with their verification tokens' expired", () => {
        UserRepository.listUnverifiedAndExpired.mockReturnValue(null);

        try {
            const result = UserService.deleteUnverifiedUsers();

            expect(result).toBeTruthy();
            expect(result).toEqual([]);
            expect(UserRepository.listUnverifiedAndExpired).toBeCalled();
            expect(UserRepository.listUnverifiedAndExpired).toReturn();
        } catch (err) {
            expect(err).toBeFalsy();
        }
    });
    test("it returns an array with all deleted users if there are unverifieds users with their verification tokens' expired", () => {
        const unverifiedUsers = [
            {
                id: 32,
                name: 'User Name'
            },
            {
                id: 56,
                name: 'User Name'
            }
        ];
        const deleteMock = jest.spyOn(UserService, "delete");

        deleteMock.mockImplementation(jest.mock());
        deleteMock.mockReturnValueOnce(unverifiedUsers[0]);
        deleteMock.mockReturnValueOnce(unverifiedUsers[1]);
        UserRepository.listUnverifiedAndExpired.mockReturnValue(unverifiedUsers);

        try {
            const result = UserService.deleteUnverifiedUsers();

            expect(result).toBeTruthy();
            expect(result).toEqual(unverifiedUsers);
            expect(UserRepository.listUnverifiedAndExpired).toBeCalled();
            expect(UserRepository.listUnverifiedAndExpired).toReturn();
            expect(deleteMock).toBeCalledTimes(2);
            expect(deleteMock).nthCalledWith(1, unverifiedUsers[0].id);
            expect(deleteMock).nthCalledWith(2, unverifiedUsers[1].id);
            expect(deleteMock).toReturnTimes(2);
        } catch (err) {
            expect(err).toBeFalsy();
        }

        deleteMock.mockRestore();
    });
});