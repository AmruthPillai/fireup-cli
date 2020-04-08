# FireUp CLI 🔥

Upload anything, right from your command line.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fireup-cli.svg)](https://npmjs.org/package/fireup-cli)
[![Downloads/week](https://img.shields.io/npm/dw/fireup-cli.svg)](https://npmjs.org/package/fireup-cli)
[![License](https://img.shields.io/npm/l/fireup-cli.svg)](https://github.com/AmruthPillai/fireup-cli/blob/master/package.json)

<!-- toc -->

- [FireUp CLI 🔥](#fireup-cli-)
- [Usage](#usage)
- [Commands](#commands)

<!-- tocstop -->

# Installation

<!-- install -->

```sh-session
$ npm install -g fireup-cli

$ fireup config:set service.account /path/to/service-account.json
$ fireup config:set storage.bucket <project-id>.appspot.com
```

<!-- installstop -->

# Usage

<!-- usage -->

```sh-session
$ fireup upload --file /path/to/file --public --clipboard
OR
$ fireup up /path/to/file -pc
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`fireup upload [FILE]`](#fireup-upload-file)
- [`fireup config:set KEY VALUE`](#fireup-configset-key-value)
- [`fireup config:view`](#fireup-configview)
- [`fireup help [COMMAND]`](#fireup-help-command)
- [`fireup history`](#fireup-history)
- [`fireup update [CHANNEL]`](#fireup-update-channel)

## `fireup upload [FILE]`

upload file

```
USAGE
  $ fireup upload [FILE]

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

_See code: [src/commands/upload.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.2/src/commands/upload.ts)_

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

_See code: [src/commands/config/set.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.2/src/commands/config/set.ts)_

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

_See code: [src/commands/config/view.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.2/src/commands/config/view.ts)_

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

## `fireup history`

file upload history

```
USAGE
  $ fireup history

OPTIONS
  -d, --delete=delete  name of file to be delete
  -h, --help           show CLI help

ALIASES
  $ fireup hi
```

_See code: [src/commands/history.ts](https://github.com/AmruthPillai/fireup-cli/blob/v0.0.2/src/commands/history.ts)_

## `fireup update [CHANNEL]`

update the fireup CLI

```
USAGE
  $ fireup update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

<!-- commandsstop -->
