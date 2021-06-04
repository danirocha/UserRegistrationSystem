import { Router } from 'express';
import UserController from './controllers/UserController';
import UserVerificationController from './controllers/UserVerificationController';
import AuthController from './controllers/AuthController';
import authMiddleware from './middlewares/auth';
import * as validationMiddleware from './middlewares/validation';

const routes = new Router();

routes.post('/user', validationMiddleware.storeUser, (req, res) => UserController.store(req, res));
routes.put('/user/verify/:token', (req, res) => UserVerificationController.update(req, res));
routes.post('/login', validationMiddleware.login, (req, res) => AuthController.store(req, res));
routes.delete('/unverified', (req, res) => UserVerificationController.delete(req, res));

routes.use(authMiddleware);

routes.get('/user', (req, res) => UserController.list(req, res));
routes.put('/user', validationMiddleware.updateUser, (req, res) => UserController.update(req, res));
routes.delete('/user', (req, res) => UserController.delete(req, res));

export default routes;