import {
    CreateRoomDto, UpdateRoomStatusDto, CreateRoomResponseDto, GetRoomResponseDto, UpdateRoomStatusResponseDto, DeleteRoomResponseDto, GetAllRoomsResponseDto
} from '@dtos/room.dto';
import { RoomJoinableResponseDto } from '@dtos/room.dto';
import { UserLocationDto, UpdateUserLocationDto } from '@dtos/user-location.dto';
import { ResponseBase } from '@interfaces/responseBase.interface'
import { RoomRepository } from '@repositories/room.repository';
import { Room, RoomStatus } from '@interfaces/room.interface';
import { Location, LocationDetail } from '@interfaces/user-location.interface';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { RoomMapper } from "@mappers/controllers/room.mapper";
import MatchService from "@services/match.service";
import UserLocationService from '@services/user-location.service';
import { k8sUtils } from '@utils/k8sUtils';

class RoomService {

    private static readonly HEARTBEAT_THRESHOLD = 10000;

    private roomRepository = new RoomRepository();
    private matchService = new MatchService();
    private userLocationService = new UserLocationService();

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
                rooms: rooms.map(room => RoomMapper.toRoomResponseDto(room)),
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
                room: RoomMapper.toRoomResponseDto(room),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async isRoomJoinable(id: string): Promise<RoomJoinableResponseDto> {
        try {
            let room = await this.roomRepository.findById(id);
            if (!room) {
                return {
                    code: ResponseCode.ROOM_NOT_EXIST,
                };
            }

            if (room.status === RoomStatus.Closed || room.status === RoomStatus.Error) {
                return {
                    code: ResponseCode.ROOM_NOT_JOINABLE,
                    room: RoomMapper.toRoomResponseDto(room),
                };
            }

            if (Date.now() - room.lastHeartbeat.getTime() > RoomService.HEARTBEAT_THRESHOLD ) {
                room.status = RoomStatus.Error;
                room = await this.roomRepository.save(room)

                return {
                    code: ResponseCode.ROOM_NOT_JOINABLE,
                    room: RoomMapper.toRoomResponseDto(room),
                };
            }

            if (room.status === RoomStatus.WaitingForPlayers || room.status === RoomStatus.StartingGame || room.status === RoomStatus.GameInProgress) {
                return {
                    code: ResponseCode.SUCCESS,
                    room: RoomMapper.toRoomResponseDto(room),
                };
            }

            return {
                code: ResponseCode.ROOM_NOT_JOINABLE,
                room: RoomMapper.toRoomResponseDto(room),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createRoom(createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
        try {
            const matchResponse = await this.matchService.findMatchById(createRoomDto.matchId);
            if (!matchResponse.match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST,
                }
            }
            
            //  room
            let room = RoomMapper.MatchResponseDto.toEntity(matchResponse.match);
            room = await this.roomRepository.save(room);

            //  room-runner
            room = await this.createRoomRunner(room);

            room = await this.roomRepository.save(room);

            return {
                code: ResponseCode.SUCCESS,
                room: RoomMapper.toRoomResponseDto(room),
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async createRoomRunner(room: Room): Promise<Room> {
        try {

            room.status = RoomStatus.CreatingRunner;
            room = await this.roomRepository.save(room);

            //  Pod
            const podManifest = {
                apiVersion: 'v1',
                kind: 'Pod',
                metadata: {
                    name: `room-pod-${room.id}`,
                    labels: {
                        app: 'room-pod',
                        roomId: room.id
                    },
                },
                spec: {
                    containers: [{
                        name: 'game-server',
                        image: 're5nardo/game-server:latest',
                        imagePullPolicy: 'Always',
                        ports: [{ containerPort: 7777, protocol: 'UDP' }],
                        env: [
                            { name: 'ROOM_ID', value: room.id },
                            { name: 'PORT', value: '7777' },
                        ],
                    }],
                    terminationGracePeriodSeconds: 30
                }
            };

            const pod = await k8sUtils.createPod(podManifest);

            //  Service
            const serviceManifest = {
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: `room-service-${room.id}`,
                    labels: {
                        app: 'room-service',
                        roomId: room.id
                    },
                },
                spec: {
                    type: 'NodePort',
                    selector: { app: 'room-pod', roomId: room.id },
                    ports: [{ port: 7777, targetPort: 7777, protocol: 'UDP' }]
                }
            };
            
            const ip = /*await k8sUtils.getPublicIP(pod.metadata?.name)*/'localhost';
            const service = await k8sUtils.createService(serviceManifest);
            const nodePort = service.spec?.ports?.[0]?.nodePort;

            if (ip && nodePort) {
                room.ip = ip;
                room.port = nodePort;
            } else {
                throw new Error(`ip or nodePort is wrong. ip: ${ip}, nodePort: ${nodePort}`);
            }
            
            room.status = RoomStatus.RunnerCreated;
            room = await this.roomRepository.save(room);
            return room;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteRoomById(id: string): Promise<DeleteRoomResponseDto> {
        try {
            await this.roomRepository.deleteById(id);
            await this.deleteRoomRunnerById(id);
            return {
                code: ResponseCode.SUCCESS
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async deleteRoomRunnerById(roomId: string): Promise<void> {
        try {
            await k8sUtils.deletePod(`room-pod-${roomId}`);
            await k8sUtils.deleteService(`room-service-${roomId}`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateRoomStatus(updateRoomStatusDto: UpdateRoomStatusDto): Promise<UpdateRoomStatusResponseDto> {
        try {
            let room = await this.roomRepository.findById(updateRoomStatusDto.roomId);
            if (!room) {
                return {
                    code: ResponseCode.ROOM_NOT_EXIST
                };
            }

            room.status = updateRoomStatusDto.status;

            if (room.status === RoomStatus.Closed || room.status === RoomStatus.Error) {
                await this.deleteRoomRunnerById(room.id);

                const getMatchResponseDto = await this.matchService.findMatchById(room.matchId);
                if (!getMatchResponseDto.match) {
                    console.warn(`getMatchResponseDto.match is undefined. Updating user-location is skipped.`);
                } else {
                    const updateUserLocationDto = new UpdateUserLocationDto();
                    getMatchResponseDto.match.playerList.forEach(playerId => {
                        const userLocationDto: UserLocationDto = {
                            userId: playerId,
                            location: Location.None,
                            locationDetail: new LocationDetail(Location.None),
                        };
                        updateUserLocationDto.userLocations.push(userLocationDto);
                    });
    
                    const updateUserLocationResponseDto = await this.userLocationService.updateUserLocation(updateUserLocationDto);
                }
            }
            
            room = await this.roomRepository.save(room);

            return {
                code: ResponseCode.SUCCESS,
                room: RoomMapper.toRoomResponseDto(room),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async heartbeat(roomId: string): Promise<ResponseBase> {
        try {
            let room = await this.roomRepository.findById(roomId);
            if (room) {
                room.lastHeartbeat = new Date();
                room = await this.roomRepository.save(room);
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

    public async checkAndCleanupRoomRunners(): Promise<void> {
        try {
            const rooms = await this.roomRepository.findAll();

            //  Pods
            const podList = await k8sUtils.listPods();
            for (const pod of podList?.items ?? []) {
                if (pod.metadata && pod.metadata.labels && pod.metadata.labels['roomId']) {

                    const roomId = pod.metadata.labels['roomId'];
                    const room = Array.from(rooms).find(room => room.id === roomId);

                    if (pod.metadata.name && pod.metadata.namespace && room) {
                        if (await this.shouldTerminateRoomRunner(room)) {
                            await k8sUtils.deletePod(pod.metadata.name, pod.metadata.namespace);
                        }
                    }
                }
            }

            //  Services
            const serviceList = await k8sUtils.listServices();
            for (const service of serviceList?.items ?? []) {
                if (service.metadata && service.metadata.labels && service.metadata.labels['roomId']) {

                    const roomId = service.metadata.labels['roomId'];
                    const room = Array.from(rooms).find(room => room.id === roomId);

                    if (service.metadata.name && service.metadata.namespace && room) {
                        if (await this.shouldTerminateRoomRunner(room)) {
                            await k8sUtils.deleteService(service.metadata.name, service.metadata.namespace);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error during CleanupRoomRunners:', error);
        }
    }

    private async shouldTerminateRoomRunner(room: Room): Promise<boolean> {
        return Date.now() - room.lastHeartbeat.getTime() > RoomService.HEARTBEAT_THRESHOLD
            || room.status === RoomStatus.Error
            || room.status === RoomStatus.Closed;
    }
}

export default RoomService;



//  Room 인스턴스
//  DB 상의 Room 정보


//  Room 인스턴스 -> OnCreate / OnHealthCheck / OnTerminated



//  매치메이킹 -> RoomCreate -> SpawnRoom -> OnCreate -> ResponseRoomCreate

//  OnTerminated -> GameResult -> Send to Lobby



//  Room (Game) 이력 로그 (OnStart, OnEnd(GameResult), 등등)