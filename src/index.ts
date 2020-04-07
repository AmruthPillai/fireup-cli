import * as chalk from 'chalk';
import * as admin from 'firebase-admin';
import * as clipboardy from 'clipboardy';
import { Command, flags } from '@oclif/command';

admin.initializeApp({
  credential: admin.credential.cert(String(process.env.FIREUP_GSA)),
  storageBucket: 'fireup-cli.appspot.com',
});
const bucket = admin.storage().bucket();

class FireUpCli extends Command {
  static description = 'describe the command here';

  static flags = {
    file: flags.string({
      char: 'f',
      description: 'The file you want to upload',
    }),
    public: flags.boolean({
      char: 'p',
      default: false,
      description: 'Do you want the file to be publicly accesible?',
    }),
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'file' }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(FireUpCli);
    const filePath = flags.file || args.file;
    const response = await bucket.upload(filePath, {
      public: flags.public,
    });
    const publicUrl = response[0].metadata.mediaLink;
    await clipboardy.write(publicUrl);

    this.log(chalk.blue('Your file has been uploaded successfully!\n'));

    if (flags.public) {
      this.log(
        chalk.blue('Public URL:'),
        chalk.bold.underline(publicUrl),
        chalk.yellow('(copied to clipboard)'),
      );
    }
  }
}

export = FireUpCli;
