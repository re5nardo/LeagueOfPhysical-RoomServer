
export enum RoomStatus {
    None = 0,
    Spawning = 1,
    Spawned = 2,
    Ready = 3,
    Playing = 4,
    Finished = 5,
}

export interface Room {
    id: string;
    matchId: string;
    createdAt: number;
    status: RoomStatus;
    ip: string;
    port: number;
};
