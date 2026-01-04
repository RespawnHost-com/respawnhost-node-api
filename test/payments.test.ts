import { describe, it, expect } from 'bun:test';
import { services, skipIfDestructive, requireTestServer } from './config';

describe('PaymentsService', () => {
  it('should list payments', async () => {
    if (!services) return;
    const result = await services.payments.list({
      page: 1,
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    console.log(`✅ Listed ${result.data.length} payments`);
  });

  it('should list payments with filters', async () => {
    if (!services) return;
    const result = await services.payments.list({
      page: 1,
      limit: 5,
      includePending: true,
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed payments with pending: ${result.data.length} payments`);
  });

  it('should list payments with search', async () => {
    if (!services) return;
    const result = await services.payments.list({
      page: 1,
      limit: 10,
      search: 'test',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Searched payments: found ${result.data.length} results`);
  });

  it('should list payments by status', async () => {
    if (!services) return;
    const result = await services.payments.list({
      page: 1,
      limit: 10,
      status: 'COMPLETED',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    console.log(`✅ Listed completed payments: ${result.data.length} payments`);
  });

  it('should handle pagination', async () => {
    if (!services) return;
    const result1 = await services.payments.list({
      page: 1,
      limit: 10,
    });

    if (result1.pagination.total > 10) {
      const result2 = await services.payments.list({
        page: 2,
        limit: 10,
      });

      expect(result2.data).toBeInstanceOf(Array);
      console.log(`✅ Paginated through payments: page 1 (${result1.data.length}) and page 2 (${result2.data.length})`);
    } else {
      console.log(`⚠️  Not enough payments to test pagination (total: ${result1.pagination.total})`);
    }
  });

  it('should handle empty results', async () => {
    if (!services) return;
    const result = await services.payments.list({
      page: 1,
      limit: 10,
      search: 'nonexistentpayment123456789',
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Array);
    expect(result.data.length).toBe(0);
    console.log('✅ Handled empty payment search results');
  });
});
