<!-- deno-fmt-ignore-file -->

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2023-05-25
### Added
- New option `--create`, to create unreleased versions [#31].

### Fixed
- Allow empty values for `--release` option

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

[2.3.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/oscarotero/keep-a-changelog/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/oscarotero/keep-a-changelog/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/oscarotero/keep-a-changelog/releases/tag/v2.0.0
