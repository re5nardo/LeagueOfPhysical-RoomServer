
export enum MatchType {
    Friendly = 0,
    Rank = 1,
}

export enum MatchStatus {
    None = 0,
    MatchStart = 1,
    MatchEnd = 2,
}

export interface Match {
    id: string;
    matchType: MatchType;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: number;
    playerList: string[];
    status: MatchStatus;
};
