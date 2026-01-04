import { RespawnHostClient } from '../client';
import type {
  Transaction,
  TransactionsListResponse,
  TransactionType,
} from '../types';

export class TransactionsService {
  constructor(private client: RespawnHostClient) {}

  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: TransactionType;
  }): Promise<TransactionsListResponse> {
    return this.client.get<TransactionsListResponse>('/api/v1/transactions', params);
  }

  async get(id: string): Promise<Transaction> {
    return this.client.get<Transaction>(`/api/v1/transactions/${id}`);
  }
}
