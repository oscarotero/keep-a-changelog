#!/usr/bin/env deno

import { join } from "https://deno.land/std/path/mod.ts";
import { Changelog, parser, Release } from "./mod.js";
import { parse as parseFlag } from "https://deno.land/std/flags/mod.ts";

const argv = parseFlag(Deno.args, {
  default: {
    file: "CHANGELOG.md",
    url: null,
    https: true,
  },
  boolean: ["https", "init", "latest-release"],
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

  const changelog = parser(Deno.readTextFileSync(file, "utf8"));

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

  if (!changelog.url && !argv.url) {
    console.error(
      red(
        'Please, set the repository url with --url="https://github.com/username/repository"',
      ),
    );
    Deno.exit(1);
  }

  changelog.url = argv.url || changelog.url;
  save(file, changelog);
} catch (err) {
  console.error(red(err.message));
}

function save(file, changelog, isNew) {
  const url = changelog.url;

  if (url && url.includes("gitlab.com")) {
    changelog.head = "master";
  }

  Deno.writeTextFile(file, changelog.toString());

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

async function run(...args) {
  const process = Deno.run({
    cmd: args,
    stdout: "piped",
    stderr: "piped",
  });

  const buff = new Uint8Array(1);
  let response = "";
  const decoder = new TextDecoder();

  while (true) {
    try {
      const result = await process.stdout?.read(buff);

      if (!result) {
        break;
      }

      response = response + decoder.decode(buff);
    } catch (ex) {
      break;
    }
  }

  return response;
}
