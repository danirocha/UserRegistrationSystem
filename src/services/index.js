import UserService from './UserService';
import _AuthService from './Auth';

const AuthService = new _AuthService(UserService);

export { AuthService };