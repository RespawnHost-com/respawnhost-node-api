import { RespawnHostClient } from '../client';
import type {
  Payment,
  PaymentsListResponse,
  InvoiceDownloadResponse,
} from '../types';

export class PaymentsService {
  constructor(private client: RespawnHostClient) {}

  async list(params?: {
    page?: number;
    limit?: number;
    includePending?: boolean;
    search?: string;
    status?: string;
  }): Promise<PaymentsListResponse> {
    return this.client.get<PaymentsListResponse>('/api/v1/payments', params);
  }

  async downloadInvoice(id: number): Promise<InvoiceDownloadResponse> {
    return this.client.get<InvoiceDownloadResponse>(`/api/v1/payments/${id}/download`);
  }
}
