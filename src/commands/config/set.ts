import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { Command, flags } from '@oclif/command';
import FireUpConfig from '../../interfaces/fireup-config';

export default class ConfigSet extends Command {
  static description = 'Set Global Configuration Variables';

  static aliases = ['cs'];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    {
      name: 'key',
      required: true,
      description: 'config variable to modify',
      options: ['service.account', 'storage.bucket'],
    },
    {
      name: 'value',
      required: true,
      description: 'value to be set',
    },
  ];

  async run(): Promise<void> {
    const { args } = this.parse(ConfigSet);

    // Check if Config Directory exists, otherwise create directory
    const configPath = path.join(this.config.configDir, 'config.json');
    await fs.ensureDir(this.config.configDir);

    // Initialize Empty Object to bypass TSLint Errors
    let userConfig: FireUpConfig = {
      serviceAccount: '',
      storageBucket: '',
    };

    // Read Existing Values to Append
    try {
      userConfig = await fs.readJSON(configPath);
    } catch (error) {}

    // Set Service Account JSON Path
    if (args.key === 'service.account') {
      userConfig.serviceAccount = args.value;
      this.log(chalk.bold('Service Account JSON has been updated.'));
    }

    // Set Firebase Storage Bucket URL
    if (args.key === 'storage.bucket') {
      userConfig.storageBucket = args.value;
      this.log(chalk.bold('Firebase Storage Bucket URL has been updated.'));
    }

    // Finally, write the updated JSON to file
    await fs.writeJSON(configPath, userConfig, { spaces: 2 });
  }
}
