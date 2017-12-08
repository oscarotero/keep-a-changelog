const fs = require('fs');
const { Changelog, Release } = require('./src');
const file = __dirname + '/CHANGELOG.md';

const changelog = new Changelog('Changelog')
    .addRelease(
        new Release('0.1.0', '2017-12-07', 'First version')
    )
    .addRelease(
        new Release('0.2.0', '2017-12-07')
            .changed('Parser improvements')
            .changed('Changed the constructor arguments of Changelog, Change and Release classes')
            .removed('Removed static factories. Use `new` instead.')
            .fixed('The last version should\'t have diff link')
    )
    .addRelease(
        new Release('0.3.0', '2017-12-08')
            .added('Added colors in CLI')
            .added('Parser errors contains the line number in the CHANGELOG file')
            .fixed('Fixed parsing bug when the changelog is using incorrect title levels')
    )

changelog.url = 'https://github.com/oscarotero/keep-a-changelog';

fs.writeFileSync(file, changelog.toString());
