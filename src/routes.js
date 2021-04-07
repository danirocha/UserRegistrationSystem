import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = new Router();

routes.post('/user', (req, res) => UserController.store(req, res));
routes.get('/user/:userId', (req, res) => UserController.list(req, res));
routes.put('/user/:userId', (req, res) => UserController.update(req, res));
routes.delete('/user/:userId', (req, res) => UserController.delete(req, res));

export default routes;