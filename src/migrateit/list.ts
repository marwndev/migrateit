import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { join } from "path";
import { Migration, MigrationSet } from "./migration-set.js";
import { glob } from 'glob';
import { getDBAdapter } from "../db/register-db-adapter.js";

export async function getMigrations(config: MigrateItConfig): Promise<MigrationSet> {
    const set = new MigrationSet()

    const migrationsPath = join(config.migrationsPath, '/', '*.up.sql');
    const files = await glob(migrationsPath);

    const dbAdapter = await getDBAdapter(config);

    const lastRunMigration = await dbAdapter.getLastRunMigration();
    set.lastRun = lastRunMigration ? lastRunMigration.timestamp : null;

    const migrations = [];
    for (let file of files) {
        const migration = Migration.fromFilepath(file);
        migrations.push(migration);
    }

    migrations.sort((a, b) => a.timestamp - b.timestamp);

    for (let migration of migrations) {
        set.add(migration);
    }

    await dbAdapter.close();

    return set;
}
