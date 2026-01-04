import { RespawnHostClient } from '../client';
import type {
  Schedule,
  ScheduleWithTasks,
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
  ScheduleTask,
  ScheduleTaskCreateRequest,
  ScheduleTaskUpdateRequest,
} from '../types';
import type { SuccessResponse } from '../types';

export class SchedulesService {
  constructor(private client: RespawnHostClient) {}

  async list(uuid: string): Promise<ScheduleWithTasks[]> {
    return this.client.get<ScheduleWithTasks[]>(`/api/v1/servers/${uuid}/schedules`);
  }

  async get(uuid: string, scheduleId: string): Promise<ScheduleWithTasks> {
    return this.client.get<ScheduleWithTasks>(`/api/v1/servers/${uuid}/schedules/${scheduleId}`);
  }

  async create(uuid: string, request: ScheduleCreateRequest): Promise<Schedule> {
    return this.client.post<Schedule>(`/api/v1/servers/${uuid}/schedules`, request);
  }

  async update(uuid: string, scheduleId: string, request: ScheduleUpdateRequest): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(`/api/v1/servers/${uuid}/schedules/${scheduleId}`, request);
  }

  async delete(uuid: string, scheduleId: string): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(`/api/v1/servers/${uuid}/schedules/${scheduleId}`);
  }

  async createTask(uuid: string, scheduleId: string, request: ScheduleTaskCreateRequest): Promise<ScheduleTask> {
    return this.client.post<ScheduleTask>(`/api/v1/servers/${uuid}/schedules/${scheduleId}/tasks`, request);
  }

  async updateTask(uuid: string, scheduleId: string, taskId: string, request: ScheduleTaskUpdateRequest): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(`/api/v1/servers/${uuid}/schedules/${scheduleId}/tasks/${taskId}`, request);
  }

  async deleteTask(uuid: string, scheduleId: string, taskId: string): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(`/api/v1/servers/${uuid}/schedules/${scheduleId}/tasks/${taskId}`);
  }
}
