import { Room } from '@interfaces/room.interface';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { RoomDaoRedis } from '@daos/room.dao.redis';

export class RoomRepository extends CrudRepositoryBase<Room, string> {
    constructor() {
        super(new RoomDaoRedis());
    }
}
