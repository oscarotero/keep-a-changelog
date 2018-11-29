# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.6.6] - 2018-11-29

### Changed

- Order the links alphabetically

## [0.6.5] - 2018-11-01

### Fixed

- Updated issue autodetection to prevent unwanted extractions - [#7]

## [0.6.4] - 2018-09-03

### Added

- Added `findRelease` function to `Changelog` for finding a release by version number - [#6]
- Added `setVersion` function to `Release` for changing the version of a release - [#6]

## [0.6.3] - 2018-08-22

### Fixed

- Fixed trailing newlines when no links are present - [#5]
- Fixed case of unreleased version to match http://keepachangelog.com/ - [#4]
- Fixed Release isEmpty and add tests - [#3]

## [0.6.2] - 2018-07-24

### Added

- Support for unreleased versions (releases with version but without date)

## [0.6.1] - 2018-06-30

### Fixed

- Prevent inserting duplicated links

## [0.6.0] - 2018-06-12

### Added

- CLI Api: New option `--init`, to generate an empty CHANGELOG.md file

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
[#3]: https://github.com/oscarotero/keep-a-changelog/issues/3
[#4]: https://github.com/oscarotero/keep-a-changelog/issues/4
[#5]: https://github.com/oscarotero/keep-a-changelog/issues/5
[#6]: https://github.com/oscarotero/keep-a-changelog/issues/6
[#7]: https://github.com/oscarotero/keep-a-changelog/issues/7

[0.6.6]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.5...v0.6.6
[0.6.5]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.4...v0.6.5
[0.6.4]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/oscarotero/keep-a-changelog/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.1.0...v0.2.0
