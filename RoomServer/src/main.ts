import App from '@src/app';
import IndexRoute from '@routes/index.route';
import RoomRoute from '@routes/room.route';
import MatchRoute from '@routes/match.route';
import validateEnv from '@utils/validateEnv';
import { logger } from '@utils/logger';
import loader from '@loaders/index';

(async () => {
    try {
        validateEnv();

        await loader();

        const app = new App([new IndexRoute(), new RoomRoute(), new MatchRoute()]);

        app.listen();
    } catch (error) {
        logger.error(`main error. error: ${error}`);
    }
})();
