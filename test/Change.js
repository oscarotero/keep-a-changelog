const Change = require("../src/Change");
const assert = require("assert");

describe("Change testing", function () {
  describe("extractIssues", function () {
    it("should extract issues from text", function () {
      const issues = [];
      const text = Change.extractIssues("some change - #777", issues);
      assert.equal(text, "some change - [#777]");
      assert.ok(issues.includes("777"));
    });

    it("should extract multiple issues", function () {
      const issues = [];
      const text = Change.extractIssues("some change - #777, #778", issues);
      assert.equal(text, "some change - [#777], [#778]");
      assert.ok(issues.includes("777"));
      assert.ok(issues.includes("778"));
    });

    it("should extract issues with brackets", function () {
      const issues = [];
      const text = Change.extractIssues("some change - [#777]", issues);
      assert.equal(text, "some change - [#777]");
      assert.ok(issues.includes("777"));
    });

    it("should not extract issues which are part of a link", function () {
      const issues = [];
      const text = Change.extractIssues(
        "some change - [#777](https://example.com)",
        issues,
      );
      assert.equal(text, "some change - [#777](https://example.com)");
      assert.deepEqual(issues, []);
    });

    it("should extract issues with a period after them", function () {
      const issues = [];
      const text = Change.extractIssues("some change - #777. [#778].", issues);
      assert.equal(text, "some change - [#777]. [#778].");
      assert.ok(issues.includes("777"));
      assert.ok(issues.includes("778"));
    });

    it("should not extract issues which are escaped", function () {
      const issues = [];
      const text = Change.extractIssues(
        "some change - \\#777, \\[#778], [\\#779]",
        issues,
      );
      assert.equal(text, "some change - \\#777, \\[#778], [\\#779]");
      assert.deepEqual(issues, []);
    });

    it("should not extract issues which are in code", function () {
      const issues = [];
      const text = Change.extractIssues("some change - `#777`", issues);
      assert.equal(text, "some change - `#777`");
      assert.deepEqual(issues, []);
    });

    it("should not extract issues which are not preceded by whitespace or commas", function () {
      const issues = [];
      const text = Change.extractIssues("some change#777", issues);
      assert.equal(text, "some change#777");
      assert.deepEqual(issues, []);
    });

    it("should extract issues which are separated by a comma", function () {
      const issues = [];
      const text = Change.extractIssues("some change #777,#778", issues);
      assert.equal(text, "some change [#777],[#778]");
      assert.ok(issues.includes("777"));
      assert.ok(issues.includes("778"));
    });

    it("should not extract issues which include non-numeric characters", function () {
      const issues = [];
      const text = Change.extractIssues("some change - #77a", issues);
      assert.equal(text, "some change - #77a");
      assert.deepEqual(issues, []);
    });

    it("should not extract issues which are inside parentheses without brackets", function () {
      const issues = [];
      const text = Change.extractIssues("some change - (#777)", issues);
      assert.equal(text, "some change - (#777)");
      assert.deepEqual(issues, []);
    });

    it("should extract issues which are inside parentheses with brackets", function () {
      const issues = [];
      const text = Change.extractIssues("some change - ([#777])", issues);
      assert.equal(text, "some change - ([#777])");
      assert.ok(issues.includes("777"));
    });
  });
});
