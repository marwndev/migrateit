import { DatabaseSync } from 'node:sqlite';
import { Migration } from "../migrateit/migration-set.js";
import { DatabaseAdapter } from './db-adapter.js';
import { MIGRATIONS_TABLE_NAME } from '../constants.js';

export class SqliteDatabaseAdapter extends DatabaseAdapter<string> {
    database: DatabaseSync;

    async init() {
        this.database = new DatabaseSync(this.clientConfig);
    }

    async query(sql: string): Promise<any> {
        const statement = this.database.prepare(sql);
        return statement.all();
    }

    async exec(sql: string): Promise<void> {
        this.database.exec(sql);
    }

    async createMigrationsTable() {
        await this.query(`CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE_NAME} (timestamp bigint PRIMARY KEY, title text NOT NULL);`)
    }

    async getLastRunMigration() {
        const result = await this.query(`SELECT timestamp, title FROM ${MIGRATIONS_TABLE_NAME} ORDER BY timestamp DESC LIMIT 1`);
        if (!result.length) {
            return null
        }

        return new Migration(result[0].title, parseInt(result[0].timestamp, 10));
    }

    async getMigrations(): Promise<Migration[]> {
        const result = await this.query(`SELECT timestamp, title FROM ${MIGRATIONS_TABLE_NAME} ORDER BY timestamp ASC`);
        return result.map(row => new Migration(row.title, parseInt(row.timestamp, 10)));
    }

    async close(): Promise<void> {
        this.database.close();
    }
}

