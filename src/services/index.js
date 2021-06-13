import { UserRepository } from '../repositories';
import _UserService from './User';
import _AuthService from './Auth';

const UserService = new _UserService(UserRepository);
const AuthService = new _AuthService(UserService);

export { UserService, AuthService };