import { NextFunction, Request, Response } from 'express';
import { UpdateMatchStatusDto, MatchStartDto, MatchEndDto } from '@dtos/match.dto';
import MatchService from '@services/match.service';

class MatchController {
    private matchService = new MatchService();

    public getMatchById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchId: string = req.params.id;
            const response = await this.matchService.findMatchById(matchId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
    
    public updateMatchStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateMatchStatusDto: UpdateMatchStatusDto = req.body;
            const response = await this.matchService.updateMatchStatus(updateMatchStatusDto);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public matchStart = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchStartDto: MatchStartDto = req.body;
            const response = await this.matchService.matchStart(matchStartDto);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public matchEnd = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchEndDto: MatchEndDto = req.body;
            const response = await this.matchService.matchEnd(matchEndDto);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default MatchController;
