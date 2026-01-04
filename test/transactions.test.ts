import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer } from './config';
import type { TransactionType } from '../src/types';

describe('TransactionsService', () => {
  it('should list transactions', async () => {
    if (!services) return;
    const result = await services.transactions.list({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
    console.log(`✅ Listed ${result.data.length} transactions`);
  });

  it('should list transactions with pagination', async () => {
    if (!services) return;
    const result = await services.transactions.list({
      page: 1,
      limit: 5,
    });

    expect(result).toBeDefined();
    expect(result.pagination).toBeDefined();
    console.log(`✅ Listed transactions page 1: ${result.data.length} transactions`);
  });

  it('should get transaction by ID', async () => {
    if (!services) return;
    const result = await services.transactions.list({ limit: 1 });

    if (result.data.length === 0) {
      console.log('⚠️  No transactions available to test get by ID');
      return;
    }

    const transaction = await services.transactions.get(result.data[0].id);

    expect(transaction).toBeDefined();
    expect(transaction.id).toBe(result.data[0].id);
    console.log(`✅ Got transaction details for ${result.data[0].id}`);
  });

  it('should filter transactions by type', async () => {
    if (!services) return;
    const result = await services.transactions.list({
      page: 1,
      limit: 10,
      type: 'SERVER' as TransactionType,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Filtered transactions by type: ${result.data.length} transactions`);
  });

  it('should handle empty results', async () => {
    if (!services) return;
    const result = await services.transactions.list({
      page: 1,
      limit: 10,
      search: 'nonexistenttransaction123456789',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBe(0);
    console.log('✅ Handled empty transaction search results');
  });
});
