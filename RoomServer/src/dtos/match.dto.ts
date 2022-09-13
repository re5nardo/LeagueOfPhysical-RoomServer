import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType, MatchStatus } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateMatchDto {
    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public targetRating: number;

    @IsArray()
    public exptectedPlayerList: string[];
}

export class UpdateMatchStatusDto {
    @IsString()
    public matchId: string;

    @IsEnum(MatchStatus)
    public status: MatchStatus;
}

export class MatchStartDto {
    @IsString()
    public matchId: string;
}

export class MatchEndDto {
    @IsString()
    public matchId: string;
}

export class MatchResponseDto {
    public id: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public status: MatchStatus;
    public playerList: string[];
}

export class CreateMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}

export class GetMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}

export class UpdateMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}

export class MatchStartResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}

export class MatchEndResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}
