export const environment = {
  production: true,
  apiBaseUrl: (typeof window !== 'undefined' && (window as any).__SOFOMAIL_API_URL__) || 'https://pjsofonic-mail.onrender.com/api/v1',
  emsBackendUrl: 'https://erp-backend-1-02lc.onrender.com'
};
