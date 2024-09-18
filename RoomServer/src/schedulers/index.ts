import * as roomScheduler from '@schedulers/room.scheduler';
import { logger } from '@utils/logger';

export default () => {
    try {
        roomScheduler.start();
    } catch (error) {
        logger.error(`scheduler error. error: ${error}`);
    }
};
