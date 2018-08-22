const fs = require('fs');
const { parser, Release } = require('../src');
const assert = require('assert');

const changelog = parser(fs.readFileSync(__dirname + '/changelog.md', 'UTF-8'));
const expected = fs.readFileSync(__dirname + '/changelog.expected.md', 'UTF-8');

//fs.writeFileSync(__dirname + '/changelog.expected.md', changelog.toString());
// console.log(changelog.toString());

describe('Changelog testing', function() {
    it('should match the generated changelog with the expected', function() {
        assert.equal(changelog.toString().trim(), expected.trim());
    });
});

describe('Release testing', function() {
    describe('isEmpty', function() {
        it('should be true for a new release with no description', function() {
            assert.equal(new Release().isEmpty(), true);
            assert.equal(new Release('1.2.3').isEmpty(), true);
            assert.equal(new Release('1.2.3', new Date()).isEmpty(), true);
            assert.equal(new Release('1.2.3', new Date(), '     ').isEmpty(), true);
        });

        it('should be false if a description is set', function() {
            assert.equal(new Release(null, null, 'description').isEmpty(), false);
            assert.equal(new Release('1.2.3', null, 'description').isEmpty(), false);
            assert.equal(new Release('1.2.3', new Date(), 'description').isEmpty(), false);
        });

        it('should be false if changes are added', function() {
            assert.equal(new Release().added('added').isEmpty(), false);
            assert.equal(new Release().changed('changed').isEmpty(), false);
            assert.equal(new Release().deprecated('deprecated').isEmpty(), false);
            assert.equal(new Release().removed('removed').isEmpty(), false);
            assert.equal(new Release().fixed('fixed').isEmpty(), false);
            assert.equal(new Release().security('security').isEmpty(), false);
        });
    });
});