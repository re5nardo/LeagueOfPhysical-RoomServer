import { Room } from "@interfaces/room.interface";
import { DaoRedisBase } from '@daos/dao.redis.base';

const TTL: number = 5 * 60;  //  sec
const ROOM_PREFIX: string = 'ROOM_PREFIX';

export class RoomDaoRedis extends DaoRedisBase<Room> {

    get Prefix() : string {
        return ROOM_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }
}
