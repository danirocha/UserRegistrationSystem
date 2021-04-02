import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = new Router();

routes.post('/user', (req, res) => UserController.post(req, res));
routes.get('/user/:userId', (req, res) => UserController.get(req, res));

export default routes;