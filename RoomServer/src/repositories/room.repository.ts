import { Room } from '@interfaces/room.interface';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { RoomDaoPostgres } from '@daos/room.dao.postgres';
import { RoomDaoRedis } from '@daos/room.dao.redis';

export class RoomRepository extends CacheCrudRepository<Room> {
    constructor() {
        super(new RoomDaoPostgres(), new RoomDaoRedis());
    }
}
