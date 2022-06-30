import { Router } from 'express';
import RoomController from '@controllers/room.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateRoomDto, UpdateRoomStatusDto } from '@dtos/room.dto';

class RoomRoute implements Routes {
    public path = '/room';
    public router = Router();
    public roomController = new RoomController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //#region status
        this.router.put(`${this.path}/status`, validationMiddleware(UpdateRoomStatusDto, 'body'), this.roomController.updateRoomStatus);
        //#endregion

        this.router.get(`${this.path}/all`, this.roomController.getAllRooms);
        this.router.get(`${this.path}/:id`, this.roomController.getRoomById);
        this.router.post(`${this.path}`, validationMiddleware(CreateRoomDto, 'body'), this.roomController.createRoom);
        this.router.delete(`${this.path}/:id`, this.roomController.deleteRoom);
    }
}

export default RoomRoute;


//  Room Server에서는
//  Room 생성/파괴 시에 유저 location 정보 정도만 변경하고,
//  입장 시에 받은 파라미터를 가지고 있다가
//  종료 시에 게임 결과 값 정도만 넘겨주는 역할?