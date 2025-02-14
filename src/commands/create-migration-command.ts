import { getConfig } from '../migrateit/get-config.js';
import { createMigration } from '../migrateit/create-migration.js';
import { Command } from 'commander';

export default function createMigrationCommand() {
  const command = new Command('create')
    .description('Scan the models directory and create a migration file')
    .option('-n, --name <name>', 'Migration file name. If left empty the LLM will generate a name for you.')
    .option('-d, --dry-run', 'Run the migration in dry-run mode. No file will be created. The result will be printed to the console.')
    .option('-e --empty', 'Create an empty migration file')
    .action(async (options) => {
        const config = getConfig();
        await createMigration({
            name: options.name,
            dryRun: options.dryRun,
            empty: options.empty
        }, config)
    });

  return command;
}
