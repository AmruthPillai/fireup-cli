import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as admin from 'firebase-admin';
import { Command, flags } from '@oclif/command';

import UploadEvent from '../interfaces/upload-event';
import FireUpConfig from '../interfaces/fireup-config';

export default class History extends Command {
  static description = 'file upload history';

  static aliases = ['hi'];

  static flags = {
    delete: flags.string({
      char: 'd',
      description: 'name of file to be delete',
    }),
    help: flags.help({ char: 'h' }),
  };

  async run(): Promise<void> {
    const { flags } = this.parse(History);

    let history: UploadEvent[] = [];
    await fs.ensureDir(this.config.configDir);
    const historyPath = path.join(this.config.configDir, 'history.json');
    try {
      history = await fs.readJSON(historyPath);
    } catch (error) {}

    if (flags.delete) {
      // Check if Config Directory exists, otherwise create directory
      await fs.ensureDir(this.config.configDir);
      const configPath = path.join(this.config.configDir, 'config.json');

      // Initialize Empty Object to bypass TSLint Errors
      let userConfig: FireUpConfig = {
        serviceAccount: '',
        storageBucket: '',
      };

      // Attempt to read Configuration Variables, otherwise show error
      try {
        userConfig = await fs.readJSON(configPath);
      } catch (error) {
        this.log(chalk.bold.red('No configuration file found.'));
        this.log('Please refer to setup guide in the documentation.');
        this.log(
          'You can also run',
          chalk.bold.underline('fireup config:set -h'),
          'to know more.',
        );
      }

      // Search for Google Service Account JSON path
      const serviceAccount = userConfig.serviceAccount || '';
      if (serviceAccount === '') {
        this.log(
          chalk.bold.red('Cannot find your Google Service Account JSON.'),
        );
        this.log(
          'Please set the path config variable by running',
          chalk.bold.underline(
            'fireup config:set service.account /path/to/file.json',
          ),
        );
        return;
      }

      // Search for Firebase Storage Bucket URL
      // Priority: flag > global config
      const storageBucket = userConfig.storageBucket || '';
      if (storageBucket === '') {
        this.log(
          chalk.bold.red('Cannot find your Firebase Storage Bucket URL.'),
        );
        this.log(
          'Please check the documentation on how to initialize config, or provide a bucket URL through the -b flag.',
        );
        return;
      }

      // Initialize Firebase Admin SDK
      const options = {
        credential: admin.credential.cert(serviceAccount),
        storageBucket,
      };
      const bucket = admin.initializeApp(options).storage().bucket();

      // Attempt to delete file, otherwise throw error
      try {
        await bucket.file(flags.delete).delete();
        history = history.filter((x) => x.name !== flags.delete);
        await fs.writeJSON(historyPath, history, { spaces: 2 });
        this.log(`${flags.delete} has been deleted successfully.`);
      } catch (error) {
        this.error(
          'The file you specified does not exist, please check the file name and try again.',
        );
      }
    } else {
      console.dir(history);
    }
  }
}
