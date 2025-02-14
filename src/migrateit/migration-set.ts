import { readFile } from "fs/promises";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";

export class Migration {

    constructor(public title: string, public timestamp: number) {
    }

    static fromFilepath(filepath: string) {
        const filename = filepath.split('/').pop();
        const parts = filename.split('-');
        const timestamp = parseInt(parts[0], 10);
        parts.shift();
        parts.shift();
        const title = parts.join('-').replace('.up.sql', '');

        const migration = new Migration(title, timestamp);
        return migration;
    }

    async getUpSQL(config: MigrateItConfig) {
        const filepath = `${config.migrationsPath}/${this.timestamp}-1-${this.title}.up.sql`;
        return await readFile(filepath, 'utf-8');
    }

    async getDownSQL(config: MigrateItConfig) {
        const filepath = `${config.migrationsPath}/${this.timestamp}-2-${this.title}.down.sql`;
        return await readFile(filepath, 'utf-8');
    }
}

export class MigrationSet extends Set<Migration> {
    lastRun: number | null;
}
