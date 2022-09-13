import { Room, RoomStatus } from '@interfaces/room.interface';
import { v4 } from 'uuid';

export class RoomFactory {
    public static create(properties?: Partial<Room>): Room {
        return { ...RoomFactory.createDefault(), ...properties };
    }

    private static createDefault(): Room {
        return {
            id: v4(),
            matchId: '',
            createdAt: Date.now(),
            status: RoomStatus.None,
            ip: '',
            port: 0,
        };
    }
}
