# Scripts

This directory contains helper scripts for the RespawnHost SDK.

## validate-schema.ts

Validates API responses against the OpenAPI schema (`spec.json`) to detect differences between actual responses and the documented schema.

### Usage

```bash
# Validate all endpoints
RESPAWNHOST_API_KEY=your_key bun run validate-schema

# Validate specific endpoint
RESPAWNHOST_API_KEY=your_key bun run validate-schema --endpoint /api/v1/payments

# Validate with test server UUID (for endpoints with path parameters)
TEST_SERVER_UUID=your-server-uuid RESPAWNHOST_API_KEY=your_key bun run validate-schema

# Validate specific method
RESPAWNHOST_API_KEY=your_key bun run validate-schema --method GET

# Validate with verbose output
RESPAWNHOST_API_KEY=your_key bun run validate-schema --verbose

# Stop on first error
RESPAWNHOST_API_KEY=your_key bun run validate-schema --fail-fast

# Include destructive operations (POST/PUT/DELETE - may modify server data)
TEST_SERVER_UUID=your-server-uuid RESPAWNHOST_API_KEY=your_key bun run validate-schema --include-destructive
```

### Options

- `--endpoint PATH` - Test a specific endpoint (supports partial matching)
- `--method METHOD` - Test a specific HTTP method (GET, POST, PUT, DELETE, PATCH)
- `--fail-fast` - Stop on first validation error
- `--verbose` - Show detailed validation output including response data and actual values of failed fields
- `--include-destructive` - Include POST/PUT/DELETE/PATCH operations (may modify server data, use with caution!)

### Environment Variables

- `RESPAWNHOST_API_KEY` (required) - Your RespawnHost API key
- `RESPAWNHOST_BASE_URL` (optional) - Base URL (default: https://respawnhost.com)
 - `TEST_SERVER_UUID` (optional) - Server UUID for testing endpoints with path parameters

Without `TEST_SERVER_UUID`, endpoints with path parameters will be skipped. When provided, the script will:
1. Fetch the first backup ID from the server
2. Fetch the first database ID from the server
3. Fetch the first schedule ID from the server
4. Fetch the first task ID from the first schedule
5. Use these IDs to test endpoints that require `{backupId}`, `{databaseId}`, `{scheduleId}`, `{taskId}`

### Output

The script provides a summary of validation results:

```
📊 Validation Summary
================================
Total:    67
Passed:   45 ✅
Failed:   3 ❌
Skipped:  19 ⚠️
```

### Implementation

Uses external libraries for schema validation:
- **@apidevtools/swagger-parser** - Parses and dereferences OpenAPI specifications
- **ajv** - Fast JSON Schema validator with error reporting
- **ajv-formats** - Additional formats for JSON Schema validation

### Features

- **Safe Mode by Default**: Only tests GET operations unless `--include-destructive` flag is used
  - Prevents accidental deletion/modification of server resources
  - Ensures resources (backups, databases, schedules) remain available for other endpoint tests
- **Path Parameter Resolution**: Automatically replaces path parameters with actual values
  - `/{uuid}` - Replaced with `TEST_SERVER_UUID` environment variable
  - `/{scheduleId}` - Fetched from API (first schedule found)
  - `/{taskId}` - Fetched from API (first task of first schedule)
  - `/{databaseId}` - Fetched from API (first database found)
  - `/{backupId}` - Fetched from API (first backup found)
  - `/{lang}` - Defaults to `'en'`
- **Request Body Generation**: Automatically generates sample request bodies from OpenAPI schema for POST/PUT/PATCH/DELETE methods
- **Query Parameter Support**: Generates sample query parameters from schema definitions
- **Full HTTP Method Support**: Tests GET, POST, PUT, PATCH, and DELETE methods (when enabled)
- **Automatic Resource Discovery**: Fetches actual resource IDs from the API before running validation
- **Destructive Operation Protection**: By default, only tests safe GET operations to preserve resources needed for other tests. Use `--include-destructive` carefully!

### What it validates

For each endpoint:
1. Loads the OpenAPI specification from `spec.json`
2. Makes an actual API call using the SDK
3. Validates the response against the schema defined in the spec
4. Reports any schema validation errors, including:
   - The field path that failed validation
   - The validation error message
   - The schema path that failed
   - **The actual value that caused the failure** (in verbose mode)

This helps identify:
- Schema mismatches between documentation and actual API
- Missing or incorrect response types
- Additional fields not documented in the schema
- Type errors (e.g., string instead of number)
