#!/usr/bin/env deno

import { join } from "https://deno.land/std@0.189.0/path/mod.ts";
import { Changelog, parser, Release } from "./mod.ts";
import { parse as parseFlag } from "https://deno.land/std@0.189.0/flags/mod.ts";
import { parse as parseIni } from "https://deno.land/x/ini@v2.1.0/mod.ts";
import getSettingsForURL from "./src/settings.ts";

const argv = parseFlag(Deno.args, {
  default: {
    file: "CHANGELOG.md",
    format: "compact",
    release: null,
    create: null,
    url: null,
    https: true,
    quiet: false,
    head: null,
  },
  string: ["file", "format", "url", "head"],
  boolean: ["https", "init", "latest-release", "quiet"],
});

const file = join(Deno.cwd(), argv.file);

try {
  if (argv.init) {
    const changelog = new Changelog("Changelog").addRelease(
      new Release("0.1.0", new Date(), "First version"),
    );

    changelog.format = argv.format as "compact" | "markdownlint";

    save(file, changelog, true);
    Deno.exit(0);
  }

  const changelog = parser(Deno.readTextFileSync(file));
  changelog.format = argv.format as "compact" | "markdownlint";

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

  if (argv.create) {
    const version = typeof argv.create === "string" ? argv.create : undefined;
    changelog.addRelease(new Release(version));
  }

  if (!changelog.url) {
    if (argv.url) {
      changelog.url = argv.url;
    } else {
      const url = getRemoteUrl(argv.https);

      if (url) {
        changelog.url = url;
      } else {
        console.error(
          red(
            'Please, set the repository url with --url="https://github.com/username/repository"',
          ),
        );
        Deno.exit(1);
      }
    }
  }

  save(file, changelog);
} catch (err) {
  console.error(red(err.message));

  if (!argv.quiet) {
    Deno.exit(1);
  }
}

function save(file: string, changelog: Changelog, isNew = false) {
  const url = changelog.url;

  if (url) {
    const settings = getSettingsForURL(url);

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

function getRemoteUrl(https = true) {
  try {
    const file = join(Deno.cwd(), ".git", "config");
    const content = Deno.readTextFileSync(file);
    const data = parseIni(content);
    const url = data?.['remote "origin"']?.url;

    if (!url) {
      return;
    }

    const remoteUrl = new URL(
      url.replace(/^git@([^:]+):(.*)\.git$/, "https://$1/$2"),
    );

    if (https) {
      remoteUrl.protocol = "https:";
    }

    // remove trailing slashes
    return remoteUrl.href.replace(/\/+$/, "");
  } catch (err) {
    console.error(red(err.message));
    // Ignore
  }
}
