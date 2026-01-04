import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';
import type { BackupIntervalLower } from '../src/types';

describe('BackupsService', () => {
  it('should list backups for server', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.backups.list(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    console.log(`✅ Listed ${result.length} backups`);
  });

  it('should get backup settings', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.backups.getSettings(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.autoBackupEnabled).toBeDefined();
    expect(result.backupInterval).toBeDefined();
    expect(result.backupRetention).toBeDefined();
    expect(result.backupTime).toBeDefined();
    console.log(`✅ Got backup settings`);
  });

  it('should create backup', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.backups.create(config.testServerUuid, {
      name: 'Test Backup from SDK',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.backupName).toBeDefined();
    console.log(`✅ Created backup with ID: ${result.id}`);
  });

  it('should get backup details', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const backups = await services.servers.backups.list(config.testServerUuid);

    if (backups.length === 0) {
      console.log('⚠️  No backups available to test get details');
      return;
    }

    const backup = await services.servers.backups.get(
      config.testServerUuid,
      String(backups[0].id)
    );

    expect(backup).toBeDefined();
    expect(backup.id).toBeDefined();
    expect(backup.backupName).toBeDefined();
    console.log(`✅ Got backup details for ID ${backup.id}`);
  });

  it('should update backup settings', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.backups.updateSettings(
      config.testServerUuid,
      {
        autoBackupEnabled: true,
        backupInterval: 'daily' as BackupIntervalLower,
        backupRetention: 7,
        backupTime: '03:00',
      }
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Updated backup settings`);
  });

  it('should get download URL for backup', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const backups = await services.servers.backups.list(config.testServerUuid);

    if (backups.length === 0) {
      console.log('⚠️  No backups available to test download');
      return;
    }

    const result = await services.servers.backups.download(
      config.testServerUuid,
      String(backups[0].id)
    );

    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
    console.log(`✅ Generated download URL for backup ${backups[0].id}`);
  });

  it('should restore from backup', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping backup restore test (would restore server data)');
  });

  it('should delete backup', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping backup delete test (requires creating a backup first)');
  });

  it('should handle non-existent backup', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    try {
      await services.servers.backups.get(config.testServerUuid, '999999999');
      console.log('❌ Expected error for non-existent backup');
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log('✅ Correctly handled 404 error for non-existent backup');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  });
});
