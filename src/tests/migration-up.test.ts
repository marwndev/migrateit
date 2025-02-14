import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";
import { afterEach, before, describe, it } from "node:test";
import { migrationUp } from "../migrateit/migration-up.js";
import { DatabaseSync } from "node:sqlite";
import { registerAdapter } from "../db/register-db-adapter.js";
import { SqliteDatabaseAdapter } from "../db/sqlite-db-adapter.js";
import { unlinkSync } from "fs";
import assert from 'node:assert';

describe('Migration Up', () => {
    before(() => {
        const adapter = new SqliteDatabaseAdapter();
        adapter.clientConfig = './src/tests/assets/db6/test.db';
        registerAdapter('sqlite', adapter);
    });

    afterEach(() => {
        unlinkSync('./src/tests/assets/db6/test.db');
    });

    it('should create table', async (t) => {
        const config: MigrateItConfig = {
            dbType: "sqlite",
            dbAdapter: "sqlite",
            modelsPath: ["./src/tests/assets/db6/models/*.ts"],
            migrationsPath: "./src/tests/assets/db6/migrations/",
            dbClientConfig: './src/tests/assets/db6/test.db',
            llm: {
                provider: "openai",
                model: "gpt-4o"
            }
        }

        await migrationUp(config);

        const db = new DatabaseSync(config.dbClientConfig);
        const tableInfo = db.prepare("PRAGMA table_info(users)").all();

        const idCol:any = tableInfo.find((col: any) => col.name === 'id');
        const nameCol:any = tableInfo.find((col: any) => col.name === 'name');
        const emailCol:any = tableInfo.find((col: any) => col.name === 'email');
        const passwordCol:any = tableInfo.find((col: any) => col.name === 'password');

        assert(idCol, 'id column not found');
        assert(nameCol, 'name column not found');
        assert(emailCol, 'email column not found');
        assert(passwordCol, 'password column not found');

        assert.equal(idCol.type, 'INTEGER', 'id column type is not INTEGER');
        assert.equal(idCol.pk, 1, 'id column is not primary key');
        assert.equal(idCol.notnull, 1, 'id column is nullable');

        assert.equal(nameCol.type, 'VARCHAR(100)', 'name column type is not VARCHAR(100)');
        assert.equal(nameCol.notnull, 1, 'name column is nullable');

        assert.equal(emailCol.type, 'VARCHAR(300)', 'email column type is not VARCHAR(300)');
        assert.equal(emailCol.notnull, 1, 'email column is nullable');

        assert.equal(passwordCol.type, 'TEXT', 'password column type is not TEXT');
        assert.equal(passwordCol.notnull, 1, 'password column is nullable');
    });
});
