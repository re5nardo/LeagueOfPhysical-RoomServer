import { Room } from '@interfaces/room.interface';
import { RoomResponseDto, CreateRoomDto } from '@dtos/room.dto';
import { RoomFactory } from '@factories/room.factory';
import { MatchResponseDto } from '@dtos/match.dto';

export class RoomMapper {
    static CreateRoomDto = class {
        public static toEntity(createRoomDto: CreateRoomDto): Room {
            return RoomFactory.create({
                matchId: createRoomDto.matchId,
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

    static MatchResponseDto = class {
        public static toEntity(matchResponseDto: MatchResponseDto): Room {
            return RoomFactory.create({
                matchId: matchResponseDto.id,
            });
        }
    };
}
