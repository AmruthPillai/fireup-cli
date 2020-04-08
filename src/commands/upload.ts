import * as ora from 'ora';
import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as clipboardy from 'clipboardy';
import { Command, flags } from '@oclif/command';

import UploadEvent from '../interfaces/upload-event';
import { getStorageBucket } from '../utils';

export default class Upload extends Command {
  static description = 'upload file to storage bucket';

  static aliases = ['up'];

  static examples = [
    `$ fireup upload /path/to/file`,
    `$ fireup upload -f /path/to/file --public`,
    `$ fireup upload -f /path/to/file -pc`,
    `$ fireup upload /path/to/file -le 10`,
  ];

  static flags = {
    file: flags.string({
      char: 'f',
      description: 'path of the file you want to upload',
    }),
    bucket: flags.string({
      char: 'b',
      description: 'link to firebase storage bucket,',
    }),
    public: flags.boolean({
      char: 'p',
      default: false,
      description: 'make the file publicly-accessible',
      exclusive: ['link'],
    }),
    link: flags.boolean({
      char: 'l',
      default: false,
      description: 'if private, generate a temporarily downloadable link',
      exclusive: ['public'],
    }),
    expiry: flags.integer({
      char: 'e',
      default: 4,
      description: 'hours until expiry of private link',
    }),
    clipboard: flags.boolean({
      char: 'c',
      default: false,
      description: 'copy generated link to clipboard',
    }),
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'file', description: 'path of the file you want to upload' },
  ];

  async copyToClipboard(link: string): Promise<void> {
    await clipboardy.write(link);
    this.log(chalk.gray.bold('\nURL has been copied to your clipboard.'));
  }

  async appendToHistory(event: UploadEvent): Promise<void> {
    let history: UploadEvent[] = [];
    await fs.ensureDir(this.config.configDir);
    const historyPath = path.join(this.config.configDir, 'history.json');
    try {
      history = await fs.readJSON(historyPath);
    } catch (error) {}
    history = history.filter((x) => x.name !== event.name);
    history.unshift(event);
    await fs.writeJSON(historyPath, history, { spaces: 2 });
  }

  async run(): Promise<void> {
    const { args, flags } = this.parse(Upload);

    // Get Firebase Storage Bucket
    const bucket = await getStorageBucket(this);

    // Check for path of file to be uploaded
    // Priority: flag > CLI argument
    const filePath = flags.file || args.file || '';
    if (filePath === '') {
      this.error(
        chalk.bold.red(
          'You need to specify a file to upload, either by passing it as the first argument or using the -f option.',
        ),
      );
    } else if (!(await fs.pathExists(filePath))) {
      this.error(
        chalk.bold.red(
          'The specified file does not exist in the path you have provided, please provide a valid file path.',
        ),
      );
    }

    // Start Spinner
    const spinner = ora({
      text: 'Uploading file...',
      spinner: 'triangle',
    }).start();

    // Upload File using Cloud Storage SDK
    const response = await bucket.upload(filePath, {
      public: flags.public,
    });
    const file = response[0];

    // Stop Spinner
    spinner.stop();

    // Notify the terminal that file has been successfully uploaded
    this.log(chalk.blue('Your file has been uploaded successfully!\n'));
    const event: UploadEvent = {
      id: file.metadata.id,
      name: file.metadata.name,
      timeCreated: file.metadata.timeCreated,
    };
    this.appendToHistory(event);

    // If public, then get Public URL
    // Else if private, check for '-l' flag for link generation
    let url = '';
    if (flags.public) {
      url = file.metadata.mediaLink;
      this.log(chalk.blue('Public URL:'), chalk.bold.underline(url));
    } else if (flags.link) {
      const fourHoursFromNow = new Date(
        new Date().getTime() + 60 * 60 * flags.expiry * 1000,
      );
      const signedUrlResponse = await file.getSignedUrl({
        action: 'read',
        expires: fourHoursFromNow,
      });
      url = signedUrlResponse[0];
      this.log(
        chalk.blue.bold(
          `This link is valid for the next ${flags.expiry} hours.`,
        ),
      );
      this.log(chalk.blue('Private URL:'), chalk.bold.underline(url));
    }

    // Copy to clipboard if flag has been set
    if (url !== '' && flags.clipboard) {
      this.copyToClipboard(url);
    }
  }
}
