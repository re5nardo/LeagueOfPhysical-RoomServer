import { Room, RoomStatus } from "@interfaces/room.interface";
import { RoomResponseDto, CreateRoomDto } from "@dtos/room.dto";
import { RoomFactory } from '@factories/room.factory';

export class RoomMapper {
    static CreateRoomDto = class {
        public static toEntity(createRoomDto: CreateRoomDto): Room {
            return RoomFactory.create({
                matchType: createRoomDto.matchType,
                subGameId: createRoomDto.subGameId,
                mapId: createRoomDto.mapId,
                targetRating: createRoomDto.targetRating,
                exptectedPlayerList: createRoomDto.exptectedPlayerList,
                status: RoomStatus.Spawning
            });
        }
    };

    public static toRoomResponseDto(room: Room): RoomResponseDto {
        return {
            id: room.id,
            matchId: room.matchId,
            matchType: room.matchType,
            subGameId: room.subGameId,
            mapId: room.mapId
        };
    }

    // public static toPersistence (t: T): any;
}
