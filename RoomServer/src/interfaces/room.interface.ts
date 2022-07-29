import { MatchType } from "@interfaces/match.interface";

export enum RoomStatus {
    None = 0,
    Spawning = 1,
    Spawned = 2,
    Ready = 3,
    Playing = 4,
    Finished = 5,
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
    ip: string;
    port: number;
};
