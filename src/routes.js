import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = new Router();

routes.post('/user', (req, res) => UserController.store(req, res));
routes.get('/user/:userId', (req, res) => UserController.list(req, res));

export default routes;