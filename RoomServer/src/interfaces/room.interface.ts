import { MatchType } from "@interfaces/match.interface";

export enum RoomStatus {
    None = 0,
}

export class Room {
    public id: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public createdAt: number;
    public exptectedPlayerList: string[];
    //public matchmakingTicketList: string[];
    public status: RoomStatus;
};
