import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface AppContextValue {
  authMode: 'login' | 'register' | null;
  setAuthMode: (mode: 'login' | 'register' | null) => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  savedRefreshKey: number;
  bumpRefreshKey: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppContextValue>({
  authMode: null, setAuthMode: () => {},
  profileOpen: false, setProfileOpen: () => {},
  savedRefreshKey: 0, bumpRefreshKey: () => {},
  toasts: [], showToast: () => {}, dismissToast: () => {}
});

let toastId = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      authMode, setAuthMode,
      profileOpen, setProfileOpen,
      savedRefreshKey, bumpRefreshKey: () => setSavedRefreshKey(k => k + 1),
      toasts, showToast, dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
