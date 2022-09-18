import { Router } from 'express';
import MatchController from '@controllers/match.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { MatchStartDto, MatchEndDto } from '@dtos/match.dto';

class MatchRoute implements Routes {
    public path = '/match';
    public router = Router();
    public matchController = new MatchController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.put(`${this.path}/match-start`, validationMiddleware(MatchStartDto, 'body'), this.matchController.matchStart);
        this.router.put(`${this.path}/match-end`, validationMiddleware(MatchEndDto, 'body'), this.matchController.matchEnd);
        this.router.get(`${this.path}/:id`, this.matchController.getMatchById);
    }
}

export default MatchRoute;
