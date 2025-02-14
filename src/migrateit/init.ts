import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { CONFIG_FILE_NAME, INIT_FILE_NAME, SCHEMA_FILE_NAME } from "../constants.js";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { cwd } from "process";
import { join } from "path";

export function init(config: MigrateItConfig) {
    const filename = CONFIG_FILE_NAME;
    if (existsSync(`./${filename}`)) {
        console.log(`${filename} already exists`);
        return;
    }

    createConfigFile();
    createMigrationsFolder('./src/migrations');
    createInitFile('./src/migrations');
}

function createInitFile(migrationsPath: string) {
    writeFileSync(join(cwd(), migrationsPath, INIT_FILE_NAME), '');
}

function createConfigFile() {
    const fileContent = `{
    "dbType": "postgres",
    "modelsPath": ["./src/models/*.ts"],
    "migrationsPath": "./src/migrations/",
    "dbClientConfig": {
        "db": "postgres"
    },
    "llm": {
        "provider": "openai",
        "model": "gpt-4o"
    }
}
        `;

    writeFileSync(join(cwd(), CONFIG_FILE_NAME), fileContent);
}

function createMigrationsFolder(migrationsPath: string) {
    if (!existsSync(migrationsPath)) {
        mkdirSync(migrationsPath, { recursive: true });
    }
}
