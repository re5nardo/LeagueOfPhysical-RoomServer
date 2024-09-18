import RoomService from '@services/room.service';
import { logger } from '@utils/logger';

const roomService = new RoomService();
const INTERVAL = 2000;

export function start(): void {
    try {
        setInterval(async () => {
            await roomService.checkAndCleanupRoomRunners();
        }, INTERVAL);
    } catch (error) {
        logger.error(`scheduler error. error: ${error}`);
    }
};
