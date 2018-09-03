const fs = require('fs');
const { parser, Changelog, Release } = require('../src');
const assert = require('assert');
const Semver = require('semver');

const changelog = parser(fs.readFileSync(__dirname + '/changelog.md', 'UTF-8'));
const expected = fs.readFileSync(__dirname + '/changelog.expected.md', 'UTF-8');
const emptyExpected = fs.readFileSync(__dirname + '/empty.expected.md', 'UTF-8');

//fs.writeFileSync(__dirname + '/changelog.expected.md', changelog.toString());
// console.log(changelog.toString());

describe('Changelog testing', function() {
    it('should generate an empty changelog', function() {
        assert.equal(new Changelog('Changelog').toString(), emptyExpected);
    });

    it('should match the generated changelog with the expected', function() {
        assert.equal(changelog.toString().trim(), expected.trim());
    });

    describe('findRelease', function() {
        it('should find an Unreleased release if no argument is passed in', function() {
            const changelog = new Changelog('Changelog');
            const unreleased = new Release();
            const versioned = new Release('1.2.3');
            changelog.addRelease(unreleased).addRelease(versioned);
            assert.equal(changelog.findRelease(), unreleased);
        });

        it('should find an Unreleased release if null is passed in', function() {
            const changelog = new Changelog('Changelog');
            const unreleased = new Release();
            const versioned = new Release('1.2.3');
            changelog.addRelease(unreleased).addRelease(versioned);
            assert.equal(changelog.findRelease(null), unreleased);
        });

        it('should return undefined when there is no Unreleased release', function() {
            const changelog = new Changelog('Changelog');
            const versioned = new Release('1.2.3');
            changelog.addRelease(versioned);
            assert.equal(changelog.findRelease(null), undefined);
        });

        it('should find the given release', function() {
            const changelog = new Changelog('Changelog');
            const unreleased = new Release();
            const versioned = new Release('1.2.3');
            changelog.addRelease(unreleased).addRelease(versioned);
            assert.equal(changelog.findRelease('1.2.3'), versioned);
        });

        it('should return undefined for a non-existent release', function() {
            const changelog = new Changelog('Changelog');
            const unreleased = new Release();
            const versioned = new Release('1.2.3');
            changelog.addRelease(unreleased).addRelease(versioned);
            assert.equal(changelog.findRelease('1.0.0'), undefined);
        });
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

    describe('setVersion', function() {
        it('should update the version of a null-version release', function() {
            const release = new Release();
            assert.equal(release.version, undefined);
            release.setVersion('1.2.3');
            assert.equal(release.version instanceof Semver, true);
            assert.equal(release.version.toString(), '1.2.3');
        });

        it('should update the version of a versioned release', function() {
            const release = new Release('1.2.2');
            assert.equal(release.version instanceof Semver, true);
            assert.equal(release.version.toString(), '1.2.2');
            release.setVersion('1.2.3');
            assert.equal(release.version instanceof Semver, true);
            assert.equal(release.version.toString(), '1.2.3');
        });

        it('should sort the parent changelog\'s releases', function() {
            const release = new Release('1.2.2');
            let sortCalled = false;
            release.changelog = {
                sortReleases() {
                    sortCalled = true
                }
            };
            assert.equal(sortCalled, false);
            release.setVersion('1.2.3');
            assert.equal(sortCalled, true);
        })
    });
});
