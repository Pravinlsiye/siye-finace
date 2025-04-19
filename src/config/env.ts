// Environment configuration
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/siye-finance',
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
    projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID,
    authUri: import.meta.env.VITE_GOOGLE_AUTH_URI,
    tokenUri: import.meta.env.VITE_GOOGLE_TOKEN_URI,
    authProviderCertUrl: import.meta.env.VITE_GOOGLE_AUTH_PROVIDER_CERT_URL,
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
};