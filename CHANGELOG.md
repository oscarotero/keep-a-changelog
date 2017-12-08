# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.3.0] - 2017-12-08

### Added

- Added colors in CLI
- Parser errors contains the line number in the CHANGELOG file

### Fixed

- Fixed parsing bug when the changelog is using incorrect title levels

## [0.2.0] - 2017-12-07

### Changed

- Parser improvements
- Changed the constructor arguments of Changelog, Change and Release classes

### Removed

- Removed static factories. Use `new` instead.

### Fixed

- The last version should't have diff link

## 0.1.0 - 2017-12-07

First version

[0.3.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.1.0...v0.2.0
