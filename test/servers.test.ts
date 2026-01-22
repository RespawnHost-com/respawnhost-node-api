import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';
import type {
  ServerOrderBy,
  Order,
  ServerState,
  PowerState,
  BackupInterval,
  BackupDay,
} from '../src/types';

describe('ServersService', () => {
  it('should list servers', async () => {
    if (!services) return;
    const result = await services.servers.list({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
    console.log(`✅ Listed ${result.data.length} servers`);
  });

  it('should list servers with filters', async () => {
    if (!services) return;
    const result = await services.servers.list({
      page: 1,
      limit: 10,
      orderBy: 'created_at' as ServerOrderBy,
      order: 'desc' as Order,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed servers with filters: ${result.data.length} servers`);
  });

  it('should list servers by state', async () => {
    if (!services) return;
    const result = await services.servers.list({
      page: 1,
      limit: 10,
      state: 'running' as ServerState,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed running servers: ${result.data.length} servers`);
  });

  it('should get server template', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getTemplate(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.panelUuid).toBeDefined();
    console.log(`✅ Got server template for ${result.panelUuid}`);
  });

  it('should get server transactions', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getTransactions(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Got ${result.data.length} transactions for server`);
  });

  it('should get startup information', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getStartupInformation(
      config.testServerUuid,
      'en'
    );

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Got startup information with ${result.data.length} variables`);
  });

  it('should get startup command', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getStartupCommand(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.currentStartup).toBeDefined();
    console.log(`✅ Got startup command`);
  });

  it('should get resource utilization', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getResourceUtilization(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.attributes.resources.memory_bytes).toBeDefined();
    console.log(`✅ Got resource utilization: CPU ${result.attributes.resources.cpu_absolute}%, Memory ${result.attributes.resources.memory_bytes} bytes`);
  });

  it('should get websocket data', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.getWebsocket(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.data.socket).toBeDefined();
    expect(result.data.token).toBeDefined();
    console.log(`✅ Got websocket connection data`);
  });

  it('should update server alias', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.updateAlias(config.testServerUuid, {
      alias: 'Test Server - Updated',
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.alias).toBe('Test Server - Updated');
    console.log(`✅ Updated server alias`);
  });

  it('should update backup settings', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.updateBackupSettings(config.testServerUuid, {
      auto_backup: true,
      backup_interval: 'WEEKLY' as BackupInterval,
      backup_day_value: 'SUNDAY' as BackupDay,
      backup_retention: 5,
      backup_time_value: '02:00',
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Updated backup settings`);
  });

  it('should update startup command', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.updateStartupCommand(config.testServerUuid, 'bun run server');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Updated startup command`);
  });

  it('should reset startup command', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.resetStartupCommand(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Reset startup command`);
  });

  it('should set power state', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.setPowerState(config.testServerUuid, {
      power_state: 'restart' as PowerState,
    });

    expect(result).toBeDefined();
    if ('success' in result) {
      expect(result.success).toBe(true);
    }
    console.log(`✅ Restarted server`);
  });

  it('should send command to server', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.sendCommand(config.testServerUuid, {
      command: 'say Test command from SDK',
    });

    expect(result).toBeDefined();
    console.log(`✅ Sent command to server`);
  });

  it('should reinstall server', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping reinstall test (would destroy server data)');
  });

  it('should rotate SFTP credentials', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.rotateSFTPCredentials(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.password).toBeDefined();
    console.log(`✅ Rotated SFTP credentials`);
  });

  it('should install mod', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping mod install test (requires specific mod details)');
  });

  it('should remove mod', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping mod remove test (requires specific mod details)');
  });

  it('should install modpack', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping modpack install test (requires specific modpack details)');
  });

  it('should rent a server', async () => {
    if (!services) return;
    if (skipIfDestructive()) return;

    console.log('⚠️  Skipping rent server test (would create a new server)');
    // Example usage with instance_count:
    // const result = await services.servers.rent({
    //   game_short: 'minecraft',
    //   plan_id: 1,
    //   region: 'eu' as Region,
    //   instance_count: 1,
    // });
    // expect(result).toBeDefined();
    // expect(result.id).toBeDefined();
    // expect(result.panelUuid).toBeDefined();
  });

  it('should rent multiple server instances', async () => {
    if (!services) return;
    if (skipIfDestructive()) return;

    console.log('⚠️  Skipping rent multiple servers test (would create new servers)');
    // Example usage with instance_count > 1:
    // const result = await services.servers.rent({
    //   game_short: 'minecraft',
    //   plan_id: 1,
    //   region: 'eu' as Region,
    //   instance_count: 3,
    // });
    // expect(result).toBeDefined();
  });
});
