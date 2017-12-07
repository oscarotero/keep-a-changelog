const fs = require('fs');
const { parser } = require('../src');
const assert = require('assert');

const changelog = parser(fs.readFileSync(__dirname + '/changelog.md', 'UTF-8'));
const expected = fs.readFileSync(__dirname + '/changelog.expected.md', 'UTF-8');

//fs.writeFileSync(__dirname + '/changelog.expected.md', changelog.toString());
//console.log(changelog.toString());

describe('Changelog testing', function() {
    it('should match the generated changelog with the expected', function() {
        assert.equal(changelog.toString().trim(), expected.trim());
    });
});
