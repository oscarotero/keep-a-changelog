#!/usr/bin/env deno

import { writeFileStr, readFileStr } from "https://deno.land/std/fs/mod.ts";
import { join as joinPath } from "https://deno.land/std/path/mod.ts";
import { parser, Changelog, Release } from "./mod.js";
import { parse as parseFlag } from "https://deno.land/std/flags/mod.ts";

const argv = parseFlag(Deno.args, {
  default: {
    file: "CHANGELOG.md",
    url: null,
    https: true,
  },
  boolean: ["https", "init", "latest-release", "release"],
});

const file = joinPath(Deno.cwd(), argv.file);

try {
  if (argv.init) {
    const changelog = new Changelog("Changelog").addRelease(
      new Release("0.1.0", new Date(), "First version"),
    );

    save(file, changelog, true);
    Deno.exit(0);
  }

  const changelog = parser(await readFileStr(file, "utf8"));

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
      return !release.date && release.version;
    });

    if (release) {
      release.date = new Date();
    }
  }

  if (!changelog.url && !argv.url) {
    const gitconfig = require("gitconfiglocal");

    gitconfig(Deno.cwd(), (err, config) => {
      if (err) {
        console.error(red(err));
        return;
      }

      changelog.url = getHttpUrl(
        config.remote && config.remote.origin && config.remote.origin.url,
      );
      save(file, changelog);
    });
  } else {
    changelog.url = getHttpUrl(argv.url || changelog.url);
    save(file, changelog);
  }
} catch (err) {
  console.error(red(err.message));
}

function getHttpUrl(remoteUrl) {
  if (!remoteUrl) {
    return;
  }

  const url = new URL(remoteUrl.replace("git@", `https://`));

  if (!argv.https) {
    url.protocol = "http";
  }

  url.pathname = url.pathname.replace(/\.git$/, "").replace(/^\/\:/, "/");

  return url.toString();
}

function save(file, changelog, isNew) {
  const url = changelog.url;

  if (url && url.includes("gitlab.com")) {
    changelog.head = "master";
  }

  writeFileStr(file, changelog.toString());

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
