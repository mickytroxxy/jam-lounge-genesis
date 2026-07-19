/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    scanMusic: () => Promise<string[]>;
    storeGet: (key: string) => Promise<string | null>;
    storeSet: (key: string, value: string) => Promise<void>;
    storeDelete: (key: string) => Promise<void>;
  };
}
