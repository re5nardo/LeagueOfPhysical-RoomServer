
import * as portfinder from "portfinder";
import { spawn } from "child_process";
import { v4 } from 'uuid';
import {
    CreateRoomDto, UpdateRoomStatusDto,
    RoomResponseDto, CreateRoomResponseDto, GetRoomResponseDto, UpdateRoomStatusResponseDto, DeleteRoomResponseDto, GetAllRoomsResponseDto
} from '@dtos/room.dto';
import { RoomRepository } from '@repositories/room.repository';
import { Room } from '@interfaces/room.interface';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { BIN_PATH } from '@config';
import { RoomMapper } from "@mappers/room.mapper";
import MatchService from "@services/match.service";
import { getPublicIP } from "@utils/util";
import { ResponseBase } from "@interfaces/responseBase.interface";

class RoomService {

    private roomRepository = new RoomRepository();
    private matchService = new MatchService();

    public async createRoomInstance(room: Room): Promise<Room> {
        try {
            room.ip = await getPublicIP(),
            room.port = await portfinder.getPortPromise();

            const args: string[] = [
                room.id,
                room.matchId,
                String(room.port),
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

            return room;
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
            let createMatchResponseDto = await this.matchService.createMatch(createRoomDto);
            if (createMatchResponseDto.match == undefined) {
                throw new Error(`Fail to create match!`);
            }

            let room = RoomMapper.CreateRoomDto.toEntity(createRoomDto);
            room.matchId = createMatchResponseDto.match.id;
            room = await this.createRoomInstance(room);

            return {
                code: ResponseCode.SUCCESS,
                room: await this.roomRepository.save(room)
            }
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

    public async updateRoomStatus(updateRoomStatusDto: UpdateRoomStatusDto): Promise<UpdateRoomStatusResponseDto> {
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

    public async heartbeat(roomId: string): Promise<ResponseBase> {
        try {
            const room = await this.roomRepository.findById(roomId);
            if (room) {
                room.lastHeartbeat = Date.now();
                await this.roomRepository.save(room);
                return {
                    code: ResponseCode.SUCCESS,
                };
            } else {
                return {
                    code: ResponseCode.ROOM_NOT_EXIST,
                };
            }
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