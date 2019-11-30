const assert = require('assert');
const {parser} = require('../src');

describe('Parser testing', function() {
    it('should include nested bullets in title', function() {
        const changelog = parser([
            '# Changelog - demo',
            '## [1.0.0] - unreleased',
            '### Added',
            '- A cool feature',
            '  * Something neat'
        ].join('\n'));

        assert.deepEqual(
            changelog.findRelease('1.0.0').changes.get('added').map(c => c.title),
            ['A cool feature\n  * Something neat']
        );
    });
    it('should not consider lines with - in the middle as changes', function() {
        const changelog = parser([
            '# Changelog - demo',
            '## [1.0.0] - unreleased',
            '### Added',
            '- A cool feature',
            '  with multiple lines and a - in the middle',
        ].join('\n'));

        assert.deepEqual(
            changelog.findRelease('1.0.0').changes.get('added').map(c => c.title),
            ['A cool feature\n  with multiple lines and a - in the middle']
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
