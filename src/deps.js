import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { eq, default as Semver } from "https://deno.land/x/semver/mod.ts";

export { eq, Semver };

export function __dirname(url) {
  const path = dirname(new URL(url).pathname);

  return (...args) => args.length ? join(path, ...args) : path;
}
