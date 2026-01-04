# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-BETA](https://github.com/RespawnHost-com/respawnhost-node-api/compare/1.0.4-BETA...v1.1.0-BETA) (2026-01-04)


### Features

* implement CI workflow and release automation with Release Please ([ef5e77c](https://github.com/RespawnHost-com/respawnhost-node-api/commit/ef5e77c748054a33c9ae4d1b53feab60a78d68d7))
* implement CI workflow and release automation with Release Please ([9ec07cd](https://github.com/RespawnHost-com/respawnhost-node-api/commit/9ec07cd10233f74a2e663a4a910d733a4068c8fc))


### Bug Fixes

* remove test and schema validation steps from CI workflows ([050d7f4](https://github.com/RespawnHost-com/respawnhost-node-api/commit/050d7f4d35dcb93194560e4c9a15bc4f5b607ab9))
* remove test and schema validation steps from CI workflows ([da4c156](https://github.com/RespawnHost-com/respawnhost-node-api/commit/da4c1569f75d114bbd193e289aabbffe95a1d1d9))

## [1.0.0](https://github.com/RespawnHost-com/respawnhost-node-api/releases/tag/v1.0.0) - Initial Release

### Added

- Initial SDK release with full API coverage
- `RespawnHostClient` - Main HTTP client with API key authentication
- `PaymentsService` - Payment operations
- `ServersService` - Server management (main service)
- `BackupsService` - Backup operations
- `DatabasesService` - Database management
- `FilesService` - File operations
- `SchedulesService` - Task scheduling
- `SharesService` - Server sharing
- `TransactionsService` - Transaction history
- Full TypeScript type definitions
- Custom error classes for all API error responses
