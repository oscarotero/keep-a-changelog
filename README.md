# keep-a-changelog

[![Build Status](https://travis-ci.org/oscarotero/keep-a-changelog.svg?branch=master)](https://travis-ci.org/oscarotero/keep-a-changelog)

Node package to parse and generate changelogs following the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format.

## Install

You can install it from the [npm repository](https://www.npmjs.com/package/keep-a-changelog) using npm/yarn:

```sh
npm install keep-a-changelog
```

## Usage

```js
const { parser } = require('keep-a-changelog');
const fs = require('fs');

//Parse a changelog file
const changelog = parser(fs.readFileSync('CHANGELOG.md', 'UTF-8'));

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

### Custom tag names

By default, the tag names are `v` + version number. For example, the tag for the version `2.4.9` is `v2.4.9`. To change this behavior, set a new `tagNameBuilder`:

```js
const changelog = new Changelog();
changelog.tagNameBuilder = release => `version-${release.version}`;
```
### Custom Change Types

By default and according to the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format, the change types are
`Added`,
`Changed`,
`Deprecated`,
`Removed`,
`Fixed`,
and `Security`.
In case you'd like add another type in order to use is in your changelog, you basically need to extend the `Release` class to support new types. Additionally, you have to tell the `parser` that it should create instances of your new extended `Release` in order to parse your changelog correctly.

For example, we would like to add a type `Maintenance`.
Extend the provided `Release` class:
```js
class CustomRelease extends Release {
    constructor(version, date, description) {
        super(version, date, description);
        // add whatever types you want - in lowercase
        const newChangeTypes = [
            ['maintenance', []]
        ];

        this.changes = new Map([...this.changes, ...newChangeTypes]);
    }
    // for convenience, add a new method to add change of type 'maintanance'
    maintenance(change) {
        return this.addChange('maintenance', change);
    }
}
```
And once you want to use the parser:
```js
const releaseCreator = (ver, date, desc) => new CustomRelease(ver, date, desc)
const changelog = parser(changelogTextContent, {releaseCreator})
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

To generate an empty new CHANGELOG.md file:

```sh
changelog --init
```

You can release automatically the latest "Unreleased" version:

```sh
changelog --release
```

And return the latest released version:

```sh
changelog --latest-release
> 0.3.1
```

Available options:

Option | Description
-------|-------------
`--file` | The markdown file of the changelog. The default value is `CHANGELOG.md`.
`--url` | The base url used to build the diff urls of the different releases. It is taken from the existing diff urls in the markdown. If no urls are found, try to catch it using the url of the git remote repository.
`--https` | Set to false to use `http` instead `https` in the url (`--https=false`).
`--init` | Init a new empty changelog file.
`--latest-release` | Print the latest release version.
`--release` | Updated the latest unreleased version with the current date.
