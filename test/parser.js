const assert = require('assert');
const {parser} = require('../src');

describe('Parser testing', function() {
    it('should allow spaces before dashes and asterisks', function() {
        const changelog = parser([
            '# Changelog - demo',
            '## [1.0.0] - unreleased',
            '### Added',
            '  - A cool feature',
            '  * Something neat'
        ].join('\n'));

        assert.deepEqual(
            changelog.findRelease('1.0.0').changes.get('added').map(c => c.title),
            ['A cool feature', 'Something neat']
        );
    });
    it('should explain why a release is invalid ', function() {
        assert.throws(
            () => parser([
                '# Changelog - demo',
                '## [1.0.0]',
                '### Added',
                ' - Something'
            ].join('\n')),
            /Release title must contain release date in yyyy-mm-dd form/
        );
    });
});
