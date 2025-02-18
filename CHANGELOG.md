# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.6.0] - 2024-07-21
### Added
- New option `--no-v-prefix` to generate the tag names without prepending `v` [#43]
- New option `--sortReleases` to enable or disable the sorting of releases [#51]
- `--help, -h` flag [#45].

### Fixed
- Updated dependencies

## [2.5.3] - 2023-11-19
### Fixed
- Improve URL normalization in CLI [#42]

## [2.5.2] - 2023-11-09
### Fixed
- Url regex for gitlab links [#41]

## [2.5.1] - 2023-11-08
### Fixed
- Url parser for gitlab links [#40]

## [2.5.0] - 2023-11-07
### Added
- Automatic detection of github and gitlab urls and build the links accordingly [#35]
- New option --head to set the HEAD name [#37]

### Changed
- Deprecated function `compareLinkBuilder`, use `tagLinkBuilder` instead

### Fixed
- Trailing slash of the remote url is now removed [#36]
- Updated dependencies

## [2.4.1] - 2023-10-10
### Fixed
- Breaking changes after updating `semver` package

## [2.4.0] - 2023-10-10
### Added
- New function `compareLinkBuilder` [#33].

### Fixed
- Updated dependencies

## [2.3.0] - 2023-05-25
### Added
- New option `--create`, to create unreleased versions [#31].

### Fixed
- Allow empty values for `--release` option
- Updated dependencies

## [2.2.1] - 2023-01-25
### Fixed
- Allow list elements in the descriptions of releases and changelogs [#30].

## [2.2.0] - 2023-01-18
### Added
- New option `format` to configure the output option [#28].
- `Release.setYanked` function [#26].

### Fixed
- Removed unnecessary new line after the title [#27].

## [2.1.0] - 2022-04-03
### Added
- Support for `[YANKED]` releases [#25]

### Fixed
- Updated dependencies

## [2.0.1] - 2022-01-09
### Fixed
- Updated deps.
- `release` and `latest-release` args [#23].

## [2.0.0] - 2021-12-08
New version merging Deno and Node code using Deno's `dnt` package.

### Changed
- Code converted to TypeScript.
- Added the link of the first version [#21].

[#21]: https://github.com/oscarotero/keep-a-changelog/issues/21
[#23]: https://github.com/oscarotero/keep-a-changelog/issues/23
[#25]: https://github.com/oscarotero/keep-a-changelog/issues/25
[#26]: https://github.com/oscarotero/keep-a-changelog/issues/26
[#27]: https://github.com/oscarotero/keep-a-changelog/issues/27
[#28]: https://github.com/oscarotero/keep-a-changelog/issues/28
[#30]: https://github.com/oscarotero/keep-a-changelog/issues/30
[#31]: https://github.com/oscarotero/keep-a-changelog/issues/31
[#33]: https://github.com/oscarotero/keep-a-changelog/issues/33
[#35]: https://github.com/oscarotero/keep-a-changelog/issues/35
[#36]: https://github.com/oscarotero/keep-a-changelog/issues/36
[#37]: https://github.com/oscarotero/keep-a-changelog/issues/37
[#40]: https://github.com/oscarotero/keep-a-changelog/issues/40
[#41]: https://github.com/oscarotero/keep-a-changelog/issues/41
[#42]: https://github.com/oscarotero/keep-a-changelog/issues/42
[#43]: https://github.com/oscarotero/keep-a-changelog/issues/43
[#45]: https://github.com/oscarotero/keep-a-changelog/issues/45
[#51]: https://github.com/oscarotero/keep-a-changelog/issues/51

[2.6.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.5.3...v2.6.0
[2.5.3]: https://github.com/oscarotero/keep-a-changelog/compare/v2.5.2...v2.5.3
[2.5.2]: https://github.com/oscarotero/keep-a-changelog/compare/v2.5.1...v2.5.2
[2.5.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.4.1...v2.5.0
[2.4.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/oscarotero/keep-a-changelog/releases/tag/v2.0.0
