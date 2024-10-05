import axios from 'axios';
import { MATCH_MAKING_SERVER_HOST, MATCH_MAKING_SERVER_PORT } from '@config';
import { GetMatchResponseDto } from '@dtos/match.dto';
import HttpService from '@services/httpServices/httpService';

class MatchmakingServerService extends HttpService {
    constructor() {
        if (!MATCH_MAKING_SERVER_HOST || !MATCH_MAKING_SERVER_PORT) {
            throw new Error(`MATCH_MAKING_SERVER_HOST: ${MATCH_MAKING_SERVER_HOST}, MATCH_MAKING_SERVER_PORT: ${MATCH_MAKING_SERVER_PORT}`);
        }
        super(MATCH_MAKING_SERVER_HOST, Number(MATCH_MAKING_SERVER_PORT));
    }

    public async findMatchById(id: string): Promise<GetMatchResponseDto> {
        try {
            const url = `http://${this.host}:${this.port}/match/${id}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchmakingServerService;
