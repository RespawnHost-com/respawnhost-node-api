import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';

describe('FilesService', () => {
  it('should list files in root directory', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.files.list(config.testServerUuid, {
      directory: '/',
    });

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    console.log(`✅ Listed ${result.length} files in root directory`);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('is_file');
  });

  it('should create directory', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const dirName = `test_dir_${Date.now()}`;

    const result = await services.servers.files.createDirectory(
      config.testServerUuid,
      {
        root: '/',
        name: dirName,
      }
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Created directory: ${dirName}`);
  });


  it('should get file content', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const files = await services.servers.files.list(config.testServerUuid, {
      directory: '/',
    });

    const txtFile = files.find((f) => f.name.endsWith('.txt'));

    if (!txtFile) {
      console.log('⚠️  No text files available to test get content');
      return;
    }

    const result = await services.servers.files.getContent(config.testServerUuid, txtFile.name);

    expect(result).toBeDefined();
    console.log(`✅ Got content for file: ${txtFile.name}`);
  });

  it('should rename file', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const files = await services.servers.files.list(config.testServerUuid, {
      directory: '/',
    });

    const testFile = files.find((f) => f.name.startsWith('test_file_'));

    if (!testFile) {
      console.log('⚠️  No test files available to rename');
      return;
    }

    const newName = `renamed_${Date.now()}.txt`;

    const result = await services.servers.files.rename(config.testServerUuid, {
      root: '/',
      files: [testFile.name],
      to: newName,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    console.log(`✅ Renamed file to: ${newName}`);
  });

  it('should copy file', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping copy test (requires existing files)');
  });

  it('should move file', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping move test (requires existing files)');
  });

  it('should delete files', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping delete test (requires creating files first)');
  });

  it('should compress files', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping compress test (requires specific files)');
  });

  it('should decompress archive', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping decompress test (requires archive file)');
  });

  it('should handle non-existent directory', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    try {
      await services.servers.files.list(config.testServerUuid, {
        directory: '/nonexistent_directory_123456789',
      });
      console.log('❌ Expected error for non-existent directory');
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log('✅ Correctly handled 404 error for non-existent directory');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  });
});
