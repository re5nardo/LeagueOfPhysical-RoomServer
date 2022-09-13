import { model, Schema, Document } from 'mongoose';
import { Match, MatchType, MatchStatus } from '@interfaces/match.interface';

const matchSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchType: {
        type: Number,
        enum: MatchType,
    },
    subGameId: String,
    mapId: String,
    targetRating: Number,
    createdAt: Number,
    playerList: [String],
    status: {
        type: Number,
        enum: MatchStatus,
    },
});

const matchModel = model<Match & Document>('Match', matchSchema);

export default matchModel;
