import * as fs from 'fs';
import * as util from 'util';
import { Command, flags } from '@oclif/command';

const readFile = util.promisify(fs.readFile);

class FireupCli extends Command {
  static description = 'describe the command here';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'file' }];

  async run(): Promise<void> {
    const { args, flags } = this.parse(FireupCli);

    const file = await readFile(args.file);
    console.log(file);
  }
}

export = FireupCli;
