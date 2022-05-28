import { Router } from 'express';
import RoomController from '@controllers/room.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { RoomCreateDto, RoomPatchDto, RoomUpdateDto } from '@dtos/room.dto';

class RoomRoute implements Routes {
    public path = '/room';
    public router = Router();
    public roomController = new RoomController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/instance`, validationMiddleware(RoomCreateDto, 'body'), this.roomController.createRoomInstance);
        this.router.delete(`${this.path}/instance/:roomId`, this.roomController.terminateRoomInstance);

        this.router.post(`${this.path}`, validationMiddleware(RoomCreateDto, 'body'), this.roomController.createRoom);
        this.router.put(`${this.path}`, validationMiddleware(RoomUpdateDto, 'body'), this.roomController.updateRoom);
        this.router.patch(`${this.path}`, validationMiddleware(RoomPatchDto, 'body'), this.roomController.patchRoom);
        this.router.put(`${this.path}/:roomId`, this.roomController.terminateRoom);
    }
}

export default RoomRoute;


//  Room Server에서는
//  Room 생성/파괴 시에 유저 location 정보 정도만 변경하고,
//  입장 시에 받은 파라미터를 가지고 있다가
//  종료 시에 게임 결과 값 정도만 넘겨주는 역할?