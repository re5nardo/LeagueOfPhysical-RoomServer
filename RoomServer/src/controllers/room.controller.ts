import { NextFunction, Request, Response } from 'express';
import { CreateRoomDto, UpdateRoomStatusDto } from '@dtos/room.dto';
import RoomService from '@services/room.service';

class RoomController {
    private roomService = new RoomService();

    public getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.roomService.findAllRooms();
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getRoomById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomId: string = req.params.id;
            const response = await this.roomService.findRoomById(roomId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public createRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createRoomDto: CreateRoomDto = req.body;
            const response = await this.roomService.createRoom(createRoomDto);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomId: string = req.params.id;
            const response = await this.roomService.deleteRoomById(roomId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateRoomStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateRoomStatusDto: UpdateRoomStatusDto = req.body;
            const response = await this.roomService.updateRoomStatus(updateRoomStatusDto);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public heartbeat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roomId: string = req.params.id;
            const response = await this.roomService.heartbeat(roomId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default RoomController;
