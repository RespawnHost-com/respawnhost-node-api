import { RespawnHostClient } from '../client';
import type {
  Server,
  ServersListResponse,
  ServerRentResponse,
  RentServerRequest,
  BackupUpdateRequest,
  AliasUpdateRequest,
  PowerStateRequest,
  ReinstallRequest,
  SendCommandRequest,
  StartupCommandResponse,
  VariableUpdateRequest,
  StartupVariableUpdateRequest,
  StartupInformationResponse,
  ResourceUtilization,
  WebsocketData,
  ModInstallRequest,
  ModRemoveRequest,
  ModpackInstallRequest,
  ModpackPlatform,
  ModLoader,
  ServerTemplateResponse,
  ServerTransactionsResponse,
  ServerState,
  ServerOrderBy,
  Order,
  Region,
} from '../types';
import type {
  SuccessResponse,
  AliasResponse,
  RotateSFTPResponse,
  ResetStartupResponse,
  ModResponse,
  EulaRequiredResponse,
} from '../types';
import { BackupsService } from './backups';
import { DatabasesService } from './databases';
import { FilesService } from './files';
import { SchedulesService } from './schedules';
import { SharesService } from './shares';

export class ServersService {
  public readonly backups: BackupsService;
  public readonly databases: DatabasesService;
  public readonly files: FilesService;
  public readonly schedules: SchedulesService;
  public readonly shares: SharesService;

  constructor(private client: RespawnHostClient) {
    this.backups = new BackupsService(client);
    this.databases = new DatabasesService(client);
    this.files = new FilesService(client);
    this.schedules = new SchedulesService(client);
    this.shares = new SharesService(client);
  }

  async list(params?: {
    page?: number;
    limit?: number;
    orderBy?: ServerOrderBy;
    order?: Order;
    state?: ServerState;
    search?: string;
    ownerId?: number;
    summaryOnly?: boolean;
  }): Promise<ServersListResponse> {
    const response = await this.client.get<ServersListResponse>('/api/v1/servers', params);
    return response;
  }

  async rent(request: RentServerRequest): Promise<ServerRentResponse> {
    return this.client.post<ServerRentResponse>('/api/v1/servers/rent', request);
  }

  async getTemplate(uuid: string, params?: { includePanelServer?: boolean }): Promise<ServerTemplateResponse> {
    return this.client.post<ServerTemplateResponse>(`/api/v1/servers/${uuid}/template-install`, undefined, params);
  }

  async updateAlias(uuid: string, request: AliasUpdateRequest): Promise<AliasResponse> {
    return this.client.put<AliasResponse>(`/api/v1/servers/${uuid}/alias`, request);
  }

  async updateBackupSettings(uuid: string, request: BackupUpdateRequest): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(`/api/v1/servers/${uuid}/backup-settings`, request);
  }

  async getTransactions(uuid: string, params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<ServerTransactionsResponse> {
    return this.client.get<ServerTransactionsResponse>(`/api/v1/servers/${uuid}/transactions`, params);
  }

  async updateVariable(uuid: string, request: VariableUpdateRequest): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(`/api/v1/servers/${uuid}/variable`, request);
  }

  async getWebsocket(uuid: string): Promise<WebsocketData> {
    return this.client.get<WebsocketData>(`/api/v1/servers/${uuid}/websocket`);
  }

  async sendCommand(uuid: string, request: SendCommandRequest): Promise<Record<string, unknown>> {
    return this.client.post<Record<string, unknown>>(`/api/v1/servers/${uuid}/send-command`, request);
  }

  async getStartupInformation(uuid: string, lang: string): Promise<StartupInformationResponse> {
    return this.client.get<StartupInformationResponse>(`/api/v1/servers/${uuid}/startup-information/${lang}`);
  }

  async getStartupCommand(uuid: string): Promise<StartupCommandResponse> {
    return this.client.get<StartupCommandResponse>(`/api/v1/servers/${uuid}/startup-command`);
  }

  async updateStartupCommand(uuid: string, startup: string): Promise<SuccessResponse> {
    return this.client.put<SuccessResponse>(`/api/v1/servers/${uuid}/startup-command`, { startup });
  }

  async resetStartupCommand(uuid: string): Promise<ResetStartupResponse> {
    return this.client.post<ResetStartupResponse>(`/api/v1/servers/${uuid}/startup-command/reset`);
  }

  async updateStartupVariable(uuid: string, request: StartupVariableUpdateRequest): Promise<void> {
    return this.client.put<void>(`/api/v1/servers/${uuid}/startup-variable`, request);
  }

  async getResourceUtilization(uuid: string): Promise<ResourceUtilization> {
    return this.client.get<ResourceUtilization>(`/api/v1/servers/${uuid}/resource-utilization`);
  }

  async installMod(uuid: string, request: ModInstallRequest): Promise<ModResponse> {
    return this.client.post<ModResponse>(`/api/v1/servers/${uuid}/mod-install`, request);
  }

  async removeMod(uuid: string, request: ModRemoveRequest): Promise<ModResponse> {
    return this.client.post<ModResponse>(`/api/v1/servers/${uuid}/mod-remove`, request);
  }

  async installModpack(uuid: string, request: {
    modpack_id: string;
    platform: ModpackPlatform;
    create_backup?: boolean;
    version?: string;
    mod_loader?: ModLoader;
    curseforge_download_url?: string;
  }): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/modpack-install`, request);
  }

  async setPowerState(uuid: string, request: PowerStateRequest): Promise<SuccessResponse | EulaRequiredResponse> {
    return this.client.post<SuccessResponse | EulaRequiredResponse>(`/api/v1/servers/${uuid}/powerstate`, request);
  }

  async reinstall(uuid: string, request?: ReinstallRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/reinstall`, request);
  }

  async rotateSFTPCredentials(uuid: string): Promise<RotateSFTPResponse> {
    return this.client.post<RotateSFTPResponse>(`/api/v1/servers/${uuid}/rotate-sftp-credentials`);
  }
}
