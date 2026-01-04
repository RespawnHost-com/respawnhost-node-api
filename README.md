# @respawnhost/sdk

<p align="center">
  <strong>Official TypeScript SDK for the RespawnHost.com Game Server Hosting API</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@respawnhost/sdk"><img src="https://img.shields.io/npm/v/@respawnhost/sdk.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@respawnhost/sdk"><img src="https://img.shields.io/npm/dm/@respawnhost/sdk.svg" alt="npm downloads"></a>
  <a href="https://github.com/your-username/respawnhost-ts-sdk/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@respawnhost/sdk.svg" alt="license"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9+-blue.svg" alt="TypeScript"></a>
</p>

---

A fully type-safe, async/await-based SDK to interact with all [RespawnHost.com](https://respawnhost.com) API endpoints. Manage your game servers, backups, databases, files, schedules, and more programmatically.

## ✨ Features

- 🎯 **Full TypeScript Support** — Complete type definitions for all API endpoints
- 🚀 **Modern Async/Await** — Clean, promise-based API
- 🛡️ **Type-Safe Error Handling** — Typed error classes for different HTTP status codes
- 📦 **Zero Runtime Dependencies** — Uses native `fetch` API
- 🎮 **Complete API Coverage** — All RespawnHost API endpoints supported
- 🔧 **Modular Design** — Use only the services you need

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Services](#services)
  - [Servers](#servers-service)
  - [Backups](#backups-service)
  - [Databases](#databases-service)
  - [Files](#files-service)
  - [Schedules](#schedules-service)
  - [Shares](#shares-service)
  - [Payments](#payments-service)
  - [Transactions](#transactions-service)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# Using npm
npm install @respawnhost/sdk

# Using yarn
yarn add @respawnhost/sdk

# Using pnpm
pnpm add @respawnhost/sdk

# Using bun
bun add @respawnhost/sdk
```

## Quick Start

```typescript
import { RespawnHostClient, ServersService, PowerState } from '@respawnhost/sdk';

// Initialize the client
const client = new RespawnHostClient({
  apiKey: 'your-api-key'
});

// Create the servers service
const servers = new ServersService(client);

// List all your servers
const { data: serverList } = await servers.list();
console.log(`You have ${serverList.length} servers`);

// Start a server
await servers.setPowerState('server-uuid', { 
  power_state: PowerState.START 
});

// Send a command to the server console
await servers.sendCommand('server-uuid', { 
  command: 'say Hello from the SDK!' 
});
```

## Authentication

All API requests require an API key. You can obtain your API key from your [RespawnHost dashboard](https://respawnhost.com).

```typescript
import { RespawnHostClient } from '@respawnhost/sdk';

const client = new RespawnHostClient({
  apiKey: 'your-api-key',
  baseURL: 'https://respawnhost.com' // Optional, this is the default
});
```

### Environment Variables

We recommend storing your API key in an environment variable:

```typescript
const client = new RespawnHostClient({
  apiKey: process.env.RESPAWNHOST_API_KEY!
});
```

## Services

The SDK is organized into modular services, each handling a specific area of the API.

### Servers Service

The main service for managing game servers. It also provides access to nested services for backups, databases, files, schedules, and shares.

```typescript
import { ServersService, ServerOrderBy, Order, PowerState } from '@respawnhost/sdk';

const servers = new ServersService(client);
```

#### List Servers

```typescript
// List all servers
const { data, pagination, summary } = await servers.list();

// With filtering and pagination
const filtered = await servers.list({
  page: 1,
  limit: 10,
  orderBy: ServerOrderBy.CREATED_AT,
  order: Order.DESC,
  search: 'minecraft'
});
```

#### Rent a New Server

```typescript
const newServer = await servers.rent({
  gamePackageId: 1,
  region: 'eu',
  months: 1
});
```

#### Server Power Control

```typescript
// Start server
await servers.setPowerState('server-uuid', { power_state: PowerState.START });

// Stop server
await servers.setPowerState('server-uuid', { power_state: PowerState.STOP });

// Restart server
await servers.setPowerState('server-uuid', { power_state: PowerState.RESTART });

// Kill server (force stop)
await servers.setPowerState('server-uuid', { power_state: PowerState.KILL });
```

#### Send Console Commands

```typescript
await servers.sendCommand('server-uuid', { 
  command: 'whitelist add PlayerName' 
});
```

#### Update Server Alias

```typescript
await servers.updateAlias('server-uuid', { 
  alias: 'My Awesome Server' 
});
```

#### Get Resource Utilization

```typescript
const resources = await servers.getResourceUtilization('server-uuid');
console.log(`CPU: ${resources.cpu}%, Memory: ${resources.memory}MB`);
```

#### Startup Command Management

```typescript
// Get current startup command
const { startup } = await servers.getStartupCommand('server-uuid');

// Update startup command
await servers.updateStartupCommand('server-uuid', 'java -Xmx4G -jar server.jar');

// Reset to default
await servers.resetStartupCommand('server-uuid');
```

#### Install Modpacks

```typescript
import { ModpackPlatform, ModLoader } from '@respawnhost/sdk';

await servers.installModpack('server-uuid', {
  modpack_id: 'adrenaserver',
  platform: ModpackPlatform.MODRINTH,
  mod_loader: ModLoader.FABRIC,
  create_backup: true
});
```

#### Reinstall Server

```typescript
await servers.reinstall('server-uuid', {
  egg_id: 1 // Optional: specify a different game egg
});
```

---

### Backups Service

Manage server backups. Accessible via `servers.backups` or as a standalone service.

```typescript
import { BackupsService } from '@respawnhost/sdk';

const backups = new BackupsService(client);
// Or use: servers.backups
```

#### List & Get Backups

```typescript
// List all backups for a server
const backupList = await backups.list('server-uuid');

// Get specific backup details
const backup = await backups.get('server-uuid', 'backup-id');
```

#### Create Backup

```typescript
const newBackup = await backups.create('server-uuid', {
  name: 'Pre-update backup'
});
```

#### Restore Backup

```typescript
// Restore backup (keeps existing files)
await backups.restore('server-uuid', 'backup-id');

// Restore and delete existing files first
await backups.restore('server-uuid', 'backup-id', true);
```

#### Download Backup

```typescript
const { url } = await backups.download('server-uuid', 'backup-id');
console.log(`Download URL: ${url}`);
```

#### Backup Settings

```typescript
// Get current settings
const settings = await backups.getSettings('server-uuid');

// Update auto-backup settings
await backups.updateSettings('server-uuid', {
  autoBackupEnabled: true,
  backupInterval: 'daily',
  backupRetention: 7,
  backupTime: '03:00'
});
```

#### Delete Backup

```typescript
await backups.delete('server-uuid', 'backup-id');
```

---

### Databases Service

Manage MySQL databases for your servers.

```typescript
import { DatabasesService } from '@respawnhost/sdk';

const databases = new DatabasesService(client);
// Or use: servers.databases
```

#### List & Get Databases

```typescript
// List all databases
const { data } = await databases.list('server-uuid');

// Get specific database
const db = await databases.get('server-uuid', 'database-id');
```

#### Create Database

```typescript
const newDb = await databases.create('server-uuid', {
  database: 'my_database',
  remote: '%' // Allow connections from any host
});
```

#### Rotate Credentials

```typescript
await databases.rotateCredentials('server-uuid', 'database-id');
```

#### Delete Database

```typescript
await databases.delete('server-uuid', 'database-id');
```

---

### Files Service

Manage server files and directories.

```typescript
import { FilesService } from '@respawnhost/sdk';

const files = new FilesService(client);
// Or use: servers.files
```

#### List Files

```typescript
const fileList = await files.list('server-uuid', {
  directory: '/plugins'
});
```

#### Read File Content

```typescript
const content = await files.getContent('server-uuid', '/server.properties');
```

#### Write File

```typescript
await files.write('server-uuid', {
  file: '/motd.txt',
  content: 'Welcome to my server!'
});
```

#### Create Directory

```typescript
await files.createDirectory('server-uuid', {
  name: 'backups',
  path: '/'
});
```

#### File Operations

```typescript
// Rename file
await files.rename('server-uuid', {
  rename_from: '/old-name.txt',
  rename_to: '/new-name.txt'
});

// Copy file
await files.copy('server-uuid', {
  source: '/config.yml',
  destination: '/config.backup.yml'
});

// Move file
await files.move('server-uuid', {
  source: '/temp/file.txt',
  destination: '/files/file.txt'
});

// Delete files
await files.delete('server-uuid', {
  files: ['/unwanted.txt', '/old-backup.zip']
});
```

#### Compression

```typescript
// Compress files
await files.compress('server-uuid', {
  files: ['/world', '/plugins'],
  destination: '/backup.tar.gz'
});

// Decompress archive
await files.decompress('server-uuid', {
  file: '/backup.tar.gz',
  destination: '/'
});
```

---

### Schedules Service

Create and manage automated tasks for your servers.

```typescript
import { SchedulesService, ScheduleTaskAction } from '@respawnhost/sdk';

const schedules = new SchedulesService(client);
// Or use: servers.schedules
```

#### List & Get Schedules

```typescript
// List all schedules
const scheduleList = await schedules.list('server-uuid');

// Get specific schedule with tasks
const schedule = await schedules.get('server-uuid', 'schedule-id');
```

#### Create Schedule

```typescript
const newSchedule = await schedules.create('server-uuid', {
  name: 'Daily Restart',
  cron_minute: '0',
  cron_hour: '4',
  cron_day_of_week: '*',
  cron_day_of_month: '*',
  cron_month: '*',
  is_active: true
});
```

#### Update Schedule

```typescript
await schedules.update('server-uuid', 'schedule-id', {
  name: 'Nightly Restart',
  is_active: true
});
```

#### Manage Tasks

```typescript
// Create a task
const task = await schedules.createTask('server-uuid', 'schedule-id', {
  action: ScheduleTaskAction.COMMAND,
  payload: 'say Server restarting in 5 minutes!',
  time_offset: 0
});

// Update a task
await schedules.updateTask('server-uuid', 'schedule-id', 'task-id', {
  payload: 'say Server restarting in 1 minute!',
  time_offset: 240 // 4 minutes after first task
});

// Delete a task
await schedules.deleteTask('server-uuid', 'schedule-id', 'task-id');
```

#### Delete Schedule

```typescript
await schedules.delete('server-uuid', 'schedule-id');
```

---

### Shares Service

Share server access with other users.

```typescript
import { SharesService } from '@respawnhost/sdk';

const shares = new SharesService(client);
// Or use: servers.shares
```

#### List Shared Users

```typescript
const { data: sharedUsers } = await shares.list('server-uuid');
```

#### Share Server

```typescript
await shares.share('server-uuid', {
  email: 'friend@example.com'
});
```

#### Remove User Access

```typescript
await shares.removeUser('server-uuid', 'user-id');
```

---

### Payments Service

View payment history and download invoices.

```typescript
import { PaymentsService } from '@respawnhost/sdk';

const payments = new PaymentsService(client);
```

#### List Payments

```typescript
const { data, pagination } = await payments.list({
  page: 1,
  limit: 20,
  status: 'COMPLETED'
});
```

#### Download Invoice

```typescript
const { url } = await payments.downloadInvoice(123);
console.log(`Invoice URL: ${url}`);
```

---

### Transactions Service

View transaction history.

```typescript
import { TransactionsService, TransactionType } from '@respawnhost/sdk';

const transactions = new TransactionsService(client);
```

#### List Transactions

```typescript
const { data } = await transactions.list({
  page: 1,
  limit: 50,
  type: TransactionType.SERVER
});
```

#### Get Transaction Details

```typescript
const transaction = await transactions.get('transaction-id');
```

---

## Error Handling

The SDK provides typed error classes for different HTTP status codes. All errors extend the base `RespawnHostError` class.

```typescript
import { 
  RespawnHostError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  ValidationError,
  ConflictError,
  PreconditionRequiredError,
  InternalServerError
} from '@respawnhost/sdk';

try {
  await servers.setPowerState('invalid-uuid', { power_state: PowerState.START });
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Server not found');
  } else if (error instanceof UnauthorizedError) {
    console.error('Invalid API key');
  } else if (error instanceof ForbiddenError) {
    console.error('Insufficient permissions');
  } else if (error instanceof BadRequestError) {
    console.error('Invalid request:', error.message);
  } else if (error instanceof RespawnHostError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
  }
}
```

### Error Properties

All errors include:
- `message` — Human-readable error description
- `statusCode` — HTTP status code
- `response` — Full error response from the API (if available)

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `UnauthorizedError` | 401 | Invalid or missing API key |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `BadRequestError` | 400 | Invalid request parameters |
| `ValidationError` | 400 | Request validation failed |
| `ConflictError` | 409 | Resource conflict |
| `PreconditionRequiredError` | 428 | Precondition required |
| `InternalServerError` | 500 | Server-side error |

---

## TypeScript Types

The SDK exports all types for full TypeScript support:

```typescript
import type {
  // Core types
  Server,
  User,
  Game,
  GamePackage,
  Pagination,
  
  // Backup types
  Backup,
  BackupSettings,
  BackupCreateRequest,
  
  // Database types
  Database,
  DatabaseCreateRequest,
  
  // File types
  FileInfo,
  FileWriteRequest,
  
  // Schedule types
  Schedule,
  ScheduleWithTasks,
  ScheduleTask,
  ScheduleCreateRequest,
  
  // Payment types
  Payment,
  PaymentsListResponse,
  
  // Transaction types
  Transaction,
  TransactionsListResponse,
  
  // Response types
  SuccessResponse,
  ErrorResponse
} from '@respawnhost/sdk';
```

### Enums

```typescript
import {
  PowerState,        // START, STOP, RESTART, KILL
  ServerState,       // RUNNING, OFFLINE, SUSPENDED, etc.
  BackupInterval,    // DAILY, WEEKLY, MONTHLY, HOURLY
  TransactionType,   // SERVER, BACKUP, AFFILIATE_COMMISSION
  ModpackPlatform,   // CURSEFORGE, MODRINTH
  ModLoader,         // FABRIC, FORGE, NEOFORGE, QUILT
  Region,            // EU, US
  ServerOrderBy,     // CREATED_AT, OWNER, GAME, STATUS
  Order,             // ASC, DESC
  ScheduleTaskAction // COMMAND, POWER, BACKUP, DELETE_FILES
} from '@respawnhost/sdk';
```

---

## Examples

### Complete Server Management Example

```typescript
import {
  RespawnHostClient,
  ServersService,
  PowerState,
  ModpackPlatform,
  ModLoader,
  NotFoundError
} from '@respawnhost/sdk';

async function manageServer() {
  const client = new RespawnHostClient({
    apiKey: process.env.RESPAWNHOST_API_KEY!
  });
  
  const servers = new ServersService(client);
  
  try {
    // List all running servers
    const { data: serverList } = await servers.list();
    
    if (serverList.length === 0) {
      console.log('No servers found');
      return;
    }
    
    const server = serverList[0];
    const uuid = server.panelUuid;
    
    console.log(`Managing server: ${server.alias}`);
    
    // Check resource usage
    const resources = await servers.getResourceUtilization(uuid);
    console.log(`CPU: ${resources.cpu}%, Memory: ${resources.memory}MB`);
    
    // Create a backup before making changes
    const backup = await servers.backups.create(uuid, {
      name: `Backup before update - ${new Date().toISOString()}`
    });
    console.log(`Backup created: ${backup.backupName}`);
    
    // Update server alias
    await servers.updateAlias(uuid, { alias: 'Updated Server Name' });
    
    // Send a broadcast message
    await servers.sendCommand(uuid, { 
      command: 'say Server update complete!' 
    });
    
    console.log('Server management complete!');
    
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('Server not found');
    } else {
      throw error;
    }
  }
}

manageServer();
```

### Automated Backup Script

```typescript
import { RespawnHostClient, ServersService } from '@respawnhost/sdk';

async function backupAllServers() {
  const client = new RespawnHostClient({
    apiKey: process.env.RESPAWNHOST_API_KEY!
  });
  
  const servers = new ServersService(client);
  const { data: serverList } = await servers.list();
  
  for (const server of serverList) {
    try {
      const backup = await servers.backups.create(server.panelUuid, {
        name: `Auto backup - ${new Date().toLocaleDateString()}`
      });
      console.log(`✅ Backup created for ${server.alias}: ${backup.backupName}`);
    } catch (error) {
      console.error(`❌ Failed to backup ${server.alias}:`, error);
    }
  }
}

backupAllServers();
```

### File Management Example

```typescript
import { RespawnHostClient, ServersService } from '@respawnhost/sdk';

async function updateServerConfig(uuid: string) {
  const client = new RespawnHostClient({
    apiKey: process.env.RESPAWNHOST_API_KEY!
  });
  
  const servers = new ServersService(client);
  
  // Read current config
  const content = await servers.files.getContent(uuid, '/server.properties');
  console.log('Current config:', content);
  
  // Update MOTD
  await servers.files.write(uuid, {
    file: '/server.properties',
    content: content.toString().replace(
      /motd=.*/,
      'motd=Welcome to my awesome server!'
    )
  });
  
  console.log('Config updated!');
}
```

---

## Requirements

- Node.js >= 18.0.0 (for native `fetch` support)
- TypeScript >= 5.0 (recommended for type safety)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Clone the repository
git clone https://github.com/your-username/respawnhost-ts-sdk.git
cd respawnhost-ts-sdk

# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for the RespawnHost community
</p>

