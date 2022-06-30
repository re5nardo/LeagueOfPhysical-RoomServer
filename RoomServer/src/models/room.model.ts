import { model, Schema, Document } from 'mongoose';
import { Room, RoomStatus } from '@interfaces/room.interface';
import { MatchType } from '@interfaces/match.interface';

const roomSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchId: String,
    matchType: {
        type: Number,
        enum: MatchType,
    },
    subGameId: String,
    mapId: String,
    targetRating: Number,
    createdAt: Number,
    exptectedPlayerList: [String],
    status: {
        type: Number,
        enum: RoomStatus,
    },
});

const roomModel = model<Room & Document>('Room', roomSchema);

export default roomModel;
