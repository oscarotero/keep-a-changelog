// deno run --allow-write example.ts
import { Changelog, Release } from "./mod.ts";

const changelog = new Changelog("Changelog")
  .addRelease(
    new Release("2.1.0", "2022-04-03")
      .added("Support for `[YANKED]` releases #25")
      .fixed("Updated dependencies"),
  )
  .addRelease(
    new Release("2.0.1", "2022-01-09")
      .fixed("Updated deps.")
      .fixed("`release` and `latest-release` args #23."),
  )
  .addRelease(
    new Release(
      "2.0.0",
      "2021-12-08",
      "New version merging Deno and Node code using Deno's `dnt` package.",
    )
      .changed("Code converted to TypeScript.")
      .changed("Added the link of the first version #21."),
  );

changelog.url = "https://github.com/oscarotero/keep-a-changelog";
changelog.flag = "deno-fmt-ignore-file";

const file = new URL("./CHANGELOG.md", import.meta.url).pathname;

Deno.writeTextFileSync(file, changelog.toString());
