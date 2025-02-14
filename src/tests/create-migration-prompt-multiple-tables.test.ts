import { MigrateItConfig } from "interfaces/auto-migrate-config.js";
import { createMigration } from "../migrateit/create-migration.js";
import { describe, it, } from "node:test";

describe('Create Migration', () => {
    it('should remove email column and create posts table', async () => {
        const config: MigrateItConfig = {
            dbType: "postgres",
            dbAdapter: "postgres",
            modelsPath: ["./src/tests/assets/db4/models/*.ts"],
            migrationsPath: "./src/tests/assets/db4/migrations/",
            llm: {
                provider: "openai",
                model: "gpt-4o"
            }
        }

        const result = await createMigration({ dryRun: true }, config);
        console.log(result);
    });
});
