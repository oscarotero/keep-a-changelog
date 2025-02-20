#!/usr/bin/env deno

import { join } from "jsr:@std/path@0.224.0";
import { Changelog, parser, Release } from "./mod.ts";
import { parseArgs } from "jsr:@std/cli@1.0.0/parse-args";
import { parse as parseIni } from "jsr:@std/ini@0.225.2";
import getSettingsForURL from "./src/settings.ts";

const argv = parseArgs(Deno.args, {
  default: {
    file: "CHANGELOG.md",
    format: "compact",
    release: null,
    create: null,
    url: null,
    https: true,
    quiet: false,
    head: null,
    combine: false,
    "bullet-style": "-",
  },
  string: ["file", "format", "url", "head", "bullet-style"],
  boolean: ["https", "init", "latest-release", "quiet", "help", "combine"],
  alias: {
    h: "help",
  },
});

const file = join(Deno.cwd(), argv.file);

try {
  if (argv.help) {
    showHelp();
    Deno.exit(0);
  }

  if (argv.init) {
    const changelog = new Changelog("Changelog").addRelease(
      new Release("0.1.0", new Date(), "First version"),
    );

    changelog.format = argv.format as "compact" | "markdownlint";
    changelog.bulletStyle = argv['bullet-style'] as "-" | "*" | "+";

    save(file, changelog, true);
    Deno.exit(0);
  }

  const changelog = parser(Deno.readTextFileSync(file));
  changelog.format = argv.format as "compact" | "markdownlint";
  changelog.bulletStyle = argv['bullet-style'] as "-" | "*" | "+";
  if (argv["no-v-prefix"]) {
    changelog.tagNameBuilder = (release) => String(release.version);
  }

  if (argv["latest-release"]) {
    const release = changelog.releases.find((release) =>
      release.date && release.version
    );

    if (release) {
      console.log(release.version?.toString());
    }

    Deno.exit(0);
  }

  if (argv.release) {
    const release = changelog.releases.find((release) => {
      if (release.date) {
        return false;
      }

      if (typeof argv.release === "string") {
        return !release.version || argv.release === release.version.toString();
      }

      return !!release.version;
    });

    if (release) {
      release.date = new Date();
      if (typeof argv.release === "string") {
        release.setVersion(argv.release);
      }
    } else {
      console.error("Not found any valid unreleased version");
      Deno.exit(1);
    }
  }

  if (argv.combine) {
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

    console.info(combinedReleases);
  }

  if (argv.create) {
    const version = typeof argv.create === "string" ? argv.create : undefined;

    const release = changelog.releases.find((release) => {
      return release.version === version
    });

    if (release) {
      console.warn("Release already exists.");
    } else {
      changelog.addRelease(new Release(version));
    }
  }

  save(file, changelog);
} catch (err) {
  console.error(red((err as Error).message));

  if (!argv.quiet) {
    Deno.exit(1);
  }
}

function save(file: string, changelog: Changelog, isNew = false) {
  changelog.url = argv.url || changelog.url || getRemoteUrl(argv.https);

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

  if (argv.head) {
    changelog.head = argv.head;
  }

  Deno.writeTextFileSync(file, changelog.toString());

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
    const file = join(Deno.cwd(), ".git", "config");
    const content = Deno.readTextFileSync(file);
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
  --file, -f          Changelog file (default: CHANGELOG.md)
  --format            Output format (default: compact)
  --bullet-style      Bullet point style (default: -)
  --url               Repository URL

  --init              Initialize a new changelog file
  --latest-release    Print the latest release version

  --release           Set the date of the specified release
  --combine           Combine changes from releases with the same version
  --create            Create a new release

  --no-v-prefix       Do not add a "v" prefix to the version
  --head              Set the HEAD link
  --quiet             Do not print errors
  --help, -h          Show this help message
`);
}
