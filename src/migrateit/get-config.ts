import { CONFIG_FILE_NAME } from "../constants.js";
import { existsSync, readFileSync } from "fs";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { join } from "path";
import { cwd } from "process";

export function getConfig(throwIfNotFound = true): MigrateItConfig {
    const path = join(cwd(), CONFIG_FILE_NAME);

    if (!existsSync(path)) {
        if (throwIfNotFound) {
            throw new Error(`${CONFIG_FILE_NAME} not found in the root directory`);
        }
        else {
            return null;
        }
    }

    const json = readFileSync(path, 'utf-8');
    const config = JSON.parse(json) as MigrateItConfig;
    return config;
}
