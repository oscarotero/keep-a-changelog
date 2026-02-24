#!/usr/bin/env node
import { join } from "node:path";
import { parseArgs } from "node:util";
import { cwd, exit } from "node:process";
import { readFileSync, writeFileSync } from "node:fs";
import { parse as parseIni } from "npm:ini@6.0.0";
import { Changelog, parser, Release } from "./mod.ts";
import getSettingsForURL from "./src/settings.ts";

const { values } = parseArgs({
  options: {
    help: {
      type: "boolean",
      short: "h",
    },
    file: {
      type: "string",
      default: "CHANGELOG.md",
    },
    format: {
      type: "string",
      default: "compact",
    },
    release: {
      type: "boolean",
    },
    init: {
      type: "boolean",
    },
    create: {
      type: "string",
    },
    url: {
      type: "string",
    },
    https: {
      type: "boolean",
      default: true,
    },
    quiet: {
      type: "boolean",
    },
    head: {
      type: "string",
    },
    combine: {
      type: "boolean",
    },
    "bullet-style": {
      type: "string",
      default: "-",
    },
    "latest-release": {
      type: "boolean",
    },
    "latest-release-full": {
      type: "boolean",
    },
    "no-v-prefix": {
      type: "boolean",
    },
    "no-sort-releases": {
      type: "boolean",
    },
  },
});

const file = join(cwd(), values.file);

try {
  if (values.help) {
    showHelp();
    exit(0);
  }

  if (values.init) {
    const changelog = new Changelog("Changelog").addRelease(
      new Release("0.1.0", new Date(), "First version"),
    );

    changelog.format = values.format as "compact" | "markdownlint";
    changelog.bulletStyle = values["bullet-style"] as "-" | "*" | "+";

    save(file, changelog, true);
    exit(0);
  }

  const changelog = parser(readFileSync(file, { encoding: "utf8" }), {
    autoSortReleases: !values["no-sort-releases"],
  });
  changelog.format = values.format as "compact" | "markdownlint";
  changelog.bulletStyle = values["bullet-style"] as "-" | "*" | "+";
  if (values["no-v-prefix"]) {
    changelog.tagNameBuilder = (release) => String(release.version);
  }

  if (values["latest-release"]) {
    const release = changelog.releases.find((release) =>
      release.date && release.version
    );

    if (release) {
      console.log(release.version?.toString());
    }

    exit(0);
  }

  if (values["latest-release-full"]) {
    const release = changelog.releases.find((release) =>
      release.date && release.version
    );

    if (release) {
      console.log(release.toString());
    }

    exit(0);
  }

  if (values.release) {
    const release = changelog.releases.find((release) => {
      if (release.date) {
        return false;
      }

      if (typeof values.release === "string") {
        return !release.version ||
          values.release === release.version.toString();
      }

      return !!release.version;
    });

    if (release) {
      release.date = new Date();
      if (typeof values.release === "string") {
        release.setVersion(values.release);
      }
    } else {
      console.error("Not found any valid unreleased version");
      exit(1);
    }
  }

  if (values.combine) {
    const combinedReleases = changelog.releases.reduce((acc, release) => {
      if (release.version) {
        if (acc[release.version]) {
          acc[release.version].combineChanges(release.changes);
        } else {
          acc[release.version] = release;
        }
      }
      return acc;
    }, {} as Record<string, typeof changelog.releases[0]>);

    changelog.releases = Object.values(combinedReleases);
  }

  if (values.create) {
    let version = values.create || undefined;

    if (version === "major" || version === "minor" || version === "patch") {
      const latestRelease = changelog.releases.find((release) =>
        release.parsedVersion
      );

      if (!latestRelease) {
        console.error("No releases found to bump version from.");
        exit(1);
      }

      let { major, minor, patch } = latestRelease.parsedVersion!;

      if (version === "major") {
        major += 1;
        minor = 0;
        patch = 0;
      } else if (version === "minor") {
        minor += 1;
        patch = 0;
      } else if (version === "patch") {
        patch += 1;
      }

      version = `${major}.${minor}.${patch}`;
    }

    const release = changelog.releases.find((release) =>
      release.version === version
    );

    if (release) {
      console.warn("Release already exists.");
    } else {
      changelog.addRelease(new Release(version));
    }
  }

  save(file, changelog);
} catch (err) {
  console.error(red((err as Error).message));

  if (!values.quiet) {
    exit(1);
  }
}

function save(file: string, changelog: Changelog, isNew = false) {
  changelog.url = values.url || changelog.url || getRemoteUrl(values.https);

  if (!changelog.url) {
    console.error(
      red(
        'Please, set the repository url with --url="https://github.com/username/repository"',
      ),
    );
    changelog.url = "https://example.com";
  }

  if (changelog.url) {
    const settings = getSettingsForURL(changelog.url);

    if (settings) {
      changelog.head = settings.head;
      changelog.tagLinkBuilder = settings.tagLink;
    }
  }

  if (values.head) {
    changelog.head = values.head;
  }

  writeFileSync(file, changelog.toString());

  if (isNew) {
    console.log(green("Generated new file"), file);
  } else {
    console.log(green("Updated file"), file);
  }
}

function red(message: string) {
  return "\u001b[" + 31 + "m" + message + "\u001b[" + 39 + "m";
}

function green(message: string) {
  return "\u001b[" + 32 + "m" + message + "\u001b[" + 39 + "m";
}

function normalizeUrl(url: string, https: boolean) {
  // remove .git suffix
  url = url.replace(/\.git$/, "");

  // normalize git@host urls
  if (url.startsWith("git@")) {
    url = url.replace(
      /^git@([^:]+):(.*)$/,
      (https ? "https" : "http") + "://$1/$2",
    );
  }

  // remove trailing slashes
  url = url.replace(/\/+$/, "");
  return new URL(url);
}

function getRemoteUrl(https = true) {
  try {
    const file = join(cwd(), ".git", "config");
    const content = readFileSync(file, { encoding: "utf8" });
    const data = parseIni(content);
    const origin = data['remote "origin"'] as { url?: string };

    if (!origin?.url) {
      return;
    }

    return normalizeUrl(origin.url, https).href;
  } catch (err) {
    console.error(red((err as Error).message));
    // Ignore
  }
}

function showHelp() {
  console.log(`keep-a-changelog

Usage: keep-a-changelog [options]

Options:
  --file, -f                Changelog file (default: CHANGELOG.md)
  --format                  Output format (default: compact)
  --bullet-style            Bullet point style (default: -)
  --url                     Repository URL

  --init                    Initialize a new changelog file
  --latest-release          Print the latest release version
  --latest-release-full     Print the latest release

  --release                 Set the date of the specified release
  --combine                 Combine changes from releases with the same version
  --create                  Create a new release. Optionally accepts a version number or 'patch', 'minor' or 'major'

  --no-v-prefix             Do not add a "v" prefix to the version
  --no-sort-releases        Do not sort releases
  --head                    Set the HEAD link
  --quiet                   Do not print errors
  --help, -h                Show this help message
`);
}
