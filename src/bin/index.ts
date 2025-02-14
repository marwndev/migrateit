#!/usr/bin/env node

import { Command } from 'commander';
import createMigrationCommand from '../commands/create-migration-command.js';
import initCommand from '../commands/init-command.js';
import listCommand from '../commands/list-command.js';
import upCommand from '../commands/up-command.js';
import downCommand from '../commands/down-command.js';
import { registerAdapter } from '../db/register-db-adapter.js';
import { PostgresDatabaseAdapter } from '../db/pg-db-adapter.js';
import { getConfig } from '../migrateit/get-config.js';
import { cwd } from 'process';
import { existsSync } from 'fs';
import { SqliteDatabaseAdapter } from '../db/sqlite-db-adapter.js';

const program = new Command();

program
    .name('migrateit')
    .description('Migrateit is a tool to automatically generate and run migrations with LLMs')
    .version('0.0.1');

program.addCommand(createMigrationCommand());
program.addCommand(initCommand());
program.addCommand(listCommand());
program.addCommand(upCommand());
program.addCommand(downCommand());

const config = getConfig(false);
if (config) {
    if (config.dbType === 'postgres' && (!config.dbAdapter || config.dbAdapter === 'postgres')) {
        const postgresAdapter = new PostgresDatabaseAdapter();
        postgresAdapter.clientConfig = config.dbClientConfig;
        registerAdapter('postgres', postgresAdapter);
    }
    else if (config.dbType === 'sqlite' && (!config.dbAdapter || config.dbAdapter === 'sqlite')) {
        const sqliteAdapter = new SqliteDatabaseAdapter();
        sqliteAdapter.clientConfig = config.dbClientConfig;
        registerAdapter('sqlite', sqliteAdapter);
    }
}

const initScriptPath = `${cwd()}/migrateit.init.ts`;

if (existsSync(initScriptPath)) {
    await import(initScriptPath);
}

program.parse(process.argv);
