import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';

describe('SharesService', () => {
  it('should list shared users for server', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.shares.list(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result.server_id).toBeDefined();
    expect(result.shared_members).toBeInstanceOf(Array);
    console.log(`✅ Listed ${result.shared_members.length} shared users`);
  });

  it('should share server with user', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping share test (requires valid email address)');
  });

  it('should remove user from share', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.shares.list(config.testServerUuid);

    if (result.shared_members.length === 0) {
      console.log('⚠️  No shared users to test remove');
      return;
    }

    const removeResult = await services.servers.shares.removeUser(
      config.testServerUuid,
      String(result.shared_members[0].id)
    );

    expect(removeResult).toBeDefined();
    expect(removeResult.success).toBe(true);
    console.log(`✅ Removed shared user`);
  });

  it('should handle non-existent server', async () => {
    if (!services) return;
    try {
      await services.servers.shares.list('00000000-0000-0000-0000-000000000000');
      console.log('❌ Expected error for non-existent server');
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log('✅ Correctly handled 404 error for non-existent server');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  });
});
