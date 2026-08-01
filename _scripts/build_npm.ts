const version = Deno.args[0];

if (!version) {
  console.error("Please provide a version number as the first argument.");
  Deno.exit(1);
}

// Remove the previous code
try {
  await Deno.remove("./package", { recursive: true });
} catch {
  // Ignore if the directory does not exist
}

const exports: Record<string, string> = {
  ".": "./mod.ts",
  "./mod.ts": "./mod.ts",
  "./bin.ts": "./bin.ts",
};

for (const { name } of Deno.readDirSync("./src")) {
  const specifier = `./src/${name}`;
  exports[specifier] = specifier;
}

const denoInfo = {
  name: "@scope/keep-a-changelog",
  version,
  exports,
};

Deno.writeTextFileSync("deno-npm.json", JSON.stringify(denoInfo));

run(
  Deno.execPath(),
  "pack",
  "--config",
  "deno-npm.json",
  "--allow-dirty",
  "--output",
  "_npm.tgz",
);

Deno.remove("deno-npm.json");

run("tar", "-xvf", "_npm.tgz");

Deno.remove("_npm.tgz");

const info = JSON.parse(Deno.readTextFileSync("./package/package.json"));

const newInfo = {
  name: "keep-a-changelog",
  version,
  description:
    "Parse and generate changelogs following the [keepachangelog](https://keepachangelog.com/) format.",
  type: "module",
  repository: {
    "type": "git",
    "url": "git+https://github.com/oscarotero/keep-a-changelog.git",
  },
  keywords: [
    "changelog",
    "keepachangelog",
    "parser",
  ],
  author: "Oscar Otero <oom@oscarotero.com>",
  homepage: "https://github.com/oscarotero/keep-a-changelog#readme",
  license: "MIT",
  bugs: {
    url: "https://github.com/oscarotero/keep-a-changelog/issues",
  },
  bin: {
    changelog: "./bin.js",
  },
  main: "./mod.js",
  types: "./mod.d.ts",
  dependencies: info.dependencies,
  exports: info.exports,
};

Deno.writeTextFileSync(
  "./package/package.json",
  JSON.stringify(newInfo, null, 2),
);

for (const path of ["./package/bin.js", "./package/bin.d.ts"]) {
  Deno.writeTextFileSync(
    path,
    Deno.readTextFileSync(path).replace(
      "#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env",
      "#!/usr/bin/env node",
    ),
  );
}

await Deno.remove("./package/deno.json");
await Deno.remove("./package/_scripts", { recursive: true });
await Deno.remove("./package/.github", { recursive: true });
await Deno.remove("./package/.vscode", { recursive: true });
await Deno.remove("./package/test", { recursive: true });

function run(cmd: string, ...args: string[]) {
  const command = new Deno.Command(cmd, {
    args,
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
  });
  command.outputSync();
}
