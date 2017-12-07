# keep-a-changelog

Node package to parse and generate changelogs following the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format.

## Usage:

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

const changelog = Changelog.create('My project', 'http://github.com/oscarotero/my-project')
    .addRelease(
        Release.create('0.1.0', '2017-12-06')
            .added('New awesome feature')
            .added('New other awesome feature')
            .fixed('Bug #3')
            .removed('Drop support for X')
    )
    .addRelease(
        Release.create('0.2.0', '2017-12-09')
            .security('Fixed security vulnerability')
            .deprecated('Feature X is deprecated')
    );

console.log(changelog.toString());
```