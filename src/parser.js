const Changelog = require('./Changelog');
const Change = require('./Change');
const Release = require('./Release');

module.exports = function parser(markdown) {
    const lines = markdown.trim().split('\n');
    const totalLines = lines.length;

    try {
        return parseLines(lines);
    } catch (error) {
        throw new Error(
            `Parse error in the line ${totalLines -
                lines.length}: ${error.message}`
        );
    }
};

function parseLines(lines) {
    const changelog = new Changelog();

    //Title
    if (lines.length && lines[0].startsWith('# ')) {
        changelog.title = lines.shift().substr(1).trim();
    }

    //Description
    changelog.description = getUntil(lines, '## ');

    //Releases
    while (moveWhile(lines, '## ')) {
        let release;
        const line = lines.shift().substr(2).trim();
        const matches = line.match(
            /\[?([^\]]+)\]?\s*-\s*([\d]{4}-[\d]{1,2}-[\d]{1,2})$/
        );

        if (matches) {
            release = new Release(matches[1], matches[2]);
            changelog.addRelease(release);
        } else if (line.toLowerCase().includes('unreleased')) {
            release = changelog.unreleased;
        } else {
            throw new Error(`Syntax error in the release title "${line}"`);
        }

        //Release description
        release.description = getUntil(lines, '## ', '### ', '[');

        //Release change
        while (moveWhile(lines, '### ')) {
            const type = lines.shift().substr(3).trim().toLowerCase();

            while (moveWhile(lines, '-', '*')) {
                release.addChange(
                    type,
                    new Change(
                        lines.shift().substr(1).trim(),
                        getUntil(lines, '-', '*', '#', '[').replace(
                            /\n\s\s/g,
                            '\n'
                        )
                    )
                );
            }
        }
    }

    //Skip release links
    while (moveWhile(lines, '[')) {
        if (!changelog.url) {
            const matches = lines[0].match(
                /^\[.*\]\:\s*(http.*)\/compare\/.*$/
            );

            if (matches) {
                changelog.url = matches[1];
            }
        }

        lines.shift();
    }

    if (lines.length) {
        throw new Error(`Syntax error: "${lines[0]}"`);
    }

    return changelog;
}

function getUntil(lines, ...starts) {
    let buffer = '';

    while (lines.length && !starts.some(start => lines[0].startsWith(start))) {
        buffer += `\n${lines.shift()}`;
    }

    return buffer.trim();
}

function moveWhile(lines, ...starts) {
    while (lines.length && !lines[0].trim()) {
        lines.shift();
    }

    return lines.length && starts.some(start => lines[0].startsWith(start));
}
