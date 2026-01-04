export enum BackupInterval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  HOURLY = "HOURLY",
}

export enum BackupIntervalLower {
  hourly = "hourly",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}

export enum BackupDay {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

export enum PaymentStatus {
  COMPLETED = "COMPLETED",
}

export enum TransactionType {
  SERVER = "SERVER",
  BACKUP = "BACKUP",
  AFFILIATE_COMMISSION = "AFFILIATE_COMMISSION",
}

export enum PowerState {
  START = "start",
  STOP = "stop",
  RESTART = "restart",
  KILL = "kill",
}

export enum ServerState {
  RUNNING = "running",
  OFFLINE = "offline",
  SUSPENDED = "suspended",
  STARTING = "starting",
  STOPPING = "stopping",
  INSTALLING = "installing",
  MOVING = "moving",
  ERRORED = "errored",
}

export enum ScheduleTaskAction {
  COMMAND = "command",
  POWER = "power",
  BACKUP = "backup",
  DELETE_FILES = "delete_files",
}

export enum ModpackPlatform {
  CURSEFORGE = "curseforge",
  MODRINTH = "modrinth",
}

export enum ModLoader {
  FABRIC = "fabric",
  FORGE = "forge",
  NEOFORGE = "neoforge",
  QUILT = "quilt",
}

export enum Region {
  EU = "eu",
  US = "us",
}

export enum ServerOrderBy {
  CREATED_AT = "created_at",
  OWNER = "owner",
  GAME = "game",
  STATUS = "status",
}

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export interface User {
  id: number;
  username: string | null;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Payment {
  id: number;
  userId: number;
  amount: string | null;
  topupBonus: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  paymentProvider: string | null;
  externalId: string | null;
  invoiceNumber: string | null;
  createdAt: string;
  user: User | null;
}

export interface PaymentsListResponse {
  data: Payment[];
  total: number;
  pagination: Pagination;
}

export interface InvoiceDownloadResponse {
  url: string;
}

export interface Game {
  id: number;
  name: string;
  short: string;
}

export interface GamePackage {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  gameId: number;
  priceHourly: string;
  priceMonthly: string;
  game: Game;
}

export interface Server {
  id: number;
  alias: string;
  panelUuid: string;
  dockerState: string;
  isSuspended: number;
  createdAt: string;
  gamePackage: GamePackage;
  user: User;
  game: Game;
  serverSharedUsers: ServerSharedUser[];
}

export interface ServerSharedUser {
  user: User;
}

export interface ServersListResponse {
  data: Server[];
  pagination: Pagination;
  summary: ServerSummary;
}

export interface ServerSummary {
  total: number;
  running: number;
  suspended: number;
  offline: number;
}

export interface Backup {
  id: number;
  serverId: number | null;
  isReady: number;
  progress: number;
  backupFileName: string;
  backupName: string;
  backupSize: number;
  jobId: string;
  lowOnCashSince: string | null;
  lowOnCashReminders: number;
  lastPaymentAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupInterval: BackupIntervalLower;
  backupRetention: number;
  backupTime: string;
}

export interface BackupUpdateRequest {
  auto_backup: boolean;
  backup_day_value?: BackupDay;
  backup_interval?: BackupInterval;
  backup_retention?: number;
  backup_time_value?: string;
  backup_month_day_value?: number;
  backup_hour_minute?: number;
}

export interface BackupCreateRequest {
  name?: string;
}

export interface BackupSettingsUpdateRequest {
  autoBackupEnabled: boolean;
  backupInterval: BackupIntervalLower;
  backupRetention: number;
  backupTime: string;
}

export interface BackupDownloadResponse {
  url: string;
}

export interface DatabaseHost {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  node: number;
  created_at: string;
  updated_at: string;
}

export interface DatabasePassword {
  password: string;
}

export interface DatabaseRelationships {
  password: { object: string; attributes: DatabasePassword };
  host: { object: string; attributes: DatabaseHost };
}

export interface Database {
  id: number;
  server: number;
  host: number;
  database: string;
  username: string;
  remote: string;
  max_connections: number;
  created_at: string;
  updated_at: string;
}

export interface WrappedDatabase {
  obect: string;
  attributes: Database;
}

export interface DatabaseListResponse {
  object: string;
  data: WrappedDatabase[];
}

export interface DatabaseCreateRequest {
  database: string;
  remote?: string;
  host?: number;
}

export interface FileCompressRequest {
  root: string;
  files: string[];
}

export interface FileCopyRequest {
  location: string;
}

export interface FileCreateDirectoryRequest {
  root: string;
  name: string;
}

export interface FileDecompressRequest {
  root: string;
  file: string;
}

export interface FileDeleteRequest {
  files: string[];
  root: string;
}

export interface FileMoveRequest {
  files: string[];
  root: string;
  to: string;
}

export interface FileRenameRequest {
  files: string[];
  root: string;
  to: string;
}

export interface FileWriteRequest {
  file: string;
  content: string;
}

export interface FileListRequest {
  directory: string;
  [key: string]: string | number | boolean;
}

export interface FileInfo {
  name: string;
  mode: string;
  size: number;
  mode_bits: string;
  is_file: boolean;
  is_symlink: boolean;
  mimetype: string | null;
  created_at: string;
  modified_at: string;
}

export interface FileListPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface FileListResponse {
  object: string;
  data: { object: string; attributes: FileInfo }[];
}

export interface ScheduleTask {
  id: number;
  sequence_id: number;
  action: ScheduleTaskAction;
  payload: string | null;
  time_offset: number;
  continue_on_failure: boolean;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  name: string;
  is_active: boolean;
  only_when_online: boolean;
  timezone: string;
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleWithTasks extends Schedule {
  relationships?: {
    tasks: {
      data: { attributes: ScheduleTask }[];
    };
  };
}

export interface ScheduleCreateRequest {
  name?: string;
  is_active?: boolean;
  only_when_online?: boolean;
  timezone?: string;
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
}

export interface ScheduleUpdateRequest {
  name?: string;
  is_active?: boolean;
  only_when_online?: boolean;
  timezone?: string;
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
}

export interface ScheduleTaskCreateRequest {
  action: ScheduleTaskAction;
  payload?: string;
  time_offset: number;
  sequence_id: number;
  continue_on_failure: boolean;
}

export interface ScheduleTaskUpdateRequest {
  action: ScheduleTaskAction;
  payload?: string;
  time_offset: number;
  sequence_id: number;
  continue_on_failure: boolean;
}

export interface ServerTransaction {
  id: number;
  userId: number;
  amount: string;
  transactionType: string;
  referenceId: number;
  usageBegin: string;
  usageEnd: string | null;
  createdAt: string;
}

export interface ServerTransactionsResponse {
  data: ServerTransaction[];
  pagination: Pagination;
}

export interface Transaction {
  id: string;
  userId: string;
  transactionType: TransactionType;
  amount: string;
  usageBegin: string | null;
  usageEnd: string | null;
  referenceId: string;
  createdAt: string;
  reference_uuid?: string | null;
  user?: User;
}

export interface TransactionsListResponse {
  data: Transaction[];
  total: number;
  pagination: Pagination;
}

export interface StartupVariable {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  server_value: string;
  is_editable: boolean;
  rules: string;
}

export interface StartupInformationResponse {
  object: string;
  data: StartupVariable[];
  meta: {
    startup_command: string;
    raw_startup_command: string;
  };
}

export interface StartupCommandResponse {
  currentStartup: string;
  defaultStartup: string;
}

export interface ResourceUtilization {
  object: string;
  attributes: {
    current_state: string;
    is_suspended: boolean;
    resources: {
      memory_bytes: number;
      cpu_absolute: number;
      disk_bytes: number;
      network_rx_bytes: number;
      network_tx_bytes: number;
      uptime: number;
    };
  };
}

export interface WebsocketData {
  data: {
    token: string;
    socket: string;
  };
}

export interface ModInstallRequest {
  filename: string;
}

export interface ModRemoveRequest {
  filename: string;
}

export interface ModpackInstallRequest {
  modpack_id: string;
  platform: ModpackPlatform;
  create_backup?: boolean;
  version?: string;
  mod_loader?: ModLoader;
  curseforge_download_url?: string;
}

export interface PowerStateRequest {
  power_state: PowerState;
}

export interface ReinstallRequest {
  keep_files?: boolean;
}

export interface SendCommandRequest {
  command: string;
}

export interface ShareServerRequest {
  email: string;
}

export interface StartupVariableUpdateRequest {
  key: string;
  value: string;
  language?: string;
}

export interface VariableUpdateRequest {
  key: string;
  value: string;
}

export interface AliasUpdateRequest {
  alias: string;
}

export interface RentServerRequest {
  game_short: string;
  plan_id: number;
  region?: Region;
  template_id?: number;
  template_version_id?: number;
}

export interface ServerRentResponse {
  id: number;
  alias: string;
  panelUuid: string;
  gameId: number;
  userId: number;
  dockerState: string;
  createdAt: string;
}

export interface ServerTemplateResponse {
  id: number;
  panelServerId: number;
  panelUuid: string;
  panelUserId: number | null;
  panelUserPassword: string | null;
  alias: string | null;
  packageId: number | null;
  autoBackup: number;
  backupInterval: BackupInterval | null;
  backupDayValue: string | null;
  backupTimeValue: string | null;
  backupRetention: number | null;
  backupMonthDayValue: number | null;
  backupHourMinute: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

export interface AliasResponse extends SuccessResponse {
  alias: string;
}

export interface RotateSFTPResponse extends SuccessResponse {
  password: string;
}

export interface ResetStartupResponse extends SuccessResponse {
  newStartup: string;
}

export interface ModResponse extends SuccessResponse {
  filename: string;
}

export interface SharedMembersResponse {
  success: boolean;
  server_id: number;
  is_owner?: boolean;
  shared_members: {
    id: number;
    serverId: number;
    userId: number;
    createdAt: string;
    user: User;
  }[];
}

export interface EulaRequiredResponse {
  statusCode: number;
  statusMessage: string;
  data: {
    eulaRequired: boolean;
  };
}

export interface ErrorResponse {
  statusCode?: number;
  statusMessage?: string;
  data?: {
    errors?: {
      detail: string;
    }[];
  };
}
