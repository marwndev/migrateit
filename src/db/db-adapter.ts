import { Migration } from "../migrateit/migration-set.js";

export interface ColumnDefinition  {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
}

export abstract class DatabaseAdapter<TConfig = any> {

    clientConfig: TConfig;

    constructor() {
    }

    abstract init(): Promise<void>;
    abstract query(sql: string): Promise<any[]>;
    abstract exec(sql: string): Promise<void>;
    abstract createMigrationsTable(): Promise<void>;
    abstract getLastRunMigration(): Promise<any>;
    abstract getMigrations(): Promise<Migration[]>;
    abstract close(): Promise<void>;
}
