import MatchmakingServerService from '@services/httpServices/matchmaking-server.service';
import { GetMatchResponseDto } from '@dtos/match.dto'

class MatchService {

    private matchmakingServerService = new MatchmakingServerService();

    public async findMatchById(id: string): Promise<GetMatchResponseDto> {
        try {
            return await this.matchmakingServerService.findMatchById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchService;
