
export enum RoomStatus {
    None = 0,
    CreatingRunner = 1,
    RunnerCreated = 2,
    Initializing = 3,
    WaitingForPlayers = 4,
    StartingGame = 5,
    GameInProgress = 6,
    GameFinished = 7,
    Closing = 8,
    Closed = 9,
    Error = 10,
}

export enum GameStatus {
    NotStarted = 0,
    Preparing = 1,
    Starting = 2,
    InProgress = 3,
    Paused = 4,
    Resuming = 5,
    Finishing = 6,
    Finished = 7,
    Error = 8,
}

export interface Room {
    id: string;
    matchId: string;
    createdAt: number;
    status: RoomStatus;
    ip: string;
    port: number;
    lastHeartbeat: number;
};
