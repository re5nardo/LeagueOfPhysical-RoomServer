
import {
    CreateMatchDto, MatchStartDto, MatchEndDto,
    CreateMatchResponseDto, GetMatchResponseDto, MatchStartResponseDto, MatchEndResponseDto
} from '@dtos/match.dto';
import { UpdateUserLocationDto, UserLocationDto } from '@dtos/user.dto';
import { MatchRepository } from '@repositories/match.repository';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { MatchMapper } from "@mappers/match.mapper";
import { MatchStatus } from '@interfaces/match.interface';
import UserService from '@services/user.service';
import { Location, LocationDetail } from '@interfaces/user.location.interface';

class MatchService {

    private matchRepository = new MatchRepository();
    private userService = new UserService();

    public async findMatchById(id: string): Promise<GetMatchResponseDto> {
        try {
            const match = await this.matchRepository.findById(id);
            if (!match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST
                };
            }
            return {
                code: ResponseCode.SUCCESS,
                match: match
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createMatch(createMatchDto: CreateMatchDto): Promise<CreateMatchResponseDto> {
        try {
            return {
                code: ResponseCode.SUCCESS,
                match: await this.matchRepository.save(MatchMapper.CreateMatchDto.toEntity(createMatchDto))
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async matchStart(matchStartDto: MatchStartDto): Promise<MatchStartResponseDto> {
        try {
            const match = await this.matchRepository.findById(matchStartDto.matchId);
            if (!match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST
                };
            }

            match.status = MatchStatus.MatchStart;

            return {
                code: ResponseCode.SUCCESS,
                match: await this.matchRepository.save(match)
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async matchEnd(matchEndDto: MatchEndDto): Promise<MatchEndResponseDto> {
        try {
            const match = await this.matchRepository.findById(matchEndDto.matchId);
            if (!match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST
                };
            }

            match.status = MatchStatus.MatchEnd;

            //  플레이어 나감 처리 / 결과 반영 등등..
            //  ...

            //  update user locations
            const updateUserLocationDto = new UpdateUserLocationDto();
            const findAllUsersDto = await this.userService.findAllUsersById(match.playerList);

            findAllUsersDto.users?.forEach(user => {
                const userLocationDto = new UserLocationDto();
                userLocationDto.userId = user.id,
                    userLocationDto.location = Location.Unknown,
                    userLocationDto.locationDetail = new LocationDetail(Location.Unknown);
                updateUserLocationDto.userLocations.push(userLocationDto);
            });

            const response = await this.userService.updateUserLocation(updateUserLocationDto);

            return {
                code: ResponseCode.SUCCESS,
                match: await this.matchRepository.save(match)
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchService;
