# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.2] - 2018-05-12

### Fixed

- Issues autodetection links

## [0.5.1] - 2018-05-12

### Fixed

- Issues autodetection problems with texts like `#3.4`
- Test execution was commented

## [0.5.0] - 2018-05-09

### Added

- Allow to insert a footer at the end of the changelog

### Changed

- Placed the urls of the issues at bottom
- Indent automatically the extra lines of the changes

### Fixed

- Parser refactoring

## [0.4.0] - 2018-03-22

### Added

- Create links automatically to the issues

### Fixed

- Use UTC date functions to fix decrement issue - [#1]

## [0.3.1] - 2017-12-11

### Added

- CLI Api: New option `--file`, to change the filename used
- CLI Api: New option `--url`, to set or change the project url
- CLI Api: New option `--https`, to change the use of https in the url scheme

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

[#1]: https://github.com/oscarotero/keep-a-changelog/issues/1

[0.5.2]: https://github.com/oscarotero/keep-a-changelog/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.1.0...v0.2.0
