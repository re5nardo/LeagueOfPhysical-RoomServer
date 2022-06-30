
import * as portfinder from "portfinder";
import { spawn } from "child_process";
import { v4 } from 'uuid';
import {
    CreateRoomDto, UpdateRoomStatusDto,
    RoomResponseDto, CreateRoomResponseDto, GetRoomResponseDto, UpdateRoomResponseDto, DeleteRoomResponseDto, GetAllRoomsResponseDto
} from '@dtos/room.dto';
import { RoomRepository } from '@repositories/room.repository';
import { Room } from '@interfaces/room.interface';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { BIN_PATH } from '@config';
import { RoomMapper } from "@mappers/room.mapper";

class RoomService {

    private roomRepository = new RoomRepository();

    public async createRoomInstance(createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
        try {
            const roomId = v4();
            const port = await portfinder.getPortPromise();
            let args: string[] = [
                roomId,
                'TestMatch',
                port.toString(),
                createRoomDto.matchType.toString(),
                createRoomDto.subGameId,
                createRoomDto.mapId
            ];

            const subprocess = spawn(String(BIN_PATH), args, {
                detached: true,
                stdio: 'ignore',
            });

            subprocess.unref();

            subprocess.on('spawn', () => {
                console.log('spawn on spawn');
            });

            subprocess.on('exit', (code, signal) => {
                console.log(`spawn on exit code: ${code} signal: ${signal}`);
            });

            return {
                code: ResponseCode.SUCCESS,
                roomId: roomId,
                port: port
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async terminateRoomInstance(roomId: string): Promise<void> {
        try {
            //const subprocess = this.roomProcesses.get(roomId);
            //subprocess?.kill('SIGINT');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllRooms(): Promise<GetAllRoomsResponseDto> {
        try {
            const rooms = await this.roomRepository.findAll() as Room[];
            if (!rooms || rooms.length == 0) {
                return {
                    code: ResponseCode.SUCCESS
                };
            }
            return {
                code: ResponseCode.SUCCESS,
                rooms: rooms.map(room => RoomMapper.toRoomResponseDto(room))
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findRoomById(id: string): Promise<GetRoomResponseDto> {
        try {
            const room = await this.roomRepository.findById(id);
            if (!room) {
                return {
                    code: ResponseCode.ROOM_NOT_EXIST
                };
            }
            return {
                code: ResponseCode.SUCCESS,
                room: room
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createRoom(createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
        try {
            const response = await this.createRoomInstance(createRoomDto);
            await this.roomRepository.save(RoomMapper.CreateRoomDto.toEntity(createRoomDto));
            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteRoomById(id: string): Promise<DeleteRoomResponseDto> {
        try {
            await this.terminateRoomInstance(id);
            await this.roomRepository.deleteById(id);
            return {
                code: ResponseCode.SUCCESS
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateRoomStatus(updateRoomStatusDto: UpdateRoomStatusDto): Promise<UpdateRoomResponseDto> {
        try {
            const room = await this.roomRepository.findById(updateRoomStatusDto.roomId);
            if (!room) {
                return {
                    code: ResponseCode.ROOM_NOT_EXIST
                };
            }

            room.status = updateRoomStatusDto.status;
            return {
                code: ResponseCode.SUCCESS,
                room: await this.roomRepository.save(room)
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default RoomService;



//  Room 인스턴스
//  DB 상의 Room 정보


//  Room 인스턴스 -> OnCreate / OnHealthCheck / OnTerminated



//  매치메이킹 -> RoomCreate -> SpawnRoom -> OnCreate -> ResponseRoomCreate

//  OnTerminated -> GameResult -> Send to Lobby



//  Room (Game) 이력 로그 (OnStart, OnEnd(GameResult), 등등)