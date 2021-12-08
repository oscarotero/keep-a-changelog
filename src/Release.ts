import { Semver } from "./deps.ts";
import Change from "./Change.ts";
import Changelog from "./Changelog.ts";

export default class Release {
  changelog?: Changelog;
  version?: Semver;
  date?: Date;
  description: string;
  changes: Map<string, Change[]>;

  constructor(
    version?: string | Semver,
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

  compare(release: Release) {
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

    if (this.version && release.version) {
      return -this.version.compare(release.version);
    }

    return 0;
  }

  isEmpty() {
    if (this.description.trim()) {
      return false;
    }

    return Array.from(this.changes.values()).every((change) => !change.length);
  }

  setVersion(version?: string | Semver) {
    if (typeof version === "string") {
      version = new Semver(version);
    }
    this.version = version;

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

  toString(changelog: Changelog) {
    let t: string[] = [];

    if (this.version) {
      if (this.hasCompareLink(changelog)) {
        t.push(`## [${this.version}] - ${formatDate(this.date)}`);
      } else {
        t.push(`## ${this.version} - ${formatDate(this.date)}`);
      }
    } else {
      if (this.hasCompareLink(changelog)) {
        t.push("## [Unreleased]");
      } else {
        t.push("## Unreleased");
      }
    }

    if (this.description.trim()) {
      t.push(this.description.trim());
      t.push("");
    }

    this.changes.forEach((changes, type) => {
      if (changes.length) {
        t.push(`### ${type[0].toUpperCase()}${type.substring(1)}`);
        t = t.concat(changes.map((change) => change.toString()));
        t.push("");
      }
    });

    return t.join("\n").trim();
  }

  getCompareLink(changelog: Changelog) {
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
      return `[Unreleased]: ${changelog.url}/compare/${
        changelog.tagName(previous)
      }...${changelog.head}`;
    }

    if (!this.date) {
      return `[${this.version}]: ${changelog.url}/compare/${
        changelog.tagName(previous)
      }...${changelog.head}`;
    }

    return `[${this.version}]: ${changelog.url}/compare/${
      changelog.tagName(
        previous,
      )
    }...${changelog.tagName(this)}`;
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

  hasCompareLink(changelog: Changelog) {
    if (!changelog || !changelog.url || !changelog.releases.length) {
      return false;
    }

    const index = changelog.releases.indexOf(this);
    const next = changelog.releases[index + 1];

    return next && next.version && next.date;
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
