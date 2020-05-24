import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { readFileStr } from "https://deno.land/std/fs/mod.ts";
import { __dirname } from "../src/deps.js";
import { parser } from "../mod.js";

import releaseCreator from "./fixture/CustomRelease.js";

const changelogContent = await readFileStr(
  __dirname(import.meta.url, "changelog.custom.type.md"),
  "utf8",
);

Deno.test("parser testing", function () {
  // is unable to parse changelog with unknown types
  assertThrows(() => parser(changelogContent));

  // parses a changelog with custom types using a custom releaseCreator
  const changelog = parser(changelogContent, { releaseCreator });

  assertEquals(changelog.toString().trim(), changelogContent.trim());
});
