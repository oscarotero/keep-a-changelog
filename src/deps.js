import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { eq, Semver } from "https://deno.land/x/semver/mod.ts";

export { eq, Semver };

export function __dirname(url, ...args) {
  const path = dirname(new URL(url).pathname);

  return args.length ? join(path, ...args) : path;
}
