export const environment = {
  production: false,
  apiBaseUrl: (typeof window !== 'undefined' && (window as any).__SOFOMAIL_API_URL__) || 'http://localhost:8080/api/v1',
  emsBackendUrl: 'https://erp-backend-1-02lc.onrender.com'
};
