import { PrismaClient, Prisma } from "@prisma/client";
import { CrudDao } from '@daos/dao.interface';

type PrismaModel<T extends { id: any }> = {
    upsert: (args: { where: { id: T["id"] }; update: Partial<T>; create: T; }) => Prisma.PrismaPromise<T>;
    findUnique: (args: { where: { id: T["id"] }; }) => Prisma.PrismaPromise<T | null>;
    findFirst: (args: { where: Partial<T>; }) => Prisma.PrismaPromise<T | null>;
    findMany: (args?: { where?: { id?: { in: T["id"][] } }; }) => Prisma.PrismaPromise<T[]>;
    count: (args?: { where?: Partial<T>; }) => Prisma.PrismaPromise<number>;
    delete: (args: { where: { id: T["id"] }; }) => Prisma.PrismaPromise<T>;
    deleteMany: (args?: { where?: { id?: { in: T["id"][] } }; }) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};

export abstract class DaoPostgresBase<T extends { id: any }, M extends PrismaModel<T>> implements CrudDao<T> {

    constructor(protected readonly prismaClient: PrismaClient, protected readonly model: M) { }

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            return await this.model.upsert({
                where: { id: entity.id },
                update: entity,
                create: entity,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(entities: Iterable<T>): Promise<void> {
        try {
            await this.prismaClient.$transaction(
                Array.from(entities).map((entity) =>
                    this.model.upsert({
                        where: { id: entity.id },
                        update: entity,
                        create: entity,
                    })
                )
            );
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await this.model.count();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: T["id"]): Promise<boolean> {
        try {
            return (await this.model.findUnique({ where: { id } })) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: T["id"]): Promise<T | undefined | null> {
        try {
            return await this.model.findUnique({ where: { id } });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<T>> {
        try {
            return await this.model.findMany();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>> {
        try {
            return await this.model.findMany({ where: { id: { in: Array.from(ids) } } });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(entity: T): Promise<void> {
        try {
            await this.deleteById(entity.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: T["id"]): Promise<void> {
        try {
            await this.model.delete({ where: { id } });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(entities?: Iterable<T>): Promise<void> {
        try {
            if (entities) {
                const ids = Array.from(entities).map<T["id"]>(entity => entity.id);
                await this.deleteAllById(ids);
            } else {
                await this.model.deleteMany();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<T["id"]>): Promise<void> {
        try {
            await this.model.deleteMany({ where: { id: { in: Array.from(ids) } } });
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null> {
        try {
            return await this.model.findFirst({
                where: { [field]: value } as Partial<Record<keyof T, any>>,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
