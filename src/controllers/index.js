import { AuthService } from '../services';
import _AuthController from './Auth';
const AuthController = new _AuthController(AuthService);

export { AuthController };