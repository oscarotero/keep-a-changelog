import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { parser } from "../mod.js";
import releaseCreator from "./fixture/CustomRelease.js";

const file = new URL("./changelog.custom.type.md", import.meta.url).pathname;
const changelogContent = Deno.readTextFileSync(file);

Deno.test("parser testing", function () {
  // is unable to parse changelog with unknown types
  assertThrows(() => parser(changelogContent));

  // parses a changelog with custom types using a custom releaseCreator
  const changelog = parser(changelogContent, { releaseCreator });

  assertEquals(changelog.toString().trim(), changelogContent.trim());
});
