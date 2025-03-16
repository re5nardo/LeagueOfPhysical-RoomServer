import { model, Schema, Document } from 'mongoose';
import { Room, RoomStatus } from '@interfaces/room.interface';

const roomSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        enum: RoomStatus,
    },
    ip: String,
    port: Number,
    lastHeartbeat: Date,
});

const roomModel = model<Room & Document>('Room', roomSchema);

export default roomModel;
