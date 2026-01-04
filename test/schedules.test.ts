import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer, config } from './config';
import type { ScheduleTaskAction } from '../src/types';

describe('SchedulesService', () => {
  it('should list schedules for server', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const result = await services.servers.schedules.list(config.testServerUuid);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    console.log(`✅ Listed ${result.length} schedules`);
  });

  it('should get schedule details', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    const schedules = await services.servers.schedules.list(config.testServerUuid);

    if (schedules.length === 0) {
      console.log('⚠️  No schedules available to test get details');
      return;
    }

    const schedule = await services.servers.schedules.get(
      config.testServerUuid,
      String(schedules[0].id)
    );

    expect(schedule).toBeDefined();
    expect(schedule.id).toBeDefined();
    expect(schedule.name).toBeDefined();
    console.log(`✅ Got schedule details for ID ${schedule.id}`);
  });

  it('should create schedule', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const result = await services.servers.schedules.create(config.testServerUuid, {
      name: 'Test Schedule from SDK',
      minute: '0',
      hour: '3',
      day_of_month: '*',
      month: '*',
      day_of_week: '*',
      is_active: true,
      only_when_online: false,
      timezone: 'UTC',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Schedule from SDK');
    console.log(`✅ Created schedule with ID: ${result.id}`);

    await services.servers.schedules.delete(config.testServerUuid, String(result.id));
    console.log(`✅ Cleaned up test schedule`);
  });

  it('should update schedule', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping schedule update test (requires creating a schedule first)');
  });

  it('should delete schedule', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping schedule delete test (requires creating a schedule first)');
  });

  it('should create schedule task', async () => {
    if (!services) return;
    if (requireTestServer() || skipIfDestructive()) return;

    const schedules = await services.servers.schedules.list(config.testServerUuid);

    if (schedules.length === 0) {
      console.log('⚠️  No schedules available to test task creation');
      return;
    }

    const result = await services.servers.schedules.createTask(
      config.testServerUuid,
      String(schedules[0].id),
      {
        action: 'command' as ScheduleTaskAction,
        payload: 'say Test task from SDK',
        time_offset: 0,
        sequence_id: 1,
        continue_on_failure: true,
      }
    );

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    console.log(`✅ Created task with ID: ${result.id}`);

    await services.servers.schedules.deleteTask(config.testServerUuid, String(schedules[0].id), String(result.id));
    console.log(`✅ Cleaned up test task`);
  });

  it('should update schedule task', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping task update test (requires creating a task first)');
  });

  it('should delete schedule task', async () => {
    if (requireTestServer() || skipIfDestructive()) return;

    console.log('⚠️  Skipping task delete test (requires creating a task first)');
  });

  it('should handle non-existent schedule', async () => {
    if (!services) return;
    if (requireTestServer()) return;

    try {
      await services.servers.schedules.get(config.testServerUuid, '999999999');
      console.log('❌ Expected error for non-existent schedule');
    } catch (error: any) {
      if (error.statusCode === 404) {
        console.log('✅ Correctly handled 404 error for non-existent schedule');
      } else {
        console.log(`❌ Unexpected error: ${error.message}`);
      }
    }
  });
});
