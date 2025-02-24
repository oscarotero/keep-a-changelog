# Changelog

[Keep a Changelog](https://github.com/oscarotero/keep-a-changelog) library for
Node & Deno

Deno package to parse and generate changelogs following the
[keepachangelog](https://keepachangelog.com/) format.

## Usage in Node

```js
import { parser } from "keep-a-changelog";
import fs from "fs";

//Parse a changelog file
const changelog = parser(fs.readFileSync("CHANGELOG.md", "UTF-8"));

//Generate the new changelog string
console.log(changelog.toString());
```

## Usage in Deno

```js
import { parser } from "https://deno.land/x/changelog@v2.2.1/mod.ts";

//Parse a changelog file
const changelog = parser(await Deno.readTextFile("CHANGELOG.md"));

//Generate the new changelog string
console.log(changelog.toString());
```

### Create a new changelog

```js
import {
  Changelog,
  Release,
} from "https://deno.land/x/changelog@v2.2.1/mod.ts";

const changelog = new Changelog("My project")
  .addRelease(
    new Release("0.1.0", "2017-12-06")
      .added("New awesome feature")
      .added("New other awesome feature")
      .fixed("Bug #3")
      .removed("Drop support for X"),
  )
  .addRelease(
    new Release("0.2.0", "2017-12-09")
      .security("Fixed security vulnerability")
      .deprecated("Feature X is deprecated"),
  );

console.log(changelog.toString());
```

### Custom output format

By default, the output format of the markdown is "compact", that removes the
space after the headings. You can change it to follow the
[`markdownlint`](https://github.com/DavidAnson/markdownlint) rules:

```js
const changelog = new Changelog();
changelog.format = "markdownlint";
```

### Custom bullet style

By default, the bullet style of the markdown is "-". You can change it to use
other styles of bullet points:

```js
const changelog = new Changelog();
changelog.bulletStyle = "*";
```

### Custom tag names

By default, the tag names are `v` + version number. For example, the tag for the
version `2.4.9` is `v2.4.9`. To change this behavior, set a new
`tagNameBuilder`:

```js
const changelog = new Changelog();
changelog.tagNameBuilder = (release) => `version-${release.version}`;
```

### Custom compare links

By default, compare links are build compliant with GitHub format. To change this
behavior, set a new `compareLinkBuilder`:

```js
const changelog = new Changelog();
changelog.url = "https://bitbucket.org/oscarotero/keep-a-changelog";
changelog.compareLinkBuilder = (previous, release) =>
  `${this.url}/branches/compare/${release.version}%0D${previous.version}`;
```

### Custom Change Types

By default and according to the [keepachangelog](https://keepachangelog.com/)
format, the change types are `Added`, `Changed`, `Deprecated`, `Removed`,
`Fixed`, and `Security`.

In case you'd like add another type, you need to extend the `Release` class to
support new types. Additionally, you have to tell the `parser` that it should
create instances of your new extended `Release` in order to parse your changelog
correctly.

For example, we would like to add a type `Maintenance`. Extend the provided
`Release` class:

```js
class CustomRelease extends Release {
  constructor(version, date, description) {
    super(version, date, description);
    // add whatever types you want - in lowercase
    const newChangeTypes = [
      ["maintenance", []],
    ];

    this.changes = new Map([...this.changes, ...newChangeTypes]);
  }
  // for convenience, add a new method to add change of type 'maintanance'
  maintenance(change) {
    return this.addChange("maintenance", change);
  }
}
```

And once you want to use the parser:

```js
const releaseCreator = (ver, date, desc) => new CustomRelease(ver, date, desc);
const changelog = parser(changelogTextContent, { releaseCreator });
```

## Cli

This library provides the `changelog` command to normalize the changelog format.
It reads the CHANGELOG.md file and override it with the new format:

### Install the library as script

Deno:

```sh
deno install --global --allow-read --allow-write -fr --name changelog https://deno.land/x/changelog/bin.ts
```

Node:

```sh
npm install keep-a-changelog -g
```

Run the script:

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

If your "Unreleased" section has no version, you can specify it as an argument:

```sh
changelog --release 2.0.0
```

And return the latest released version:

```sh
changelog --latest-release
> 2.0.0
```

See available options:

```sh
changelog --help
```
