import { NextFunction, Request, Response } from 'express';
import RoomService from '@services/room.service';

class RoomController {
    private roomService = new RoomService();
    
    public createRoomInstance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomCreateResponseDto = await this.roomService.createRoom(req.body);
            // const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
            
            res.status(200).json({ data: roomCreateResponseDto, message: 'findAll' }); //  BaseResponse?
        } catch (error) {
            next(error);
        }
    };

    public terminateRoomInstance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.roomService.terminateRoom(req.body);
            // const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
            
            // res.status(200).json({ data: findAllRoomsData, message: 'findAll' }); //  BaseResponse?
            res.status(200);
        } catch (error) {
            next(error);
        }
    };

    public updateRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomCreateResponseDto = await this.roomService.createRoom(req.body);
            // const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
            
            res.status(200).json({ data: roomCreateResponseDto, message: 'findAll' }); //  BaseResponse?
        } catch (error) {
            next(error);
        }
    };

    public patchRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomCreateResponseDto = await this.roomService.createRoom(req.body);
            // const findAllRoomsData: Room[] = await this.roomService.findAllRoom();
            
            res.status(200).json({ data: roomCreateResponseDto, message: 'findAll' }); //  BaseResponse?
        } catch (error) {
            next(error);
        }
    };
}

export default RoomController;
