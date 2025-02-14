import { existsSync, readFileSync } from "fs";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { resolve } from "path";
import { INIT_FILE_NAME, SCHEMA_FILE_NAME } from "../constants.js";

export function getCurrentSchema(config: MigrateItConfig) {
    const schemaFilePath = resolve(config.migrationsPath, SCHEMA_FILE_NAME);
    const initFilePath = resolve(config.migrationsPath, INIT_FILE_NAME);

    const content = [];

    if (existsSync(schemaFilePath)) {
        content.push(readFileSync(schemaFilePath, 'utf-8'));
    }

    if (existsSync(initFilePath)) {
        content.push(readFileSync(initFilePath, 'utf-8'));
    }

    if (!content.length) {
        return 'none';
    }

    return content.join('\n');
}

