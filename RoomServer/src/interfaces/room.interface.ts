import { MatchType } from "@interfaces/match.interface";

export enum RoomStatus {
    None = 0,
}

export interface Room {
    id: string;
    matchId: string;
    matchType: MatchType;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: number;
    exptectedPlayerList: string[];
    status: RoomStatus;
};
