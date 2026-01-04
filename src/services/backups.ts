import { RespawnHostClient } from '../client';
import type {
  Backup,
  BackupSettings,
  BackupUpdateRequest,
  BackupCreateRequest,
  BackupSettingsUpdateRequest,
  BackupDownloadResponse,
} from '../types';
import type { SuccessResponse } from '../types';

export class BackupsService {
  constructor(private client: RespawnHostClient) {}

  async list(uuid: string): Promise<Backup[]> {
    return this.client.get<Backup[]>(`/api/v1/servers/${uuid}/backups`);
  }

  async get(uuid: string, backupId: string): Promise<Backup> {
    return this.client.get<Backup>(`/api/v1/servers/${uuid}/backups/${backupId}`);
  }

  async create(uuid: string, request: BackupCreateRequest): Promise<Backup> {
    return this.client.post<Backup>(`/api/v1/servers/${uuid}/backups`, request);
  }

  async delete(uuid: string, backupId: string): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(`/api/v1/servers/${uuid}/backups/${backupId}`);
  }

  async getSettings(uuid: string): Promise<BackupSettings> {
    return this.client.get<BackupSettings>(`/api/v1/servers/${uuid}/backups/settings`);
  }

  async updateSettings(uuid: string, request: BackupSettingsUpdateRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/backups/settings`, request);
  }

  async download(uuid: string, backupId: string): Promise<BackupDownloadResponse> {
    return this.client.get<BackupDownloadResponse>(`/api/v1/servers/${uuid}/backups/${backupId}/download`);
  }

  async restore(uuid: string, backupId: string, truncate: boolean = false): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(
      `/api/v1/servers/${uuid}/backups/${backupId}/restore`,
      undefined,
      { truncate }
    );
  }
}
