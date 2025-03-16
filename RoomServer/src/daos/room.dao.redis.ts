import { Room as RoomEntity } from '@prisma/client';
import { DaoRedisBase } from '@daos/dao.redis.base';
import { redisClient } from '@loaders/redis.loader';

const TTL: number = 10;  //  sec
const ROOM_PREFIX: string = 'ROOM_PREFIX';

export class RoomDaoRedis extends DaoRedisBase<RoomEntity> {

    get Prefix() : string {
        return ROOM_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }

    public async expire(id: string): Promise<boolean> {
        try {
            return await redisClient.expire(this.GetRedisKey(id), this.TTL);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
