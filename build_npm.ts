import { build } from "https://deno.land/x/dnt@0.40.0/mod.ts";
import { dirname, join } from "jsr:@std/path@1.0.8";
import { ensureDir } from "jsr:@std/fs@1.0.13";

await Deno.remove("npm", { recursive: true }).catch(() => {});

const version = Deno.args[0];

if (!version) {
  throw new Error("Version not specified");
}

const testFiles = [
  "changelog.azdo.md",
  "changelog.custom.type.md",
  "changelog.expected.linted.md",
  "changelog.expected.md",
  "changelog.gitlab.md",
  "changelog.sort.md",
  "changelog.md",
  "empty.expected.md",
];

for (const file of testFiles) {
  await copyFile(`test/${file}`, `esm/keep-a-changelog/test/${file}`);
  await copyFile(`test/${file}`, `script/keep-a-changelog/test/${file}`);
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
    version,
    description:
      "Node package to parse and generate changelogs following the [keepachangelog](https://keepachangelog.com/) format.",
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
