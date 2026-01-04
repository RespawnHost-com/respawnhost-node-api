import { handleError, RespawnHostError } from './errors';

export interface ClientConfig {
  apiKey: string;
  baseURL?: string;
}

const headers: Record<string, string> = {
  'Authorization': '',
  'Content-Type': 'application/json'
};

type HeadersInit = Record<string, string>;

export class RespawnHostClient {
  private readonly apiKey: string;
  private readonly baseURL: string;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://respawnhost.com';
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = new URL(path, this.baseURL);
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };

    try {
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        let errorResponse = null;
        try {
          errorResponse = await response.json() as { statusCode?: number; statusMessage?: string; data?: { errors?: { detail: string }[] } };
        } catch {
        }
        throw handleError(response.status, errorResponse);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof RespawnHostError) {
        throw error;
      }
      throw new RespawnHostError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      );
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('GET', path, undefined, query);
  }

  post<T>(path: string, body?: unknown, query?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('POST', path, body, query);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}

export * from './errors';
export * from './types';
