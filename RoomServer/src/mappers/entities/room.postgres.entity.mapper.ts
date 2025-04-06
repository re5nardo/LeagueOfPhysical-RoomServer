import { Room, RoomStatus } from '@interfaces/room.interface';
import { Room as RoomEntity } from '@prisma/client';
import * as Entity from '@prisma/client';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class RoomMapper implements DomainEntityMapper<Room, RoomEntity> {
    public toDomain(entity: RoomEntity): Room {
        return {
            id: entity.id,
            matchId: entity.matchId,
            createdAt: entity.createdAt,
            status: RoomStatus[entity.status as keyof typeof RoomStatus],
            ip: entity.ip,
            port: entity.port,
            lastHeartbeat: entity.lastHeartbeat,
        };
    }

    public toEntity(domain: Room): RoomEntity {
        return {
            id: domain.id,
            matchId: domain.matchId,
            createdAt: new Date(domain.createdAt),
            status: RoomStatus[domain.status] as Entity.RoomStatus,
            ip: domain.ip,
            port: domain.port,
            lastHeartbeat: new Date(domain.lastHeartbeat),
        };
    }

    public toDomains(entities: Iterable<RoomEntity>): Iterable<Room> {
        return Array.from(entities, (entity) => this.toDomain(entity));
    }

    public toEntities(domains: Iterable<Room>): Iterable<RoomEntity> {
        return Array.from(domains, (domain) => this.toEntity(domain));
    }

    public getEntityFieldName<K extends keyof Room>(field: K): string {
        switch (field) {
            default: return field;
        }
    }

    public toEntityValue<K extends keyof Room>(field: K, value: Room[K]): any {
        switch (field) {
            default: return value;
        }
    }
}
