const Changelog = require('./Changelog');
const Change = require('./Change');
const Release = require('./Release');

module.exports = function parser(markdown) {
    const lines = markdown.trim().split('\n');
    const changelog = new Changelog(
        lines
            .shift()
            .split('-')
            .pop()
            .trim()
    );

    let release, change, line, type;

    while (lines.length) {
        line = lines.shift().trim();

        if (line.startsWith('## ')) {
            const matches = line.match(
                /##\s+\[?([^\]]+)\]?\s*-\s*([\d]{4}-[\d]{1,2}-[\d]{1,2})$/
            );

            if (matches) {
                release = Release.create(matches[1], matches[2]);
                changelog.addRelease(release);
            } else if (line.toLowerCase().includes('unreleased')) {
                release = changelog.unreleased;
            } else {
                throw new Error(`Syntax error in the release title\n${line}`);
            }

            change = type = null;
            continue;
        }

        if (line.startsWith('### ')) {
            type = line
                .split(' ', 2)
                .pop()
                .toLowerCase();
            continue;
        }

        if (!release) {
            if (!changelog.description) {
                changelog.description = line;
            } else {
                changelog.description += `\n${line}`;
            }
            continue;
        }

        if (type && (line.startsWith('-') || line.startsWith('*'))) {
            change = Change.create(line.substr(1).trim());
            release.addChange(type, change);
            continue;
        }

        //skip compare links
        if (line.startsWith('[') && line.includes('/compare/')) {
            if (!changelog.url) {
                const matches = line.match(
                    /^\[.*\]\:\s*(http.*)\/compare\/.*$/
                );

                if (matches) {
                    changelog.url = matches[1];
                }
            }
            continue;
        }

        if (change) {
            change.title += `\n${line}`;
            continue;
        }

        release.description += `\n${line}`;
    }

    return changelog;
};
