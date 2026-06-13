#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { auditCommand } from './commands/audit.js';
import { validateCommand } from './commands/validate.js';

declare const process: any;

const program = new Command();

program
  .name('meta-tags')
  .description('CLI tool for managing and validating SEO meta tags')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize meta-tags configuration file')
  .action(initCommand);

program
  .command('audit')
  .description('Audit local files for SEO meta configurations')
  .action(auditCommand);

program
  .command('validate <url>')
  .description('Validate meta tags on a live URL')
  .action(validateCommand);

program.parse(process.argv);
