import { getConfig } from '../migrateit/get-config.js';
import { Command } from 'commander';
import { migrationDown } from '../migrateit/migration-down.js';

export default function downCommand() {
    const command = new Command('down')
        .description('Undo the last migration')
        .action(async () => {
            const config = getConfig();
            await migrationDown(config);
        });

    return command;
}
