# 🔥 `fireup-cli`

Upload anything, right from your command line.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fireup-cli.svg)](https://npmjs.org/package/fireup-cli)
[![Downloads/week](https://img.shields.io/npm/dw/fireup-cli.svg)](https://npmjs.org/package/fireup-cli)
[![License](https://img.shields.io/npm/l/fireup-cli.svg)](https://github.com/AmruthPillai/fireup-cli/blob/master/package.json)

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)

# Introduction

I've always found myself on the terminal 90% of the time when I'm on my computer. The first thing I do when I wake up is fire up the command line, git pull all my projects and then I drink my coffee.

Given this lifestyle, I've also found it a pain to find a place to upload a certain file when I need to share them with friends privately, or upload an image publicly that I want to post on a forum/message board. Thus, `fireup-cli` was born. It taps into your Firebase Project's Storage Bucket to upload/download files to it, share links and delete them, all from your command line.

The motivation to go with Firebase Storage was simply that it was free and seemed like the most convinient. **On the free Spark plan, you get 5 GB of storage with 1 GB of download bandwidth per day**. If this is not enough for you, you can [learn more about the Blaze plan here](https://firebase.google.com/pricing#storage).

# Installation

To install and set up `fireup-cli` for quick and easy uploads, all you need is:

1. Node.js installed on your machine, and node/npm in your PATH
2. Firebase Project you can upload to, you can create one for free here
3. Service Account JSON & Storage Bucket URL from above Firebase Project

Then, just run these commands:

```sh-session
$ npm install --global fireup-cli

$ fireup config:set service.account /path/to/service-account.json
$ fireup config:set storage.bucket <project-id>.appspot.com
```

# Usage

```sh-session
$ fireup upload --file /path/to/file --public --clipboard
```

**OR**

```sh-session
$ fireup up /path/to/file -pc
```

# Commands

<!-- commands -->

- [`fireup upload [FILE]`](#fireup-upload-file)
- [`fireup history`](#fireup-history)
- [`fireup config:set KEY VALUE`](#fireup-configset-key-value)
- [`fireup config:view`](#fireup-configview)
- [`fireup help [COMMAND]`](#fireup-help-command)
- [`fireup update [CHANNEL]`](#fireup-update-channel)

## `fireup upload [FILE]`

upload file to storage bucket

```
USAGE
  $ fireup upload [FILE]

ARGUMENTS
  FILE  path of the file you want to upload

OPTIONS
  -b, --bucket=bucket  link to firebase storage bucket,
  -c, --clipboard      copy generated link to clipboard
  -e, --expiry=expiry  [default: 4] hours until expiry of private link
  -f, --file=file      path of the file you want to upload
  -h, --help           show CLI help
  -l, --link           if private, generate a temporarily downloadable link
  -p, --public         make the file publicly-accessible

ALIASES
  $ fireup up

EXAMPLES
  $ fireup upload /path/to/file
  $ fireup upload -f /path/to/file --public
  $ fireup upload -f /path/to/file -pc
  $ fireup upload /path/to/file -le 10
```

_See code: [src/commands/upload.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.4/src/commands/upload.ts)_

## `fireup history`

file upload history

```
USAGE
  $ fireup history

OPTIONS
  -d, --delete=delete  name of file to be deleted
  -h, --help           show CLI help
  -p, --public=public  make file public, get download URL
  -s, --signed=signed  make file private, get temporarily signed URL
  -v, --view           view upload history

ALIASES
  $ fireup hi
```

_See code: [src/commands/history.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.4/src/commands/history.ts)_

## `fireup config:set KEY VALUE`

set global config vars

```
USAGE
  $ fireup config:set KEY VALUE

ARGUMENTS
  KEY    (service.account|storage.bucket) config variable to modify
  VALUE  value to be set

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ fireup cs

EXAMPLES
  $ fireup cs service.account /path/to/file.json
  $ fireup config:set storage.bucket <project-id>.appspot.com
```

_See code: [src/commands/config/set.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.4/src/commands/config/set.ts)_

## `fireup config:view`

view global config vars

```
USAGE
  $ fireup config:view

OPTIONS
  -h, --help  show CLI help

ALIASES
  $ fireup cv
```

_See code: [src/commands/config/view.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.4/src/commands/config/view.ts)_

## `fireup help [COMMAND]`

display help for fireup

```
USAGE
  $ fireup help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `fireup update [CHANNEL]`

update the fireup CLI

```
USAGE
  $ fireup update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

<!-- commandsstop -->
