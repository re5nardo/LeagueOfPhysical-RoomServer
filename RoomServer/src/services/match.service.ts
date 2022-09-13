
import {
    CreateMatchDto, UpdateMatchStatusDto, MatchStartDto, MatchEndDto,
    CreateMatchResponseDto, GetMatchResponseDto, UpdateMatchResponseDto, MatchStartResponseDto, MatchEndResponseDto
} from '@dtos/match.dto';
import { MatchRepository } from '@repositories/match.repository';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { MatchMapper } from "@mappers/match.mapper";

class MatchService {

    private matchRepository = new MatchRepository();

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

    public async updateMatchStatus(updateMatchStatusDto: UpdateMatchStatusDto): Promise<UpdateMatchResponseDto> {
        try {
            const match = await this.matchRepository.findById(updateMatchStatusDto.matchId);
            if (!match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST
                };
            }

            match.status = updateMatchStatusDto.status;
            return {
                code: ResponseCode.SUCCESS,
                match: await this.matchRepository.save(match)
            };
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

            console.log(`[matchStart] matchId: ${match.id}`);

            //match.status = updateMatchStatusDto.status;
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

            console.log(`[matchEnd] matchId: ${match.id}`);

            //match.status = updateMatchStatusDto.status;
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
