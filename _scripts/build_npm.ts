import { copy, walk } from "jsr:@std/fs@1.0.19";

const version = Deno.args[0];

if (!version) {
  console.error("Please provide a version number as the first argument.");
  Deno.exit(1);
}

// Remove the previous code
try {
  await Deno.remove("./_npm", { recursive: true });
} catch {
  // Ignore if the directory does not exist
}
await Deno.mkdir("./_npm");

// Copy the files
const paths: string[] = [
  "src",
  "bin.ts",
  "mod.ts",
];

for (const path of paths) {
  await copy(path, `./_npm/${path}`);
}

// Run tsc to compile Typescript files
await Deno.writeTextFile(
  "_npm/tsconfig.json",
  JSON.stringify(
    {
      compilerOptions: {
        declaration: true,
        declarationDir: "./types",
        target: "es2022",
        allowImportingTsExtensions: true,
        moduleResolution: "NodeNext",
      },
    },
    null,
    2,
  ),
);

// Generate exports for the package.json file
interface ExportedFile {
  import: {
    types: string;
    default: string;
  };
}

let exports: Record<string, string | ExportedFile> = {};

for await (const { path } of walk("_npm", { exts: [".ts"] })) {
  const filename = path.replace(/^_npm\//, "").replace(/\.ts$/, "");
  const file = `./${filename}.js`;
  const types = `./types/${filename}.d.ts`;
  exports[file] = {
    import: {
      types,
      default: file,
    },
  };
}

exports["."] = exports["./mod.js"];

// Sort the exports by key
exports = Object.fromEntries(
  Object.entries(exports).sort(([a], [b]) => a.localeCompare(b)),
);

await new Deno.Command("deno", {
  args: ["run", "-A", "npm:typescript/tsc", "-p", "."],
  cwd: "./_npm",
}).output();

await Deno.remove("_npm/tsconfig.json");

// Replace .ts extensions with .js in the imports of JavaScript files
for await (const { path } of walk("_npm", { exts: [".js"] })) {
  const code = await Deno.readTextFile(path);
  Deno.writeTextFile(path, code.replaceAll(/\.ts";/g, '.js";'));
}

// Replace .ts extensions with .d.ts in the imports of TypeScript files
for await (const { path } of walk("_npm", { exts: [".ts"] })) {
  const code = Deno.readTextFileSync(path).replaceAll(/\.ts";/g, '.d.ts";');
  Deno.writeTextFile(path, code);
}

// Remove the TypeScript files
for await (const { path } of walk("_npm", { exts: [".ts"] })) {
  if (path.endsWith(".d.ts")) continue; // Keep declaration files
  await Deno.remove(path);
}

const { default: denoJson } = await import("../deno.json", {
  with: { type: "json" },
});
const dependencies: Record<string, string> = {};

for (const dep of Object.values(denoJson.imports)) {
  const match = dep.match(/^npm:(.+)@(.+)$/);

  if (match) {
    dependencies[match[1]] = match[2];
  }
}

// Create a package.json file to publish on npm
await Deno.writeTextFile(
  "_npm/package.json",
  JSON.stringify(
    {
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
      dependencies,
      exports,
    },
    null,
    2,
  ),
);

Deno.copyFileSync("LICENSE", "_npm/LICENSE");
Deno.copyFileSync("README.md", "_npm/README.md");
Deno.copyFileSync("CHANGELOG.md", "_npm/CHANGELOG.md");

// Run Deno to format the code
await new Deno.Command("deno", {
  args: ["fmt", "--unstable-components", "."],
  cwd: "./_npm",
}).output();

console.log("Browser/NPM build completed successfully.");
