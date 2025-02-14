import { MIGRATIONS_TABLE_NAME } from "../constants.js";
import { DatabaseAdapter } from "./db-adapter.js";
import pg from 'pg';
import { Migration } from "../migrateit/migration-set.js";

export class PostgresDatabaseAdapter extends DatabaseAdapter<pg.ClientConfig> {
    client: pg.Client;

    async init() {
        const config = {
            ...this.clientConfig,
        };

        this.client = new pg.Client(config);
        await this.client.connect();
        await this.createMigrationsTable();
    }

    async query(sql: string): Promise<any> {
        const result = await this.client.query(sql);
        return result.rows;
    }

    async exec(sql: string) {
        return this.query(sql).then(() => {});
    }

    async createMigrationsTable() {
        await this.exec(`CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE_NAME} (timestamp bigint PRIMARY KEY, title text NOT NULL);`)
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
        await this.client.end()
    }
}
