import { Changelog, Release } from "./mod.js";
import { __dirname } from "./deps.js";

const path = __dirname(import.meta.url);
const file = path("CHANGELOG.md");

const changelog = new Changelog("Changelog")
  .addRelease(
    new Release("1.0.0", "2020-06-24", "Fist version for Deno")
  )
  .addRelease(
    new Release("1.0.1", "2020-08-31")
      .fixed("Support for latest version of deno Std library"),
  )
  .addRelease(
    new Release("1.1.0", "2021-05-13")
      .added("Support for flags like 'deno-fmt-ignore-file'")
      .added("Allow to pass a version number to `--release` command #18"),
  )
  .addRelease(
    new Release("1.1.1", "2021-06-09")
      .fixed("Updated dependencies to support Deno 1.11.0")
      .fixed("Remove spaces in empty lines"),
  );

changelog.url = "https://github.com/oscarotero/keep-a-changelog";
changelog.flag = "deno-fmt-ignore-file";

Deno.writeTextFileSync(file, changelog.toString());
