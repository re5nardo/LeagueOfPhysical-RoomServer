import { Room, RoomStatus } from '@interfaces/room.interface';
import { MatchType } from "@interfaces/match.interface";
import { v4 } from 'uuid';

export class RoomFactory {
    public static create(properties?: Partial<Room>): Room {
        return { ...RoomFactory.createDefault(), ...properties };
    }

    private static createDefault(): Room {
        return {
            id: v4(),
            matchId: '',
            matchType: MatchType.Friendly,
            subGameId: '',
            mapId: '',
            targetRating: 1000,
            createdAt: Date.now(),
            exptectedPlayerList: [],
            status: RoomStatus.None,
        };
    }
}
