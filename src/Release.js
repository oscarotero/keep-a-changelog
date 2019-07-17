const Semver = require('semver');
const Change = require('./Change');
const moment = require('moment');

const DEFAULT_DATE_FORMAT = 'YYYY-DD-MM';

class Release {
  constructor(version, date, description = '') {
    this.setVersion(version);
    this.setDate(date);

    this.changesLabels = {};
    this.description = description;
    this.changes = new Map([
      ['added', []],
      ['changed', []],
      ['deprecated', []],
      ['removed', []],
      ['fixed', []],
      ['security', []],
    ]);
  }

  setChangeLabels(labels) {
    if (labels instanceof Object) {
      this.changesLabels = labels;
    }
    return this;
  }

  setDate(date) {
    if (date && Release.DATE_FORMAT && typeof date === 'string') {
      this.date = moment(date, Release.DATE_FORMAT);
    } else {
      this.date = date;
    }
  }

  compare(release) {
    if (!this.version && release.version) {
      return -1;
    }

    if (!release.version) {
      return 1;
    }

    if (!this.date && release.date) {
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

    return Array.from(this.changes.values()).every(change => !change.length);
  }

  setVersion(version) {
    if (typeof version === 'string') {
      version = new Semver(version);
    }
    this.version = version;
    //Re-sort the releases of the parent changelog
    if (this.changelog) {
      this.changelog.sortReleases();
    }
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
        t.push(`## [${this.version}] - ${this._formatDate(this.date)}`);
      } else {
        t.push(`## ${this.version} - ${this._formatDate(this.date)}`);
      }
    } else {
      if (this.hasCompareLink(changelog)) {
        t.push('## [Unreleased]');
      } else {
        t.push('## Unreleased');
      }
    }

    if (this.description.trim()) {
      t.push(this.description.trim());
      t.push('');
    }
    t.push('\n');
    this.changes.forEach((changes, type) => {
      if (changes.length) {
        type = this.changesLabels[type]
          ? this.changesLabels[type]
          : `### ${type[0].toUpperCase()}${type.substring(1)}`;
        t.push(`${type}\n`);
        t = t.concat(changes.map(change => change.toString()));
        t.push('');
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
    let previous = changelog.releases[index + offset];

    while (!previous.date) {
      ++offset;
      previous = changelog.releases[index + offset];
    }

    if (!this.version) {
      return `[Unreleased]: ${changelog.url}/compare/${changelog.tagName(
        previous,
      )}...HEAD`;
    }

    if (!this.date) {
      return `[${this.version}]: ${changelog.url}/compare/${changelog.tagName(
        previous,
      )}...HEAD`;
    }

    return `[${this.version}]: ${changelog.url}/compare/${changelog.tagName(
      previous,
    )}...${changelog.tagName(this)}`;
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
            links.push(`[#${issue}]: ${changelog.url}/issues/${issue}`);
          }
        });
      }),
    );

    return links;
  }

  hasCompareLink(changelog) {
    if (!changelog || !changelog.url || !changelog.releases.length) {
      return false;
    }

    const index = changelog.releases.indexOf(this);
    const next = changelog.releases[index + 1];

    return next && next.version && next.date;
  }

  _formatDate() {
    if (!this.date) {
      return 'Unreleased';
    }
    return this.date instanceof Object && Release.DATE_FORMAT
      ? this.date.format(Release.DATE_FORMAT)
      : 'Unreleased';
  }
}

Release.DATE_FORMAT = DEFAULT_DATE_FORMAT;

module.exports = Release;
