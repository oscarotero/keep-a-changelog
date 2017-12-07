const Semver = require('semver');
const Change = require('./Change');

class Release {
    static create(version, date) {
        return new Release(new Semver(version), new Date(date));
    }

    constructor(version, date) {
        this.version = version;
        this.date = date;
        this.description = '';
        this.changes = {
            added: [],
            changed: [],
            deprecated: [],
            removed: [],
            fixed: [],
            security: []
        };
    }

    compare(release) {
        if (!this.version) {
            return -1;
        }

        if (!release.version) {
            return 1;
        }

        return -this.version.compare(release.version);
    }

    isEmpty() {
        if (this.description.trim()) {
            return false;
        }

        return !Object.keys(this.changes).some(
            key => this.changes[key].length > 0
        );
    }

    addChange(type, change) {
        if (!(change instanceof Change)) {
            change = new Change(change);
        }

        if (!Array.isArray(this.changes[type])) {
            throw new Error('Invalid change type');
        }

        this.changes[type].push(change);

        return this;
    }

    added(change) {
        return this.addChange('added', change);
    }

    changed(change) {
        return this.addChange('changed', change);
    }

    deprecated(change) {
        return this.addChange('deprecated', change);
    }

    removed(change) {
        return this.addChange('removed', change);
    }

    fixed(change) {
        return this.addChange('fixed', change);
    }

    security(change) {
        return this.addChange('security', change);
    }

    toString() {
        let t = [];

        if (this.version) {
            t.push(
                `## [${
                    this.version
                }] - ${this.date.getFullYear()}-${this.date.getMonth() +
                    1}-${this.date.getDate()}`
            );
        } else {
            t.push('## [UNRELEASED]');
        }

        if (this.description.trim()) {
            t.push('');
            t.push(this.description.trim());
        }

        for (let k in this.changes) {
            let changes = this.changes[k];

            if (changes.length) {
                t.push('');
                t.push(`### ${k[0].toUpperCase()}${k.substring(1)}`);
                t.push('');
                t = t.concat(changes.map(change => change.toString()));
            }
        }

        return t.join('\n').trim();
    }

    getCompareLink(url, prev) {
        if (this.version) {
            return `[${this.version}]: ${url}/compare/v${prev.version}...v${
                this.version
            }`;
        }

        return `[UNRELEASED]: ${url}/compare/v${prev.version}...HEAD`;
    }
}

module.exports = Release;
