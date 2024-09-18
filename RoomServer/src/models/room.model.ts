import { model, Schema, Document } from 'mongoose';
import { Room, RoomStatus } from '@interfaces/room.interface';

const roomSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchId: String,
    createdAt: Number,
    status: {
        type: Number,
        enum: RoomStatus,
    },
    ip: String,
    port: Number,
    lastHeartbeat: Number,
});

const roomModel = model<Room & Document>('Room', roomSchema);

export default roomModel;
