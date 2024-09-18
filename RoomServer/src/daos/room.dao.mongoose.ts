import { Room } from "@interfaces/room.interface";
import roomModel from '@models/room.model';
import { DaoMongooseBase } from '@daos/dao.mongoose.base';
import { Model } from 'mongoose';

export class RoomDaoMongoose extends DaoMongooseBase<Room> {
    get mongooseModel(): Model<Room> {
        return roomModel as Model<Room>;
    }
}
