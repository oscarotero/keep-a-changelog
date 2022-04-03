import { assertEquals, assertThrows } from "./deps.ts";
import { parser } from "../mod.ts";
import releaseCreator from "./fixture/CustomRelease.ts";

const file = new URL("./changelog.custom.type.md", import.meta.url).pathname;
const changelogContent = Deno.readTextFileSync(file);

Deno.test("parser testing", function () {
  // is unable to parse changelog with unknown types
  assertThrows(() => parser(changelogContent));

  // parses a changelog with custom types using a custom releaseCreator
  const changelog = parser(changelogContent, { releaseCreator });

  assertEquals(changelog.toString().trim(), changelogContent.trim());
});
