import express from 'express';
import routes from './routes';
import utils from './utils';
import logMiddleware from './middlewares/log';
import resMiddleware from './middlewares/res';

globalThis.utils = utils;

class App {
constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
}

middlewares () {
    this.server.use(express.json());
    this.server.use(logMiddleware);
    this.server.use(resMiddleware);
}

routes() {
    this.server.use(routes);
}
}

export default new App().server;