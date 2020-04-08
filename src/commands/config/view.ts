import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import Command, { flags } from '@oclif/command';

export default class ConfigView extends Command {
  static description = 'view global config vars';

  static aliases = ['cv'];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run(): Promise<void> {
    this.parse(ConfigView);

    // Check if Config Directory exists, otherwise create directory
    await fs.ensureDir(this.config.configDir);
    const configPath = path.join(this.config.configDir, 'config.json');

    // Attempt to read Configuration Variables, otherwise show error
    try {
      const userConfig = await fs.readJSON(configPath);
      console.dir(userConfig);
    } catch (error) {
      this.log(chalk.bold.red('No configuration file found.'));
      this.log('Please refer to setup guide in the documentation.');
      this.log(
        'You can also run',
        chalk.bold.underline('fireup config:set -h'),
        'to know more.',
      );
    }
  }
}
