import { PrismaClient, Room as RoomEntity } from '@prisma/client';
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class RoomDaoPostgres extends DaoPostgresBase<RoomEntity, PrismaClient["room"]> {
    constructor() {
        super(prismaClient, prismaClient.room);
    }
}
