# AGENTS.md

This file contains important information for AI agents working on this project.

## Project Overview

**@respawnhost/sdk** is a TypeScript SDK for the RespawnHost.com game server hosting API. It provides a type-safe, async/await-based interface to interact with all API endpoints.

- **Package Name**: `@respawnhost/sdk`
- **Version**: 1.0.0
- **Runtime**: Bun (uses Bun's built-in fetch API)
- **Language**: TypeScript 5.9+
- **Node Version**: >=18.0.0
- **License**: MIT

## Development Setup

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test

# Development mode
bun run dev
```

## Build Process

The build process involves two steps:
1. `tsc` - TypeScript compiler generates `.d.ts` and `.d.ts.map` files
2. `bun build` - Bundles the code into a single `dist/index.js` file

**Important**: The TypeScript compiler outputs to `dist/` directory, then bun build creates the final bundle. Always run both to ensure type definitions are generated.

## Project Structure

```
.
├── src/
│   ├── client.ts           # Main HTTP client with API key authentication
│   ├── errors.ts           # Custom error classes
│   ├── types.ts            # All TypeScript type definitions
│   └── services/           # API service modules
│       ├── payments.ts      # Payment operations
│       ├── servers.ts       # Server management (main service)
│       ├── backups.ts       # Backup operations
│       ├── databases.ts     # Database management
│       ├── files.ts         # File operations
│       ├── schedules.ts     # Task scheduling
│       ├── shares.ts        # Server sharing
│       └── transactions.ts  # Transaction history
├── index.ts                # Main entry point (exports everything)
├── spec.json               # OpenAPI 3.1.0 specification
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript compiler configuration
├── bunfig.toml             # Bun build configuration
└── .github/workflows/
    └── publish.yml          # GitHub Actions for npm publishing
```

## Key Components

### RespawnHostClient (`src/client.ts`)

The main HTTP client class:
- Accepts `apiKey` (required) and `baseURL` (optional, defaults to https://respawnhost.com)
- Uses Bearer token authentication via Authorization header
- Provides generic `request()`, `get()`, `post()`, `put()`, `delete()` methods
- Integrates with error handling from `src/errors.ts`
- Uses Bun's built-in `fetch` API (no external dependencies)

**Pattern**:
```typescript
const client = new RespawnHostClient({
  apiKey: 'your-api-key',
  baseURL: 'https://respawnhost.com' // optional
});
```

### Service Pattern (`src/services/`)

All services follow the same pattern:
- Constructor receives `RespawnHostClient` instance
- Methods are async and return typed responses
- Use `client.get()`, `client.post()`, `client.put()`, `client.delete()` for HTTP calls
- Paths are constructed using template literals with UUIDs
- Query parameters are passed as objects

**Example from `payments.ts`**:
```typescript
async list(params?: {...}): Promise<PaymentsListResponse> {
  return this.client.get<PaymentsListResponse>('/api/v1/payments', params);
}
```

### Error Handling (`src/errors.ts`)

Custom error class hierarchy:
- `RespawnHostError` (base class)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `BadRequestError` (400)
- `ValidationError` (extends BadRequestError)
- `ConflictError` (409)
- `PreconditionRequiredError` (428)
- `InternalServerError` (500)

All errors include:
- `message`: Human-readable error message
- `statusCode`: HTTP status code
- `response`: Full error response from API (if available)

### Type Definitions (`src/types.ts`)

All types are auto-generated from the OpenAPI spec. Contains:
- Enums: `BackupInterval`, `PowerState`, `ServerState`, `TransactionType`, `ModpackPlatform`, `ModLoader`, `Region`, `OrderBy`, `Order`, `ServerOrderBy`, `BackupDay`, `BackupIntervalLower`
- Request/Response interfaces for all endpoints
- Common types: `User`, `Pagination`, `Game`, `Server`, `Payment`, etc.

## Important Commands

### Development
```bash
bun install              # Install dependencies
bun run build           # Build the project
bun run dev             # Run in development mode
bun test                # Run tests
```

### Publishing
```bash
bun publish --access public    # Publish to npm (requires NPM_TOKEN)
```

### When Adding New Features

1. **Add types to `src/types.ts`**:
   - Define request interfaces
   - Define response interfaces
   - Add any new enums

2. **Create/update service in `src/services/`**:
   - Import new types from `../types`
   - Add async methods with proper typing
   - Use template literals for dynamic paths

3. **Export from `index.ts`**:
   - Export service class
   - Export any new types if needed

4. **Build and test**:
   ```bash
   bun run build
   ```

## Code Conventions

### TypeScript
- Use `strict` mode (enabled in tsconfig.json)
- Use modern TypeScript features (ESNext target)
- Use `async/await` for all async operations
- Type all method parameters and return values
- Use `unknown` instead of `any` for untyped data

### Naming
- Service classes: `PascalCase` with `Service` suffix (e.g., `PaymentsService`)
- Methods: `camelCase` with descriptive names
- Types: `PascalCase` (e.g., `PaymentsListResponse`)
- Request types: `PascalCase` with `Request` suffix (e.g., `RentServerRequest`)
- Response types: `PascalCase` with `Response` suffix (e.g., `ServerRentResponse`)

### Error Handling
- All service methods should throw errors (let the client handle them)
- Use the error handling in `client.ts` via `handleError()`
- Never catch and swallow errors silently

### Authentication
- Always use Bearer token authentication
- API key is passed in Authorization header: `Bearer ${apiKey}`
- Client handles this automatically in the `request()` method

## Adding New Endpoints

When the OpenAPI spec is updated:

1. Review the new/changed endpoints in `spec.json`
2. Add or update types in `src/types.ts`
3. Add or update methods in the appropriate service file
4. Export any new service classes from `index.ts`
5. Build the project: `bun run build`
6. Update README.md if needed
7. Increment version in `package.json` (follow semantic versioning)

## Semantic Versioning

- **Major (X.0.0)**: Breaking changes (API changes, removed methods)
- **Minor (0.X.0)**: New features (new endpoints, new methods)
- **Patch (0.0.X)**: Bug fixes, internal changes

Version is in `package.json` under the `version` field.

## Publishing Workflow

The GitHub Actions workflow (`.github/workflows/publish.yml`) handles publishing:

1. **Build Job**:
   - Runs on every push to `main`
   - Checks out code
   - Sets up Bun
   - Installs dependencies
   - Builds the project
   - Uploads build artifacts

2. **Publish Job**:
   - Only runs on GitHub releases
   - Downloads build artifacts
   - Publishes to npm with `bun publish --access public`
   - Requires `NPM_TOKEN` secret in GitHub repository

**To publish manually**: Run `bun publish --access public`

**To publish via GitHub**:
1. Update version in `package.json`
2. Create and push a tag: `git tag v1.0.0 && git push origin v1.0.0`
3. Create a release on GitHub

## Testing

Tests are located in the `test/` directory (not currently present - add as needed).

To add tests:
```bash
# Create test file
touch test/example.test.ts

# Run tests
bun test
```

## Dependencies

**Runtime Dependencies**: None (uses Bun's built-in fetch)

**Dev Dependencies**:
- `@types/bun` - Type definitions for Bun
- `typescript` - TypeScript compiler

## Important Notes

1. **No external HTTP library**: Uses Bun's built-in fetch API
2. **ESM only**: Package is ESM (ECMAScript Modules) only
3. **Type safety**: All methods are fully typed
4. **Error handling**: All errors are typed and extend `RespawnHostError`
5. **Authentication**: Uses Bearer token authentication
6. **OpenAPI spec**: All types and endpoints are derived from `spec.json`
7. **Service composition**: The `ServersService` composes other services (backups, databases, files, schedules, shares)

## Common Patterns

### Creating a new service

```typescript
import { RespawnHostClient } from '../client';
import type { YourRequestType, YourResponseType } from '../types';

export class YourService {
  constructor(private client: RespawnHostClient) {}

  async someMethod(params?: YourRequestType): Promise<YourResponseType> {
    return this.client.get<YourResponseType>('/api/v1/endpoint', params);
  }

  async createMethod(data: CreateRequest): Promise<CreateResponse> {
    return this.client.post<CreateResponse>('/api/v1/endpoint', data);
  }

  async updateMethod(id: string, data: UpdateRequest): Promise<UpdateResponse> {
    return this.client.put<UpdateResponse>(`/api/v1/endpoint/${id}`, data);
  }

  async deleteMethod(id: string): Promise<void> {
    return this.client.delete<void>(`/api/v1/endpoint/${id}`);
  }
}
```

### Adding to the main client

If you create a new service, you may need to add it to the main SDK structure. Currently, the SDK exports services individually for users to instantiate:

```typescript
import { RespawnHostClient, PaymentsService } from '@respawnhost/sdk';

const client = new RespawnHostClient({ apiKey: 'your-api-key' });
const payments = new PaymentsService(client);
```

## Troubleshooting

### Build Errors
- If TypeScript compilation fails, check type definitions in `src/types.ts`
- Ensure all imports are correctly referenced (use `../` for parent directory)
- Check tsconfig.json includes/excludes correct paths

### Runtime Errors
- API key authentication issues: Check `Authorization` header in `client.ts`
- Type errors: Verify types match the OpenAPI spec
- Network errors: Ensure `baseURL` is correct (default is https://respawnhost.com)

### Publishing Issues
- Ensure `NPM_TOKEN` is set in GitHub secrets
- Verify version in `package.json` is incremented
- Check that `publishConfig.access` is set to "public"

## Files to Modify for Different Tasks

| Task | Files to Modify |
|------|-----------------|
| Add new endpoint type | `src/types.ts` |
| Add new endpoint method | Appropriate file in `src/services/` |
| Add new service | Create new file in `src/services/`, update `index.ts` |
| Update authentication | `src/client.ts` |
| Update error handling | `src/errors.ts` |
| Update build config | `tsconfig.json`, `bunfig.toml` |
| Update package metadata | `package.json` |
| Update documentation | `README.md` |
| Update CI/CD | `.github/workflows/publish.yml` |
| Add tests | Create files in `test/` directory |
| Update version | `package.json` (version field) |

## Contact & Support

- **Issues**: GitHub repository issues page
- **Documentation**: README.md
- **API Documentation**: spec.json (OpenAPI 3.1.0)
