import { compare, format, parse } from "./deps.ts";
import Change from "./Change.ts";
import Changelog from "./Changelog.ts";

import type { SemVer } from "./deps.ts";

export default class Release {
  changelog?: Changelog;
  parsedVersion?: SemVer;
  date?: Date;
  yanked = false;
  description: string;
  changes: Map<string, Change[]>;

  constructor(
    version?: string | SemVer,
    date?: string | Date,
    description = "",
  ) {
    this.setVersion(version);
    this.setDate(date);

    this.description = description;
    this.changes = new Map([
      ["added", []],
      ["changed", []],
      ["deprecated", []],
      ["removed", []],
      ["fixed", []],
      ["security", []],
    ]);
  }

  get version(): string | undefined {
    return this.parsedVersion ? format(this.parsedVersion) : undefined;
  }

  compare(release: Release) {
    if (!this.parsedVersion && release.parsedVersion) {
      return -1;
    }

    if (!release.parsedVersion) {
      return 1;
    }

    if (!this.date && release.date) {
      return -1;
    }

    if (!release.date) {
      return 1;
    }

    if (this.parsedVersion && release.parsedVersion) {
      return -compare(this.parsedVersion, release.parsedVersion);
    }

    return 0;
  }

  isEmpty() {
    if (this.description.trim()) {
      return false;
    }

    return Array.from(this.changes.values()).every((change) => !change.length);
  }

  setVersion(version?: string | SemVer) {
    const parsed = typeof version === "string" ? parse(version) : version;

    this.parsedVersion = parsed;

    //Re-sort the releases of the parent changelog
    if (this.changelog) {
      this.changelog.sortReleases();
    }
  }

  setDate(date?: Date | string) {
    if (typeof date === "string") {
      date = new Date(date);
    }
    this.date = date;
  }

  setYanked(yanked = true) {
    this.yanked = yanked;
    return this;
  }

  addChange(type: string, change: Change | string) {
    if (!(change instanceof Change)) {
      change = new Change(change);
    }

    if (!this.changes.has(type)) {
      throw new Error("Invalid change type");
    }

    this.changes.get(type)!.push(change);

    return this;
  }

  added(change: Change | string) {
    return this.addChange("added", change);
  }

  changed(change: Change | string) {
    return this.addChange("changed", change);
  }

  deprecated(change: Change | string) {
    return this.addChange("deprecated", change);
  }

  removed(change: Change | string) {
    return this.addChange("removed", change);
  }

  fixed(change: Change | string) {
    return this.addChange("fixed", change);
  }

  security(change: Change | string) {
    return this.addChange("security", change);
  }

  toString(changelog?: Changelog) {
    let t: string[] = [];
    const hasCompareLink = this.getCompareLink(changelog) !== undefined;
    const yanked = this.yanked ? " [YANKED]" : "";
    const { version } = this;

    if (version) {
      if (hasCompareLink) {
        t.push(`## [${version}] - ${formatDate(this.date)}${yanked}`);
      } else {
        t.push(`## ${version} - ${formatDate(this.date)}${yanked}`);
      }
    } else {
      if (hasCompareLink) {
        t.push(`## [Unreleased]${yanked}`);
      } else {
        t.push(`## Unreleased${yanked}`);
      }
    }

    if (changelog?.format === "markdownlint") {
      t.push("");
    }

    if (this.description.trim()) {
      t.push(this.description.trim());
      t.push("");
    }

    this.changes.forEach((changes, type) => {
      if (changes.length) {
        t.push(`### ${type[0].toUpperCase()}${type.substring(1)}`);
        if (changelog?.format === "markdownlint") {
          t.push("");
        }
        t = t.concat(changes.map((change) => change.toString(changelog?.bulletStyle)));
        t.push("");
      }
    });

    return t.join("\n").trim();
  }

  getCompareLink(changelog?: Changelog) {
    if (!changelog?.url) {
      return;
    }

    const index = changelog.releases.indexOf(this);

    if (index === -1) {
      return;
    }

    let offset = 1;
    let previous = changelog.releases[index + offset];

    while (previous && !previous.date) {
      ++offset;
      previous = changelog.releases[index + offset];
    }

    if (!previous && (!this.version || !this.date)) {
      return;
    }

    const compareLink = changelog.compareLink(previous, this);

    if (!compareLink) {
      return;
    }

    return `[${this.version || "Unreleased"}]: ${compareLink}`;
  }

  getLinks(changelog: Changelog) {
    const links: string[] = [];

    if (!changelog.url) {
      return links;
    }

    this.changes.forEach((changes) =>
      changes.forEach((change) => {
        change.issues.forEach((issue) => {
          if (!links.includes(issue)) {
            links.push(`[#${issue}]: ${changelog.url}/issues/${issue}`);
          }
        });
      })
    );

    return links;
  }
}

function formatDate(date?: Date) {
  if (!date) {
    return "Unreleased";
  }

  const year = date.getUTCFullYear();
  let month: number | string = date.getUTCMonth() + 1;
  let day: number | string = date.getUTCDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}
