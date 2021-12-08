// deno test --allow-read test
// deno run -A build_npm.ts 2.0.0

import { build } from "https://deno.land/x/dnt@0.7.2/mod.ts";

await Deno.remove("npm", { recursive: true }).catch(() => {});

await build({
  typeCheck: false,
  entryPoints: [
    "./mod.js",
    {
      kind: "bin",
      name: "changelog",
      path: "bin.js",
    },
  ],
  outDir: "./npm",
  package: {
    name: "keep-a-changelog",
    version: Deno.args[0],
    description:
      "Node package to parse and generate changelogs following the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format.",
    homepage: "https://github.com/oscarotero/keep-a-changelog#readme",
    license: "MIT",
    keywords: [
      "changelog",
      "keepachangelog",
      "parser",
    ],
    author: "Oscar Otero <oom@oscarotero.com>",
    repository: {
      type: "git",
      url: "git+https://github.com/oscarotero/keep-a-changelog.git",
    },
    bugs: {
      url: "https://github.com/oscarotero/keep-a-changelog/issues",
    },
  },
});

await Deno.copyFile("LICENSE", "npm/LICENSE");
await Deno.copyFile("README.md", "npm/README.md");
await Deno.copyFile("CHANGELOG.md", "npm/CHANGELOG.md");
