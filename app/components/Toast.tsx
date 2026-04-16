"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setKey(k => k + 1);
    setTimeout(() => setMessage(null), 2800);
  }, []);

  return (
      <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          className="pointer-events-none fixed right-6 bottom-6 z-[100] rounded-[10px] bg-[color:var(--chip)] px-4 py-2.5 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--caramel-light)] animate-[fadein_0.3s_ease] max-sm:right-4 max-sm:bottom-4 max-sm:left-4 max-sm:text-center"
          key={key}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
