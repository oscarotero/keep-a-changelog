import { Changelog, parser, Release } from "../mod.ts";
import customRelease from "./fixture/CustomRelease.ts";
import { assertEquals } from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { Semver } from "../src/deps.ts";

const changelogFile = new URL("./changelog.md", import.meta.url).pathname;
const expectedFile =
  new URL("./changelog.expected.md", import.meta.url).pathname;
const emptyExpectedFile =
  new URL("./empty.expected.md", import.meta.url).pathname;

const changelog = parser(Deno.readTextFileSync(changelogFile));
const expected = Deno.readTextFileSync(expectedFile);
const emptyExpected = Deno.readTextFileSync(emptyExpectedFile);

// Deno.writeTextFileSync(expectedFile, changelog.toString());
// console.log(changelog.toString());

Deno.test("Changelog testing", function () {
  // should generate an empty changelog
  assertEquals(new Changelog("Changelog").toString(), emptyExpected);

  // should match the generated changelog with the expected
  assertEquals(changelog.toString().trim(), expected.trim());
});

Deno.test("should find an Unreleased release if no argument is passed in", function () {
  const changelog = new Changelog("Changelog");
  const unreleased = new Release();
  const versioned = new Release("1.2.3");
  changelog.addRelease(unreleased).addRelease(versioned);
  assertEquals(changelog.findRelease(), unreleased);
});

Deno.test("should find an Unreleased release if null is passed in", function () {
  const changelog = new Changelog("Changelog");
  const unreleased = new Release();
  const versioned = new Release("1.2.3");
  changelog.addRelease(unreleased).addRelease(versioned);
  assertEquals(changelog.findRelease(undefined), unreleased);
});

Deno.test("should return undefined when there is no Unreleased release", function () {
  const changelog = new Changelog("Changelog");
  const versioned = new Release("1.2.3");
  changelog.addRelease(versioned);
  assertEquals(changelog.findRelease(undefined), undefined);
});

Deno.test("should find the given release", function () {
  const changelog = new Changelog("Changelog");
  const unreleased = new Release();
  const versioned = new Release("1.2.3");
  changelog.addRelease(unreleased).addRelease(versioned);
  assertEquals(changelog.findRelease("1.2.3"), versioned);
});

Deno.test("should return undefined for a non-existent release", function () {
  const changelog = new Changelog("Changelog");
  const unreleased = new Release();
  const versioned = new Release("1.2.3");
  changelog.addRelease(unreleased).addRelease(versioned);
  assertEquals(changelog.findRelease("1.0.0"), undefined);
});

Deno.test("Release testing", function () {
  //should be true for a new release with no description
  assertEquals(new Release().isEmpty(), true);
  assertEquals(new Release("1.2.3").isEmpty(), true);
  assertEquals(new Release("1.2.3", new Date()).isEmpty(), true);
  assertEquals(new Release("1.2.3", new Date(), "     ").isEmpty(), true);

  // should be false if a description is set
  assertEquals(new Release(undefined, undefined, "description").isEmpty(), false);
  assertEquals(new Release("1.2.3", undefined, "description").isEmpty(), false);
  assertEquals(
    new Release("1.2.3", new Date(), "description").isEmpty(),
    false,
  );

  // should be false if changes are added
  assertEquals(new Release().added("added").isEmpty(), false);
  assertEquals(new Release().changed("changed").isEmpty(), false);
  assertEquals(new Release().deprecated("deprecated").isEmpty(), false);
  assertEquals(new Release().removed("removed").isEmpty(), false);
  assertEquals(new Release().fixed("fixed").isEmpty(), false);
  assertEquals(new Release().security("security").isEmpty(), false);
});

Deno.test("should update the version of a null-version release", function () {
  const release = new Release();
  assertEquals(release.version, undefined);
  release.setVersion("1.2.3");
  assertEquals(release.version instanceof Semver, true);
  assertEquals(release.version?.toString(), "1.2.3");
});

Deno.test("should update the version of a versioned release", function () {
  const release = new Release("1.2.2");
  assertEquals(release.version instanceof Semver, true);
  assertEquals(release.version?.toString(), "1.2.2");
  release.setVersion("1.2.3");
  assertEquals(release.version instanceof Semver, true);
  assertEquals(release.version?.toString(), "1.2.3");
});

Deno.test("should sort the parent changelog's releases", function () {
  const release = new Release("1.2.2");
  release.changelog = new Changelog("Changelog");
  let sortCalled = false;
  release.changelog.sortReleases = () => sortCalled = true;
  assertEquals(sortCalled, false);
  release.setVersion("1.2.3");
  assertEquals(sortCalled, true);
});

Deno.test("should update the date of a null-date release", function () {
  const release = new Release();
  assertEquals(release.version, undefined);
  release.setDate("2019-02-02");
  assertEquals(release.date instanceof Date, true);
  assertEquals(release.date?.getUTCFullYear(), 2019);
  assertEquals(release.date?.getUTCMonth(), 1);
  assertEquals(release.date?.getUTCDate(), 2);
});

Deno.test("should update the date of a dated release", function () {
  const release = new Release("1.2.3", "2018-05-05");
  assertEquals(release.date instanceof Date, true);
  assertEquals(release.date?.getUTCFullYear(), 2018);
  assertEquals(release.date?.getUTCMonth(), 4);
  assertEquals(release.date?.getUTCDate(), 5);
  release.setDate("2019-02-02");
  assertEquals(release.date instanceof Date, true);
  assertEquals(release.date?.getUTCFullYear(), 2019);
  assertEquals(release.date?.getUTCMonth(), 1);
  assertEquals(release.date?.getUTCDate(), 2);
});

Deno.test("adds a change with a new method maintenance()", function () {
  assertEquals(
    customRelease().maintenance("maintenance").isEmpty(),
    false,
  );
});
Deno.test("creates release entry with Maintanace subsection", function () {
  const release = customRelease()
    .maintenance("upgrade")
    .maintenance("fix vulnerabilities");
  const expectedResult = [
    "## Unreleased",
    "### Maintenance",
    "- upgrade",
    "- fix vulnerabilities",
  ].join("\n");

  assertEquals(release.toString(), expectedResult);
});
