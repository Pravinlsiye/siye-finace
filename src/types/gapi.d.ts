interface Window {
  gapi: {
    client: {
      init: (config: {
        apiKey: string;
        clientId: string;
        discoveryDocs: string[];
        scope: string;
      }) => Promise<void>;
      drive: {
        files: {
          list: (params: {
            q: string;
            fields: string;
          }) => Promise<{
            result: {
              files: Array<{
                id: string;
                name?: string;
              }>;
            };
          }>;
          create: (params: {
            resource: any;
            media?: {
              mimeType: string;
              body: string;
            };
            fields: string;
          }) => Promise<{
            result: {
              id: string;
            };
          }>;
          update: (params: {
            fileId: string;
            resource: any;
            media: {
              mimeType: string;
              body: string;
            };
          }) => Promise<void>;
        };
      };
    };
  };
}