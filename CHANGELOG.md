# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.10.4] - 2021-03-04
### Fixed
- Allow to pass a version number to `--release` command [#18]

## [0.10.3] - 2021-01-09
### Fixed
- Support for multiline links [#16]

## [0.10.2] - 2020-10-11
### Added
- New command option --quiet added to cli [#14] [#15]

### Changed
- `changelong` command will exit with code 1 if it fails to parse the changelog file

## [0.10.1] - 2020-05-04
### Added
- New command --latest-release added to cli
- New command --release added to cli

### Fixed
- Removed trailing space in the default description generated with --init
- Updated dependencies

## [0.10.0] - 2020-02-08
### Added
- Documentation to extend `Release` class + test coverage [#12] [#13]
- Ability to use extended `Release` within `parser` [#12] [#13]

### Fixed
- Upgrade semver and mocha to the latest version

## [0.9.1] - 2019-11-26
### Fixed
- Undefined function bug in CLI

## [0.9.0] - 2019-11-26
### Removed
- Support for node < 10

## [0.8.2] - 2019-11-26
### Added
- Allow to customize the HEAD branch to compare the unreleased versions

### Fixed
- Compare with master branch in gitlab
- Nested lists were flatten
- Updated yargs-parser

## [0.8.1] - 2019-05-27
### Fixed
- Support for more than one unreleased version
- Updated semver to the latest version

## [0.8.0] - 2019-03-02
### Added
- New property `Changelog.tagNameBuilder` to customize how the tag names are generated - [#10]
- New `Release.setDate()` function - [#9]

### Fixed
- Update `yargs-parser` dependency to v13.0.0

## [0.7.0] - 2018-11-29
### Changed
- Removed some spaces before and after some titles to inline with the changelog format

## [0.6.7] - 2018-11-29
### Fixed
- Fixed the links sorting to compare issues numerically instead alphabetically

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
[#9]: https://github.com/oscarotero/keep-a-changelog/issues/9
[#10]: https://github.com/oscarotero/keep-a-changelog/issues/10
[#12]: https://github.com/oscarotero/keep-a-changelog/issues/12
[#13]: https://github.com/oscarotero/keep-a-changelog/issues/13
[#14]: https://github.com/oscarotero/keep-a-changelog/issues/14
[#15]: https://github.com/oscarotero/keep-a-changelog/issues/15
[#16]: https://github.com/oscarotero/keep-a-changelog/issues/16
[#18]: https://github.com/oscarotero/keep-a-changelog/issues/18

[0.10.4]: https://github.com/oscarotero/keep-a-changelog/compare/v0.10.3...v0.10.4
[0.10.3]: https://github.com/oscarotero/keep-a-changelog/compare/v0.10.2...v0.10.3
[0.10.2]: https://github.com/oscarotero/keep-a-changelog/compare/v0.10.1...v0.10.2
[0.10.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.9.1...v0.10.0
[0.9.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.8.2...v0.9.0
[0.8.2]: https://github.com/oscarotero/keep-a-changelog/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/oscarotero/keep-a-changelog/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.7...v0.7.0
[0.6.7]: https://github.com/oscarotero/keep-a-changelog/compare/v0.6.6...v0.6.7
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
