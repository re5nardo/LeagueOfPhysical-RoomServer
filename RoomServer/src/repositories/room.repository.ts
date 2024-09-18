import { Room } from '@interfaces/room.interface';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { RoomDaoMongoose } from '@daos/room.dao.mongoose';
import { RoomDaoRedis } from '@daos/room.dao.redis';

export class RoomRepository extends CacheCrudRepository<Room, string> {
    constructor() {
        super(new RoomDaoMongoose(), new RoomDaoRedis());
    }
}
