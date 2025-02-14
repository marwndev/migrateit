import { getConfig } from '../migrateit/get-config.js';
import { getMigrations } from '../migrateit/list.js';
import { Command } from 'commander';

export default function initCommand() {
    const command = new Command('list')
        .description('List all migrations')
        .option('-p, --pending', 'List only pending migrations')
        .action(async (options) => {
            const config = getConfig();
            const set = await getMigrations(config);

            if (set.size === 0) {
                console.log('No migrations found');
                return;
            }

            const list = Array.from(set).sort((a, b) => a.timestamp - b.timestamp);
            const pending = list.filter(m => m.timestamp > set.lastRun);

            if (options.pending) {
                if (!pending.length) {
                    console.log('No pending migrations');
                    return;
                }
            }

            for (let migration of list) {
                const isPending = migration.timestamp > set.lastRun;
                const icon = isPending ? '\x1b[33m?\x1b[0m' : '\x1b[32m✔\x1b[0m'; // Yellow for pending, green for successful
                console.log(`${icon} ${migration.title}`);
            }

            if (pending.length) {
                console.log(`\n\x1b[31m${pending.length}\x1b[0m Pending migration${pending.length > 1 ? 's' : ''}`);
            }
        });

    return command;
}

