import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { getMigrations } from "./list.js";
import { MIGRATIONS_TABLE_NAME } from "../constants.js";
import { getDBAdapter } from "../db/register-db-adapter.js";

export async function migrationDown(config: MigrateItConfig) {
    const migrations = await getMigrations(config);
    const dbAdapter = await getDBAdapter(config);


    if (!migrations.lastRun) {
        console.log('No migrations to revert');
        await dbAdapter.close();
        return;
    }

    const completedMigrations = await dbAdapter.getMigrations();
    const lastRunMigration = completedMigrations.find(m => m.timestamp === migrations.lastRun);


    console.log(`\x1b[31m(down)\x1b[0m - ${lastRunMigration.timestamp}-${lastRunMigration.title} (reverting)`);

    const queries = ['BEGIN;'];
    const downSQL = await lastRunMigration.getDownSQL(config);
    const removeMigrationSQL = `DELETE FROM ${MIGRATIONS_TABLE_NAME} WHERE timestamp = ${lastRunMigration.timestamp};`;

    queries.push(downSQL);
    queries.push(removeMigrationSQL);
    queries.push('COMMIT;');

    const finalSQL = queries.join('\n');
    await dbAdapter.exec(finalSQL);

    console.log(`\x1b[31m(down)\x1b[0m - ${lastRunMigration.timestamp}-${lastRunMigration.title} \x1b[32m(done)\x1b[0m`);

    console.log('\nMigration reverted successfully');
    await dbAdapter.close();
}

