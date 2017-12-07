const Release = require('./Release');

class Changelog {
    constructor(title, description = '') {
        this.title = title;
        this.description = description;
        this.url = null;
        this.releases = [];
        this.unreleased = new Release();
        this.unreleased.changelog = this;
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
        let t = [`# ${this.title}`];

        const description =
            this.description.trim() ||
            `All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).`;

        if (description) {
            t.push('');
            t.push(description);
        }

        if (!this.unreleased.isEmpty()) {
            t.push('');
            t.push(this.unreleased.toString());
        }

        this.releases.forEach(release => {
            t.push('');
            t.push(release.toString());
        });

        t.push('');

        if (!this.unreleased.isEmpty() && this.unreleased.hasCompareLink()) {
            t.push(this.unreleased.getCompareLink());
        }

        this.releases.forEach(release => {
            const line = release.getCompareLink();

            if (line) {
                t.push(line);
            }
        });

        t.push('');

        return t.join('\n');
    }
}

module.exports = Changelog;
