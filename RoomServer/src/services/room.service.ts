
import { RoomCreateDto, RoomCreateResponseDto, RoomUpdateDto } from '@dtos/room.dto';
import { v4 } from 'uuid';
import * as portfinder from "portfinder";
import { spawn, ChildProcess } from "child_process";
import { isEmpty } from '@utils/util';
import { RoomRepository } from '@repositories/room.repository';
import { HttpException } from '@exceptions/HttpException';
import { Room } from '@interfaces/room.interface';

const BIN_PATH = 'C:\\Users\\USER\\Desktop\\lop-server-window\\LeagueOfPhysical_Server.exe';

class RoomService {

    private roomRepository = new RoomRepository();
    private roomProcesses = new Map<string, ChildProcess>();

    public async createRoom(roomCreateDto: RoomCreateDto): Promise<RoomCreateResponseDto> {
        try {
            const roomId = v4();
            const port = await portfinder.getPortPromise();
            let args: string[] = [
                roomId,
                'TestMatch',
                port.toString(),
                roomCreateDto.matchType.toString(),
                roomCreateDto.subGameId,
                roomCreateDto.mapId
            ];
    
            const subprocess = spawn(BIN_PATH, args, {
                detached: true,
                stdio: 'ignore',
            });

            console.log('create Room');
            console.log(`spawnfile: ${subprocess.spawnfile}`);
            subprocess.on('spawn', () => {
                console.log('spawn on spawn');
            });

            subprocess.stdout?.on('data', (data) => {
            console.log(`spawn stdout: ${data}`);
            });

            subprocess.stderr?.on('data', (data) => {
                console.log(`spawn on error ${data}`);
            });

            subprocess.on('exit', (code, signal) => {
                console.log(`spawn on exit code: ${code} signal: ${signal}`);
            });

            subprocess.on('close', (code: number, args: any[])=> {
                console.log(`spawn on close code: ${code} args: ${args}`);
            });
        
            subprocess.unref();

            this.roomProcesses.set(roomId, subprocess);

            return {
                code: 200,
                roomId: roomId,
                port: port
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateRoom(id: string, roomUpdateDto: RoomUpdateDto): Promise<Room> {
        try {
            if (isEmpty(roomUpdateDto)) {
                throw new HttpException(400, "You're not userData");
            }

            const room = await this.roomRepository.findById(id);
            if (room) {
                return await this.roomRepository.save(roomUpdateDto.toEntity(room));
            } else {
                throw new HttpException(400, "You're not roomData");
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async terminateRoom(roomId: string): Promise<void> {
        try {
            const subprocess = this.roomProcesses.get(roomId);
            subprocess?.kill('SIGINT');
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