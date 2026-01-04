# Test Suite

This directory contains comprehensive tests for the RespawnHost SDK, covering all API endpoints.

## Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```bash
RESPAWNHOST_API_KEY=your_api_key_here
TEST_SERVER_UUID=your-server-uuid-here
ENABLE_DESTRUCTIVE=false
```

3. Get your API key from https://respawnhost.com/api-keys
4. Get your server UUID from https://respawnhost.com/servers

## Running Tests

### Run all tests (read-only):
```bash
bun test
```

### Run all tests including destructive operations:
```bash
ENABLE_DESTRUCTIVE=true bun test
```

### Run specific test file:
```bash
bun test test/payments.test.ts
```

### Run tests with environment file:
```bash
bun --env-file=.env test
```

## Test Files

- `payments.test.ts` - Payment operations
- `transactions.test.ts` - Account transactions
- `servers.test.ts` - Server management
- `backups.test.ts` - Backup operations
- `databases.test.ts` - Database management
- `files.test.ts` - File operations
- `schedules.test.ts` - Task scheduling
- `shares.test.ts` - Server sharing
- `config.ts` - Test configuration
- `index.test.ts` - Test runner

## Destructive Tests

Tests marked as destructive include:
- Creating/deleting resources
- Updating server settings
- Modifying files
- Starting/stopping/restarting servers
- Installing mods or modpacks
- Rotating credentials

These tests are **disabled by default** (`ENABLE_DESTRUCTIVE=false`).

To enable destructive tests:
```bash
ENABLE_DESTRUCTIVE=true bun test
```

## Test Coverage

### Read-Only Tests (Always Run)
- ✅ List servers/payments/transactions/backups/databases/files/schedules/shares
- ✅ Get server details
- ✅ Get resource utilization
- ✅ Get startup information
- ✅ Get backup settings
- ✅ Download URLs (backups, invoices)
- ✅ Error handling (404, etc.)

### Destructive Tests (Require ENABLE_DESTRUCTIVE=true)
- ⚠️  Create/update/delete resources
- ⚠️  Start/stop/restart servers
- ⚠️  Send console commands
- ⚠️  Create/delete files
- ⚠️  Install/remove mods
- ⚠️  Rotate credentials
- ⚠️  Create/delete schedules
- ⚠️  Share/unshare servers

## Notes

- Tests require a valid API key
- Some tests require a server UUID (for server-specific operations)
- Destructive tests may affect your real data - use with caution!
- Tests output detailed console messages showing what's being tested
- Failed tests will show ❌ emoji, successful tests show ✅, skipped tests show ⚠️
