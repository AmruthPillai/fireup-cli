import * as ora from 'ora';
import * as chalk from 'chalk';
import * as admin from 'firebase-admin';
import * as clipboardy from 'clipboardy';
import { Command, flags } from '@oclif/command';

class FireUpCli extends Command {
  static description = 'Upload anything, right from your command line.';

  static flags = {
    file: flags.string({
      char: 'f',
      description: 'path of the file you want to upload',
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
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'file' }];

  async run(): Promise<void> {
    admin.initializeApp({
      credential: admin.credential.cert(String(process.env.FIREUP_GSA)),
      storageBucket: 'fireup-cli.appspot.com',
    });
    const bucket = admin.storage().bucket();

    const { args, flags } = this.parse(FireUpCli);
    const filePath = flags.file || args.file;

    const spinner = ora({
      text: 'Uploading file...',
      spinner: 'triangle',
    }).start();

    const response = await bucket.upload(filePath, {
      public: flags.public,
    });

    spinner.stop();

    this.log(chalk.blue('Your file has been uploaded successfully!\n'));

    if (flags.public) {
      const publicUrl = response[0].metadata.mediaLink;
      await clipboardy.write(publicUrl);

      this.log(
        chalk.blue('Public URL:'),
        chalk.bold.underline(publicUrl),
        chalk.yellow('(copied to clipboard)'),
      );
    } else if (flags.link) {
      const signedUrlResponse = await response[0].getSignedUrl({
        action: 'read',
        expires: new Date(new Date().getTime() + 60 * 60 * 4 * 1000),
      });
      const privateUrl = signedUrlResponse[0];
      await clipboardy.write(privateUrl);

      this.log(
        chalk.blue.bold('This link is valid only for the next 4 hours.'),
      );
      this.log(
        chalk.blue('Private URL:'),
        chalk.bold.underline(privateUrl),
        chalk.yellow('(copied to clipboard)'),
      );
    }
  }
}

export = FireUpCli;
