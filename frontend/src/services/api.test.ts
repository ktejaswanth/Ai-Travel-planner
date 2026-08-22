import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { api } from './api';

describe('API Client Configuration', () => {
  const store: Record<string, string> = {};

  beforeAll(() => {
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k in store) delete store[k];
      },
      key: (index: number) => Object.keys(store)[index] || null,
      length: Object.keys(store).length,
    };
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('should have standard headers configured', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
    expect(api.defaults.timeout).toBe(15000);
  });

  it('should attach Authorization header when tripwise_token is in localStorage', async () => {
    localStorage.setItem('tripwise_token', 'test-jwt-token');

    // Simulate request interceptor
    const config = { headers: {} } as any;
    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const modifiedConfig = requestInterceptor(config);

    expect(modifiedConfig.headers.Authorization).toBe('Bearer test-jwt-token');
  });
});
