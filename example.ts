// deno run --allow-write example.ts
import { Changelog, Release } from "./mod.ts";

const changelog = new Changelog("Changelog")
  .addRelease(
    new Release(
      "2.0.0",
      "2021-11-18",
      "New version merging Deno and Node code. There are no changes.",
    ),
  );

changelog.url = "https://github.com/oscarotero/keep-a-changelog";
changelog.flag = "deno-fmt-ignore-file";

const file = new URL("./CHANGELOG.md", import.meta.url).pathname;

Deno.writeTextFileSync(file, changelog.toString());
