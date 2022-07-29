import { Room } from '@interfaces/room.interface';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { RoomDaoRedis } from '@daos/room.dao.redis';

export class RoomRepository extends CrudRepositoryBase<Room, string> {
    constructor() {
        super(new RoomDaoRedis());
    }

    public async expire(id: string): Promise<boolean> {
        try {
            const roomDaoRedis = this.dao as RoomDaoRedis;
            return await roomDaoRedis.expire(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
