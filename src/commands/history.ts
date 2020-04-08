import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as clipboardy from 'clipboardy';
import { Command, flags } from '@oclif/command';

import UploadEvent from '../interfaces/upload-event';
import { getStorageBucket } from '../utils';

export default class History extends Command {
  static description = 'file upload history';

  static aliases = ['hi'];

  static flags = {
    view: flags.boolean({
      char: 'v',
      default: false,
      description: 'view upload history',
    }),
    delete: flags.string({
      char: 'd',
      description: 'name of file to be deleted',
    }),
    public: flags.string({
      char: 'p',
      description: 'make file public, get download URL',
      exclusive: ['signed'],
    }),
    signed: flags.string({
      char: 's',
      description: 'make file private, get temporarily signed URL',
      exclusive: ['public'],
    }),
    help: flags.help({ char: 'h' }),
  };

  async deleteFile(
    history: UploadEvent[],
    historyPath: string,
    filename: string,
  ): Promise<void> {
    // Get Firebase Storage Bucket
    const bucket = await getStorageBucket(this);

    // Attempt to delete file, otherwise throw error
    try {
      await bucket.file(filename).delete();
      history = history.filter((x) => x.name !== filename);
      await fs.writeJSON(historyPath, history, { spaces: 2 });
      this.log(`${filename} has been deleted successfully.`);
    } catch (error) {
      this.error(
        'The file you specified does not exist, please check the file name and try again.',
      );
    }
  }

  async copyToClipboard(link: string): Promise<void> {
    await clipboardy.write(link);
    this.log(chalk.gray.bold('\nURL has been copied to your clipboard.'));
  }

  async getPublicUrl(filename: string): Promise<void> {
    // Get Firebase Storage Bucket
    const bucket = await getStorageBucket(this);

    try {
      const file = await bucket.file(filename).getMetadata();
      await bucket.file(filename).makePublic();
      const url = file[0].mediaLink;
      this.log(chalk.blue('\nPublic URL:'), chalk.bold.underline(url));
      this.copyToClipboard(url);
    } catch (error) {
      this.error(
        'The file you specified does not exist, please check the file name and try again.',
      );
    }
  }

  async getSignedUrl(filename: string): Promise<void> {
    // Get Firebase Storage Bucket
    const bucket = await getStorageBucket(this);
    const fourHoursFromNow = new Date(
      new Date().getTime() + 60 * 60 * 4 * 1000,
    );

    try {
      await bucket.file(filename).makePrivate();
      const signedUrlResponse = await bucket.file(filename).getSignedUrl({
        action: 'read',
        expires: fourHoursFromNow,
      });
      const url = signedUrlResponse[0];
      this.log(chalk.blue('\nPrivate URL:'), chalk.bold.underline(url));
      this.copyToClipboard(url);
    } catch (error) {
      this.error(
        'The file you specified does not exist, please check the file name and try again.',
      );
    }
  }

  async run(): Promise<void> {
    const { flags } = this.parse(History);

    // Get History of Upload Events
    let history: UploadEvent[] = [];
    await fs.ensureDir(this.config.configDir);
    const historyPath = path.join(this.config.configDir, 'history.json');
    try {
      history = await fs.readJSON(historyPath);
    } catch (error) {}

    // Display History JSON if -v flag is set
    if (flags.view) {
      console.dir(history);
      return;
    }

    // Delete file if -d flag is set
    if (flags.delete) {
      await this.deleteFile(history, historyPath, flags.delete);
      return;
    }

    // Get Public URL if -p flag is set
    if (flags.public) {
      await this.getPublicUrl(flags.public);
      return;
    }

    // Get Temporarily Signed URL if -s flag is set
    if (flags.signed) {
      await this.getSignedUrl(flags.signed);
      return;
    }

    // Ask the user what action to perform
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'View Upload History',
        'Delete File from Storage',
        'Get Public Download Link',
        'Get Temporarily Signed URL',
      ],
    });

    // Display Upload History if 'View Upload History' is selected
    if (action === 'View Upload History') {
      console.dir(history);
      return;
    }

    // Ask the user what file to perform the action on
    // Display a list of file names from `history.json`
    const { filename } = await inquirer.prompt({
      type: 'list',
      name: 'filename',
      message: 'Choose a file you want to perform the action on?',
      choices: history.map((x) => x.name),
    });

    switch (action) {
      case 'Delete File from Storage':
        await this.deleteFile(history, historyPath, filename);
        break;
      case 'Get Public Download Link':
        await this.getPublicUrl(filename);
        break;
      case 'Get Temporarily Signed URL':
        await this.getSignedUrl(filename);
        break;
    }
  }
}
