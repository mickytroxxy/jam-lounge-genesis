/**
 * Custom redux-persist storage adapter for Electron.
 * In packaged Electron apps, localStorage is not reliably persisted between sessions.
 * This adapter uses IPC to read/write a JSON file in the app's userData directory instead.
 * Falls back to localStorage when running in a plain browser (dev server without Electron).
 */

const electronStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (window.electronAPI?.storeGet) {
      return window.electronAPI.storeGet(key);
    }
    // Fallback to localStorage in dev browser mode
    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (window.electronAPI?.storeSet) {
      return window.electronAPI.storeSet(key, value);
    }
    localStorage.setItem(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (window.electronAPI?.storeDelete) {
      return window.electronAPI.storeDelete(key);
    }
    localStorage.removeItem(key);
  },
};

export default electronStorage;
