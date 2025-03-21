import LobbyServerService from '@services/httpServices/lobbyServer.service';
import { GetUserResponseDto, FindAllUsersResponseDto } from '@dtos/user.dto';

class UserService {

    private lobbyServerService = new LobbyServerService();

    public async findUserById(id: string): Promise<GetUserResponseDto> {
        try {
            return await this.lobbyServerService.findUserById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllUsersById(ids: string[]): Promise<FindAllUsersResponseDto> {
        try {
            return await this.lobbyServerService.findAllUsersById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default UserService;
