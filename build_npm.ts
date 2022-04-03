import { build } from "https://deno.land/x/dnt@0.22.0/mod.ts";
import { dirname, join } from "https://deno.land/std@0.133.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.133.0/fs/mod.ts";

await Deno.remove("npm", { recursive: true }).catch(() => {});

const testFiles = [
  "changelog.custom.type.md",
  "changelog.expected.md",
  "changelog.md",
  "empty.expected.md",
];

for (const file of testFiles) {
  await copyFile(`test/${file}`, `esm/test/${file}`);
  await copyFile(`test/${file}`, `script/test/${file}`);
}

await copyFile("LICENSE");
await copyFile("README.md");
await copyFile("CHANGELOG.md");

await build({
  typeCheck: false,
  shims: {
    deno: true,
  },
  entryPoints: [
    "./mod.ts",
    {
      kind: "bin",
      name: "changelog",
      path: "bin.ts",
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

async function copyFile(from: string, to = from) {
  to = join("npm", to);
  await ensureDir(dirname(to));
  await Deno.copyFile(from, to);
}
