const assert = require('assert');
const fs = require('fs');

const { parser } = require('../src');
const { customReleaseCreator } = require('./fixture/CustomRelease');
const changelogContent = fs.readFileSync(__dirname + '/changelog.custom.type.md', 'UTF-8')

describe('parser testing', function() {
    it('is unable to parse changelog with unknown types', function() {
        const throwingReleaseCreatedByParser = function() {
            parser(changelogContent);
        };

        assert.throws(throwingReleaseCreatedByParser);
    });
    it('parses a changelog with custom types using a custom releaseCreator', function() {
        const changelog = parser(changelogContent, {releaseCreator: customReleaseCreator})
        assert.equal(changelog.toString().trim(), changelogContent.trim());
    });
});
