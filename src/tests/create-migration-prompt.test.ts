import { MigrateItConfig } from "interfaces/auto-migrate-config.js";
import { createMigration } from "../migrateit/create-migration.js";
import { afterEach, describe, it, } from "node:test";
import { registerAdapter, removeAdapter } from "db/register-db-adapter.js";
import { SqliteDatabaseAdapter } from "db/sqlite-db-adapter.js";
import { unlinkSync } from "fs";
import assert from 'node:assert';
import { migrationUp } from "../migrateit/migration-up.js";
import { DatabaseSync } from "node:sqlite";
import { globIterateSync } from 'glob';

describe('Create Migration', () => {

    let createdSQLFiles: string[] = [];

    afterEach(() => {
        removeAdapter('sqlite');

        const dbs = globIterateSync('./src/tests/assets/**/*.db');
        for (let db of dbs) {
            unlinkSync(db);
        }

        for (let file of createdSQLFiles) {
            unlinkSync(file);
        }

        createdSQLFiles = [];
    });

    it('create users table', async () => {
        const adapter = new SqliteDatabaseAdapter();
        adapter.clientConfig = './src/tests/assets/db1/test.db';
        registerAdapter('sqlite', adapter);

        const config: MigrateItConfig = {
            dbType: "sqlite",
            modelsPath: ["./src/tests/assets/db1/models/*.ts"],
            migrationsPath: "./src/tests/assets/db1/migrations/",
            dbClientConfig: './src/tests/assets/db1/test.db',
            llm: {
                provider: "openai",
                model: "gpt-4o"
            }
        };

        const createResult = await createMigration({ dryRun: false, doNotUpdateSchemaFile: true }, config);
        await migrationUp(config);

        createdSQLFiles.push(createResult.migrationUpFile);
        createdSQLFiles.push(createResult.migrationDownFile);

        const db = new DatabaseSync(config.dbClientConfig);

        const tableInfo = db.prepare("PRAGMA table_info(users)").all();

        const idCol: any = tableInfo.find((col: any) => col.name === 'id');
        const nameCol: any = tableInfo.find((col: any) => col.name === 'name');
        const emailCol: any = tableInfo.find((col: any) => col.name === 'email');
        const passwordCol: any = tableInfo.find((col: any) => col.name === 'password');
        const createdAt: any = tableInfo.find((col: any) => col.name === 'created_at');
        const updatedAt: any = tableInfo.find((col: any) => col.name === 'updated_at');

        assert.strictEqual(tableInfo.length, 5, 'table columns count is not 5');

        assert(idCol, 'id column not found');
        assert(nameCol, 'name column not found');
        assert(emailCol, 'email column not found');
        assert(passwordCol, 'password column not found');
        assert(createdAt, 'created_at column not found');
        assert.strictEqual(updatedAt, undefined, 'updated_at column found');

        assert.equal(idCol.type, 'INTEGER', 'id column type is not INTEGER');
        assert.equal(idCol.pk, 1, 'id column is not primary key');
        assert.equal(idCol.notnull, 1, 'id column is nullable');

        assert.equal(nameCol.type, 'VARCHAR(100)', 'name column type is not VARCHAR(100)');
        assert.equal(nameCol.notnull, 1, 'name column is nullable');

        assert.equal(emailCol.type, 'VARCHAR(300)', 'email column type is not VARCHAR(300)');
        assert.equal(emailCol.notnull, 1, 'email column is nullable');

        assert.equal(passwordCol.type, 'TEXT', 'password column type is not TEXT');
        assert.equal(passwordCol.notnull, 1, 'password column is nullable');

        assert.equal(createdAt.type, 'DATETIME', 'created_at column type is not DATE');
        assert.equal(createdAt.notnull, 1, 'created_at column is nullable');
    });

    it('add new age column', async () => {
        const adapter = new SqliteDatabaseAdapter();
        adapter.clientConfig = './src/tests/assets/db2/test.db';
        registerAdapter('sqlite', adapter);

        const config: MigrateItConfig = {
            dbType: "sqlite",
            modelsPath: ["./src/tests/assets/db2/models/*.ts"],
            migrationsPath: "./src/tests/assets/db2/migrations/",
            dbClientConfig: './src/tests/assets/db2/test.db',
            llm: {
                provider: "openai",
                model: "gpt-4o"
            }
        }

        const createResult = await createMigration({ dryRun: false, doNotUpdateSchemaFile: true }, config);
        await migrationUp(config);

        createdSQLFiles.push(createResult.migrationUpFile);
        createdSQLFiles.push(createResult.migrationDownFile);

        const db = new DatabaseSync(config.dbClientConfig);
        const tableInfo = db.prepare("PRAGMA table_info(users)").all();

        const idCol: any = tableInfo.find((col: any) => col.name === 'id');
        const nameCol: any = tableInfo.find((col: any) => col.name === 'name');
        const emailCol: any = tableInfo.find((col: any) => col.name === 'email');
        const passwordCol: any = tableInfo.find((col: any) => col.name === 'password');
        const createdAt: any = tableInfo.find((col: any) => col.name === 'created_at');
        const updatedAt: any = tableInfo.find((col: any) => col.name === 'updated_at');
        const ageCol: any = tableInfo.find((col: any) => col.name === 'age');

        assert.strictEqual(tableInfo.length, 6, 'table columns count is not 5');

        assert(idCol, 'id column not found');
        assert(nameCol, 'name column not found');
        assert(emailCol, 'email column not found');
        assert(passwordCol, 'password column not found');
        assert(createdAt, 'created_at column not found');
        assert(ageCol, 'age column not found');
        assert.strictEqual(updatedAt, undefined, 'updated_at column found');

        assert.equal(idCol.type, 'INTEGER', 'id column type is not INTEGER');
        assert.equal(idCol.pk, 1, 'id column is not primary key');
        assert.equal(idCol.notnull, 1, 'id column is nullable');

        assert.equal(nameCol.type, 'VARCHAR(100)', 'name column type is not VARCHAR(100)');
        assert.equal(nameCol.notnull, 1, 'name column is nullable');

        assert.equal(emailCol.type, 'VARCHAR(300)', 'email column type is not VARCHAR(300)');
        assert.equal(emailCol.notnull, 1, 'email column is nullable');

        assert.equal(passwordCol.type, 'TEXT', 'password column type is not TEXT');
        assert.equal(passwordCol.notnull, 1, 'password column is nullable');

        assert.equal(createdAt.type, 'DATETIME', 'created_at column type is not DATE');
        assert.equal(createdAt.notnull, 1, 'created_at column is nullable');

        assert.equal(ageCol.type, 'INTEGER', 'age column type is not INTEGER');
        assert.equal(ageCol.notnull, 1, 'age column is nullable');
        assert.equal(ageCol.dflt_value, '10', 'age column default value is not 10');
    });
    //
    // it('should remove email column', async () => {
    //     const config: AutoMigrateConfig = {
    //         dbType: "postgres",
    //         dbAdapter: "postgres",
    //         modelsPath: ["./src/tests/assets/db3/models/*.ts"],
    //         migrationsPath: "./src/tests/assets/db3/migrations/",
    //         llm: {
    //             provider: "openai",
    //             model: "gpt-4o"
    //         }
    //     }
    //
    //     const configPath = './src/tests/assets/db3/dbadmin.config.json';
    //     const result = await createMigration({ dryRun: true }, config);
    //     console.log(result);
    // });
});
