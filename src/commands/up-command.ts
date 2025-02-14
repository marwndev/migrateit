import { getConfig } from '../migrateit/get-config.js';
import { Command } from 'commander';
import { migrationUp } from '../migrateit/migration-up.js';

export default function upCommand() {
    const command = new Command('up')
        .description('Execute all pending migrations')
        .action(async () => {
            const config = getConfig();
            await migrationUp(config);
        });

    return command;
}
