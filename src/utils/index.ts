import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import Command from '@oclif/command';
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';

import FireUpConfig from '../interfaces/fireup-config';

const getStorageBucket = async (
  context: Command,
  storageBucketFlag?: string,
): Promise<Bucket> => {
  // Check if Config Directory exists, otherwise create directory
  await fs.ensureDir(context.config.configDir);
  const configPath = path.join(context.config.configDir, 'config.json');

  // Initialize Empty Object to bypass TSLint Errors
  let userConfig: FireUpConfig = {
    serviceAccount: '',
    storageBucket: '',
  };

  // Attempt to read Configuration Variables, otherwise show error
  try {
    userConfig = await fs.readJSON(configPath);
  } catch (error) {
    context.log(chalk.bold.red('No configuration file found.'));
    context.log('Please refer to setup guide in the documentation.');
    context.log(
      'You can also run',
      chalk.bold.underline('fireup config:set -h'),
      'to know more.',
    );
  }

  // Search for Google Service Account JSON path
  const serviceAccount = userConfig.serviceAccount || '';
  if (serviceAccount === '') {
    context.log(
      chalk.bold.red('Cannot find your Google Service Account JSON.'),
    );
    context.log(
      'Please set the path config variable by running',
      chalk.bold.underline(
        'fireup config:set service.account /path/to/file.json',
      ),
    );

    throw new Error('Cannot find your Google Service Account JSON.');
  }

  // Search for Firebase Storage Bucket URL
  const storageBucket = storageBucketFlag || userConfig.storageBucket || '';
  if (storageBucket === '') {
    context.log(
      chalk.bold.red('Cannot find your Firebase Storage Bucket URL.'),
    );
    context.log(
      'Please check the documentation on how to initialize config, or provide a bucket URL through the -b flag.',
    );

    throw new Error('Cannot find your Firebase Storage Bucket URL.');
  }

  // Initialize Firebase Admin SDK
  const options = {
    credential: admin.credential.cert(serviceAccount),
    storageBucket,
  };
  return admin.initializeApp(options).storage().bucket();
};

export { getStorageBucket };
