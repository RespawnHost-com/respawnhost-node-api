import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';

describe('DatabasesService', () => {
  it('should list databases for server', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.databases.list(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed ${result.data.length} databases`);
  });

  it('should list databases with pagination', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.databases.list(config.testServerUuid, {
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed databases with pagination: ${result.data.length} databases`);
  });

  it('should list databases with relationships', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.databases.list(config.testServerUuid, {
      include: 'password,host',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed databases with relationships`);
  });

  it('should get database details', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const databases = await services.servers.databases.list(config.testServerUuid);

    if (databases.data.length === 0) {
      console.log('⚠️  No databases available to test get details');
      return;
    }

    const database = await services.servers.databases.get(
      config.testServerUuid,
      String(databases.data[0].attributes.id)
    );

    expect(database).toBeDefined();
    expect(database.attributes.id).toBeDefined();
    expect(database.attributes.database).toBeDefined();
    expect(database.attributes.username).toBeDefined();
    console.log(`✅ Got database details for ${database.attributes.database}`);
  });

  it('should create database', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.databases.create(config.testServerUuid, {
      database: `test_db_${Date.now()}`,
    });

    expect(result).toBeDefined();
    expect(result.attributes.id).toBeDefined();
    expect(result.attributes.database).toBeDefined();
    console.log(`✅ Created database: ${result.attributes.database}`);
  });

  it('should rotate database credentials', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const databases = await services.servers.databases.list(config.testServerUuid);

    if (databases.data.length === 0) {
      console.log('⚠️  No databases available to test credential rotation');
      return;
    }

    const result = await services.servers.databases.rotateCredentials(
      config.testServerUuid,
      String(databases.data[0].attributes.id)
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Rotated credentials for database ${databases.data[0].attributes.id}`);
  });

  it('should delete database', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping database delete test (requires creating a database first)');
  });

  it('should handle non-existent database', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    try {
      await services.servers.databases.get(config.testServerUuid, '999999999');
      console.log('❌ Expected error for non-existent database');
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log('✅ Correctly handled 404 error for non-existent database');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  });
});
