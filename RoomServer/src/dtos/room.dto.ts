import { IsNumber, IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@src/interfaces/responseBase.interface';
import { Room } from '@interfaces/room.interface';

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

export class RoomCreateResponseDto implements ResponseBase {
    @IsNumber()
    public code: number;

    @IsString()
    public roomId: string;

    @IsNumber()
    public port: number;
}

export class RoomUpdateDto {
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

    public toEntity(room: Room): Room {
        room.matchType = this.matchType;
        room.subGameId = this.subGameId;
        room.mapId = this.mapId;
        room.targetRating = this.targetRating;
        room.exptectedPlayerList = this.exptectedPlayerList;
        return room;
    }
}

export class RoomPatchDto {
    @IsOptional()
    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsOptional()
    @IsString()
    public subGameId: string;

    @IsOptional()
    @IsString()
    public mapId: string;

    @IsOptional()
    @IsNumber()
    public targetRating: number;

    @IsOptional()
    @IsArray()
    public exptectedPlayerList: string[];
}