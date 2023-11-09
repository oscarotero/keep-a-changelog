import { assertEquals, assertNotEquals, assertThrows } from "./deps.ts";
import { parser } from "../mod.ts";
import releaseCreator from "./fixture/CustomRelease.ts";
import getSettingsForURL from "../src/settings.ts";

const file = new URL("./changelog.custom.type.md", import.meta.url).pathname;
const fileGitlab = new URL("./changelog.gitlab.md", import.meta.url).pathname;
const changelogContent = Deno.readTextFileSync(file);
const changelogContentGitlab = Deno.readTextFileSync(fileGitlab);

Deno.test("parser testing", function () {
  // is unable to parse changelog with unknown types
  assertThrows(() => parser(changelogContent));

  // parses a changelog with custom types using a custom releaseCreator
  const changelog = parser(changelogContent, { releaseCreator });

  assertEquals(changelog.toString().trim(), changelogContent.trim());
});

Deno.test("parser testing gitlab", function () {
  // parses a changelog with gitlab links
  const changelog = parser(changelogContentGitlab, );

  // get settings from url
  assertNotEquals(changelog.url, undefined)
  if(changelog.url) {
    const settings = getSettingsForURL(changelog.url);
    assertNotEquals(settings, undefined)
    if(settings) {
      changelog.head = settings.head;
      changelog.tagLinkBuilder = settings.tagLink;
    }
  }

  assertEquals(changelog.toString().trim(), changelogContentGitlab.trim());
});
