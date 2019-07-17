const fs = require('fs');
const Release = require('./Release');
const Semver = require('semver');

class Changelog {
  constructor(title, description = '') {
    this.title = title;
    this.description = description.trim();
    this.footer = null;
    this.url = null;
    this.releases = [];
    this.tagNameBuilder = null;
    this.changeLabels = {};
    this.releasesDateFormat = '';
  }

  addFooter(footer) {
    if (footer) {
      this.footer = footer;
    }
    return this;
  }

  setConfigs(configs = {}) {
    if (configs['changesLabels'] instanceof Object) {
      this.changesLabels = configs['changesLabels'];
    }
    if (typeof configs['url'] === 'string') {
      this.url = configs['url'];
    }
    return this;
  }

  addRelease(release) {
    if (!(release instanceof Release)) {
      throw new Error('Invalid release. Must be an instance of Release');
    }
    release.setChangeLabels(this.changesLabels);
    this.releases.push(release);
    this.sortReleases();
    release.changelog = this;

    return this;
  }

  findRelease(version) {
    if (!version) {
      return this.releases.find(release => !release.version);
    }
    return this.releases.find(
      release => release.version && Semver.eq(release.version, version),
    );
  }

  sortReleases() {
    this.releases.sort((a, b) => a.compare(b));
  }

  tagName(release) {
    if (this.tagNameBuilder) {
      return this.tagNameBuilder(release);
    }

    return `v${release.version}`;
  }

  toString() {
    const t = [`# ${this.title}`];

    const links = [];
    const compareLinks = [];

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

      release.getLinks(this).forEach(link => {
        if (!links.includes(link)) {
          links.push(link);
        }
      });

      const link = release.getCompareLink(this);

      if (link) {
        compareLinks.push(link);
      }
    });

    if (links.length) {
      t.push('');
      links.sort(compare);
      links.forEach(link => t.push(link));
    }

    if (compareLinks.length) {
      t.push('');

      compareLinks.forEach(link => t.push(link));
    }

    t.push('');

    if (this.footer) {
      t.push('');
      t.push(this.footer);
      t.push('');
    }

    return t.join('\n');
  }

  generate() {
    fs.writeFile('CHANGELOG.md', this.toString(), function(err) {
      if (err) throw err;
    });
  }
}

module.exports = Changelog;

function compare(a, b) {
  if (a === b) {
    return 0;
  }
  const reg = /^\[#(\d+)\]:/;
  const aNumber = a.match(reg);
  const bNumber = b.match(reg);

  if (aNumber && bNumber) {
    return parseInt(aNumber[1]) - parseInt(bNumber[1]);
  }

  return a < b ? -1 : 1;
}
