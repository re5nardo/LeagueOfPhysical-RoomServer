import { Room } from '@interfaces/room.interface';
import { Room as RoomEntity } from '@prisma/client';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { RoomDaoPostgres } from '@daos/room.dao.postgres';
import { RoomDaoRedis } from '@daos/room.dao.redis';
import { RoomMapper } from '@mappers/entities/room.postgres.entity.mapper'

export class RoomRepository extends CacheCrudRepository<Room, RoomEntity> {
    constructor() {
        super(new RoomDaoPostgres(), new RoomDaoRedis(), new RoomMapper());
    }
}
