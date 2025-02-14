import { init } from '../migrateit/init.js';
import { Command } from 'commander';

export default function initCommand() {
  const command = new Command('init')
    .description('Initialize auto-migrate by creating a default configuration file')
    .action(init);

  return command;
}

