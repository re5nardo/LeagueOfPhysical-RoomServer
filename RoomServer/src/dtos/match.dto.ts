import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class MatchResponseDto {
    public id: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public playerList: string[];
}

export class GetMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}
