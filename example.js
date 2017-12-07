const fs = require('fs');
const { parser } = require('./src');
const file = __dirname + '/CHANGELOG.md';

const changelog = parser(fs.readFileSync(file, 'UTF-8'));

fs.writeFileSync(file, changelog.toString());
