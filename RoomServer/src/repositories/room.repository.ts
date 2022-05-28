import { Room } from '@interfaces/room.interface';
import { CrudRepositoryImpl } from '@repositories/crud.repository.impl';
import { RoomDaoRedis } from '@daos/room.dao.redis';

export class RoomRepository extends CrudRepositoryImpl<Room, string> {
    constructor() {
        super(new RoomDaoRedis());
    }
}
