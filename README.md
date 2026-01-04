# @respawnhost/sdk

TypeScript SDK for RespawnHost.com game server hosting API.

## Installation

```bash
bun add @respawnhost/sdk
```

## Usage

```typescript
import { RespawnHostClient } from '@respawnhost/sdk';

const client = new RespawnHostClient({
  apiKey: 'your-api-key',
  baseURL: 'https://respawnhost.com'
});

// List servers
const servers = await client.servers.list();

// Get server details
const server = await client.servers.getTemplate('server-uuid');

// Start a server
await client.servers.setPowerState('server-uuid', { power_state: 'start' });

// Send a command
await client.servers.sendCommand('server-uuid', { command: 'say Hello!' });
```

## Services

### Servers
- `list()` - List all servers
- `rent()` - Rent a new server
- `getTemplate()` - Get server details
- `updateAlias()` - Update server name
- `setPowerState()` - Control server power (start/stop/restart/kill)
- `sendCommand()` - Send console commands
- `getStartupCommand()` - Get startup command
- `updateStartupCommand()` - Update startup command
- `getResourceUtilization()` - Get server resource usage
- `reinstall()` - Reinstall server
- `installModpack()` - Install a modpack

### Backups
- `list()` - List all backups
- `get()` - Get backup details
- `create()` - Create a new backup
- `delete()` - Delete a backup
- `restore()` - Restore from backup
- `download()` - Get download URL

### Databases
- `list()` - List all databases
- `get()` - Get database details
- `create()` - Create a new database
- `delete()` - Delete a database
- `rotateCredentials()` - Rotate database credentials

### Files
- `list()` - List files in a directory
- `getContent()` - Get file content
- `write()` - Write to a file
- `createDirectory()` - Create a directory
- `rename()` - Rename a file
- `copy()` - Copy a file
- `move()` - Move a file
- `delete()` - Delete files
- `compress()` - Compress files
- `decompress()` - Decompress an archive

### Schedules
- `list()` - List all schedules
- `get()` - Get schedule details
- `create()` - Create a schedule
- `update()` - Update a schedule
- `delete()` - Delete a schedule
- Tasks management

### Shares
- `list()` - List shared users
- `share()` - Share server with user
- `removeUser()` - Remove user from share

### Payments
- `list()` - List payments
- `downloadInvoice()` - Download invoice PDF

### Transactions
- `list()` - List transactions
- `get()` - Get transaction details

## Error Handling

All SDK methods throw typed errors:

```typescript
try {
  await client.servers.list();
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.error('Invalid API key');
  } else if (error instanceof ForbiddenError) {
    console.error('Missing permissions');
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  }
}
```

## License

MIT

## Testing

This SDK includes a comprehensive test suite covering all API endpoints. See [test/README.md](test/README.md) for detailed testing instructions.

### Quick Start

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your API key
RESPAWNHOST_API_KEY=your_api_key_here

# Run tests (read-only)
bun test

# Run tests with destructive operations
ENABLE_DESTRUCTIVE=true bun test
```

### Test Coverage

- ✅ All API endpoints tested
- ✅ Read operations (default)
- ⚠️  Destructive operations (require `ENABLE_DESTRUCTIVE=true`)
- ✅ Error handling for all status codes
- ✅ Type safety checks

See [test/README.md](test/README.md) for more details.
