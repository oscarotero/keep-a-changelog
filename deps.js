import { dirname, join } from "https://deno.land/std@0.96.0/path/mod.ts";

export function __dirname(url) {
  const path = dirname(new URL(url).pathname);

  return (...args) => args.length ? join(path, ...args) : path;
}
