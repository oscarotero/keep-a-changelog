#!/usr/bin/env deno

import { join } from "https://deno.land/std@0.113.0/path/mod.ts";
import { Changelog, parser, Release } from "./mod.js";
import { parse as parseFlag } from "https://deno.land/std@0.113.0/flags/mod.ts";
import { parse as parseIni } from "https://deno.land/x/ini@v2.1.0/mod.ts";

const argv = parseFlag(Deno.args, {
  default: {
    file: "CHANGELOG.md",
    url: null,
    https: true,
    quiet: false,
  },
  boolean: ["https", "init", "latest-release", "quiet"],
});

const file = join(Deno.cwd(), argv.file);

try {
  if (argv.init) {
    const changelog = new Changelog("Changelog").addRelease(
      new Release("0.1.0", new Date(), "First version"),
    );

    save(file, changelog, true);
    Deno.exit(0);
  }

  const changelog = parser(Deno.readTextFileSync(file));

  if (argv.latestRelease) {
    const release = changelog.releases.find((release) =>
      release.date && release.version
    );

    if (release) {
      console.log(release.version.toString());
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

function save(file, changelog, isNew) {
  const url = changelog.url;

  if (url && url.includes("gitlab.com")) {
    changelog.head = "master";
  }

  Deno.writeTextFileSync(file, changelog.toString());

  if (isNew) {
    console.log(green("Generated new file"), file);
  } else {
    console.log(green("Updated file"), file);
  }
}

function red(message) {
  return "\u001b[" + 31 + "m" + message + "\u001b[" + 39 + "m";
}

function green(message) {
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

    return remoteUrl.href;
  } catch (err) {
    console.error(red(err.message));
    // Ignore
  }
}
