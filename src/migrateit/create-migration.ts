import { extractDefinitions } from "../reflection/extract-definitions.js";
import CreateMigrationOptions from "../interfaces/create-migration-options.js";
import { CreateMigrationAgent, CreateMigrationResult } from "../agents/create-migration-agent.js";
import { writeFile } from "fs/promises";
import { getCurrentSchema } from "./get-schema.js";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { SCHEMA_FILE_NAME } from "../constants.js";

export async function createMigration(options: CreateMigrationOptions = {}, config: MigrateItConfig): Promise<CreateMigrationResult> {

    if (options.empty) {
        const timestamp = new Date().getTime();
        const name = options.name || 'empty-migration';

        const upFilename = `${timestamp}-1-${name}.up.sql`;
        const downFilename = `${timestamp}-2-${name}.down.sql`;

        const upFilepath = `${config.migrationsPath}/${upFilename}`;
        const downFilepath = `${config.migrationsPath}/${downFilename}`;

        await writeFile(upFilepath, '');
        await writeFile(downFilepath, '');

        console.log(`\x1b[32mcreated\x1b[0m - ${upFilepath}`);
        return {
            migrationUp: '',
            migrationDown: '',
            filename: name,
            migrationUpFile: upFilepath,
            migrationDownFile: downFilepath
        }
    }

    const definitions = extractDefinitions(config.modelsPath);

    if (!definitions.length) {
        console.log('No models found');
        return;
    }

    let currentSchema = getCurrentSchema(config);

    const agent = new CreateMigrationAgent(config, options, definitions.join('\n'), currentSchema);
    const result = await agent.run();

    if (!(result.migrationUp || '').trim()) {
        console.log('No changes detected.');
        return;
    }

    cleanUp(result);

    if (options.dryRun) {
        return result;
    }

    if (!options.dryRun) {
        const migrationUp = result.migrationUp;
        const migrationDown = result.migrationDown;
        const schema = result.finalTableSchema;

        const timestamp = new Date().getTime();
        const upFilename = `${timestamp}-1-${result.filename}.up.sql`;
        const downFilename = `${timestamp}-2-${result.filename}.down.sql`;

        const upFilepath = `${config.migrationsPath}/${upFilename}`;
        const downFilepath = `${config.migrationsPath}/${downFilename}`;
        const schemaFilepath = `${config.migrationsPath}/${SCHEMA_FILE_NAME}`;

        await writeFile(upFilepath, migrationUp);
        await writeFile(downFilepath, migrationDown);

        if (!options.doNotUpdateSchemaFile) {
            await writeFile(schemaFilepath, schema);
        }

        console.log(`\x1b[32mcreated\x1b[0m - ${upFilepath}`);
        console.log(`\x1b[32mcreated\x1b[0m - ${downFilepath}`);

        return {
            migrationUp: migrationUp,
            migrationDown: migrationDown,
            finalTableSchema: schema,
            filename: result.filename,
            migrationUpFile: upFilepath,
            migrationDownFile: downFilepath
        }
    }
}

function cleanUp(result: CreateMigrationResult) {
    result.migrationUp = cleanUpSQL(result.migrationUp).trim();
    result.migrationDown = cleanUpSQL(result.migrationDown).trim();
    result.finalTableSchema = cleanUpSQL(result.finalTableSchema).trim();
}

function cleanUpSQL(sql: string) {
    return sql.replace(/BEGIN;/g, '').replace(/COMMIT;/g, '').replace(/ROLLBACK;/g, '');
}
