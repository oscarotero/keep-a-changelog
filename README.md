# keep-a-changelog

Node package to parse and generate changelogs following the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format.

## Install

You can install it from the [npm repository](https://www.npmjs.com/package/keep-a-changelog) using npm/yarn:

```sh
npm install keep-a-changelog
```

## Usage

```js
const { parse } = require('keep-a-changelog');
const fs = require('fs');

//Parse a changelog file
const changelog = parse(fs.readFileSync('CHANGELOG.md', 'UTF-8'));

//Generate the new changelog string
console.log(changelog.toString());
```

### Create a new changelog

```js
const { Changelog, Release } = require('keep-a-changelog');

const changelog = new Changelog('My project')
    .addRelease(
        new Release('0.1.0', '2017-12-06')
            .added('New awesome feature')
            .added('New other awesome feature')
            .fixed('Bug #3')
            .removed('Drop support for X')
    )
    .addRelease(
        new Release('0.2.0', '2017-12-09')
            .security('Fixed security vulnerability')
            .deprecated('Feature X is deprecated')
    );

console.log(changelog.toString());
```

## Cli

This library provides the `changelog` command to normalize the changelog format. It reads the CHANGELOG.md file and override it with the new format:

```sh
changelog
```

To use other file name:

```sh
changelog --file=History.md
```

Available options:

Option | Description
-------|-------------
`--file` | The markdown file of the changelog. The default value is `CHANGELOG.md`.
`--url` | The base url used to build the diff urls of the different releases. It is taken from the existing diff urls in the markdown. If no urls are found, try to catch it using the url of the git remote repository.
`--https` | Set to false to use `http` instead `https` in the url (`--https=false`).
