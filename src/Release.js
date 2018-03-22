const Semver = require('semver');
const Change = require('./Change');
const _changelog = Symbol.for('changelog');

class Release {
    constructor(version, date, description = '') {
        if (typeof version === 'string') {
            version = new Semver(version);
        }

        if (typeof date === 'string') {
            date = new Date(date);
        }

        this.version = version;
        this.date = date;
        this.description = description;
        this.changes = {
            added: [],
            changed: [],
            deprecated: [],
            removed: [],
            fixed: [],
            security: []
        };
    }

    set changelog(changelog) {
        this[_changelog] = changelog;
    }

    get changelog() {
        return this[_changelog];
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
        change.release = this;

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
        const url = this.changelog ? this.changelog.url : null;
        let t = [];

        if (this.version) {
            if (this.hasCompareLink()) {
                t.push(`## [${this.version}] - ${formatDate(this.date)}`);
            } else {
                t.push(`## ${this.version} - ${formatDate(this.date)}`);
            }
        } else {
            if (this.hasCompareLink()) {
                t.push('## [UNRELEASED]');
            } else {
                t.push('## UNRELEASED');
            }
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

    getCompareLink() {
        if (!this.hasCompareLink()) {
            return;
        }

        const changelog = this[_changelog];

        if (changelog.unreleased === this) {
            return `[UNRELEASED]: ${changelog.url}/compare/v${changelog
                .releases[0].version}...HEAD`;
        }

        const index = changelog.releases.indexOf(this);
        const next = changelog.releases[index + 1];

        return `[${this
            .version}]: ${changelog.url}/compare/v${next.version}...v${this
            .version}`;
    }

    hasCompareLink() {
        const changelog = this[_changelog];

        if (!changelog || !changelog.url || !changelog.releases.length) {
            return false;
        }

        if (changelog.unreleased === this) {
            return true;
        }

        if (this.version) {
            return (
                changelog.releases.length > changelog.releases.indexOf(this) + 1
            );
        }

        return false;
    }
}

module.exports = Release;

function formatDate(date) {
    let year = date.getUTCFullYear(),
        month = date.getUTCMonth() + 1,
        day = date.getUTCDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}
