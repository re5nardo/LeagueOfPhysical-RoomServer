import { Room, RoomStatus } from "@interfaces/room.interface";
import { RoomResponseDto, CreateRoomDto } from "@dtos/room.dto";
import { RoomFactory } from '@factories/room.factory';

export class RoomMapper {
    static CreateRoomDto = class {
        public static toEntity(createRoomDto: CreateRoomDto): Room {
            return RoomFactory.create({
                status: RoomStatus.Spawning
            });
        }
    };

    public static toRoomResponseDto(room: Room): RoomResponseDto {
        return {
            id: room.id,
            matchId: room.matchId,
            status: room.status,
            ip: room.ip,
            port: room.port,
        };
    }
}
