import { RespawnHostClient } from '../src/client';
import { PaymentsService } from '../src/services/payments';
import { ServersService } from '../src/services/servers';
import { TransactionsService } from '../src/services/transactions';

export const config = {
  apiKey: process.env.RESPAWNHOST_API_KEY || '',
  baseURL: process.env.RESPAWNHOST_BASE_URL || 'https://respawnhost.com',
  enableDestructive: process.env.ENABLE_DESTRUCTIVE === 'true',
  testServerUuid: process.env.TEST_SERVER_UUID || '',
};

export function skipIfDestructive(): boolean {
  if (!config.enableDestructive) {
    console.log('⚠️  Skipping destructive test (set ENABLE_DESTRUCTIVE=true to enable)');
    return true;
  }
  return false;
}

export function requireTestServer(): boolean {
  if (!config.testServerUuid) {
    console.log('⚠️  Skipping test (set TEST_SERVER_UUID to enable)');
    return true;
  }
  return false;
}

export function checkApiKey(): boolean {
  if (!config.apiKey) {
    console.error('❌ RESPAWNHOST_API_KEY environment variable is required');
    return false;
  }
  return true;
}

export function getClient(): RespawnHostClient | null {
  if (!checkApiKey()) {
    return null;
  }
  return new RespawnHostClient({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });
}

export function getServices() {
  const client = getClient();
  if (!client) {
    return null;
  }
  return {
    payments: new PaymentsService(client),
    servers: new ServersService(client),
    transactions: new TransactionsService(client),
  };
}

export const client = getClient();
export const services = getServices();
