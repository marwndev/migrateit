import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { getMigrations } from "./list.js";
import { INIT_FILE_NAME, MIGRATIONS_TABLE_NAME } from "../constants.js";
import { Migration } from "./migration-set.js";
import { getDBAdapter } from "../db/register-db-adapter.js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export async function migrationUp(config: MigrateItConfig) {
    const migrations = await getMigrations(config);

    const dbAdapter = await getDBAdapter(config);

    const lastMigration = await dbAdapter.getLastRunMigration();

    let initScript = '';
    if (!lastMigration) {
        initScript = getInitScript(config);
    }

    const migrationsToRun: Migration[] = [];
    for (let migration of migrations) {
        if (lastMigration && migration.timestamp <= lastMigration.timestamp) {
            continue;
        }

        migrationsToRun.push(migration);
    }

    if (!migrationsToRun.length) {
        console.log('Database is up to date');
        await dbAdapter.close();
        return;
    }

    for (let migration of migrationsToRun) {
        console.log(`\x1b[32m(up)\x1b[0m - ${migration.timestamp}-${migration.title} (running)`);

        const queries = ['BEGIN;'];
        if (initScript) {
            queries.push(initScript);
        }

        let upSQL = await migration.getUpSQL(config);
        let addMigrationSQL = `INSERT INTO ${MIGRATIONS_TABLE_NAME} (timestamp, title) VALUES (${migration.timestamp}, '${migration.title}');`;

        queries.push(upSQL);
        queries.push(addMigrationSQL);
        queries.push('COMMIT;');

        const finalSQL = queries.join('\n');

        await dbAdapter.exec(finalSQL);

        console.log(`\x1b[32m(up)\x1b[0m - ${migration.timestamp}-${migration.title} \x1b[32m(done)\x1b[0m`);
    }

    console.log('\nAll migrations ran successfully');
    await dbAdapter.close();
}

function getInitScript(config: MigrateItConfig) {
    const filePath = join(config.migrationsPath, INIT_FILE_NAME);

    if (existsSync(filePath)) {
        return readFileSync(filePath, 'utf-8');
    }

    return '';
}

