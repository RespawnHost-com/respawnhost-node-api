import { RespawnHostClient } from '../client';
import type {
  FileCompressRequest,
  FileCopyRequest,
  FileCreateDirectoryRequest,
  FileDecompressRequest,
  FileDeleteRequest,
  FileMoveRequest,
  FileRenameRequest,
  FileWriteRequest,
  FileListRequest,
  FileInfo,
  FileListResponse,
} from '../types';
import type { SuccessResponse } from '../types';

export class FilesService {
  constructor(private client: RespawnHostClient) {}

  async list(uuid: string, request: FileListRequest): Promise<FileInfo[]> {
    const response = await this.client.get<FileListResponse>(`/api/v1/servers/${uuid}/files`, request);
    
    return response.data.map(item => item.attributes);
  }

  async getContent(uuid: string, file: string): Promise<string | ArrayBuffer> {
    const response = await fetch(
      `${this.client['baseURL']}/api/v1/servers/${uuid}/files/content?file=${encodeURIComponent(file)}`,
      {
        headers: {
          'Authorization': `Bearer ${this.client['apiKey']}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get file content: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.text();
    }
    return await response.arrayBuffer();
  }

  async write(uuid: string, request: FileWriteRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/write`, request);
  }

  async createDirectory(uuid: string, request: FileCreateDirectoryRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/create-directory`, request);
  }

  async rename(uuid: string, request: FileRenameRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/rename`, request);
  }

  async copy(uuid: string, request: FileCopyRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/copy`, request);
  }

  async move(uuid: string, request: FileMoveRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/move`, request);
  }

  async delete(uuid: string, request: FileDeleteRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/delete`, request);
  }

  async compress(uuid: string, request: FileCompressRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/compress`, request);
  }

  async decompress(uuid: string, request: FileDecompressRequest): Promise<SuccessResponse> {
    return this.client.post<SuccessResponse>(`/api/v1/servers/${uuid}/files/decompress`, request);
  }
}
