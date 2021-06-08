import { AuthService, UserService } from '../services';
import _AuthController from './Auth';
import _UserController from './User';
import _UserVerificationController from './UserVerification';

const AuthController = new _AuthController(AuthService);
const UserController = new _UserController(UserService);
const UserVerificationController = new _UserVerificationController(UserService);

export { AuthController, UserController, UserVerificationController };