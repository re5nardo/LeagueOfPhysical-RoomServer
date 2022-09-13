
export enum MatchType {
    Friendly = 0,
    Rank = 1,
}

export enum MatchStatus {
    None = 0,
    Spawning = 1,
    Spawned = 2,
    Ready = 3,
    Playing = 4,
    Finished = 5,
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
