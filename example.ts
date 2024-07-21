// deno run --allow-write example.ts
import { Changelog, Release } from "./mod.ts";

const changelog = new Changelog("Changelog")
  .addRelease(
    new Release("2.6.0", "2024-07-21")
      .added(
        "New option `--no-v-prefix` to generate the tag names without prepending `v` #43",
      )
      .fixed("Updated dependencies"),
  )
  .addRelease(
    new Release("2.5.3", "2023-11-19")
      .fixed("Improve URL normalization in CLI #42"),
  )
  .addRelease(
    new Release("2.5.2", "2023-11-09")
      .fixed("Url regex for gitlab links #41"),
  )
  .addRelease(
    new Release("2.5.1", "2023-11-08")
      .fixed("Url parser for gitlab links #40"),
  )
  .addRelease(
    new Release("2.5.0", "2023-11-07")
      .added(
        "Automatic detection of github and gitlab urls and build the links accordingly #35",
      )
      .added("New option --head to set the HEAD name #37")
      .changed(
        "Deprecated function `compareLinkBuilder`, use `tagLinkBuilder` instead",
      )
      .fixed("Trailing slash of the remote url is now removed #36")
      .fixed("Updated dependencies"),
  )
  .addRelease(
    new Release("2.4.1", "2023-10-10")
      .fixed("Breaking changes after updating `semver` package"),
  )
  .addRelease(
    new Release("2.4.0", "2023-10-10")
      .added("New function `compareLinkBuilder` #33.")
      .fixed("Updated dependencies"),
  )
  .addRelease(
    new Release("2.3.0", "2023-05-25")
      .added("New option `--create`, to create unreleased versions #31.")
      .fixed("Allow empty values for `--release` option")
      .fixed("Updated dependencies"),
  )
  .addRelease(
    new Release("2.2.1", "2023-01-25")
      .fixed(
        "Allow list elements in the descriptions of releases and changelogs #30.",
      ),
  )
  .addRelease(
    new Release("2.2.0", "2023-01-18")
      .added("New option `format` to configure the output option #28.")
      .added("`Release.setYanked` function #26.")
      .fixed("Removed unnecessary new line after the title #27."),
  )
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

const file = new URL("./CHANGELOG.md", import.meta.url).pathname;

Deno.writeTextFileSync(file, changelog.toString());
