import { Room } from "@interfaces/room.interface";
import { PrismaClient } from "@prisma/client";
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class RoomDaoPostgres extends DaoPostgresBase<Room, PrismaClient["room"]> {
    constructor() {
        super(prismaClient, prismaClient.room);
    }
}
