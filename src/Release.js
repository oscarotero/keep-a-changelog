const Semver = require('semver');
const Change = require('./Change');

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
        this.changes = new Map([
            ['added', []],
            ['changed', []],
            ['deprecated', []],
            ['removed', []],
            ['fixed', []],
            ['security', []]
        ]);
    }

    compare(release) {
        if (!this.version) {
            return -1;
        }

        if (!release.version) {
            return 1;
        }

        if (!this.date) {
            return -1;
        }

        if (!release.date) {
            return 1;
        }

        return -this.version.compare(release.version);
    }

    isEmpty() {
        if (this.description.trim()) {
            return false;
        }

        return Array.from(this.changes.values()).some(
            change => change.length > 0
        );
    }

    addChange(type, change) {
        if (!(change instanceof Change)) {
            change = new Change(change);
        }

        if (!this.changes.has(type)) {
            throw new Error('Invalid change type');
        }

        this.changes.get(type).push(change);

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

    toString(changelog) {
        let t = [];

        if (this.version) {
            if (this.hasCompareLink(changelog)) {
                t.push(`## [${this.version}] - ${formatDate(this.date)}`);
            } else {
                t.push(`## ${this.version} - ${formatDate(this.date)}`);
            }
        } else {
            if (this.hasCompareLink(changelog)) {
                t.push('## [UNRELEASED]');
            } else {
                t.push('## UNRELEASED');
            }
        }

        if (this.description.trim()) {
            t.push('');
            t.push(this.description.trim());
        }

        this.changes.forEach((changes, type) => {
            if (changes.length) {
                t.push('');
                t.push(`### ${type[0].toUpperCase()}${type.substring(1)}`);
                t.push('');
                t = t.concat(changes.map(change => change.toString()));
            }
        });

        return t.join('\n').trim();
    }

    getCompareLink(changelog) {
        if (!this.hasCompareLink(changelog)) {
            return;
        }

        const index = changelog.releases.indexOf(this);

        let offset = 1;
        let next = changelog.releases[index + offset];

        while (!next.date) {
            ++offset;
            next = changelog.releases[index + offset];
        }

        if (!this.version) {
            return `[UNRELEASED]: ${changelog.url}/compare/v${
                next.version
            }...HEAD`;
        }

        if (!this.date) {
            return `[${this.version}]: ${changelog.url}/compare/v${
                next.version
            }...HEAD`;
        }

        return `[${this.version}]: ${changelog.url}/compare/v${
            next.version
        }...v${this.version}`;
    }

    getLinks(changelog) {
        const links = [];

        if (!changelog.url) {
            return links;
        }

        this.changes.forEach(changes =>
            changes.forEach(change => {
                change.issues.forEach(issue => {
                    if (!links.includes(issue)) {
                        links.push(
                            `[#${issue}]: ${changelog.url}/issues/${issue}`
                        );
                    }
                });
            })
        );

        return links;
    }

    hasCompareLink(changelog) {
        if (!changelog || !changelog.url || !changelog.releases.length) {
            return false;
        }

        return changelog.releases.length > changelog.releases.indexOf(this) + 1;
    }
}

module.exports = Release;

function formatDate(date) {
    if (!date) {
        return 'UNRELEASED';
    }

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
