
export enum MatchType {
    Friendly = 0,
    Rank = 1,
}

export interface MatchSetting {
    matchType: MatchType;
    subGameId: string;
    mapId: string;
}
