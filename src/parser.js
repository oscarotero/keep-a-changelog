const Changelog = require('./Changelog');
const Release = require('./Release');

const defaultOptions = {
    releaseCreator: (version, date, description) => new Release(version, date, description),
};

module.exports = function parser(markdown, options) {
    const opts = Object.assign({}, defaultOptions, options);
    const tokens = tokenize(markdown);

    try {
        return parseTokens(tokens, opts);
    } catch (error) {
        throw new Error(`Parse error in the line ${tokens[0][0]}: ${error.message}`);
    }
};

function parseTokens(tokens, opts) {
    const changelog = new Changelog();

    changelog.title = getContent(tokens, 'h1', true);
    changelog.description = getContent(tokens, 'p');

    //Releases
    let release;

    while ((release = getContent(tokens, 'h2').toLowerCase())) {
        const matches = release.match(/\[?([^\]]+)\]?\s*-\s*([\d]{4}-[\d]{1,2}-[\d]{1,2})$/);

        if (matches) {
            release = opts.releaseCreator(matches[1], matches[2]);
        } else if (release.includes('unreleased')) {
            const matches = release.match(/\[?([^\]]+)\]?\s*-\s*unreleased$/);
            release = matches ? opts.releaseCreator(matches[1]) : opts.releaseCreator();
        } else {
            throw new Error(`Syntax error in the release title`);
        }

        changelog.addRelease(release);
        release.description = getContent(tokens, 'p');

        let type;

        while ((type = getContent(tokens, 'h3').toLowerCase())) {
            let change;

            while ((change = getContent(tokens, 'li'))) {
                release.addChange(type, change);
            }
        }
    }

    //Skip release links
    let link = getContent(tokens, 'link');

    while (link) {
        if (!changelog.url) {
            const matches = link.match(/^\[.*\]\:\s*(http.*)\/compare\/.*$/);

            if (matches) {
                changelog.url = matches[1];
            }
        }

        link = getContent(tokens, 'link');
    }

    //Footer
    if (getContent(tokens, 'hr')) {
        changelog.footer = getContent(tokens, 'p');
    }

    if (tokens.length) {
        throw new Error(`Unexpected content ${JSON.stringify(tokens)}`);
    }

    return changelog;
}

function getContent(tokens, type, required = false) {
    if (!tokens[0] || tokens[0][1] !== type) {
        if (required) {
            throw new Error(`Required token missing in: "${tokens[0][0]}"`);
        }

        return '';
    }

    return tokens.shift()[2].join('\n');
}

function tokenize(markdown) {
    const tokens = [];

    markdown
        .trim()
        .split('\n')
        .map((line, index, allLines) => {
            if (line.startsWith('---')) {
                return ['hr', ['-']];
            }

            if (line.startsWith('# ')) {
                return ['h1', [line.substr(1).trim()]];
            }

            if (line.startsWith('## ')) {
                return ['h2', [line.substr(2).trim()]];
            }

            if (line.startsWith('### ')) {
                return ['h3', [line.substr(3).trim()]];
            }

            if (line.startsWith('-')) {
                return ['li', [line.substr(1).trim()]];
            }

            if (line.startsWith('*')) {
                return ['li', [line.substr(1).trim()]];
            }

            if (line.match(/^\[.*\]\:\s*http.*$/)) {
                return ['link', [line.trim()]];
            }
            if (line.match(/^\[.*\]\:$/)) {
                const nextLine = allLines[index + 1];
                if (nextLine && nextLine.match(/\s+http.*$/)) {
                    // We found a multi-line link: treat it like a single line
                    allLines[index + 1] = '';
                    return ['link', [line.trim() + '\n' + nextLine.trimEnd()]];
                }
            }

            return ['p', [line.trimEnd()]];
        })
        .forEach((line, index) => {
            const [type, [content]] = line;

            if (index > 0) {
                const prevType = tokens[0][1];

                if (type === 'p') {
                    if (prevType === 'p') {
                        return tokens[0][2].push(content);
                    }

                    if (prevType === 'li') {
                        return tokens[0][2].push(content.replace(/^\s\s/, ''));
                    }
                }
            }

            tokens.unshift([index + 1, type, [content]]);
        });

    return tokens
        .filter((token) => !isEmpty(token[2]))
        .map((token) => {
            const content = token[2];

            while (isEmpty(content[content.length - 1])) {
                content.pop();
            }

            while (isEmpty(content[0])) {
                content.shift();
            }

            return token;
        })
        .reverse();
}

function isEmpty(val) {
    if (Array.isArray(val)) {
        val = val.join('');
    }

    return !val || val.trim() === '';
}
