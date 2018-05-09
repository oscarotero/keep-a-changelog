const Release = require('./Release');

class Changelog {
    constructor(title, description = '') {
        this.title = title;
        this.description = description;
        this.footer = null;
        this.url = null;
        this.releases = [];
    }

    addRelease(release) {
        if (!(release instanceof Release)) {
            throw new Error('Invalid release. Must be an instance of Release');
        }

        this.releases.push(release);
        this.releases.sort((a, b) => a.compare(b));
        release.changelog = this;

        return this;
    }

    toString() {
        const t = [`# ${this.title}`];

        let links = [];
        let compareLinks = [];

        const description =
            this.description.trim() ||
            `All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).`;

        if (description) {
            t.push('');
            t.push(description);
        }

        this.releases.forEach(release => {
            t.push('');
            t.push(release.toString(this));

            links = links.concat(release.getLinks(this));

            const link = release.getCompareLink(this);

            if (link) {
                compareLinks.push(link);
            }
        });

        t.push('');

        links.forEach(link => t.push(link));

        t.push('');

        compareLinks.forEach(link => t.push(link));

        t.push('');

        if (this.footer) {
            t.push('---');
            t.push('');
            t.push(this.footer);
            t.push('');
        }

        return t.join('\n');
    }
}

module.exports = Changelog;
