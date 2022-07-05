import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';
import { RoomStatus } from '@interfaces/room.interface';

export class CreateRoomDto {
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

export class UpdateRoomStatusDto {
    @IsString()
    public roomId: string;

    @IsEnum(RoomStatus)
    public status: RoomStatus;
}

export class RoomResponseDto {
    public id: string;
    public matchId: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public ip: string;
    public port: number;
}

export class CreateRoomResponseDto implements ResponseBase {
    public code: number;
    public room?: RoomResponseDto;
}

export class GetRoomResponseDto implements ResponseBase {
    public code: number;
    public room?: RoomResponseDto;
}

export class UpdateRoomResponseDto implements ResponseBase {
    public code: number;
    public room?: RoomResponseDto;
}

export class GetAllRoomsResponseDto implements ResponseBase {
    public code: number;
    public rooms?: RoomResponseDto[];
}

export class DeleteRoomResponseDto implements ResponseBase {
    public code: number;
}
