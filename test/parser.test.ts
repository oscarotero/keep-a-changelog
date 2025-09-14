import { assertEquals, assert, assertThrows } from "./deps.ts";
import { parser } from "../mod.ts";
import releaseCreator from "./fixture/CustomRelease.ts";
import getSettingsForURL from "../src/settings.ts";

const file = new URL("./changelog.custom.type.md", import.meta.url).pathname;
const fileGitlab = new URL("./changelog.gitlab.md", import.meta.url).pathname;
const fileAzdo = new URL("./changelog.azdo.md", import.meta.url).pathname;
const fileSort = new URL("./changelog.sort.md", import.meta.url).pathname;
const fileBitbucket = new URL("./changelog.bitbucket.md", import.meta.url).pathname;
const changelogContent = Deno.readTextFileSync(file);
const changelogContentGitlab = Deno.readTextFileSync(fileGitlab);
const changelogContentAzdo = Deno.readTextFileSync(fileAzdo);
const changelogContentSort = Deno.readTextFileSync(fileSort);
const changelogContentBitbucket = Deno.readTextFileSync(fileBitbucket);

Deno.test("parser testing", function () {
  // is unable to parse changelog with unknown types
  assertThrows(() => parser(changelogContent));

  // parses a changelog with custom types using a custom releaseCreator
  const changelog = parser(changelogContent, { releaseCreator });

  assertEquals(changelog.toString().trim(), changelogContent.trim());
});

Deno.test("parser testing auto sorting", function () {
  const changelog = parser(changelogContentSort, );

  assertEquals(changelog.releases[0].version, "2.0.0");
});

Deno.test("parser testing manual sorting", function () {
  const changelog = parser(changelogContentSort, { autoSortReleases: false });

  changelog.sortReleases();

  assertEquals(changelog.releases[0].version, "2.0.0");
});

Deno.test("parser testing disabled auto sorting", function () {
  const changelog = parser(changelogContentSort, { autoSortReleases: false });

  assertEquals(changelog.releases[0].version, "1.0.1");
});

Deno.test("parser testing gitlab", function () {
  // parses a changelog with gitlab links
  const changelog = parser(changelogContentGitlab, );

  // get settings from url
  assert(changelog.url)

  if(changelog.url) {
    const settings = getSettingsForURL(changelog.url);
    assert(settings)

    if (settings) {
      changelog.head = settings.head;
      changelog.tagLinkBuilder = settings.tagLink;
    }
  }

  assertEquals(changelog.toString().trim(), changelogContentGitlab.trim());
});

Deno.test("parser testing Azure DevOps", function () {
  // parses a changelog with Azure DevOps links
  const changelog = parser(changelogContentAzdo, );

  // get settings from url
  assert(changelog.url, "URL is not defined");

  if(changelog.url) {
    const settings = getSettingsForURL(changelog.url);
    assert(settings)

    if (settings) {
      changelog.head = settings.head;
      changelog.tagLinkBuilder = settings.tagLink;
    }
  }

  assertEquals(changelog.toString().trim(), changelogContentAzdo.trim());
});

Deno.test("parser testing BitBucket", function () {
  // parses a changelog with Azure BitBucket links
  const changelog = parser(changelogContentBitbucket, );

  // get settings from url
  assert(changelog.url, "URL is not defined");

  if(changelog.url) {
    const settings = getSettingsForURL(changelog.url);
    assert(settings)

    if (settings) {
      changelog.head = settings.head;
      changelog.tagLinkBuilder = settings.tagLink;
    }
  }

  assertEquals(changelog.toString().trim(), changelogContentBitbucket.trim());
});
