const _release = Symbol.for('release');

class Change {
    constructor(title, description = '') {
        this.title = title;
        this.description = description;
    }

    set release(release) {
        this[_release] = release;
    }

    get release() {
        return this[_release];
    }

    toString() {
        const url =
            this.release && this.release.changelog
                ? this.release.changelog.url
                : null;

        let t = [`- ${this.title}`];

        if (this.description) {
            t = t.concat(this.description.split('\n').map(line => `  ${line}`));
        }

        return t.map(line => linkify(line, url)).join('\n').trim();
    }
}

module.exports = Change;

function linkify(text, url) {
    if (url) {
        return text.replace(/#(\d+)([^\w\]]|$)/g, `[#$1](${url}/issues/$1)$2`);
    }

    return text;
}
