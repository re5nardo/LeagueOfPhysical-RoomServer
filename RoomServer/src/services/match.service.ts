import {
    CreateMatchDto, MatchStartDto, MatchEndDto, CreateMatchResponseDto, GetMatchResponseDto, MatchStartResponseDto, MatchEndResponseDto
} from '@dtos/match.dto';
import { UpdateUserLocationDto, UserLocationDto } from '@dtos/user-location.dto';
import { MatchRepository } from '@repositories/match.repository';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { MatchMapper } from "@mappers/match.mapper";
import { MatchStatus } from '@interfaces/match.interface';
import UserLocationService from '@services/user-location.service';
import { Location, LocationDetail } from '@interfaces/user-location.interface';

class MatchService {

    private matchRepository = new MatchRepository();
    private userLocationService = new UserLocationService();

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
                match: MatchMapper.toMatchResponseDto(match),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createMatch(createMatchDto: CreateMatchDto): Promise<CreateMatchResponseDto> {
        try {
            const match = MatchMapper.CreateMatchDto.toEntity(createMatchDto);
            await this.matchRepository.save(match);

            return {
                code: ResponseCode.SUCCESS,
                match: MatchMapper.toMatchResponseDto(match),
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
            
            await this.matchRepository.save(match);

            return {
                code: ResponseCode.SUCCESS,
                match: MatchMapper.toMatchResponseDto(match),
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

            match.playerList.forEach(playerId => {
                const userLocationDto: UserLocationDto = {
                    userId: playerId,
                    location: Location.None,
                    locationDetail: new LocationDetail(Location.None),
                };
                updateUserLocationDto.userLocations.push(userLocationDto);
            });

            const response = await this.userLocationService.updateUserLocation(updateUserLocationDto);

            await this.matchRepository.save(match);

            return {
                code: ResponseCode.SUCCESS,
                match: MatchMapper.toMatchResponseDto(match),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchService;
