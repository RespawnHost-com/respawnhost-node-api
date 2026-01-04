import { RespawnHostClient } from '../client';
import type {
  Database,
  DatabaseListResponse,
  DatabaseCreateRequest,
} from '../types';
import type { SuccessResponse } from '../types';

export class DatabasesService {
  constructor(private client: RespawnHostClient) {}

  async list(uuid: string, params?: { include?: string; page?: number }): Promise<DatabaseListResponse> {
    return this.client.get<DatabaseListResponse>(`/api/v1/servers/${uuid}/databases`, params);
  }

  async get(uuid: string, databaseId: string): Promise<{ object: string; attributes: Database }> {
    return this.client.get<{ object: string; attributes: Database }>(`/api/v1/servers/${uuid}/databases/${databaseId}`);
  }

  async create(uuid: string, request: DatabaseCreateRequest): Promise<{ object: string; attributes: Database }> {
    return this.client.post<{ object: string; attributes: Database }>(`/api/v1/servers/${uuid}/databases`, request);
  }

  async delete(uuid: string, databaseId: string): Promise<SuccessResponse> {
    return this.client.delete<SuccessResponse>(`/api/v1/servers/${uuid}/databases/${databaseId}`);
  }

  async rotateCredentials(uuid: string, databaseId: string): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/databases/${databaseId}/rotate-credentials`);
  }
}
