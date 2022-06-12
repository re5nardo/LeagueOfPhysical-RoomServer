
export class ResponseCode {
    
    public static readonly SUCCESS = 0;

    //#region Match
    public static readonly INVALID_TO_MATCH_MAKING = 10000;
    public static readonly ALREADY_IN_GAME = 10001;

    public static readonly MATCH_MAKING_TICKET_NOT_EXIST = 10100;
    public static readonly NOT_MATCH_MAKING_STATE = 10101;
    //#endregion

    //#region User
    public static readonly USER_NOT_EXIST = 30000;
    //#endregion

    //#region WaitingRoom
    public static readonly WAITING_ROOM_NOT_EXIST = 40000;
    //#endregion

    public static readonly UNKNOWN_ERROR = 5000000;
}
