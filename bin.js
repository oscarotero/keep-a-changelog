#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const url = require('url');
const { parser, Changelog, Release } = require('./src');
const argv = require('yargs-parser')(process.argv.slice(2), {
    default: {
        file: 'CHANGELOG.md',
        url: null,
        https: true
    },
    boolean: ['https', 'init']
});

const file = path.join(process.cwd(), argv.file);

try {
    if (argv.init) {
        const changelog = new Changelog('Changelog').addRelease(
            new Release('0.1.0', new Date(), 'First version')
        );

        save(file, changelog, true);
        process.exit(0);
    }

    const changelog = parser(fs.readFileSync(file, 'UTF-8'));

    if (!changelog.url && !argv.url) {
        const gitconfig = require('gitconfiglocal');

        gitconfig(process.cwd(), (err, config) => {
            if (err) {
                console.error(red(err));
                return;
            }

            changelog.url = getHttpUrl(
                config.remote && config.remote.origin && config.remote.origin.url
            );
            save(file, changelog);
        });
    } else {
        changelog.url = getHttpUrl(argv.url || changelog.url);
        save(file, changelog);
    }
} catch (err) {
    console.error(red(err.message));
}

function getHttpUrl(remoteUrl) {
    if (!remoteUrl) {
        return;
    }

    const parsed = url.parse(remoteUrl.replace('git@', `https://`));

    if (!argv.https) {
        parsed.protocol = 'http';
    }

    parsed.pathname = parsed.pathname.replace(/\.git$/, '').replace(/^\/\:/, '/');

    return url.format(parsed);
}

function save(file, changelog, isNew) {
    const url = changelog.url;

    if (url && url.contains('gitlab.com')) {
        changelog.head = 'master';
    }

    fs.writeFileSync(file, changelog.toString());

    if (isNew) {
        console.log(green('Generated new file'), file);
    } else {
        console.log(green('Updated file'), file);
    }
}

function red(message) {
    return '\u001b[' + 31 + 'm' + message + '\u001b[' + 39 + 'm';
}

function green(message) {
    return '\u001b[' + 32 + 'm' + message + '\u001b[' + 39 + 'm';
}
