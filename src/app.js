import express from 'express';
import routes from './api/routes';
import utils from './libs/Utils';
import logMiddleware from './api/middlewares/log';
import resMiddleware from './api/middlewares/res';

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

const app = new App().server;

app.listen(3333);