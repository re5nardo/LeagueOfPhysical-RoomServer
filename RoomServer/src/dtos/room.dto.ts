import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';

export class RoomCreateDto {
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

export class RoomCreateResponseDto {
    @IsNumber()
    public code: number;

    @IsString()
    public roomId: string;
}
