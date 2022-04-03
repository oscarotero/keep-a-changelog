import { Change } from "../mod.ts";
import { assert, assertEquals } from "./deps.ts";

Deno.test("should extract issues from text", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - #777", issues);
  assertEquals(text, "some change - [#777]");
  assert(issues.includes("777"));
});

Deno.test("should extract multiple issues", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - #777, #778", issues);
  assertEquals(text, "some change - [#777], [#778]");
  assert(issues.includes("777"));
  assert(issues.includes("778"));
});

Deno.test("should extract issues with brackets", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - [#777]", issues);
  assertEquals(text, "some change - [#777]");
  assert(issues.includes("777"));
});

Deno.test("should not extract issues which are part of a link", function () {
  const issues: string[] = [];
  const text = Change.extractIssues(
    "some change - [#777](https://example.com)",
    issues,
  );
  assertEquals(text, "some change - [#777](https://example.com)");
  assertEquals(issues, []);
});

Deno.test("should extract issues with a period after them", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - #777. [#778].", issues);
  assertEquals(text, "some change - [#777]. [#778].");
  assert(issues.includes("777"));
  assert(issues.includes("778"));
});

Deno.test("should not extract issues which are escaped", function () {
  const issues: string[] = [];
  const text = Change.extractIssues(
    "some change - \\#777, \\[#778], [\\#779]",
    issues,
  );
  assertEquals(text, "some change - \\#777, \\[#778], [\\#779]");
  assertEquals(issues, []);
});

Deno.test("should not extract issues which are in code", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - `#777`", issues);
  assertEquals(text, "some change - `#777`");
  assertEquals(issues, []);
});

Deno.test("should not extract issues which are not preceded by whitespace or commas", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change#777", issues);
  assertEquals(text, "some change#777");
  assertEquals(issues, []);
});

Deno.test("should extract issues which are separated by a comma", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change #777,#778", issues);
  assertEquals(text, "some change [#777],[#778]");
  assert(issues.includes("777"));
  assert(issues.includes("778"));
});

Deno.test("should not extract issues which include non-numeric characters", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - #77a", issues);
  assertEquals(text, "some change - #77a");
  assertEquals(issues, []);
});

Deno.test("should not extract issues which are inside parentheses without brackets", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - (#777)", issues);
  assertEquals(text, "some change - (#777)");
  assertEquals(issues, []);
});

Deno.test("should extract issues which are inside parentheses with brackets", function () {
  const issues: string[] = [];
  const text = Change.extractIssues("some change - ([#777])", issues);
  assertEquals(text, "some change - ([#777])");
  assert(issues.includes("777"));
});
