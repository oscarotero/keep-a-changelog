#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parser } = require('./src');

const file = path.join(process.cwd(), 'CHANGELOG.md');

const changelog = parser(fs.readFileSync(file, 'UTF-8'));

fs.writeFileSync(file, changelog.toString());
