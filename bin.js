#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parser } = require('./src');

const file = path.join(process.cwd(), 'CHANGELOG.md');

try {
    const changelog = parser(fs.readFileSync(file, 'UTF-8'));

    fs.writeFileSync(file, changelog.toString());
    console.log(green('Updated file'), file);
} catch (err) {
    console.error(red(err.message));
}

function red(message) {
    return '\u001b['+ 31 + 'm' + message + '\u001b[' + 39 + 'm';
}

function green(message) {
    return '\u001b['+ 32 + 'm' + message + '\u001b[' + 39 + 'm';
}
