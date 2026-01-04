import { RespawnHostClient } from '../client';
import type {
  SharedMembersResponse,
  ShareServerRequest,
  User,
} from '../types';
import type { SuccessResponse } from '../types';

export class SharesService {
  constructor(private client: RespawnHostClient) {}

  async list(uuid: string): Promise<SharedMembersResponse> {
    return this.client.get<SharedMembersResponse>(`/api/v1/servers/${uuid}/shares`);
  }

  async share(uuid: string, request: ShareServerRequest): Promise<SharedMembersResponse> {
    return this.client.post<SharedMembersResponse>(`/api/v1/servers/${uuid}/shares`, request);
  }

  async removeUser(uuid: string, userId: string): Promise<SharedMembersResponse> {
    return this.client.delete<SharedMembersResponse>(`/api/v1/servers/${uuid}/shares/${userId}`);
  }
}
